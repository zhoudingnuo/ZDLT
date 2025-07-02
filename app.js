const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const formidable = require('formidable');

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
let agents = [];
if (fs.existsSync(agentsPath)) {
  agents = JSON.parse(fs.readFileSync(agentsPath, 'utf-8'));
}

// 获取智能体列表（不包含API key，用于显示）
app.get('/api/agents', (req, res) => {
  res.json(agents.map(({ apiKey, ...rest }) => rest)); // 不返回apiKey
});

// 获取完整智能体信息（包含API key，用于调用）
app.get('/api/agents/full', (req, res) => {
  res.json(agents); // 返回完整信息包括apiKey
});

// 获取智能体列表（兼容新版前端，返回不含apiKey）
app.get('/api/agents/list', (req, res) => {
  if (!agents || !Array.isArray(agents)) {
    return res.json([]);
  }
  res.json(agents.map(({ apiKey, ...rest }) => rest));
});

// 转发到Dify智能体
app.post('/api/agent/:id/invoke', async (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  // 打印收到的参数
  console.log('收到chat-messages参数:', JSON.stringify(req.body, null, 2));
  try {
    const response = await axios.post(
      agent.apiUrl,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${agent.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
      const DIFy_API = 'http://118.145.74.50:24131/v1/files/upload';
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

// 新增 Dify 智能体主API代理接口（支持 agentId 动态 key）
app.post('/api/agent/:id/invoke', async (req, res) => {
  const agent = agents.find(a => a.id === req.params.id);
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  try {
    const response = await axios.post(
      agent.apiUrl,
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${agent.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5000;
const HOST = '0.0.0.0'; // 监听所有网络接口

app.listen(PORT, HOST, () => {
  console.log(`Backend running on http://${HOST}:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://[your-ip]:${PORT}`);
}); 