const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

const USERS_FILE = path.join(__dirname, 'users.json');
function readJson(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}
function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}
// 用户API日志
router.use((req, res, next) => {
  console.log(`[用户API] ${req.method} ${req.path}`);
  if (Object.keys(req.body || {}).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});
// 登录
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const users = readJson(USERS_FILE);
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    user.lastLoginTime = new Date().toISOString();
    writeJson(USERS_FILE, users);
    res.json({ success: true, data: { ...user, password: undefined } });
  } else {
    res.status(401).json({ success: false, error: '账号或密码错误' });
  }
});
// 注册
router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  let users = readJson(USERS_FILE);
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, error: '用户名已存在' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
    email,
    usage_tokens: 0,
    usage_price: 0,
    balance: 0,
    createTime: now,
    lastLoginTime: null
  };
  users.push(newUser);
  writeJson(USERS_FILE, users);
  res.json({ success: true, data: { ...newUser, password: undefined } });
});
// 查询用户
router.get('/user/:username', (req, res) => {
  const users = readJson(USERS_FILE);
  const user = users.find(u => u.username === req.params.username);
  if (user) {
    const result = { success: true, data: { ...user, password: undefined } };
    console.log('[用户API][查询用户] 请求:', req.params, '响应:', result);
    res.json(result);
  } else {
    const result = { success: false, error: '用户不存在' };
    console.log('[用户API][查询用户] 请求:', req.params, '响应:', result);
    res.status(404).json(result);
  }
});
// 更新消耗
router.post('/user/usage', (req, res) => {
  const { username, usage_tokens, usage_price } = req.body;
  let users = readJson(USERS_FILE);
  const idx = users.findIndex(u => u.username === username);
  if (idx !== -1) {
    // 新增：余额判断与扣费
    if (users[idx].balance === undefined) users[idx].balance = 0;
    if (usage_price > 0) {
      if (users[idx].balance < usage_price) {
        const result = { success: false, error: 'Insufficient balance. Please recharge.' };
        console.log('[用户API][更新消耗-余额不足] 请求:', req.body, '响应:', result);
        return res.status(400).json(result);
      } else {
        users[idx].balance -= usage_price;
      }
    }
    users[idx].usage_tokens = usage_tokens;
    users[idx].usage_price = usage_price;
    writeJson(USERS_FILE, users);
    const result = { success: true, balance: users[idx].balance };
    console.log('[用户API][更新消耗] 请求:', req.body, '响应:', result);
    res.json(result);
  } else {
    const result = { success: false, error: '用户不存在' };
    console.log('[用户API][更新消耗] 请求:', req.body, '响应:', result);
    res.status(404).json(result);
  }
});
// 更新余额
router.post('/user/balance', (req, res) => {
  const { username, balance } = req.body;
  let users = readJson(USERS_FILE);
  const idx = users.findIndex(u => u.username === username);
  if (idx !== -1) {
    users[idx].balance = balance;
    writeJson(USERS_FILE, users);
    const result = { success: true };
    console.log('[用户API][更新余额] 请求:', req.body, '响应:', result);
    res.json(result);
  } else {
    const result = { success: false, error: '用户不存在' };
    console.log('[用户API][更新余额] 请求:', req.body, '响应:', result);
    res.status(404).json(result);
  }
});
// 获取所有用户
router.get('/users', (req, res) => {
  const users = readJson(USERS_FILE).map(u => ({ ...u, password: undefined }));
  const result = { success: true, data: users };
  console.log('[用户API][获取所有用户] 响应:', result);
  res.json(result);
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
      balance: 0,
      isAdmin: true,
      createTime: new Date().toISOString(),
      lastLoginTime: null
    });
    writeJson(USERS_FILE, users);
    console.log('已自动初始化管理员账号：ZDLT / Administrator2025');
  }
}
initAdminUser();
// 启动时自动补全所有用户的balance字段
(function ensureUserBalance() {
  let users = readJson(USERS_FILE);
  let changed = false;
  users.forEach(u => {
    if (u.balance === undefined) {
      u.balance = 0;
      changed = true;
    }
  });
  if (changed) writeJson(USERS_FILE, users);
})();
// 导出内部读写方法供支付模块调用
router.__getUsers = readJson;
router.__writeUsers = writeJson;

module.exports = router; 