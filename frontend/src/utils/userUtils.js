import axios from 'axios';
import API_BASE from './apiConfig';
// import { hashPassword } from './passwordUtils'; // 不再需要前端hash

// 登录
export const loginUser = async (username, password) => {
  // 直接传明文密码
  const res = await axios.post(`${API_BASE}/api/login`, { username, password });
  if (res.data.success) return res.data.data;
  throw new Error(res.data.error || '登录失败');
};

// 注册
export const registerUser = async (username, password, email) => {
  if (!username || !password || !email) throw new Error('请填写完整信息');
  if (password.length < 6) throw new Error('密码至少6位');
  // 直接传明文密码
  const res = await axios.post(`${API_BASE}/api/register`, { username, password, email });
  if (res.data.success) return res.data.data;
  throw new Error(res.data.error || '注册失败');
};

// 获取用户
export const getUserFromServer = async (username) => {
  const res = await axios.get(`${API_BASE}/user/${username}`);
  return res.data;
};

// 更新消耗
export const updateUserUsage = async (username, usage_tokens, usage_price) => {
  await axios.post(`${API_BASE}/api/user/usage`, { username, usage_tokens, usage_price });
};

// 用户信息本地存储
export const getUser = () => {
  const loginUser = JSON.parse(localStorage.getItem('user') || 'null');
  if (!loginUser) return null;
  // 从users表同步usage_tokens和usage_price
  const users = getUsers();
  const dbUser = users.find(u => u.username === loginUser.username && u.password === loginUser.password);
  if (dbUser) {
    return { ...loginUser, usage_tokens: dbUser.usage_tokens || 0, usage_price: dbUser.usage_price || 0 };
  }
  return loginUser;
};
export const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const clearUser = () => localStorage.removeItem('user');

// 用户数据管理
export const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
export const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
export const addUser = (user) => {
  const users = getUsers();
  users.push({ ...user, usage_tokens: 0, usage_price: 0 });
  setUsers(users);
};

// 用户验证函数
export const validateUser = (username, password) => {
  const users = getUsers();
  return users.find(user => user.username === username && user.password === password);
};

export const checkUserExists = (username) => {
  const users = getUsers();
  return users.some(user => user.username === username);
};

// 用户数据统计
export const getUserStats = () => {
  const users = getUsers();
  return {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.lastLoginTime).length,
    newUsersToday: users.filter(user => {
      const today = new Date().toDateString();
      const createDate = new Date(user.createTime).toDateString();
      return createDate === today;
    }).length
  };
};

// 更新用户登录时间
export const updateUserLoginTime = (userId) => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex].lastLoginTime = new Date().toISOString();
    setUsers(users);
  }
};

// 初始化默认用户（用于测试）
export const initDefaultUsers = () => {
  const users = getUsers();
  if (users.length === 0) {
    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin123', // 明文
        createTime: new Date().toISOString(),
        lastLoginTime: null
      },
      {
        id: '2',
        username: 'demo',
        email: 'demo@example.com',
        password: 'Demo123', // 明文
        createTime: new Date().toISOString(),
        lastLoginTime: null
      }
    ];
    setUsers(defaultUsers);
  }
};

// 新增：同步消耗到users表
export const syncUserUsage = (username, password, usage_tokens, usage_price) => {
  const users = getUsers();
  const idx = users.findIndex(u => u.username === username && u.password === password);
  if (idx !== -1) {
    users[idx].usage_tokens = usage_tokens;
    users[idx].usage_price = usage_price;
    setUsers(users);
  }
};

// 新增：从服务端获取所有用户
export const getAllUsersFromServer = async () => {
  const res = await axios.get(`${API_BASE}/users`);
  return res.data;
};

// 新增：更新用户余额
export const updateUserBalance = async (username, balance) => {
  await axios.post(`${API_BASE}/api/user/balance`, { username, balance });
}; 