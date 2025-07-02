const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const formidable = require('formidable');
const userService = require('./userService');
const readline = require('readline');
const dotenv = require('dotenv');
const winston = require('winston');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();

// 配置CORS，允许局域网访问
app.use(cors({
  origin: true, // 允许所有来源
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// 读取智能体配置
const agentsPath = path.join(__dirname, 'agents.json');
console.log('【 后端调试 】实际读取的 agents.json 路径:', agentsPath);
let agents = [];
if (fs.existsSync(agentsPath)) {
  agents = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
}

// 日志配置
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

// 获取智能体列表（用于前端渲染）
app.get('/api/agents/list', (req, res) => {
  let agentsList = agents;
  // 获取用户名
  const username = req.query.username;
  // 读取用户信息
  let users = [];
  const usersPath = path.join(__dirname, 'users.json');
  if (fs.existsSync(usersPath)) {
    users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
  }
  const user = users.find(u => u.username === username);
  // 判断是否管理员
  const isAdmin = user && user.isAdmin;
  // 管理员返回全部，普通用户只返回安全字段
  const safeAgents = agentsList.map(a => isAdmin ? a : {
    id: a.id,
    name: a.name,
    description: a.description,
    status: a.status,
    inputs: a.inputs,
    inputType: a.inputType,
  });
  res.json(safeAgents);
});

// 转发到Dify智能体
app.post('/api/agent/:id/invoke', async (req, res) => {
  // 直接从 agents.json 文件读取最新的 agent 配置
  let agents = [];
  if (fs.existsSync(agentsPath)) {
    agents = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
  }
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  if (!agent.apiKey || !agent.apiUrl) {
    return res.status(400).json({ error: 'Agent not configured. Please configure API key and URL first.' });
  }

  // 1. 先判断 inputType 是否为 dialogue
  if (agent.inputType === 'dialogue') {
    // 直接用 req.body 组装参数，不用 formidable
    let inputs = {};
    try {
      inputs = req.body.inputs || {};
    } catch {
      inputs = {};
    }
    const data = {
      inputs: inputs,
      query: req.body.query,
      response_mode: req.body.response_mode || 'blocking',
      conversation_id: req.body.conversation_id || '',
      user: req.body.user || 'auto_test'
    };
    const headers = {
      'Authorization': `Bearer ${agent.apiKey}`,
      'Content-Type': 'application/json'
    };
    // 调试输出
    console.log('| dialogue');
    console.log('data:', data);
    try {
      const response = await axios.post(agent.apiUrl, data, { headers, timeout: 10000 });
      console.log('Dify响应:', response.data);
      res.json(response.data);
    } catch (err) {
      console.error('调用agent失败:', err.message, err.response?.data);
      res.status(500).json({ error: err.message, detail: err.response?.data });
    }
    return;
  }

  // 2. 只有 parameter 类型才用 formidable 解析文件上传
  const formidable = require('formidable');
  const form = new formidable.IncomingForm({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Parse error' });
    let inputs = {};
    try {
      inputs = fields.inputs ? JSON.parse(fields.inputs) : {};
    } catch {
      inputs = {};
    }
    if (Array.isArray(agent.inputs)) {
      for (const inputDef of agent.inputs) {
        const key = inputDef.name;
        if (
          inputDef.type === 'file' ||
          inputDef.type === 'upload' ||
          (inputDef.type === 'array' && inputDef.itemType === 'file')
        ) {
          // 单文件
          if (inputDef.type === 'file' || inputDef.type === 'upload') {
            const file = files[key];
            if (file && file.filepath) {
              const fileInfo = await uploadFileToDify(file, fields.user, agent);
              inputs[key] = {
                type: 'document',
                transfer_method: 'local_file',
                upload_file_id: fileInfo.id,
                url: fileInfo.preview_url || ''
              };
            }
          }
          // 多文件
          if (inputDef.type === 'array' && inputDef.itemType === 'file') {
            const fileArr = files[key];
            if (Array.isArray(fileArr)) {
              inputs[key] = [];
              for (const file of fileArr) {
                if (file && file.filepath) {
                  const fileInfo = await uploadFileToDify(file, fields.user, agent);
                  inputs[key].push({
                    type: 'document',
                    transfer_method: 'local_file',
                    upload_file_id: fileInfo.id,
                    url: fileInfo.preview_url || ''
                  });
                }
              }
            }
          }
        }
      }
    }
    const data = {
      ...fields,
      inputs: inputs
    };
    const headers = {
      'Authorization': `Bearer ${agent.apiKey}`,
      'Content-Type': 'application/json'
    };
    // 日志
    console.log('| parameter');
    console.log('data:', data);
    try {
      const response = await axios.post(agent.apiUrl, data, { headers, timeout: 10000 });
      console.log('Dify响应:', response.data);
      res.json(response.data);
    } catch (err) {
      console.error('调用agent失败:', err.message, err.response?.data);
      res.status(500).json({ error: err.message, detail: err.response?.data });
    }
  });
});

// 文件上传到 Dify
async function uploadFileToDify(file, user, agent) {
  const FormData = require('form-data');
  const fd = new FormData();
  fd.append('file', fs.createReadStream(file.filepath), file.originalFilename);
  fd.append('user', user || 'auto_test');
  const DIFy_API = agent.apiUrl.replace('/v1/chat-messages', '') + '/v1/files/upload';
  const res = await axios.post(DIFy_API, fd, {
    headers: {
      ...fd.getHeaders(),
      'Authorization': `Bearer ${agent.apiKey}`
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });
  return res.data;
}

// 图片base64转imgbb url
async function base64ToImgbbUrl(base64_data) {
  if (base64_data.includes(',')) {
    base64_data = base64_data.split(',')[1];
  }
  try {
    const form = new URLSearchParams();
    form.append('key', '509b2f114d885a9f3377c13e2b72117c');
    form.append('image', base64_data);

    const response = await axios.post(
      'https://api.imgbb.com/1/upload',
      form.toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 10000
      }
    );
    if (response.status === 200) {
      return response.data.data.url;
    } else {
      throw new Error('imgbb error: ' + response.data.error?.message || response.statusText);
    }
  } catch (e) {
    throw new Error('Exception: ' + e.message);
  }
}

// 新增图片上传接口
app.post('/api/upload-image', async (req, res) => {
  const { base64 } = req.body;
  console.log('收到上传请求，base64长度:', base64 ? base64.length : 0);
  if (!base64) return res.status(400).json({ error: '缺少base64' });
  try {
    const url = await base64ToImgbbUrl(base64);
    console.log('imgbb返回url:', url);
    res.json({ url });
  } catch (e) {
    console.error('上传失败:', e.message);
    if (e.response) {
      console.error('imgbb响应:', e.response.data);
    }
    console.error('错误堆栈:', e.stack);
    res.status(500).json({ error: e.message });
  }
});

// 新的 Dify 文件上传代理接口（支持 agentId 动态 key）
app.post('/api/upload-dify-file', async (req, res) => {
  const form = new formidable.IncomingForm({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: '文件解析失败' });
    let user = fields.user;
    let agentId = fields.agentId;
    if (Array.isArray(agentId)) agentId = agentId[0];
    if (!agentId) {
      agentId = 'chinese-dictation'; // 默写批改的服务id
    }
    if (Array.isArray(user)) user = user[0];
    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    // 日志输出，便于排查
    console.log('fields:', fields);
    console.log('自动补全后 agentId:', agentId, '可用id:', agents.map(a=>a.id));
    if (!user || !file || !agentId) return res.status(400).json({ error: '缺少user、file或agentId' });

    // 动态获取apiKey
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return res.status(400).json({ error: '无效的agentId' });
    const DIFy_TOKEN = agent.apiKey;

    const FormData = require('form-data');
    const fd = new FormData();
    fd.append('file', require('fs').createReadStream(file.filepath), file.originalFilename);
    fd.append('user', user);

    try {
      // 使用智能体配置的API URL，如果没有则使用默认值
      const baseUrl = agent.apiUrl ? agent.apiUrl.replace('/v1/chat-messages', '') : 'http://118.145.74.50:24131';
      const DIFy_API = `${baseUrl}/v1/files/upload`;
      const response = await axios.post(DIFy_API, fd, {
        headers: {
          ...fd.getHeaders(),
          'Authorization': `Bearer ${DIFy_TOKEN}`
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      res.json(response.data);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

// ========== 用户API相关 ========== //
const USERS_FILE = path.join(__dirname, 'users.json');
function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// 用户API日志
app.use((req, res, next) => {
  if (req.path.startsWith('/api/login') || req.path.startsWith('/api/register') || req.path.startsWith('/api/user') || req.path.startsWith('/api/users')) {
    console.log(`[用户API] ${req.method} ${req.path}`);
    if (Object.keys(req.body || {}).length > 0) {
      console.log('Body:', req.body);
    }
  }
  next();
});

// 登录
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readJson(USERS_FILE);
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    logger.info(`[登录] 用户: ${username}`);
    res.json({ success: true, data: { ...user, password: undefined } });
  } else {
    logger.warn(`[登录失败] 用户: ${username}`);
    res.status(401).json({ success: false, error: '账号或密码错误' });
  }
});

// 注册
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  let users = readJson(USERS_FILE);
  if (users.find(u => u.username === username)) {
    logger.warn(`[注册] 用户名已存在: ${username}`);
    return res.status(400).json({ success: false, error: '用户名已存在' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    email,
    usage_tokens: 0,
    usage_price: 0,
    balance: 0
  };
  users.push(newUser);
  writeJson(USERS_FILE, users);
  logger.info(`[注册] 新用户: ${username}`);
  res.json({ success: true, data: { ...newUser, password: undefined } });
});

// 查询用户
app.get('/api/user/:username', (req, res) => {
  const users = readJson(USERS_FILE);
  const user = users.find(u => u.username === req.params.username);
  if (user) {
    res.json({ ...user, password: undefined });
  } else {
    res.status(404).json({ error: '用户不存在' });
  }
});

// 更新消耗
app.post('/api/user/usage', (req, res) => {
  const { username, usage_tokens, usage_price } = req.body;
  let users = readJson(USERS_FILE);
  const idx = users.findIndex(u => u.username === username);
  if (idx !== -1) {
    users[idx].usage_tokens = usage_tokens;
    users[idx].usage_price = usage_price;
    writeJson(USERS_FILE, users);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: '用户不存在' });
  }
});

// 更新余额
app.post('/api/user/balance', (req, res) => {
  const { username, balance } = req.body;
  let users = readJson(USERS_FILE);
  const idx = users.findIndex(u => u.username === username);
  if (idx !== -1) {
    users[idx].balance = balance;
    writeJson(USERS_FILE, users);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: '用户不存在' });
  }
});

// 自动初始化管理员账号
function initAdminUser() {
  let users = readJson(USERS_FILE);
  if (!users.find(u => u.username === 'ZDLT')) {
    users.push({
      id: Date.now().toString(),
      username: 'ZDLT',
      password: 'Administrator2025',
      email: 'admin@example.com',
      usage_tokens: 0,
      usage_price: 0,
      isAdmin: true
    });
    writeJson(USERS_FILE, users);
    console.log('已自动初始化管理员账号：ZDLT / Administrator2025');
  }
}
initAdminUser();

// 获取所有用户（不返回密码）
app.get('/api/users', (req, res) => {
  // 假设req.user.isAdmin，实际应有token校验
  if (!req.user || !req.user.isAdmin) {
    logger.warn('[权限] 非管理员访问用户列表');
    return res.status(403).json({ success: false, error: '无权限' });
  }
  const users = readJson(USERS_FILE).map(u => ({ ...u, password: undefined }));
  res.json({ success: true, data: users });
});

app.use('/api', userService);

// ====== 微信支付模拟接口 ======
const payOrders = {};
// 生成微信支付二维码（模拟）
app.post('/api/pay/wechat', (req, res) => {
  const { username, amount } = req.body;
  if (!username || !amount || isNaN(amount) || amount <= 0) {
    return res.json({ success: false, error: '参数错误' });
  }
  // 生成订单号
  const orderId = 'wx' + Date.now() + Math.floor(Math.random()*10000);
  // 模拟二维码链接
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wepay://${orderId}`;
  // 记录订单，2秒后自动支付成功
  payOrders[orderId] = { username, amount, paid: false };
  setTimeout(() => {
    payOrders[orderId].paid = true;
    // 自动增加用户余额
    const users = require('./userService').__getUsers && require('./userService').__getUsers();
    if (users) {
      const idx = users.findIndex(u => u.username === username);
      if (idx !== -1) {
        users[idx].balance = (users[idx].balance || 0) + Number(amount);
        require('./userService').__writeUsers && require('./userService').__writeUsers(users);
      }
    }
  }, 2000);
  res.json({ success: true, qrUrl, orderId });
});
// 查询支付状态（模拟）
app.get('/api/pay/status', (req, res) => {
  const { orderId } = req.query;
  if (!orderId || !payOrders[orderId]) {
    return res.json({ success: false, error: '订单不存在' });
  }
  res.json({ success: true, paid: payOrders[orderId].paid });
});

// ====== 手动充值接口 ======
const manualPayOrders = {};
app.post('/api/pay/manual', (req, res) => {
  const { username, amount } = req.body;
  if (!username || !amount || isNaN(amount) || amount <= 0) {
    return res.json({ success: false, error: '参数错误' });
  }
  const orderId = 'manual' + Date.now() + Math.floor(Math.random()*10000);
  manualPayOrders[orderId] = { 
    orderId, 
    username, 
    amount: Number(amount), 
    status: 'pending', 
    createTime: new Date().toISOString(),
    paid: false 
  };
  // 终端提示管理员确认
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(`用户 ${username} 申请充值金额 ${amount}，是否确认充值？（y/n）`, answer => {
    if (answer.trim().toLowerCase() === 'y') {
      // 加余额
      const users = require('./userService').__getUsers && require('./userService').__getUsers();
      if (users) {
        const idx = users.findIndex(u => u.username === username);
        if (idx !== -1) {
          users[idx].balance = (users[idx].balance || 0) + Number(amount);
          require('./userService').__writeUsers && require('./userService').__writeUsers(users);
          manualPayOrders[orderId].status = 'approved';
          manualPayOrders[orderId].paid = true;
          manualPayOrders[orderId].approveTime = new Date().toISOString();
          console.log(`已为用户 ${username} 充值 ${amount}`);
        }
      }
    } else {
      manualPayOrders[orderId].status = 'rejected';
      console.log(`未为用户 ${username} 充值`);
    }
    rl.close();
  });
  res.json({ success: true, orderId });
});
app.get('/api/pay/manual/status', (req, res) => {
  const { orderId } = req.query;
  if (!orderId || !manualPayOrders[orderId]) {
    return res.json({ success: false, error: '订单不存在' });
  }
  res.json({ success: true, paid: manualPayOrders[orderId].paid });
});

// ====== 充值订单管理API ======
// 获取所有充值订单（管理员用）
app.get('/api/admin/recharge-orders', (req, res) => {
  const orders = Object.values(manualPayOrders).map(order => ({
    ...order,
    statusText: order.status === 'pending' ? '待审核' : 
                order.status === 'approved' ? '已通过' : '已拒绝'
  }));
  res.json(orders);
});

// 审核充值订单（管理员用）
app.post('/api/admin/recharge-orders/:orderId/approve', (req, res) => {
  const { orderId } = req.params;
  const order = manualPayOrders[orderId];
  if (!order) {
    return res.status(404).json({ error: '订单不存在' });
  }
  if (order.status !== 'pending') {
    return res.status(400).json({ error: '订单已处理' });
  }
  
  // 加余额
  const users = require('./userService').__getUsers && require('./userService').__getUsers();
  if (users) {
    const idx = users.findIndex(u => u.username === order.username);
    if (idx !== -1) {
      users[idx].balance = (users[idx].balance || 0) + order.amount;
      require('./userService').__writeUsers && require('./userService').__writeUsers(users);
      order.status = 'approved';
      order.approveTime = new Date().toISOString();
      res.json({ success: true, message: '审核通过' });
    } else {
      res.status(404).json({ error: '用户不存在' });
    }
  } else {
    res.status(500).json({ error: '用户数据读取失败' });
  }
});

// 拒绝充值订单（管理员用）
app.post('/api/admin/recharge-orders/:orderId/reject', (req, res) => {
  const { orderId } = req.params;
  const order = manualPayOrders[orderId];
  if (!order) {
    return res.status(404).json({ error: '订单不存在' });
  }
  if (order.status !== 'pending') {
    return res.status(400).json({ error: '订单已处理' });
  }
  
  order.status = 'rejected';
  order.rejectTime = new Date().toISOString();
  res.json({ success: true, message: '已拒绝' });
});

// 获取用户充值记录（用户用）
app.get('/api/user/recharge-orders/:username', (req, res) => {
  const { username } = req.params;
  const orders = Object.values(manualPayOrders)
    .filter(order => order.username === username)
    .map(order => ({
      ...order,
      statusText: order.status === 'pending' ? '待审核' : 
                  order.status === 'approved' ? '已到账' : '已拒绝'
    }));
  res.json(orders);
});

// ====== 命令行充值功能 ======
function promptRecharge() {
  const users = require('./userService').__getUsers && require('./userService').__getUsers();
  if (!users) return;
  users.forEach(user => {
    if (user.balance !== undefined && user.balance < 0) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      rl.question(`用户 ${user.username} 余额为 ${user.balance}，是否充值为0？（y/n）`, answer => {
        if (answer.trim().toLowerCase() === 'y') {
          user.balance = 0;
          require('./userService').__writeUsers && require('./userService').__writeUsers(users);
          console.log(`已为用户 ${user.username} 充值至0`);
        } else {
          console.log(`未为用户 ${user.username} 充值`);
        }
        rl.close();
      });
    }
  });
}
setInterval(promptRecharge, 10000);

// ========== 智能体API配置更新接口 ========== //
app.post('/api/agents/update-key', (req, res) => {
  const { id, apiKey, apiUrl, inputs, inputType } = req.body; // 新增 apiUrl
  if (!id || !apiKey) return res.status(400).json({ error: '缺少id或apiKey' });

  let agents = [];
  if (fs.existsSync(agentsPath)) {
    agents = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
  }
  const agent = agents.find(a => a.id === id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });

  agent.apiKey = apiKey;
  // 如果API URL为空，自动填充默认值
  agent.apiUrl = apiUrl || 'http://118.145.74.50:24131/v1/chat-messages';
  agent.status = 'review'; // 这里强制设为 review
  if (inputs) agent.inputs = inputs;
  if (inputType) agent.inputType = inputType;
  fs.writeFileSync(agentsPath, JSON.stringify(agents, null, 2), 'utf-8');
  res.json({ success: true });
});

// ========== 智能体状态审核接口 ========== //
// 获取所有智能体状态（管理员用）
app.get('/api/admin/agents/status', (req, res) => {
  let agents = [];
  if (fs.existsSync(agentsPath)) {
    agents = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
  }
  
  // 按状态分组
  const agentsByStatus = {
    pending: agents.filter(a => a.status === 'pending'),
    review: agents.filter(a => a.status === 'review'),
    configured: agents.filter(a => a.status === 'configured')
  };
  
  res.json(agentsByStatus);
});
app.get('/api/agents/detail/:id', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  res.json(agent);
});

// 审核智能体状态（管理员用）
app.post('/api/admin/agents/:agentId/approve', (req, res) => {
  const { agentId } = req.params;
  
  let agents = [];
  if (fs.existsSync(agentsPath)) {
    agents = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
  }
  
  const agent = agents.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: '智能体不存在' });
  }
  
  if (agent.status !== 'review') {
    return res.status(400).json({ error: '只能审核状态为"审核中"的智能体' });
  }
  
  // 更新状态为已配置
  agent.status = 'configured';
  agent.approveTime = new Date().toISOString();
  
  fs.writeFileSync(agentsPath, JSON.stringify(agents, null, 2), 'utf-8');
  res.json({ success: true, message: '审核通过，智能体已配置' });
});

// 拒绝智能体配置（管理员用）
app.post('/api/admin/agents/:agentId/reject', (req, res) => {
  const { agentId } = req.params;
  const { reason } = req.body;
  
  let agents = [];
  if (fs.existsSync(agentsPath)) {
    agents = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
  }
  
  const agent = agents.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ error: '智能体不存在' });
  }
  
  if (agent.status !== 'review') {
    return res.status(400).json({ error: '只能拒绝状态为"审核中"的智能体' });
  }
  
  // 更新状态为待配置
  agent.status = 'pending';
  agent.rejectTime = new Date().toISOString();
  agent.rejectReason = reason || '配置不符合要求';
  
  fs.writeFileSync(agentsPath, JSON.stringify(agents, null, 2), 'utf-8');
  res.json({ success: true, message: '已拒绝，智能体状态已重置' });
});

const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // 监听所有网络接口

// const PORT = 45262;
// const HOST = 'http://29367ir756de.vicp.fun'; // 监听所有网络接口

app.listen(PORT, HOST, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://[your-ip]:${PORT}`);
});

// 统一错误处理中间件
app.use((err, req, res, next) => {
  logger.error(`[异常] ${err.message}`);
  res.status(500).json({ success: false, error: err.message });
}); 