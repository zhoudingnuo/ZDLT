import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Card, Input, Spin, Tabs, Button, message, Avatar, Dropdown, Modal, Form, Drawer, List, Tooltip, Tag } from 'antd';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ArrowLeftOutlined, PlusOutlined, HistoryOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import axios from 'axios';
import { 
  getUser, 
  setUser, 
  clearUser, 
  getUsers, 
  setUsers, 
  addUser, 
  validateUser, 
  checkUserExists, 
  hashPassword, 
  verifyPassword,
  updateUserLoginTime,
  initDefaultUsers 
} from './utils/userUtils';

const { Header, Content, Sider } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;

// 全局美化样式
const mainColor = 'linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%)';
const mainColorSolid = '#4f8cff';
const mainColor2 = '#6f6fff';
const tagBg = 'rgba(79,140,255,0.08)';
const tagColor = '#4f8cff';
const cardShadow = '0 4px 24px 0 rgba(79,140,255,0.08)';
const fontFamily = 'PingFang SC, Microsoft YaHei, Arial, sans-serif';

// 初始化默认用户
initDefaultUsers();

// 用户信息本地存储
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const clearUser = () => localStorage.removeItem('user');

// 用户数据管理
const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
const setUsers = (users) => localStorage.setItem('users', JSON.stringify(users));
const addUser = (user) => {
  const users = getUsers();
  users.push(user);
  setUsers(users);
};

// 用户验证函数
const validateUser = (username, password) => {
  const users = getUsers();
  return users.find(user => user.username === username && user.password === password);
};

const checkUserExists = (username) => {
  const users = getUsers();
  return users.some(user => user.username === username);
};

// 密码加密（简单示例，实际项目中应使用更安全的方法）
const hashPassword = (password) => {
  // 这里使用简单的base64编码，实际项目中应使用bcrypt等
  return btoa(password);
};

const verifyPassword = (password, hashedPassword) => {
  return btoa(password) === hashedPassword;
};

function LoginModal({ visible, onCancel, onLogin, onRegister }) {
  const [form] = Form.useForm();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // 重置表单
  const handleCancel = () => {
    form.resetFields();
    setIsRegister(false);
    onCancel();
  };

  // 切换登录/注册模式
  const toggleMode = () => {
    setIsRegister(!isRegister);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      if (isRegister) {
        await onRegister(values);
      } else {
        await onLogin(values);
      }
      
      form.resetFields();
      setIsRegister(false);
    } catch (error) {
      console.error('表单验证失败:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      open={visible} 
      onCancel={handleCancel}
      onOk={handleSubmit}
      title={isRegister ? '注册新账号' : '用户登录'}
      okText={isRegister ? '注册' : '登录'}
      cancelText="取消"
      confirmLoading={loading}
      width={400}
      centered
    >
      <Form form={form} layout="vertical" size="large">
        <Form.Item 
          name="username" 
          label="用户名" 
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, max: 20, message: '用户名长度在3-20个字符之间' },
            { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文' }
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        
        {isRegister && (
          <Form.Item 
            name="email" 
            label="邮箱" 
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入正确的邮箱格式' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>
        )}
        
        <Form.Item 
          name="password" 
          label="密码" 
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码长度至少6位' },
            { 
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
              message: '密码必须包含大小写字母和数字' 
            }
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
        
        {isRegister && (
          <Form.Item 
            name="confirmPassword" 
            label="确认密码" 
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入密码" />
          </Form.Item>
        )}
      </Form>
      
      <div style={{ textAlign: 'center', marginTop: 16 }}>
        <Button type="link" onClick={toggleMode} style={{ fontSize: 14 }}>
          {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
        </Button>
      </div>
      
      {isRegister && (
        <div style={{ marginTop: 16, padding: 12, background: '#f6f8fa', borderRadius: 6, fontSize: 12, color: '#666' }}>
          <div>注册须知：</div>
          <div>• 用户名长度3-20个字符</div>
          <div>• 密码至少6位，包含大小写字母和数字</div>
          <div>• 请确保邮箱地址正确</div>
        </div>
      )}
    </Modal>
  );
}

// 个人中心组件
function ProfileModal({ visible, onCancel, user }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email
      });
    }
  }, [visible, user, form]);

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 这里可以添加更新用户信息的逻辑
      message.success('个人信息更新成功！');
      onCancel();
    } catch (error) {
      console.error('更新失败:', error);
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleUpdateProfile}
      title="个人中心"
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      width={500}
      centered
    >
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <Avatar 
            size={64} 
            icon={<UserOutlined />} 
            style={{ background: mainColorSolid, marginRight: 16 }} 
          />
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: mainColorSolid }}>
              {user?.username}
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>
              用户ID: {user?.id}
            </div>
          </div>
        </div>
        
        <div style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, fontSize: 12, color: '#666' }}>
          <div>注册时间: {user?.createTime ? new Date(user.createTime).toLocaleString() : '未知'}</div>
          <div>最后登录: {user?.loginTime ? new Date(user.loginTime).toLocaleString() : '未知'}</div>
        </div>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item 
          name="username" 
          label="用户名"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 3, max: 20, message: '用户名长度在3-20个字符之间' }
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>
        
        <Form.Item 
          name="email" 
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入正确的邮箱格式' }
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </Form>

      <div style={{ marginTop: 20, padding: 16, background: '#fff7e6', borderRadius: 6, border: '1px solid #ffd591' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#d46b08', marginBottom: 8 }}>
          💡 功能提示
        </div>
        <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
          • 修改用户名后需要重新登录<br/>
          • 邮箱用于接收重要通知<br/>
          • 更多功能正在开发中...
        </div>
      </div>
    </Modal>
  );
}

function ChatPage({ onBack, agent }) {
  const [messages, setMessages] = useState([
    { role: 'system', content: agent?.description || '欢迎使用智能体，请输入你的问题。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [user, setUser] = useState(getUser());
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // 登录处理
  const handleLogin = async (values) => {
    try {
      const { username, password } = values;
      
      // 验证用户
      const user = validateUser(username, hashPassword(password));
      
      if (user) {
        const userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        
        setUser(userInfo);
        setLoginVisible(false);
        message.success(`欢迎回来，${user.username}！`);
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请重试');
    }
  };

  // 注册处理
  const handleRegister = async (values) => {
    try {
      const { username, password, email } = values;
      
      // 检查用户是否已存在
      if (checkUserExists(username)) {
        message.error('用户名已存在，请选择其他用户名');
        return;
      }
      
      // 创建新用户
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: hashPassword(password),
        createTime: new Date().toISOString(),
        lastLoginTime: null
      };
      
      // 保存用户信息
      addUser(newUser);
      
      // 自动登录
      const userInfo = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      setUser(userInfo);
      setLoginVisible(false);
      message.success('注册成功！欢迎使用智大蓝图！');
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请重试');
    }
  };

  // 登出处理
  const handleLogout = () => {
    setUser(null);
    clearUser();
    message.success('已退出登录');
  };

  // 个人中心处理
  const handleProfile = () => {
    setProfileVisible(true);
  };

  const sendMessage = async () => {
    if (!input || typeof input !== 'string' || !input.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    try {
      const res = await axios.post(agent.apiUrl, {
        inputs: {},
        query: input,
        response_mode: 'blocking',
        conversation_id: '',
        user: 'guest',
      }, {
        headers: {
          'Authorization': agent.apiKey ? `Bearer ${agent.apiKey}` : '',
          'Content-Type': 'application/json',
        }
      });
      const answer = res.data.answer || (res.data.data && res.data.data.answer) || JSON.stringify(res.data);
      setMessages([...newMessages, { role: 'assistant', content: answer }]);
    } catch (e) {
      let errMsg = '接口请求失败';
      if (e.response && e.response.data) {
        errMsg += '：' + (e.response.data.error || JSON.stringify(e.response.data));
      } else if (e.message) {
        errMsg += '：' + e.message;
      }
      message.error(errMsg);
      setMessages([...newMessages, { role: 'assistant', content: errMsg }]);
    }
    setLoading(false);
  };

  return (
    <Layout style={{ minHeight: '100vh', fontFamily }}>
      <Sider width={260} style={{ background: '#f7f8fa', borderRight: '1px solid #eee', transition: 'all 0.2s' }}>
        <LogoTitle onClick={onBack} />
        <div style={{ padding: '0 16px' }}>
          <Button type="primary" icon={<PlusOutlined />} block style={{ marginBottom: 16, background: mainColor, border: 'none', borderRadius: 12, fontWeight: 600 }}>新对话</Button>
        </div>
        <div style={{ padding: '0 8px' }}>
          <List
            header={<span style={{ color: '#888', fontWeight: 'bold' }}><HistoryOutlined /> 历史对话</span>}
            dataSource={[]}
            renderItem={item => (
              <List.Item style={{ cursor: 'pointer', borderRadius: 8, margin: 4, background: '#fff', boxShadow: cardShadow }}>
                <span>{item.title}</span>
              </List.Item>
            )}
            style={{ maxHeight: 400, overflowY: 'auto' }}
          />
        </div>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <span style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 18, color: mainColorSolid }}>{agent?.name || ''}</span>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={user ? user.username : '未登录'}>
              <Dropdown 
                overlay={
                  <Menu>
                    {user ? (
                      <>
                        <Menu.Item key="profile" onClick={handleProfile}>个人中心</Menu.Item>
                        <Menu.Item key="logout" onClick={handleLogout}>退出登录</Menu.Item>
                      </>
                    ) : (
                      <Menu.Item key="login" onClick={() => setLoginVisible(true)}>登录/注册</Menu.Item>
                    )}
                  </Menu>
                }
                placement="bottomRight"
                trigger={['click']}
              >
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ cursor: 'pointer', background: mainColorSolid, marginLeft: 8 }} 
                />
              </Dropdown>
            </Tooltip>
          </div>
        </Header>
        <Content style={{ minHeight: 'calc(100vh - 64px)', background: '#f7f8fa', padding: 0 }}>
          <div style={{ maxWidth: 900, margin: '40px auto', background: '#fff', borderRadius: 24, boxShadow: cardShadow, padding: '40px 48px', display: 'flex', flexDirection: 'column', height: '70vh' }}>
            <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', marginBottom: 24, padding: 8 }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', margin: '12px 0' }}>
                  {msg.role === 'assistant' && <Avatar icon={<UserOutlined />} style={{ background: mainColorSolid, marginRight: 8 }} />}
                  <span style={{
                    display: 'inline-block',
                    background: msg.role === 'user' ? mainColor : '#f5f5f5',
                    color: msg.role === 'user' ? '#fff' : '#333',
                    borderRadius: 18,
                    padding: '10px 20px',
                    maxWidth: 520,
                    fontSize: 16,
                    boxShadow: cardShadow,
                    fontWeight: 500
                  }}>{msg.content}</span>
                  {msg.role === 'user' && <Avatar icon={<UserOutlined />} style={{ background: mainColor2, marginLeft: 8 }} />}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <Input.TextArea
                value={input}
                onChange={e => setInput(e.target.value)}
                onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="请输入你的问题，按Enter发送"
                autoSize={{ minRows: 2, maxRows: 4 }}
                disabled={loading}
                style={{ borderRadius: 16, fontSize: 16, background: '#f7f8fa', border: `1.5px solid ${mainColor2}` }}
              />
              <Button type="primary" onClick={sendMessage} loading={loading} style={{ borderRadius: 16, fontWeight: 600, fontSize: 18, height: 48, minWidth: 100, background: mainColor, border: 'none' }}>发送</Button>
            </div>
          </div>
        </Content>
      </Layout>
      
      {/* 登录模态框 */}
      <LoginModal 
        visible={loginVisible}
        onCancel={() => setLoginVisible(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      {/* 个人中心模态框 */}
      <ProfileModal
        visible={profileVisible}
        onCancel={() => setProfileVisible(false)}
        user={user}
      />
    </Layout>
  );
}

// 新增LogoTitle组件
function LogoTitle({ onClick }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: 64, padding: '0 16px', cursor: 'pointer', userSelect: 'none' }} onClick={onClick}>
      <img src="/logo-zeta-vista.png" alt="logo" style={{ height: 48, marginRight: 12 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 22, letterSpacing: 2, color: mainColorSolid, lineHeight: 1, textAlign: 'center', width: '100%' }}>智大蓝图</span>
        <span style={{ fontWeight: 700, fontSize: 11, color: '#888', letterSpacing: 3, marginTop: 2, userSelect: 'none', textAlign: 'center', width: '100%' }}>ZETA VISTA</span>
      </div>
    </div>
  );
}

// 卡片美化样式，更多颜色
const cardColors = [
  { bg: '#eaf3ff', border: '#4f8cff', icon: <UserOutlined style={{ fontSize: 28, color: '#4f8cff' }} /> },
  { bg: '#f3eaff', border: '#a04fff', icon: <PlusOutlined style={{ fontSize: 28, color: '#a04fff' }} /> },
  { bg: '#ffeaf3', border: '#ff4f8c', icon: <HistoryOutlined style={{ fontSize: 28, color: '#ff4f8c' }} /> },
  { bg: '#eaf7ff', border: '#4fdfff', icon: <LoginOutlined style={{ fontSize: 28, color: '#4fdfff' }} /> },
  { bg: '#eafff3', border: '#4fff8c', icon: <UserOutlined style={{ fontSize: 28, color: '#4fff8c' }} /> },
  { bg: '#fffbe6', border: '#ffd700', icon: <PlusOutlined style={{ fontSize: 28, color: '#ffd700' }} /> },
  { bg: '#f0eaff', border: '#7c4fff', icon: <HistoryOutlined style={{ fontSize: 28, color: '#7c4fff' }} /> },
  { bg: '#eafffa', border: '#4fffd7', icon: <LoginOutlined style={{ fontSize: 28, color: '#4fffd7' }} /> },
];

// 热门推荐只显示随机减少6个后的智能体
function getRandomSubset(arr, removeCount) {
  if (arr.length <= removeCount) return arr;
  const copy = [...arr];
  for (let i = 0; i < removeCount; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    copy.splice(idx, 1);
  }
  return copy;
}

function App() {
  const [page, setPage] = useState('home');
  const [chatType, setChatType] = useState('qa');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tabKey, setTabKey] = useState('hot');
  const [currentAgent, setCurrentAgent] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    axios.get('/api/agents').then(res => {
      setAgents(res.data);
      setLoading(false);
    });
  }, []);

  // 登录处理
  const handleLogin = async (values) => {
    try {
      const { username, password } = values;
      
      // 验证用户
      const user = validateUser(username, hashPassword(password));
      
      if (user) {
        const userInfo = {
          id: user.id,
          username: user.username,
          email: user.email,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        
        setUser(userInfo);
        setLoginVisible(false);
        message.success(`欢迎回来，${user.username}！`);
      } else {
        message.error('用户名或密码错误');
      }
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败，请重试');
    }
  };

  // 注册处理
  const handleRegister = async (values) => {
    try {
      const { username, password, email } = values;
      
      // 检查用户是否已存在
      if (checkUserExists(username)) {
        message.error('用户名已存在，请选择其他用户名');
        return;
      }
      
      // 创建新用户
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: hashPassword(password),
        createTime: new Date().toISOString(),
        lastLoginTime: null
      };
      
      // 保存用户信息
      addUser(newUser);
      
      // 自动登录
      const userInfo = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        isLoggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      setUser(userInfo);
      setLoginVisible(false);
      message.success('注册成功！欢迎使用智大蓝图！');
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请重试');
    }
  };

  // 登出处理
  const handleLogout = () => {
    setUser(null);
    clearUser();
    message.success('已退出登录');
  };

  // 个人中心处理
  const handleProfile = () => {
    setProfileVisible(true);
  };

  // 智能问答助手卡片
  const qaCard = {
    id: 'qa-module',
    name: '智能问答助手',
    description: '通用智能问答，支持多轮对话，无需上传图片',
  };

  // 热门推荐和全部智能体都包含所有agents和qaCard
  const hotApps = getRandomSubset([...agents, qaCard], 6);
  const allApps = [...agents, qaCard];

  // 首页卡片点击事件
  const handleCardClick = (agent) => {
    setCurrentAgent(agent);
    setPage('chat');
  };

  if (page === 'chat') {
    return <ChatPage onBack={() => setPage('home')} agent={currentAgent} />;
  }

  // 首页内容
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} style={{ background: '#fff' }}>
        <LogoTitle onClick={() => setPage('home')} />
        <Menu mode="inline" selectedKeys={[tabKey]} onClick={e => setTabKey(e.key)}>
          <Menu.Item key="hot">热门推荐</Menu.Item>
          <Menu.Item key="all">全部智能体</Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#f5f6fa', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Search
            placeholder="搜索智能体"
            onSearch={setSearch}
            style={{ width: 300, marginTop: 16 }}
            allowClear
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={user ? user.username : '未登录'}>
              <Dropdown 
                overlay={
                  <Menu>
                    {user ? (
                      <>
                        <Menu.Item key="profile" onClick={handleProfile}>个人中心</Menu.Item>
                        <Menu.Item key="logout" onClick={handleLogout}>退出登录</Menu.Item>
                      </>
                    ) : (
                      <Menu.Item key="login" onClick={() => setLoginVisible(true)}>登录/注册</Menu.Item>
                    )}
                  </Menu>
                }
                placement="bottomRight"
                trigger={['click']}
              >
                <Avatar 
                  icon={<UserOutlined />} 
                  style={{ cursor: 'pointer', background: mainColorSolid, marginLeft: 8 }} 
                />
              </Dropdown>
            </Tooltip>
          </div>
        </Header>
        <Content style={{ margin: 24 }}>
          {loading ? <Spin /> : (
            <Tabs activeKey={tabKey} onChange={setTabKey}>
              <TabPane tab="热门推荐" key="hot">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                  {hotApps.filter(a => a.name.includes(search) || a.description.includes(search)).map((agent, i) => (
                    <div
                      key={agent.id}
                      style={{
                        background: cardColors[i % cardColors.length].bg,
                        border: `2px solid ${cardColors[i % cardColors.length].border}`,
                        borderRadius: 16,
                        boxShadow: cardShadow,
                        padding: 14,
                        width: 180,
                        height: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s',
                        marginBottom: 16
                      }}
                      onClick={() => handleCardClick(agent)}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(79,140,255,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = cardShadow}
                    >
                      <div style={{ marginBottom: 12 }}>{cardColors[i % cardColors.length].icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: mainColorSolid, marginBottom: 6, textAlign: 'center' }}>{agent.name}</div>
                      <div style={{ color: '#666', fontSize: 13, textAlign: 'center' }}>{agent.description}</div>
                    </div>
                  ))}
                </div>
              </TabPane>
              <TabPane tab="全部智能体" key="all">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                  {allApps.filter(a => a.name.includes(search) || a.description.includes(search)).map((agent, i) => (
                    <div
                      key={agent.id}
                      style={{
                        background: cardColors[i % cardColors.length].bg,
                        border: `2px solid ${cardColors[i % cardColors.length].border}`,
                        borderRadius: 16,
                        boxShadow: cardShadow,
                        padding: 14,
                        width: 180,
                        height: 180,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'box-shadow 0.2s, border 0.2s',
                        marginBottom: 16
                      }}
                      onClick={() => handleCardClick(agent)}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(79,140,255,0.18)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = cardShadow}
                    >
                      <div style={{ marginBottom: 12 }}>{cardColors[i % cardColors.length].icon}</div>
                      <div style={{ fontWeight: 700, fontSize: 16, color: mainColorSolid, marginBottom: 6, textAlign: 'center' }}>{agent.name}</div>
                      <div style={{ color: '#666', fontSize: 13, textAlign: 'center' }}>{agent.description}</div>
                    </div>
                  ))}
                </div>
              </TabPane>
            </Tabs>
          )}
        </Content>
      </Layout>
      
      {/* 登录模态框 */}
      <LoginModal 
        visible={loginVisible}
        onCancel={() => setLoginVisible(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      {/* 个人中心模态框 */}
      <ProfileModal
        visible={profileVisible}
        onCancel={() => setProfileVisible(false)}
        user={user}
      />
    </Layout>
  );
}

export default App; 