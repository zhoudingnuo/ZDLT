import React, { useEffect, useState, useRef } from 'react';
import { Checkbox,Layout, Menu, Card, Input, Spin, Tabs, Button, message, Avatar, Dropdown, Modal, Form, Drawer, List, Tooltip, Tag, Upload, Select, Empty, QRCode, Space } from 'antd';
import { UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined, ArrowLeftOutlined, PlusOutlined, HistoryOutlined, LogoutOutlined, LoginOutlined, UploadOutlined, BulbOutlined, MoonOutlined, SearchOutlined, MessageOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
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
  updateUserLoginTime,
  initDefaultUsers,
  syncUserUsage,
  loginUser,
  registerUser,
  getUserFromServer,
  updateUserUsage,
  getAllUsersFromServer,
  updateUserBalance
} from './utils/userUtils';
import { convertImageToPng, convertImagesToPng, processImageWithWavesAndText } from './utils/imageUtils';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import { UserListProvider, useUserList } from './contexts/UserListContext';
// 在文件顶部插入全局样式
import './nav-btn.css';
import './category-tab.css';
import API_BASE from './utils/apiConfig';
import useIsMobile from './utils/useIsMobile';
import './mobile-adapt.css';
import LoginPage from './LoginPage';


const { Header, Content, Sider } = Layout;
const { Search } = Input;
const { TabPane } = Tabs;
const { Option } = Select;

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

// 初始化管理员账号
function initAdminUser() {
  const users = getUsers();
  if (!users.find(u => u.username === 'ZDLT')) {
    addUser({
      id: Date.now().toString(),
      username: 'ZDLT',
      email: 'admin@zdltaiplatform.com',
      password: 'Administrator2025',
      createTime: new Date().toISOString(),
      lastLoginTime: null,
      isAdmin: true
    });
  }
}
initAdminUser();

// 全局深色主题样式
const globalDarkStyles = `
  body[data-theme="dark"] {
    background: #18191c !important;
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-layout {
    background: #23262e !important;
  }
  body[data-theme="dark"] .ant-layout-sider {
    background: #23262e !important;
    border-right: 1px solid #333 !important;
  }
  body[data-theme="dark"] .ant-menu {
    background: #23262e !important;
    color: #eee !important;
    border-right: none !important;
  }
  body[data-theme="dark"] .ant-menu-item {
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-menu-item:hover {
    background: #2f3136 !important;
  }
  body[data-theme="dark"] .ant-menu-item-selected {
    background: #4f8cff !important;
    color: #fff !important;
  }
  body[data-theme="dark"] .ant-list {
    background: #23262e !important;
  }
  body[data-theme="dark"] .ant-list-item {
    background: #23262e !important;
    color: #eee !important;
    border-bottom: 1px solid #333 !important;
  }
  body[data-theme="dark"] .ant-list-item:hover {
    background: #2f3136 !important;
  }
  body[data-theme="dark"] .ant-list-header {
    color: #bbb !important;
    background: #23262e !important;
    border-bottom: 1px solid #333 !important;
  }
  body[data-theme="dark"] .ant-btn {
    background: #23262e !important;
    color: #eee !important;
    border-color: #444 !important;
  }
  body[data-theme="dark"] .ant-btn-primary {
    background: linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%) !important;
    color: #fff !important;
    border: none !important;
  }
  body[data-theme="dark"] .ant-btn-default {
    background: #23262e !important;
    color: #eee !important;
    border-color: #444 !important;
  }
  body[data-theme="dark"] .ant-btn-default:hover {
    background: #3a3d42 !important;
    border-color: #555 !important;
  }
  body[data-theme="dark"] .ant-divider {
    border-color: #333 !important;
  }
  body[data-theme="dark"] .ant-card {
    background: #2f3136 !important;
    border-color: #444 !important;
    color: #eee !important;
    box-shadow: 0 4px 24px 0 rgba(0,0,0,0.18) !important;
  }
  body[data-theme="dark"] .ant-tabs-content {
    background: #23262e !important;
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-tabs-tab {
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-tabs-tab-active {
    color: #4f8cff !important;
  }
  body[data-theme="dark"] .ant-tabs-ink-bar {
    background: #4f8cff !important;
  }
  body[data-theme="dark"] .ant-modal-content {
    background: #2f3136 !important;
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-modal-header {
    background: #2f3136 !important;
    border-bottom: 1px solid #444 !important;
  }
  body[data-theme="dark"] .ant-modal-title {
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-modal-body {
    background: #2f3136 !important;
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-input,
  body[data-theme="dark"] .ant-input-textarea,
  body[data-theme="dark"] .ant-select-selector {
    background: #2f3136 !important;
    color: #eee !important;
    border-color: #444 !important;
  }
  body[data-theme="dark"] .ant-input-affix-wrapper {
    background: #23262e !important;
    color: #eee !important;
    border-color: #444 !important;
  }
  body[data-theme="dark"] .ant-input::placeholder {
    color: #888 !important;
  }
  body[data-theme="dark"] .ant-input-affix-wrapper-focused {
    border-color: #4f8cff !important;
    box-shadow: 0 0 0 2px rgba(79,140,255,0.2) !important;
  }
  body[data-theme="dark"] .ant-input:focus,
  body[data-theme="dark"] .ant-input-textarea:focus,
  body[data-theme="dark"] .ant-select-focused .ant-select-selector {
    border-color: #4f8cff !important;
    box-shadow: 0 0 0 2px rgba(79, 140, 255, 0.2) !important;
  }
  body[data-theme="dark"] .ant-dropdown-menu {
    background: #2f3136 !important;
    border: 1px solid #444 !important;
  }
  body[data-theme="dark"] .ant-dropdown-menu-item {
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-dropdown-menu-item:hover {
    background: #3a3d42 !important;
  }
  body[data-theme="dark"] .ant-drawer-content {
    background: #2f3136 !important;
  }
  body[data-theme="dark"] .ant-drawer-header {
    background: #2f3136 !important;
    border-bottom: 1px solid #444 !important;
  }
  body[data-theme="dark"] .ant-drawer-title {
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-drawer-body {
    background: #2f3136 !important;
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-tooltip-inner {
    background: #2f3136 !important;
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-tooltip-arrow::before {
    background: #2f3136 !important;
  }
  body[data-theme="dark"] .ant-message-notice-content {
    background: #2f3136 !important;
    color: #eee !important;
  }
  body[data-theme="dark"] .ant-spin-dot-item {
    background: #4f8cff !important;
  }
  body[data-theme="dark"] .ant-tag {
    background: #2f3136 !important;
    color: #eee !important;
    border-color: #444 !important;
  }
  /* 聊天气泡 */
  body[data-theme="dark"] .chat-bubble-assistant {
    background: #23262e !important;
    color: #eee !important;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.12) !important;
  }
  body[data-theme="dark"] .chat-bubble-user {
    background: linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%) !important;
    color: #fff !important;
  }
  /* No data 图标和文字 */
  body[data-theme="dark"] .no-data-img {
    filter: invert(1) !important;
  }
  body[data-theme="dark"] .no-data-text {
    color: #fff !important;
  }
`;

// 更强的表格修正函数
function fixMarkdownTable(md) {
  // 1. 找到所有连续的"|"分隔的多行，自动补全分隔线
  return md.replace(/((^|\n)(\|[^\n]+\|\n){2,})/g, (block) => {
    const lines = block.trim().split('\n');
    if (lines.length < 2) return block;
    // 检查第二行是否为分隔线
    if (/^\|\s*-+\s*(\|\s*-+\s*)+\|$/.test(lines[1])) return block;
    // 自动补全分隔线
    const colCount = (lines[0].match(/\|/g) || []).length - 1;
    const sep = '|' + Array(colCount).fill('---').join('|') + '|';
    return [lines[0], sep, ...lines.slice(1)].join('\n');
  });
}

function LoginModal({ visible, onCancel, onLogin, onRegister, theme }) {
  const [form] = Form.useForm();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // 根据theme动态设置颜色
  const modalBg = theme === 'dark' ? '#2f3136' : '#fff';
  const textColor = theme === 'dark' ? '#eee' : '#333';
  const borderColor = theme === 'dark' ? '#444' : '#d9d9d9';

  const handleCancel = () => {
    form.resetFields();
    setIsRegister(false);
    onCancel();
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 调用父组件传入的登录或注册函数
      if (isRegister) {
        await onRegister(values);
      } else {
        await onLogin(values);
      }
      
      form.resetFields();
    } catch (e) {
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      title={
        <div style={{ color: textColor }}>
          {isRegister ? '注册新用户' : '用户登录'}
        </div>
      }
      footer={null}
      width={400}
      centered
      style={{ background: modalBg, borderRadius: 16, boxShadow: theme === 'dark' ? '0 4px 32px 0 rgba(0,0,0,0.22)' : undefined }}
    >
      <Form form={form} layout="vertical" size="large">
        <Form.Item
          name="username"
          label={<span style={{ color: textColor }}>用户名</span>}
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 2, message: '用户名至少2个字符' },
            { max: 20, message: '用户名最多20个字符' }
          ]}
        >
          <Input 
            placeholder="请输入用户名" 
            style={{ 
              background: theme === 'dark' ? '#262a32' : '#fff',
              color: textColor,
              borderColor: theme === 'dark' ? '#444' : borderColor,
              borderRadius: 8
            }}
          />
        </Form.Item>
        
        <Form.Item
          name="password"
          label={<span style={{ color: textColor }}>密码</span>}
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' }
          ]}
        >
          <Input.Password 
            placeholder="请输入密码" 
            style={{ 
              background: theme === 'dark' ? '#262a32' : '#fff',
              color: textColor,
              borderColor: theme === 'dark' ? '#444' : borderColor,
              borderRadius: 8
            }}
          />
        </Form.Item>

        {isRegister && (
          <Form.Item
            name="email"
            label={<span style={{ color: textColor }}>邮箱</span>}
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
              {
                validator(_, value) {
                  if (!value || value.includes('@')) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('请输入有效的邮箱地址'));
                }
              }
            ]}
          >
            <Input 
              placeholder="请输入邮箱" 
              style={{ 
                background: theme === 'dark' ? '#262a32' : '#fff',
                color: textColor,
                borderColor: theme === 'dark' ? '#444' : borderColor,
                borderRadius: 8
              }}
            />
          </Form.Item>
        )}

        <Form.Item>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              style={{ flex: 1, borderRadius: 8, background: theme === 'dark' ? mainColorSolid : undefined, border: 'none', fontWeight: 600 }}
            >
              {isRegister ? '注册' : '登录'}
            </Button>
            <Button onClick={toggleMode} style={{ flex: 1, borderRadius: 8 }}>
              {isRegister ? '已有账号？去登录' : '没有账号？去注册'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

// 个人中心组件
function ProfileModal({ visible, onCancel, user, theme }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rechargeOrders, setRechargeOrders] = useState([]);
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // 根据theme动态设置颜色
  const modalBg = theme === 'dark' ? '#2f3136' : '#fff';
  const textColor = theme === 'dark' ? '#eee' : '#333';
  const borderColor = theme === 'dark' ? '#444' : '#d9d9d9';

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email
      });
      // 加载用户充值记录
      loadRechargeOrders();
      // 刷新用户信息
      refreshUserInfo();
    }
    // 主题切换时强制刷新
    // eslint-disable-next-line
  }, [visible, user, form, theme]);

  const refreshUserInfo = async () => {
    if (!user?.username) return;
    try {
      const response = await axios.get(`/api/user/${user.username}`);
      setCurrentUser(response.data);
      setUser && setUser(response.data); // 新增：同步全局user
      localStorage.setItem('user', JSON.stringify(response.data));
      console.log('[个人中心] 刷新用户信息成功:', response.data);
    } catch (error) {
      console.error('[个人中心] 刷新用户信息失败:', error);
    }
  };

  const loadRechargeOrders = async () => {
    if (!user?.username) return;
    setRechargeLoading(true);
    try {
      const response = await axios.get(`/api/user/recharge-orders/${user.username}`);
      setRechargeOrders(response.data);
      // 充值记录变化后刷新用户信息
      refreshUserInfo();
    } catch (error) {
      // 忽略错误
    } finally {
      setRechargeLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 更新用户信息
      const users = getUsers();
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { ...u, ...values };
        }
        return u;
      });
      setUsers(updatedUsers);
      
      // 更新当前用户状态
      const updatedUser = { ...user, ...values };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      message.success('个人信息更新成功！');
      onCancel();
    } catch (error) {
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={<span style={{ color: textColor }}>个人中心</span>}
      onOk={handleUpdateProfile}
      okText="保存"
      cancelText="取消"
      confirmLoading={loading}
      width={500}
      centered
      style={{ background: modalBg }}
    >
      <Form form={form} layout="vertical" size="large">
        <Form.Item
          name="username"
          label={<span style={{ color: textColor }}>用户名</span>}
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 2, message: '用户名至少2个字符' },
            { max: 20, message: '用户名最多20个字符' }
          ]}
        >
          <Input 
            placeholder="请输入用户名" 
            style={{ 
              background: theme === 'dark' ? '#3a3d42' : '#fff',
              color: textColor,
              borderColor: borderColor
            }}
          />
        </Form.Item>
        
        <Form.Item
          name="email"
          label={<span style={{ color: textColor }}>邮箱</span>}
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input 
            placeholder="请输入邮箱" 
            style={{ 
              background: theme === 'dark' ? '#3a3d42' : '#fff',
              color: textColor,
              borderColor: borderColor
            }}
          />
        </Form.Item>

        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          background: theme === 'dark' ? '#23262e' : '#f6f8fa', 
          borderRadius: 6, 
          fontSize: 12, 
          color: theme === 'dark' ? '#bbb' : '#666',
          border: theme === 'dark' ? '1px solid #444' : 'none'
        }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>💡 账户信息</div>
          <div>• 用户ID: {currentUser?.id}</div>
          <div>• 注册时间: {currentUser?.createTime ? new Date(currentUser.createTime).toLocaleString() : '未知'}</div>
          <div>• 最后登录: {currentUser?.lastLoginTime ? new Date(currentUser.lastLoginTime).toLocaleString() : '未知'}</div>
          <div>• 用户角色: {currentUser?.isAdmin ? '管理员' : '普通用户'}</div>
          <div style={{ marginTop: 8, fontWeight: 600, color: theme === 'dark' ? '#4f8cff' : mainColorSolid }}>💰 消耗统计</div>
          <div>累计消耗Token：<span style={{ color: theme === 'dark' ? '#fff' : '#222', fontWeight: 700 }}>{currentUser?.usage_tokens !== undefined && currentUser?.usage_tokens !== null ? currentUser.usage_tokens : '--'}</span></div>
          <div>累计消耗金额：<span style={{ color: theme === 'dark' ? '#fff' : '#222', fontWeight: 700 }}>{currentUser?.usage_price !== undefined && currentUser?.usage_price !== null ? Number(currentUser.usage_price).toFixed(4) : '--'}</span></div>
          <div style={{ marginTop: 8, fontWeight: 600, color: theme === 'dark' ? '#4f8cff' : mainColorSolid }}>💰 账户余额</div>
          <div>• 账户余额: {currentUser?.balance !== undefined && currentUser?.balance !== null ? Number(currentUser.balance).toFixed(2) : '--'}
            <RechargeButton user={currentUser} onSuccess={() => { loadRechargeOrders(); refreshUserInfo(); }} />
          </div>
          
          <div style={{ marginTop: 8, fontWeight: 600, color: theme === 'dark' ? '#4f8cff' : mainColorSolid }}>📋 充值记录</div>
          {rechargeLoading ? (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <Spin size="small" />
            </div>
          ) : rechargeOrders.length === 0 ? (
            <div style={{ fontSize: 12, color: theme === 'dark' ? '#888' : '#999' }}>暂无充值记录</div>
          ) : (
            <div style={{ maxHeight: 120, overflow: 'auto' }}>
              {rechargeOrders.slice(0, 5).map(order => (
                <div key={order.orderId} style={{ 
                  fontSize: 11, 
                  marginBottom: 4,
                  padding: '4px 6px',
                  background: theme === 'dark' ? '#18191c' : '#f0f0f0',
                  borderRadius: 4,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: textColor,
                  border: theme === 'dark' ? '1px solid #444' : 'none'
                }}>
                  <span style={{ color: textColor }}>
                    ¥{order.amount.toFixed(2)} - {order.createTime ? new Date(order.createTime).toLocaleDateString() : '未知'}
                  </span>
                  <Tag 
                    color={order.status === 'pending' ? 'orange' : order.status === 'approved' ? 'green' : 'red'} 
                    style={{ fontSize: 10, margin: 0 }}
                  >
                    {order.statusText}
                  </Tag>
                </div>
              ))}
              {rechargeOrders.length > 5 && (
                <div style={{ fontSize: 11, color: theme === 'dark' ? '#888' : '#999', textAlign: 'center', marginTop: 4 }}>
                  还有 {rechargeOrders.length - 5} 条记录...
                </div>
              )}
            </div>
          )}
        </div>
      </Form>
    </Modal>
  );
}
// 充值审核弹窗组件
function RechargeReviewModal({ visible, onCancel, theme, onRefreshUsers }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvingOrderId, setApprovingOrderId] = useState(null);
  const approveLock = useRef(false); // 新增Promise锁

  // 根据theme动态设置颜色
  const modalBg = theme === 'dark' ? '#2f3136' : '#fff';
  const textColor = theme === 'dark' ? '#eee' : '#333';
  const borderColor = theme === 'dark' ? '#444' : '#d9d9d9';

  useEffect(() => {
    if (visible) {
      setLoading(true);
      axios.get(`${API_BASE}/api/admin/recharge-orders`)
        .then(response => {
          setOrders(response.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [visible]);

  const handleApprove = async (orderId, event) => {
    if (event && event.stopPropagation) event.stopPropagation();
    if (approveLock.current) return;
    approveLock.current = true;
    setApprovingOrderId(orderId);
    try {
      await axios.post(`${API_BASE}/api/admin/recharge-orders/${orderId}/approve`);
      message.success('审核通过');
      // 刷新订单列表
      const response = await axios.get(`${API_BASE}/api/admin/recharge-orders`);
      setOrders(response.data);
      if (onRefreshUsers) onRefreshUsers();
    } catch (error) {
      message.error('操作失败：' + (error.response?.data?.error || error.message));
    } finally {
      setTimeout(() => {
        setApprovingOrderId(null);
        approveLock.current = false;
      }, 1000);
    }
  };

  const handleReject = async (orderId) => {
    try {
      await axios.post(`${API_BASE}/api/admin/recharge-orders/${orderId}/reject`);
      message.success('已拒绝');
      // 刷新订单列表1
      const response = await axios.get(`${API_BASE}/api/admin/recharge-orders`);
      setOrders(response.data);
      if (onRefreshUsers) onRefreshUsers();
    } catch (error) {
      message.error('操作失败：' + (error.response?.data?.error || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={<span style={{ color: textColor }}>充值审核</span>}
      footer={null}
      width={900}
      centered
      style={{ background: modalBg }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ maxHeight: 500, overflow: 'auto' }}>
          {orders.length === 0 ? (
            <Empty 
              description="暂无充值订单" 
              style={{ color: textColor }}
            />
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ 
                  background: theme === 'dark' ? '#3a3d42' : '#fafafa',
                  borderBottom: `1px solid ${borderColor}`
                }}>
                  <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>订单号</th>
                  <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>用户名</th>
                  <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>充值金额</th>
                  <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>申请时间</th>
                  <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>状态</th>
                  <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.orderId} style={{ 
                    borderBottom: `1px solid ${borderColor}`,
                    background: theme === 'dark' ? '#2f3136' : '#fff'
                  }}>
                    <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>{order.orderId}</td>
                    <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>{order.username}</td>
                    <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>¥{order.amount.toFixed(2)}</td>
                    <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>
                      {order.createTime ? new Date(order.createTime).toLocaleString() : '未知'}
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>
                      <Tag color={getStatusColor(order.status)} style={{ fontSize: 12 }}>
                        {order.statusText}
                      </Tag>
                    </td>
                    <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>
                      {order.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <Button 
                            type="primary" 
                            size="small" 
                            onClick={e => handleApprove(order.orderId, e)}
                            style={{ fontSize: 12 }}
                            disabled={approvingOrderId === order.orderId}
                            loading={approvingOrderId === order.orderId}
                          >
                            通过
                          </Button>
                          <Button 
                            danger 
                            size="small" 
                            onClick={() => handleReject(order.orderId)}
                            style={{ fontSize: 12 }}
                          >
                            拒绝
                          </Button>
                        </div>
                      )}
                      {order.status !== 'pending' && (
                        <span style={{ color: theme === 'dark' ? '#888' : '#999', fontSize: 12 }}>
                          {order.status === 'approved' && order.approveTime ? 
                            `审核时间: ${new Date(order.approveTime).toLocaleString()}` :
                            order.status === 'rejected' && order.rejectTime ? 
                            `拒绝时间: ${new Date(order.rejectTime).toLocaleString()}` : 
                            '已处理'
                          }
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: theme === 'dark' ? '#23262e' : '#f6f8fa', 
        borderRadius: 6, 
        fontSize: 12, 
        color: theme === 'dark' ? '#bbb' : '#666',
        border: theme === 'dark' ? '1px solid #444' : 'none'
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>💡 充值审核说明</div>
        <div>• 显示所有用户的充值申请记录</div>
        <div>• 管理员可以审核通过或拒绝充值申请</div>
        <div>• 审核通过后用户余额将自动增加</div>
      </div>
    </Modal>
  );
}

// 用户管理弹窗组件
function UserListModal({ theme }) {
  const { userListVisible, hideUserList } = useUserList();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rechargeReviewVisible, setRechargeReviewVisible] = useState(false);
  const [agentReviewVisible, setAgentReviewVisible] = useState(false);

  // 根据theme动态设置颜色
  const modalBg = theme === 'dark' ? '#2f3136' : '#fff';
  const textColor = theme === 'dark' ? '#eee' : '#333';
  const borderColor = theme === 'dark' ? '#444' : '#d9d9d9';

  const fetchUsers = () => {
    setLoading(true);
    getAllUsersFromServer().then(allUsers => {
      setUsers(allUsers);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => {
    if (userListVisible) {
      fetchUsers();
    }
  }, [userListVisible]);

  const columns = [
    {
      title: <span style={{ color: textColor }}>用户名</span>,
      dataIndex: 'username',
      key: 'username',
      render: (text) => <span style={{ color: textColor }}>{text}</span>
    },
    {
      title: <span style={{ color: textColor }}>邮箱</span>,
      dataIndex: 'email',
      key: 'email',
      render: (text) => <span style={{ color: textColor }}>{text}</span>
    },
    {
      title: <span style={{ color: textColor }}>注册时间</span>,
      dataIndex: 'createTime',
      key: 'createTime',
      render: (text) => (
        <span style={{ color: textColor }}>
          {text ? new Date(text).toLocaleString() : '未知'}
        </span>
      )
    },
    {
      title: <span style={{ color: textColor }}>最后登录</span>,
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime',
      render: (text) => (
        <span style={{ color: textColor }}>
          {text ? new Date(text).toLocaleString() : '从未登录'}
        </span>
      )
    },
    {
      title: <span style={{ color: textColor }}>角色</span>,
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      render: (isAdmin) => (
        <Tag color={isAdmin ? 'red' : 'blue'} style={{ fontSize: 12 }}>
          {isAdmin ? '管理员' : '普通用户'}
        </Tag>
      )
    },
    {
      title: <span style={{ color: textColor }}>余额</span>,
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => <span style={{ color: textColor }}>{balance !== undefined ? (Number(balance).toFixed(2).replace(/^-0\.00$/, '0.00')) : '未知'}</span>
    }
  ];

  return (
    <Modal
      open={userListVisible}
      onCancel={hideUserList}
      title={<span style={{ color: textColor }}>用户管理</span>}
      footer={null}
      width={800}
      centered
      style={{ background: modalBg }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <div style={{ maxHeight: 400, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ 
                background: theme === 'dark' ? '#3a3d42' : '#fafafa',
                borderBottom: `1px solid ${borderColor}`
              }}>
                {columns.map(col => (
                  <th key={col.key} style={{ 
                    padding: '12px 8px', 
                    fontSize: 14, 
                    fontWeight: 600,
                    color: textColor,
                    textAlign: 'left'
                  }}>
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ 
                  borderBottom: `1px solid ${borderColor}`,
                  background: theme === 'dark' ? '#2f3136' : '#fff'
                }}>
                  {columns.map(col => (
                    <td key={col.key} style={{ 
                      padding: '12px 8px', 
                      fontSize: 14,
                      color: textColor
                    }}>
                      {col.render ? col.render(user[col.dataIndex], user) : user[col.dataIndex]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: theme === 'dark' ? '#23262e' : '#f6f8fa', 
        borderRadius: 6, 
        fontSize: 12, 
        color: theme === 'dark' ? '#bbb' : '#666',
        border: theme === 'dark' ? '1px solid #444' : 'none'
      }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>💡 功能说明</div>
        <div>• 显示所有注册用户的基本信息</div>
        <div>• 管理员可以查看用户注册时间和最后登录时间</div>
        <div>• 支持用户角色管理（管理员/普通用户）</div>
      </div>
      
      {/* 审核按钮组 */}
      <div style={{ 
        marginTop: 16, 
        textAlign: 'center',
        display: 'flex',
        gap: 12,
        justifyContent: 'center'
      }}>
        <Button 
          type="primary" 
          icon={<MessageOutlined />}
          onClick={() => setRechargeReviewVisible(true)}
          style={{ 
            background: mainColor,
            border: 'none',
            borderRadius: 6,
            height: 36,
            fontSize: 14,
            fontWeight: 500
          }}
        >
          审核充值
        </Button>
        <Button 
          type="primary" 
          icon={<SettingOutlined />}
          onClick={() => setAgentReviewVisible(true)}
          style={{ 
            background: mainColor,
            border: 'none',
            borderRadius: 6,
            height: 36,
            fontSize: 14,
            fontWeight: 500
          }}
        >
          审核智能体
        </Button>
      </div>
      
      {/* 充值审核弹窗 */}
      <RechargeReviewModal 
        visible={rechargeReviewVisible}
        onCancel={() => setRechargeReviewVisible(false)}
        theme={theme}
        onRefreshUsers={fetchUsers}
      />
      
      {/* 智能体审核弹窗 */}
      <AgentReviewModal 
        visible={agentReviewVisible}
        onCancel={() => setAgentReviewVisible(false)}
        theme={theme}
      />
    </Modal>
  );
}

// 智能体审核配置弹窗组件
function AgentReviewModal({ visible, onCancel, theme }) {
  const [agentsByStatus, setAgentsByStatus] = useState({ pending: [], review: [], configured: [] });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('review');
  const aiStartTimeRef = useRef(null);
  // 根据theme动态设置颜色
  const modalBg = theme === 'dark' ? '#2f3136' : '#fff';
  const textColor = theme === 'dark' ? '#eee' : '#333';
  const borderColor = theme === 'dark' ? '#444' : '#d9d9d9';

  useEffect(() => {
    if (visible) {
      fetchAgentsStatus();
    }
  }, [visible]);

  const fetchAgentsStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/admin/agents/status`);
      setAgentsByStatus(response.data);
    } catch (error) {
      message.error('获取智能体状态失败');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (agentId) => {
    try {
      await axios.post(`${API_BASE}/api/admin/agents/${agentId}/approve`);
      message.success('审核通过，智能体已配置，页面即将刷新');
      // 延迟刷新页面，让用户看到成功消息
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      message.error('操作失败：' + (error.response?.data?.error || error.message));
    }
  };

  const handleReject = async (agentId) => {
    try {
      await axios.post(`${API_BASE}/api/admin/agents/${agentId}/reject`, {
        reason: '配置不符合要求'
      });
      message.success('已拒绝，智能体状态已重置');
      fetchAgentsStatus(); // 刷新数据
    } catch (error) {
      message.error('操作失败：' + (error.response?.data?.error || error.message));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'review': return 'blue';
      case 'configured': return 'green';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return '待配置';
      case 'review': return '审核中';
      case 'configured': return '已配置';
      default: return '未知';
    }
  };

  const renderAgentList = (agents, status) => (
    <div style={{ maxHeight: 400, overflow: 'auto' }}>
      {agents.length === 0 ? (
        <Empty 
          description={`暂无${getStatusText(status)}的智能体`} 
          style={{ color: textColor }}
        />
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ 
              background: theme === 'dark' ? '#3a3d42' : '#fafafa',
              borderBottom: `1px solid ${borderColor}`
            }}>
              <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>智能体名称</th>
              <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>描述</th>
              <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>状态</th>
              <th style={{ padding: '12px 8px', fontSize: 14, fontWeight: 600, color: textColor, textAlign: 'left' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {agents.map(agent => (
              <tr key={agent.id} style={{ 
                borderBottom: `1px solid ${borderColor}`,
                background: theme === 'dark' ? '#2f3136' : '#fff'
              }}>
                <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>{agent.name}</td>
                <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>
                  <div style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {agent.description}
                  </div>
                </td>
                <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>
                  <Tag color={getStatusColor(agent.status)} style={{ fontSize: 12 }}>
                    {getStatusText(agent.status)}
                  </Tag>
                </td>
                <td style={{ padding: '12px 8px', fontSize: 14, color: textColor }}>
                  {agent.status === 'review' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button 
                        type="primary" 
                        size="small" 
                        onClick={() => handleApprove(agent.id)}
                        style={{ fontSize: 12 }}
                      >
                        通过
                      </Button>
                      <Button 
                        danger 
                        size="small" 
                        onClick={() => handleReject(agent.id)}
                        style={{ fontSize: 12 }}
                      >
                        拒绝
                      </Button>
                    </div>
                  )}
                  {agent.status === 'configured' && (
                    <span style={{ color: theme === 'dark' ? '#888' : '#999', fontSize: 12 }}>
                      {agent.approveTime ? `审核时间: ${new Date(agent.approveTime).toLocaleString()}` : '已配置'}
                    </span>
                  )}
                  {agent.status === 'pending' && (
                    <span style={{ color: theme === 'dark' ? '#888' : '#999', fontSize: 12 }}>
                      {agent.rejectTime ? `拒绝时间: ${new Date(agent.rejectTime).toLocaleString()}` : '等待配置'}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      title={<span style={{ color: textColor }}>智能体审核配置</span>}
      footer={null}
      width={1000}
      centered
      style={{ background: modalBg }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ color: textColor }}>
            <Tabs.TabPane 
              tab={
                <span style={{ color: textColor }}>
                  审核中 ({agentsByStatus.review.length})
                </span>
              } 
              key="review"
            >
              {renderAgentList(agentsByStatus.review, 'review')}
            </Tabs.TabPane>
            <Tabs.TabPane 
              tab={
                <span style={{ color: textColor }}>
                  待配置 ({agentsByStatus.pending.length})
                </span>
              } 
              key="pending"
            >
              {renderAgentList(agentsByStatus.pending, 'pending')}
            </Tabs.TabPane>
            <Tabs.TabPane 
              tab={
                <span style={{ color: textColor }}>
                  已配置 ({agentsByStatus.configured.length})
                </span>
              } 
              key="configured"
            >
              {renderAgentList(agentsByStatus.configured, 'configured')}
            </Tabs.TabPane>
          </Tabs>
          
          <div style={{ 
            marginTop: 16, 
            padding: 12, 
            background: theme === 'dark' ? '#3a3d42' : '#f6f8fa', 
            borderRadius: 6, 
            fontSize: 12, 
            color: theme === 'dark' ? '#bbb' : '#666' 
          }}>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>💡 智能体审核说明</div>
            <div>• <strong>待配置</strong>：智能体尚未配置API Key和参数</div>
            <div>• <strong>审核中</strong>：已配置API Key，等待管理员审核通过</div>
            <div>• <strong>已配置</strong>：审核通过，用户可以使用该智能体</div>
            <div>• 管理员可以审核通过或拒绝"审核中"状态的智能体</div>
            <div>• 拒绝后智能体状态会重置为"待配置"</div>
          </div>
        </>
      )}
    </Modal>
  );
}
// 工作流参数输入组件
function WorkflowInputModal({ visible, onCancel, onSubmit, agent, theme }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const aiStartTimeRef = useRef(null);
  // 根据theme动态设置颜色
  const modalBg = theme === 'dark' ? '#2f3136' : '#fff';
  const textColor = theme === 'dark' ? '#eee' : '#333';
  const borderColor = theme === 'dark' ? '#444' : '#d9d9d9';

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  // 文件转base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };



    const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      // 直接组装FormData，让后端处理文件上传
      const formData = new FormData();
      const inputs = {};
      
      // 修复query获取逻辑：如果没有第一个输入字段，使用默认值
      const firstInputName = agent?.inputs?.[0]?.name;
      const queryValue = firstInputName && values[firstInputName] ? values[firstInputName] : '参数配置';
      
      formData.append('query', queryValue);
      formData.append('user', getUser()?.username || 'guest');
      
      // 处理文件和非文件参数
      for (const input of agent.inputs || []) {
        if (input.type === 'file' || input.type === 'upload' || (input.type === 'array' && input.itemType === 'file')) {
          // 文件参数，先转换图片格式，再添加到FormData
          const fileList = form.getFieldValue(input.name);
          
          if (input.type === 'array' && input.itemType === 'file') {
            // 多文件处理
            if (fileList && fileList.length > 0) {
              const originalFiles = fileList.map(fileItem => fileItem.originFileObj).filter(Boolean);
              // 转换所有图片为PNG格式
              const convertedFiles = await convertImagesToPng(originalFiles);
              convertedFiles.forEach((fileObj, index) => {
                formData.append(input.name, fileObj);
              });
            }
          } else {
            // 单文件处理
            const fileObj = fileList && fileList[0] && fileList[0].originFileObj;
            if (fileObj) {
              // 转换图片为PNG格式
              const convertedFile = await convertImageToPng(fileObj);
              formData.append(input.name, convertedFile);

              // 新增：保存图片到全局，供后续P图
              const base64 = await fileToBase64(convertedFile);
              const img = new window.Image();
              img.src = base64;
              window.lastUploadedImage = img;
            }
          }
        } else if (values[input.name] !== undefined) {
          // 非文件参数，添加到inputs对象
          inputs[input.name] = values[input.name];
        }
      }
      
      // 将非文件参数序列化后添加到FormData
      formData.append('inputs', JSON.stringify(inputs));
      

      
      const res = await axios.post(`${API_BASE}/api/agent/${agent.id}/invoke`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      

      
      // 文件上传成功，关闭弹窗
      message.success('参数提交成功！');
      form.resetFields();
      onCancel(); // 关闭弹窗
      
      // 立即显示用户消息和AI思考气泡，开始计时
      await onSubmit({ status: 'processing', message: '参数提交成功，正在处理中...' });
      
      // 如果有组装好的数据，调用新的Dify API
      if (res.data && res.data.inputs) {
        try {
          // 统一用chat类型的构造方式
          const difyResponse = await axios.post(`${API_BASE}/api/agent/${agent.id}/call-dify`, { data: res.data });

          onSubmit(difyResponse.data);
        } catch (difyError) {
          onSubmit({ 
            status: 'error', 
            message: 'Dify调用失败: ' + (difyError.response?.data?.error || difyError.message)
          });
        }
      } else if ((res.data && res.data.answer)) {
        // 如果有直接结果，更新为最终结果
        onSubmit(res.data);
      }
    } catch (e) {
      message.error('参数提交失败: ' + (e.response?.data?.error || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal 
      open={visible} 
      onCancel={handleCancel}
      onOk={handleSubmit}
      title={<span style={{ color: textColor }}>{`${agent?.name} - 参数配置`}</span>}
      okText="提交"
      cancelText="取消"
      confirmLoading={loading}
      width={600}
      centered
      style={{ background: modalBg, borderRadius: 18, boxShadow: theme === 'dark' ? '0 8px 40px 0 rgba(0,0,0,0.32)' : '0 8px 40px 0 rgba(79,140,255,0.13)', padding: 0 }}
      bodyStyle={{ padding: 0 }}
      footer={null}
    >
      <div style={{ padding: 0, height: 500, display: 'flex', flexDirection: 'column', borderRadius: 18, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px 0 40px', background: modalBg }}>
          <Form form={form} layout="vertical" size="large">
          {agent?.inputs?.map((input, index) => (
            input.type === 'upload' ? (
              <Form.Item
                key={index}
                name={input.name}
                label={<span style={{ color: textColor, fontWeight: 600, fontSize: 16 }}>{input.label}</span>}
                valuePropName="fileList"
                getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                rules={[{ required: input.required, message: `请先选择${input.label}` }]}
                extra={<span style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: 13 }}>{input.description || '支持文档上传到Dify，图片将自动转换为PNG格式'}</span>}
                style={{ marginBottom: 28 }}
              >
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>选择文档</Button>
                </Upload>
              </Form.Item>
            ) : input.type === 'file' ? (
              <Form.Item
                key={index}
                name={input.name}
                label={<span style={{ color: textColor, fontWeight: 600, fontSize: 16 }}>{input.label}</span>}
                valuePropName="fileList"
                getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                rules={[{ required: input.required, message: `请先选择${input.label}` }]}
                extra={<span style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: 13 }}>{input.description || '支持图片文件，将自动转换为PNG格式'}</span>}
                style={{ marginBottom: 28 }}
              >
                <Upload beforeUpload={() => false} maxCount={1}>
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </Form.Item>
            ) : input.type === 'array' && input.itemType === 'file' ? (
              <Form.Item
                key={index}
                name={input.name}
                label={<span style={{ color: textColor, fontWeight: 600, fontSize: 16 }}>{input.label}</span>}
                valuePropName="fileList"
                getValueFromEvent={e => Array.isArray(e) ? e : e && e.fileList}
                rules={[{ required: input.required, message: `请先选择${input.label}` }]}
                extra={<span style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: 13 }}>{input.description || '支持多文件上传，图片将自动转换为PNG格式'}</span>}
                style={{ marginBottom: 28 }}
              >
                <Upload beforeUpload={() => false} multiple>
                  <Button icon={<UploadOutlined />}>选择多个文件</Button>
                </Upload>
              </Form.Item>
            ) : input.type === 'select' ? (
              <Form.Item
                key={index}
                name={input.name}
                label={<span style={{ color: textColor, fontWeight: 600, fontSize: 16 }}>{input.label}</span>}
                rules={[{ required: input.required, message: `请输入${input.label}` }]}
                extra={<span style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: 13 }}>{input.description}</span>}
                style={{ marginBottom: 28 }}
              >
                <Select 
                  placeholder={`请选择${input.label}`}
                  style={{ 
                    background: theme === 'dark' ? '#3a3d42' : '#fff',
                    color: textColor
                  }}
                >
                  {input.options?.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <Form.Item
                key={index}
                name={input.name}
                label={<span style={{ color: textColor, fontWeight: 600, fontSize: 16 }}>{input.label}</span>}
                rules={[{ required: input.required, message: `请输入${input.label}` }]}
                extra={input.name !== 'word_list' ? <span style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: 13 }}>{input.description}</span> : undefined}
                style={{ marginBottom: 28 }}
              >
                <Input.TextArea 
                  placeholder={`请输入${input.label}`}
                  rows={input.type === 'string' ? 3 : 1}
                  disabled={false}
                  readOnly={false}
                  ref={input.name === 'word_list' ? (el) => { if (el) window.wordListInput = el; } : undefined}
                  style={{ 
                    background: theme === 'dark' ? '#3a3d42' : '#fff',
                    color: textColor,
                    borderColor: borderColor,
                    borderRadius: 10,
                    fontSize: 15,
                    minHeight: 80
                  }}
                />
                {/* word_list专属自动填入按钮和示例描述 */}
                {input.name === 'word_list' && (
                  <>
                    <Button
                      style={{ marginTop: 8 }}
                      onClick={() => {
                        const example = [
                          'Achieve 实现；达到',
                          'Curious 好奇的；求知欲强的',
                          'Frequent 频繁的；经常的',
                          'Generate 产生；生成',
                          'Valuable 有价值的；贵重的'
                        ].join('\n');
                        form.setFieldsValue({ [input.name]: example });
                        setTimeout(() => {
                          if (window.wordListInput && window.wordListInput.resizableTextArea && window.wordListInput.resizableTextArea.textArea) {
                            window.wordListInput.resizableTextArea.textArea.value = example;
                            window.wordListInput.focus();
                          }
                        }, 100);
                      }}
                    >自动填入示例</Button>
                    <div style={{ 
                      color: theme === 'dark' ? '#bbb' : '#888', 
                      fontSize: 13, 
                      marginTop: 4, 
                      whiteSpace: 'pre-line' 
                    }}>
                      {`每行一个，格式如下：\nAchieve 实现；达到\nCurious 好奇的；求知欲强的\nFrequent 频繁的；经常的\nGenerate 产生；生成\nValuable 有价值的；贵重的`}
                    </div>
                  </>
                )}
              </Form.Item>
            )
          ))}
          </Form>
        </div>
        <div style={{ padding: '0 40px 32px 40px', background: modalBg, display: 'flex', justifyContent: 'center', gap: 18 }}>
          <Button onClick={handleCancel} style={{ borderRadius: 10, minWidth: 90, height: 40, fontWeight: 600, fontSize: 16, background: theme === 'dark' ? '#23262e' : '#fff', color: theme === 'dark' ? '#eee' : '#333', border: `1.5px solid ${borderColor}` }}>取消</Button>
          <Button type="primary" onClick={handleSubmit} loading={loading} style={{ borderRadius: 10, minWidth: 90, height: 40, fontWeight: 600, fontSize: 16, background: mainColor, border: 'none' }}>提交</Button>
        </div>
      </div>
    </Modal>
  );
}

function ChatPage({ onBack, agent, theme, setTheme, chatId, navigate, user, setUser }) {
  const { showUserList } = useUserList();
  const [messages, setMessages] = useState([
    { role: 'system', content: agent?.description || '欢迎使用智能体，请输入你的问题' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [workflowInputVisible, setWorkflowInputVisible] = useState(false);
  const [outputMode, setOutputMode] = useState('rendered'); // 新增：输出模式开关 'rendered' | 'json'
  const chatRef = useRef(null);
  const [aiTimer, setAiTimer] = useState(0);
  const aiTimerRef = useRef(null);
  const aiStartTimeRef = useRef(null);
  const [chatHistory, setChatHistory] = useState(loadChatHistory(agent?.id));
  const [currentHistoryId, setCurrentHistoryId] = useState(null);
  const [chatPageKey, setChatPageKey] = useState(Date.now());

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // 登录处理
  const handleLogin = async (values) => {
    try {
      const { username, password } = values;
      const user = await loginUser(username, password);
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setLoginVisible(false);
        message.success(`欢迎回来${user.username}！`);
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
      const user = await registerUser(username, password, email);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setLoginVisible(false);
      message.success('注册成功！欢迎使用智大蓝图！');
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请重试');
    }
  };

  // 获取用户信息
  const fetchUser = async (username) => {
    const user = await getUserFromServer(username);
    setUser(user);
  };

  // 登出处理
  const handleLogout = () => {
    setUser(null);
    clearUser();
    localStorage.removeItem('user');
    message.success('已退出登录');
  };

  // 个人中心处理
  const handleProfile = () => {
    setProfileVisible(true);
  };

  const sendMessage = async () => {
    let usage = undefined; // 统一定义
    if (!input.trim()) return;
    // 余额判断
    const currentUser = getUser();
    if (!currentUser) {
      message.error('请先登录');
      return;
    }
    // 新增：workflow类型默认扣费逻辑
    if (agent?.workflow === true || agent?.apiUrl?.includes('/workflows/')) {
      // workflow类型，默认消耗
      if (!currentUser.isAdmin && (currentUser.balance === undefined || currentUser.balance < 0.05)) {
        message.error('余额不足，workflow类型最低需0.05元，请充值后再试！');
        return;
      }
    } else {
      if (!currentUser.isAdmin && currentUser.balance !== undefined && currentUser.balance < 0.01) {
        message.error('余额不足，请充值后再试！');
        return;
      }
    }
    aiStartTimeRef.current = Date.now();
    setAiTimer(0);
    aiTimerRef.current = setInterval(() => {
      setAiTimer(((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1));
    }, 100);
    setLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    // 立即插入AI loading气泡，显示思考消息。
    setMessages([...newMessages, { role: 'assistant', content: 'AI正在思考🤔', isLoading: true }]);
    setInput('');
    try {
      console.log('普通消息调用信息:', {
        query: input,
        timestamp: new Date().toISOString()
      });
      
      const res = await axios.post(`/api/agent/${agent.id}/invoke`, {
        query: input.trim(),
        inputs: {},
      });
      
      console.log('API响应状态:', res.status);
      console.log('API响应数据:', res.data);
      
      // 直接使用完整响应数据，不提取任何字段
      const answer = res.data;
      
      // 累加token和价格消耗
      usage = res.data.metadata?.usage || res.data.data;
      // 新增：workflow类型无usage时默认扣费
      let tokens = Number(usage?.total_tokens) || 0;
      let priceRaw = Number(usage?.total_price) || 0;
      if ((agent?.workflow === true || agent?.apiUrl?.includes('/workflows/')) && (tokens === 0 || priceRaw === 0)) {
        tokens = 1000;
        priceRaw = 0.05;
      }
      let price = priceRaw === 0 ? 0.005 : priceRaw;
      if (agent?.id === 'word-to-song') {
        price += 1.5;
      }
      let currentUser = getUser();
      currentUser.usage_tokens = (currentUser.usage_tokens || 0) + tokens;
      currentUser.usage_price = (currentUser.usage_price || 0) + price;
      // 调试输出
      console.log('[消耗统计] 本次返回 tokens:', tokens, 'price:', price, '累计 tokens:', currentUser.usage_tokens, '累计 price:', currentUser.usage_price);
      setUser(currentUser);
      const usageResponse = await updateUserUsage(currentUser.username, currentUser.usage_tokens, currentUser.usage_price);
      // 更新本地用户余额信息
      if (usageResponse.success && usageResponse.balance !== undefined) {
        currentUser.balance = usageResponse.balance;
        setUser(currentUser);
        console.log('[余额更新] 更新后余额:', usageResponse.balance);
      }
      // === 修复点：AI回复后替换最后一条 isLoading assistant 消息 ===
      setMessages(msgs => {
        const lastIdx = msgs.length - 1;
        if (msgs[lastIdx]?.isLoading) {
          clearInterval(aiTimerRef.current);
          setAiTimer(0);
          return [
            ...msgs.slice(0, lastIdx),
            {
              role: 'assistant',
              content: answer, // 这里用AI返回内容
              usedTime: ((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1),
              tokens: usage?.total_tokens,
              price: price
            }
          ];
        }
        return msgs;
      });
    } catch (e) {
      console.error('普通消息调用失败详细信息:', {
        message: e.message,
        code: e.code,
        status: e.response?.status,
        statusText: e.response?.statusText,
        data: e.response?.data,
        config: {
          url: e.config?.url,
          method: e.config?.method,
          headers: e.config?.headers,
          timeout: e.config?.timeout
        }
      });
      
      let errMsg = '接口请求失败';
      let details = '';
      
      if (e.code === 'ECONNABORTED') {
        errMsg = '请求超时';
        details = '服务器响应超时，请检查网络连接或稍后重试';
      } else if (e.code === 'ERR_NETWORK') {
        errMsg = '网络连接错误';
        details = '无法连接到服务器，请检查：\n1. 网络连接是否正常\n2. 服务器地址是否正确\n3. 防火墙设置';
      } else if (e.response) {
        // 服务器返回了错误状态码
        errMsg = `服务器错误 (${e.response.status})`;
        details = `状态码: ${e.response.status}\n状态文本: ${e.response.statusText}\n响应数据: ${JSON.stringify(e.response.data, null, 2)}`;
      } else if (e.request) {
        // 请求已发出但没有收到响应
        errMsg = '无服务器响应';
        details = '请求已发送但服务器没有响应，请检查服务器状态';
      } else {
        // 其他错误
        errMsg = '请求配置错误';
        details = e.message;
      }
      
      const fullErrorMsg = `${errMsg}\n\n详细信息:\n${details}\n\n请求URL: ${agent.apiUrl}\nAPI Key: ${agent.apiKey ? agent.apiKey.substring(0, 10) + '...' : '未设置'}`;
      
      setMessages(msgs => {
        const lastIdx = msgs.length - 1;
        const priceRaw = Number(usage?.total_price) || 0;
        let price = priceRaw === 0 ? 0.005 : priceRaw;
        if (agent?.id === 'word-to-song') {
          price += 1.5;
        }
        if (msgs[lastIdx]?.isLoading) {
          clearInterval(aiTimerRef.current);
          setAiTimer(0);
          return [
            ...msgs.slice(0, lastIdx),
            {
              role: 'assistant',
              content: fullErrorMsg,
              usedTime: ((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1),
              tokens: usage?.total_tokens,
              price: price
            }
          ];
        } else {
          return [
            ...msgs,
            {
              role: 'assistant',
              content: fullErrorMsg,
              usedTime: ((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1),
              tokens: usage?.total_tokens,
              price: price
            }
          ];
        }
      });
    }
    setLoading(false);
  };

  // 工作流提交处理
  const handleWorkflowSubmit = async (params) => {
    // 检查是否是处理中状态
    if (params.status === 'processing') {
      // 如果是第一次调用（还没有loading状态），初始化界面
      if (!loading) {
        const newMessages = [...messages, { role: 'user', content: `提交参数：图片+其它参数` }];
        setMessages([...newMessages, { role: 'assistant', content: '', isLoading: true }]); // 立即插入AI正在思考气泡
        setWorkflowInputVisible(false);
        
        // 立即开始计时
        aiStartTimeRef.current = Date.now();
        setAiTimer(0);
        aiTimerRef.current = setInterval(() => {
          setAiTimer(((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1));
        }, 100);
        
        setLoading(true);
      }
      
      // 更新处理中消息，保持isLoading状态以显示计时器
      setMessages(msgs => {
        const lastIdx = msgs.length - 1;
        if (msgs[lastIdx]?.isLoading) {
          return [
            ...msgs.slice(0, lastIdx),
            {
              role: 'assistant',
              content: params.message || 'AI正在思考🤔',
              isLoading: true, // 保持isLoading状态，让计时器继续显示
              usedTime: ((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1)
            }
          ];
        }
        return msgs;
      });
      return;
    }
    
    // 检查是否是错误状态
    if (params.status === 'error') {
      // 更新错误消息，保持计时器运行
      setMessages(msgs => {
        const lastIdx = msgs.length - 1;
        if (msgs[lastIdx]?.isLoading) {
          return [
            ...msgs.slice(0, lastIdx),
            {
              role: 'assistant',
              content: params.message || '处理失败',
              usedTime: ((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1)
            }
          ];
        }
        return msgs;
      });
      
      // 停止计时器
      clearInterval(aiTimerRef.current);
      setAiTimer(0);
      setLoading(false);
      return;
    }
    
    // 如果有直接的结果数据（如answer字段），直接显示
    if (params.answer || params.content) {
      // 累加token和价格消耗
      if (params.metadata?.usage && user) {
        let tokens = Number(params.metadata.usage.total_tokens) || 0;
        let priceRaw = Number(params.metadata.usage.total_price) || 0;
        if ((agent?.workflow === true || agent?.apiUrl?.includes('/workflows/')) && (tokens === 0 || priceRaw === 0)) {
          tokens = 1000;
          priceRaw = 0.05;
        }
        let price = priceRaw === 0 ? 0.005 : priceRaw;
        if (agent?.id === 'word-to-song') {
          price += 1.5;
        }
        let currentUser = getUser();
        currentUser.usage_tokens = (currentUser.usage_tokens || 0) + tokens;
        currentUser.usage_price = (currentUser.usage_price || 0) + price;
        // 调试输出
        console.log('[消耗统计] 本次返回 tokens:', tokens, 'price:', price, '累计 tokens:', currentUser.usage_tokens, '累计 price:', currentUser.usage_price);
        setUser(currentUser);
        const usageResponse = await updateUserUsage(currentUser.username, currentUser.usage_tokens, currentUser.usage_price);
        // 更新本地用户余额信息
        if (usageResponse.success && usageResponse.balance !== undefined) {
          currentUser.balance = usageResponse.balance;
          setUser(currentUser);
          console.log('[余额更新] 更新后余额:', usageResponse.balance);
        }
      }
      
      // 更新最终结果，保持计时器运行
      setMessages(msgs => {
        const lastIdx = msgs.length - 1;
        const priceRaw = Number(params.metadata?.usage?.total_price) || 0;
        let price = priceRaw === 0 ? 0.005 : priceRaw;
        if (agent?.id === 'word-to-song') {
          price += 1.5;
        }
        if (msgs[lastIdx]?.isLoading) {
          return [
            ...msgs.slice(0, lastIdx),
            {
              role: 'assistant',
              content: params,
              usedTime: ((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1),
              tokens: params.metadata?.usage?.total_tokens || params.data?.total_tokens,
              price: price
            }
          ];
        }
        return msgs;
      });
      
      // 停止计时器
      clearInterval(aiTimerRef.current);
      setAiTimer(0);
      setLoading(false);
      return;
    }
    
    // 如果已经有loading状态，说明正在处理中，直接返回
    if (loading) {
      console.log('【前端】已有处理中的请求，忽略重复调用');
      return;
    }
    
    // 立即显示用户消息和AI思考气泡
    const newMessages = [...messages, { role: 'user', content: `提交参数：图片+其它参数` }];
    setMessages([...newMessages, { role: 'assistant', content: '', isLoading: true }]); // 立即插入AI正在思考气泡
    setWorkflowInputVisible(false);
    
    // 立即开始计时
    aiStartTimeRef.current = Date.now();
    setAiTimer(0);
    aiTimerRef.current = setInterval(() => {
      setAiTimer(((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1));
    }, 100);
    
    setLoading(true);
    
    // 其他情况，显示处理完成
    clearInterval(aiTimerRef.current);
    setAiTimer(0);
    setMessages([
      ...newMessages,
      {
        role: 'assistant',
        content: params,
        usedTime: ((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1)
      }
    ]);
    setLoading(false);
  };

  // 网络诊断功能
  const handleNetworkDiagnosis = async () => {
    const diagnosisResults = [];
    diagnosisResults.push('=== 网络诊断开始 ===');
    diagnosisResults.push(`诊断时间: ${new Date().toLocaleString()}`);
    diagnosisResults.push(`目标服务器: ${agent.apiUrl}`);
    diagnosisResults.push(`API Key: ${agent.apiKey ? agent.apiKey.substring(0, 10) + '...' : '未设置'}`);
    
    try {
      // 测试基本连接
      diagnosisResults.push('\n1. 测试基本网络连接...');
      const pingTest = await axios.get(agent.apiUrl.replace('/v1/chat-messages', '/health'), {
        timeout: 5000
      }).catch(e => {
        diagnosisResults.push(`   ❌ 连接失败: ${e.message}`);
        return null;
      });
      
      if (pingTest) {
        diagnosisResults.push(`   ✅ 连接成功 (状态码: ${pingTest.status})`);
      }
      
      // 测试API端点
      diagnosisResults.push('\n2. 测试API端点...');
      const apiTest = await axios.post(agent.apiUrl, {
        inputs: {},
        query: 'test',
        response_mode: 'blocking',
        conversation_id: '',
        user: 'diagnosis',
      }, {
        headers: {
          'Authorization': `Bearer ${agent.apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }).catch(e => {
        if (e.response) {
          diagnosisResults.push(`   ⚠️ API响应错误: ${e.response.status} - ${e.response.statusText}`);
          diagnosisResults.push(`   响应数据: ${JSON.stringify(e.response.data, null, 2)}`);
        } else if (e.request) {
          diagnosisResults.push(`   ❌ 无服务器响应: ${e.message}`);
        } else {
          diagnosisResults.push(`   ❌ 请求配置错误: ${e.message}`);
        }
        return null;
      });
      
      if (apiTest) {
        diagnosisResults.push(`   ✅ API调用成功 (状态码: ${apiTest.status})`);
      }
      
    } catch (error) {
      diagnosisResults.push(`\n❌ 诊断过程出错: ${error.message}`);
    }
    
    diagnosisResults.push('\n=== 网络诊断结束 ===');
    
    const diagnosisText = diagnosisResults.join('\n');
    setMessages([...messages, { role: 'assistant', content: diagnosisText }]);
  };

  // 聊天主内容区样式优化
  const mainCardStyle = {
    maxWidth: 1400,
    width: '95vw',
    margin: '8px auto',
    background: theme === 'dark' ? '#202125' : '#fff', // 更深
    borderRadius: 28, // 圆角加大
    boxShadow: theme === 'dark' ? '0 6px 32px 0 rgba(0,0,0,0.22)' : cardShadow,
    padding: '40px 40px', // 留白加大
    display: 'flex',
    flexDirection: 'column',
    height: '80vh',
    minHeight: 500,
    border: theme === 'dark' ? '1.5px solid #202125' : 'none',
  };

  // 聊天内容区样式优化
  const chatContentStyle = {
    flex: 1,
    minHeight: 0,
    maxHeight: 'calc(80vh - 140px)', // 主卡片高度减去底部输入区
    overflowY: 'auto',
    padding: 32, // 留白加大
    background: 'transparent',
    borderRadius: 18,
    wordBreak: 'break-all',
    whiteSpace: 'pre-wrap',
  };

  // 启动时自动清理localStorage中的空历史对话
  useEffect(() => {
    if (agent?.id) {
      let history = loadChatHistory(agent.id).filter(h => Array.isArray(h.messages) && h.messages.some(m => m.content && m.content.trim() && (m.role === 'user' || m.role === 'assistant')));
      saveChatHistory(history, agent.id);
      setChatHistory(history);
    }
  }, [agent?.id]);

  // 保存历史对话（只保存有有效用户/AI消息的，不能只是一条系统消息）
  useEffect(() => {
    if (
      agent?.id &&
      messages.length > 0 &&
      messages.some(m => {
        return m.content && (typeof m.content === 'string' ? m.content.trim() : true);
      })
    ) {
      // 生成历史标题：首条用户消息前20字或'新对话'
      const firstUserMsg = messages.find(m => m.role === 'user' && m.content && m.content.trim());
      const title = firstUserMsg ? firstUserMsg.content.slice(0, 20) : '新对话';
      let history = loadChatHistory(agent.id);
      let id = currentHistoryId;
      // 如果currentHistoryId为空，自动生成并保存新历史
      if (!id) {
        id = Date.now().toString();
        setCurrentHistoryId(id);
        // 避免重复push，只有不存在时才push
        if (!history.find(h => h.id === id)) {
          const currentHistory = {
            id,
            agentId: agent.id,
            agentName: agent.name,
            title,
            messages: messages.filter(m => {
              return m.content && (typeof m.content === 'string' ? m.content.trim() : true);
            }),
            lastUpdate: new Date().toISOString()
          };
          history.push(currentHistory);
        }
      } else {
        const currentHistory = {
          id,
          agentId: agent.id,
          agentName: agent.name,
          title,
                      messages: messages.filter(m => {
              return m.content && (typeof m.content === 'string' ? m.content.trim() : true);
            }),
          lastUpdate: new Date().toISOString()
        };
        const existingIndex = history.findIndex(h => h.id === id);
        if (existingIndex >= 0) {
          history[existingIndex] = currentHistory;
        } else if (messages.length === 1 && messages[0].role === 'system') {
          // 不保存只有系统消息的历史
          return;
        } else {
          history.push(currentHistory);
        }
      }
      // 只保留最近20条对话
      if (history.length > 20) {
        history = history.slice(-20);
      }
      saveChatHistory(history, agent.id);
      setChatHistory(history);
    }
  }, [messages, agent?.id, currentHistoryId]);

  // 切换历史对话时不立即保存，只切换内容
  const handleHistoryClick = (item) => {
    setMessages(item.messages);
    setCurrentHistoryId(item.id);
    setChatPageKey(Date.now()); // 强制刷新
  };

  // 新对话
  const handleNewChat = () => {
    const newId = Date.now().toString();
    setMessages([{ role: 'system', content: agent?.description || '欢迎使用智能体，请输入你的问题' }]);
    setCurrentHistoryId(newId);
  };

  // 删除历史对话
  const handleDeleteHistory = (id, e) => {
    e.stopPropagation();
    let history = loadChatHistory(agent?.id);
    history = history.filter(h => h.id !== id);
    saveChatHistory(history, agent?.id);
    setChatHistory(history);
    if (currentHistoryId === id) {
      handleNewChat();
    }
  };

  // 初始化时根据chatId恢复历史
  useEffect(() => {
    if (chatId) {
      const history = loadChatHistory();
      const item = history.find(h => h.id === chatId);
      if (item) {
        setMessages(item.messages);
        setCurrentHistoryId(item.id);
      }
    }
  }, [chatId]);

  // aiTimer定时器副作用，loading时自动计时，结束时清理
  useEffect(() => {
    if (loading) {
      aiStartTimeRef.current = Date.now();
      setAiTimer(0);
      if (aiTimerRef.current) clearInterval(aiTimerRef.current);
      aiTimerRef.current = setInterval(() => {
        setAiTimer(((Date.now() - aiStartTimeRef.current) / 1000).toFixed(1));
      }, 100);
    } else {
      if (aiTimerRef.current) {
        clearInterval(aiTimerRef.current);
        aiTimerRef.current = null;
      }
      setAiTimer(0);
    }
    return () => {
      if (aiTimerRef.current) {
        clearInterval(aiTimerRef.current);
        aiTimerRef.current = null;
      }
    };
  }, [loading]);

  // 保证user状态变化时自动同步localStorage，实现自动登录
  useEffect(() => {
    if (user) {
      setUser && typeof user === 'object' && localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // 新增：内容提取和渲染函数
  const extractAndRenderContent = (content) => {
    const isWorkflow = agent?.workflow === true || agent?.apiUrl?.includes('/workflows/');
    // 调试输出类型
    console.log('[extractAndRenderContent] 当前类型:', isWorkflow ? 'workflow' : 'chat', 'agent:', agent);
    if (outputMode === 'json') {
      // JSON模式：直接返回原始内容
      return typeof content === 'string' ? content : JSON.stringify(content, null, 2);
    }

    // 渲染模式：根据智能体类型处理内容
    // const isWorkflow = agent?.workflow === true || agent?.apiUrl?.includes('/workflows/'); // 删除此行
    
    // 新增：自动检测HTML内容
    function isHtmlContent(text) {
      console.log('isHtmlContent', text);
      if (typeof text !== 'string') return false;
      console.log('检测到html内容，渲染iframe', text);
      return /<(html|body|div|table|img|iframe|span|p|a)[\s>]/i.test(text.trim());
    }
    // 默写批改P图分支
    // Workflow类型：提取data.outputs中的内容
    if (isWorkflow) {
      if (content && typeof content === 'object') {
        const data = content.data || content;
        const outputs = data.outputs;
        if (outputs) {
          let renderedContent = '';
          if (outputs.result) renderedContent += `${outputs.result}\n\n`;
          if (outputs.text) renderedContent += `${outputs.text}\n\n`;
          if (outputs.file) renderedContent += `${outputs.file}\n\n`;
          if (outputs.answer) renderedContent += `${outputs.answer}\n\n`;
          // 新增：处理文件数组，渲染音频播放器和下载链接
          if (outputs.files && Array.isArray(outputs.files)) {
            outputs.files.forEach(file => {
              if (file.url || file.remote_url) {
                // 渲染audio播放器
                renderedContent += `<audio controls src="${file.url || file.remote_url}">您的浏览器不支持音频播放</audio>\n\n`;
                renderedContent += `[下载音频文件：${file.filename || file.extension || '文件'}](${file.url || file.remote_url})\n\n`;
              }
            });
          }
          const finalContent = renderedContent.trim() || '处理完成，但未找到可显示的内容';
          console.log('Workflow提取的内容:', finalContent);
          
          // 对提取到的内容进行HTML检测
          if (outputMode === 'rendered' && isHtmlContent(finalContent)) {
            console.log('检测到HTML内容，渲染iframe:', finalContent);
            const bgColor = theme === 'dark' ? '#2f3136' : '#fff';
            const iframeBgColor = theme === 'dark' ? '#2f3136' : '#fff';
            return (
              <div
                style={{
                  width: '80%',
                  margin: '0 auto',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  minHeight: 500,
                  background: bgColor,
                  borderRadius: 18,
                  boxShadow: '0 4px 24px 0 rgba(79,140,255,0.10)',
                  padding: 0,
                  overflow: 'hidden'
                }}
              >
                <iframe
                  style={{
                    width: '100%',
                    height: '100%',
                    minHeight: 500,
                    background: iframeBgColor,
                    borderRadius: 18,
                    border: 'none',
                    boxShadow: '0 2px 8px 0 rgba(79,140,255,0.08)',
                    display: 'block',
                    overflow: 'auto'
                  }}
                  srcDoc={finalContent}
                  sandbox="allow-scripts allow-same-origin"
                  title="HTML内容"
                />
              </div>
            );
          }
          
          // markdown渲染
          return <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{fixMarkdownTable(finalContent)}</ReactMarkdown>;
        }
      }
      // 没有outputs时，直接返回原始content（如问候语）1
      return typeof content === 'string' ? content : '';
    } else {
      // Chat类型
      const isDialogue = agent?.inputType === 'dialogue';
      if (isDialogue) {
        if (content && typeof content === 'object') {
          return <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{fixMarkdownTable(content.answer || content.data?.answer || '未找到答案内容')}</ReactMarkdown>;
        }
        return <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{fixMarkdownTable(typeof content === 'string' ? content : '未找到答案内容')}</ReactMarkdown>;
      } else {
        if (typeof content.answer === 'string' && content.answer.includes('*op*po*')) {
          console.log('检测到默写批改P图内容', content);
          const parts = content.answer.split('*op*po*');
          const textPart = parts[0]?.trim();
          const pText = parts[1]?.trim();
          const coordsStr = parts[2]?.trim();
    
          let waves = [];
          if (coordsStr) {
            const arr = coordsStr.replace(/\[|\]/g, '').split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
            if (arr.length % 4 === 0) waves = arr;
            console.log('waves', waves);
          }
    
          let imgBase64 = '';
          if (window.lastUploadedImage && waves.length > 0) {
            imgBase64 = processImageWithWavesAndText(window.lastUploadedImage, waves, pText);
          }
    
          return (
            <div>
              <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{fixMarkdownTable(textPart)}</ReactMarkdown>
              {imgBase64 && (
                <div style={{ margin: '16px 0', textAlign: 'center' }}>
                  <img src={imgBase64} alt="默写批改" style={{ maxWidth: '100%' }} />
                </div>
              )}
            </div>
          );
        }
        if (content && typeof content === 'object') {
          const contentData = content.content || content.data?.content;
          if (contentData) {
            return <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{fixMarkdownTable(contentData.answer || contentData.data?.answer || '未找到答案内容')}</ReactMarkdown>;
          }
          return <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{fixMarkdownTable(content.answer || content.data?.answer || '未找到答案内容')}</ReactMarkdown>;
        }
        return <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>{fixMarkdownTable(typeof content === 'string' ? content : '未找到答案内容')}</ReactMarkdown>;
      }
    }
  };

  // 监听user变化，非管理员强制锁定输出模式为'rendered'
  useEffect(() => {
    if (!user?.isAdmin && outputMode !== 'rendered') {
      setOutputMode('rendered');
    }
  }, [user]);

  

  return (
    <Layout key={chatPageKey} style={{ minHeight: '100vh', fontFamily, background: theme === 'dark' ? '#18191c' : undefined, paddingTop: 20 }}>
      <style>{forceDesktopStyles}</style>
      <style>{globalDarkStyles}</style>
      <style>{`
.markdown-body { font-size: 16px; margin: 0; padding: 0; }
.markdown-body p, .markdown-body ul, .markdown-body ol { margin: 0 0 8px 0; }
.markdown-body table { width: 100%; overflow-x: auto; display: block; border-collapse: collapse; margin: 12px 0; background: #fff; }
.markdown-body th, .markdown-body td { word-break: break-all; white-space: pre-wrap; border: 1px solid #d0d0d0; padding: 6px 10px; }
.markdown-body th { background: #f0f4fa; font-weight: bold; }
.markdown-body tr:nth-child(even) { background: #f8fafc; }
::-webkit-scrollbar { width: 8px; background: #f0f0f0; }
::-webkit-scrollbar-thumb { background: #bdbdbd; border-radius: 4px; }
.markdown-body img { display: block; margin: 16px auto 16px auto; max-width: 100%; border-radius: 8px; }
`}</style>
      <style>
{`
body[data-theme="dark"] .ant-tabs-nav * {
  color: #fff !important;
}
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-tab-active * {
  color: #4f8cff !important;
  font-weight: bold;
}
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-nav-more,
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-nav-operations {
  display: none !important;
}
body[data-theme="dark"] .ant-tabs-nav::-webkit-scrollbar {
  height: 0 !important;
  background: transparent !important;
}
body[data-theme="dark"] .ant-tabs-tab {
  color: #fff !important;
  opacity: 1 !important;
}
body[data-theme="dark"] .ant-tabs-tab.ant-tabs-tab-active {
  color: #4f8cff !important;
  font-weight: bold;
}
body[data-theme="dark"] .ant-tabs-tab span {
  color: #fff !important;
}
body[data-theme="dark"] .ant-tabs-tab.ant-tabs-tab-active span {
  color: #4f8cff !important;
}
body[data-theme="dark"] .ant-tabs-tab-btn {
  color: #fff !important;
}
body[data-theme="dark"] .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #4f8cff !important;
  font-weight: bold;
}
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-tab,
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-tab span,
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-tab-btn {
  color: #fff !important;
}
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-tab-active,
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-tab-active span,
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-tab-active .ant-tabs-tab-btn {
  color: #4f8cff !important;
  font-weight: bold;
}
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-nav-operations,
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-nav-more,
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-nav-add,
body[data-theme="dark"] .ant-tabs-nav .ant-tabs-nav-operations-hidden {
  display: none !important;
}
body[data-theme="dark"] .category-scrollbar,
body[data-theme="light"] .category-scrollbar {
  scrollbar-width: thin !important; /* Firefox */
  -ms-overflow-style: auto !important; /* IE 10+ */
}
body[data-theme="dark"] .category-scrollbar::-webkit-scrollbar,
body[data-theme="light"] .category-scrollbar::-webkit-scrollbar {
  height: 3px !important;
  background: transparent !important;
}
body[data-theme="dark"] .category-scrollbar::-webkit-scrollbar-thumb {
  background: #6f8fff !important;
  border-radius: 8px !important;
}
body[data-theme="dark"] .category-scrollbar::-webkit-scrollbar-track {
  background: transparent !important;
}
body[data-theme="light"] .category-scrollbar {
  scrollbar-width: thin !important;
  -ms-overflow-style: auto !important;
}
body[data-theme="light"] .category-scrollbar::-webkit-scrollbar {
  height: 3px !important;
  background: transparent !important;
}
body[data-theme="light"] .category-scrollbar::-webkit-scrollbar-thumb {
  background: #e0e0e0 !important;
  border-radius: 8px !important;
}
body[data-theme="light"] .category-scrollbar::-webkit-scrollbar-track {
  background: transparent !important;
}
`}
</style>
      <style>
{`
body[data-theme="dark"] .markdown-body table {
  background: #23262e !important;
  color: #eee !important;
  border-collapse: collapse;
}
body[data-theme="dark"] .markdown-body th,
body[data-theme="dark"] .markdown-body td {
  border: 1px solid #444 !important;
  color: #eee !important;
  background: #23262e !important;
}
body[data-theme="dark"] .markdown-body th {
  background: #262a32 !important;
  font-weight: bold;
}
body[data-theme="dark"] .markdown-body tr:nth-child(even) td {
  background: #202125 !important;
}
`}
</style>
      <Sider width={260} style={{ background: theme === 'dark' ? '#202125' : '#f7f8fa', borderRight: theme === 'dark' ? '1px solid #23262e' : '1px solid #eee', transition: 'all 0.2s', borderTopRightRadius: 16, borderBottomRightRadius: 16, boxShadow: theme === 'dark' ? '2px 0 16px 0 rgba(0,0,0,0.10)' : 'none' }}>
        <LogoTitle onClick={() => navigate('/')} />
        <div style={{ padding: '0 16px', marginTop: 10 }}>
          <Button type="primary" icon={<PlusOutlined />} block style={{ marginBottom: 16, background: mainColor, border: 'none', borderRadius: 12, fontWeight: 600 }} onClick={handleNewChat}>新对话</Button>
          {/* 返回主页按钮 */}
          <Button
            block
            icon={<ArrowLeftOutlined />}
            style={{
              marginBottom: 16,
              borderRadius: 12,
              fontWeight: 600,
              background: '#fff',
              color: '#4f8cff',
              border: '1.5px solid #4f8cff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#eaf3ff';
              e.currentTarget.style.color = '#6f6fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#4f8cff';
            }}
            onClick={() => navigate('/')}
          >
            返回主页
          </Button>
          <Button
            block
            icon={<MessageOutlined />}
            style={{
              marginBottom: 16,
              borderRadius: 12,
              fontWeight: 600,
              background: '#fff',
              color: '#4f8cff',
              border: '1.5px solid #4f8cff',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#eaf3ff';
              e.currentTarget.style.color = '#6f6fff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#4f8cff';
            }}
            onClick={handleNetworkDiagnosis}
          >
            网络诊断
          </Button>
        </div>
        <div style={{ padding: '0 8px' }}>
          <div style={{
            background: theme === 'dark' ? '#23262e' : '#fff', // 与主页一致
            borderRadius: 20,
            boxShadow: theme === 'dark' ? '0 2px 16px 0 rgba(0,0,0,0.10)' : '0 2px 16px 0 rgba(79,140,255,0.06)',
            padding: '18px 10px 10px 10px',
            margin: '0 2px',
            border: theme === 'dark' ? '1.5px solid #23262e' : '1.5px solid #e6eaf0',
            minHeight: 120
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme === 'dark' ? '#4f8cff' : mainColorSolid, marginBottom: 10, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <HistoryOutlined style={{ fontSize: 17 }} /> 历史对话
            </div>
            <div style={{ maxHeight: 340, overflowY: 'auto', paddingRight: 2 }}>
              {chatHistory.length === 0 ? (
                <div style={{ color: theme === 'dark' ? '#888' : '#aaa', textAlign: 'center', padding: '32px 0' }}>暂无历史对话</div>
              ) : (
                chatHistory.map((item, idx) => (
                  <div
                    key={item.id}
                onClick={() => handleHistoryClick(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: currentHistoryId === item.id ? (theme === 'dark' ? 'rgba(79,140,255,0.10)' : '#eaf3ff') : (theme === 'dark' ? '#23262e' : '#fff'),
                      border: currentHistoryId === item.id ? `2px solid ${mainColorSolid}` : `1.5px solid ${theme === 'dark' ? '#23262e' : '#e6eaf0'}`,
                      borderRadius: 14,
                      marginBottom: 10,
                      padding: '10px 12px',
                      boxShadow: currentHistoryId === item.id ? '0 2px 8px 0 rgba(79,140,255,0.10)' : '0 1px 4px 0 rgba(0,0,0,0.04)',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                      position: 'relative',
                      minHeight: 40
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = currentHistoryId === item.id ? (theme === 'dark' ? 'rgba(79,140,255,0.13)' : '#e0f0ff') : (theme === 'dark' ? '#262a32' : '#f5f8fa'); }}
                    onMouseLeave={e => { e.currentTarget.style.background = currentHistoryId === item.id ? (theme === 'dark' ? 'rgba(79,140,255,0.10)' : '#eaf3ff') : (theme === 'dark' ? '#23262e' : '#fff'); }}
                  >
                    <MessageOutlined style={{ color: currentHistoryId === item.id ? mainColorSolid : (theme === 'dark' ? '#8cbfff' : '#bbb'), fontSize: 18, marginRight: 10, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 15, color: theme === 'dark' ? '#eee' : '#222', fontWeight: currentHistoryId === item.id ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: 40 }}>{item.title || '新对话'}</span>
                    <Button
                      danger
                      size="small"
                      style={{
                        marginLeft: 8,
                        borderRadius: 8,
                        position: 'absolute',
                        right: 10,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        opacity: 0.7,
                        fontSize: 12,
                        padding: '0 8px',
                        height: 24,
                        zIndex: 2,
                        color: theme === 'dark' ? '#fff' : '#ff4d4f',
                        borderColor: theme === 'dark' ? '#fff' : '#ff4d4f',
                        background: 'transparent'
                      }}
                      onClick={e => { e.stopPropagation(); handleDeleteHistory(item.id, e); }}
                    >删除</Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Sider>
      <Layout style={{ background: theme === 'dark' ? '#18191c' : undefined }}>
        <Header style={{ background: theme === 'dark' ? '#23262e' : '#f5f6fa', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 64, marginTop: 0 }}>
          <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 26, color: mainColorSolid, letterSpacing: 1 }}>{agent?.name || ''}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* 输出模式开关（仅管理员可见） */}
            {user?.isAdmin && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: theme === 'dark' ? '#eee' : '#333', fontSize: 14 }}>输出模式:</span>
                <Select
                  value={outputMode}
                  onChange={setOutputMode}
                  size="small"
                  style={{ width: 100 }}
                >
                  <Select.Option value="rendered">渲染模式</Select.Option>
                  <Select.Option value="json">JSON模式</Select.Option>
                </Select>
              </div>
            )}
            <Tooltip title={user ? user.username : '未登录'}>
            <Dropdown 
              overlay={
                <Menu>
                  {user ? (
                    <>
                      <Menu.Item key="profile" onClick={handleProfile}>个人中心</Menu.Item>
                        {user.isAdmin && <Menu.Item key="userlist" onClick={showUserList}>用户管理</Menu.Item>}
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
                  style={{
                    cursor: 'pointer',
                    background: theme === 'dark' ? mainColorSolid : '#fff',
                    color: theme === 'dark' ? '#fff' : mainColorSolid,
                    marginLeft: 8,
                    boxShadow: 'none',
                  }}
                />
          </Dropdown>
            </Tooltip>
            <ThemeSwitch theme={theme} setTheme={setTheme} />
          </div>
        </Header>
        <div style={{ height: 8 }} />
        <Content style={{ margin: 8, background: theme === 'dark' ? '#23262e' : undefined }}>
          <div style={{ ...mainCardStyle, marginTop: 30 }}>
            <div style={chatContentStyle} ref={chatRef}>
              {messages.map((msg, idx) => {
                const processedContent = extractAndRenderContent(msg.content);
                const isUser = msg.role === 'user';

                // 判断是否为iframe HTML内容（即extractAndRenderContent返回的div里有iframe）
                if (
                  React.isValidElement(processedContent) &&
                  processedContent.type === 'div' &&
                  processedContent.props.children &&
                  React.isValidElement(processedContent.props.children) &&
                  processedContent.props.children.type === 'iframe'
                ) {
                  // 直接全宽渲染，不包裹在气泡里
                  return (
                    <div key={idx} style={{ width: '100%', margin: '24px 0' }}>
                      {processedContent}
                    </div>
                  );
                }

                // 如果是JSON模式且内容不是字符串，使用<pre>标签
                if (outputMode === 'json' && typeof msg.content !== 'string' && !isUser) {
                  return (
                    <pre key={idx} style={{ color: theme === 'dark' ? '#eee' : '#222', fontSize: 15, background: 'none', border: 'none', boxShadow: 'none', padding: 0 }}>
                      {processedContent}
                    </pre>
                  );
                }

                // 其他情况使用气泡框
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                      margin: '12px 0'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        background: isUser
                          ? 'linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%)'
                          : (theme === 'dark' ? '#23262e' : '#f5f6fa'),
                        color: isUser ? '#fff' : (theme === 'dark' ? '#eee' : '#333'),
                        borderRadius: 18,
                        padding: '16px 22px',
                        fontSize: 16,
                        boxShadow: theme === 'dark' ? '0 2px 12px 0 rgba(0,0,0,0.13)' : '0 2px 8px 0 rgba(79,140,255,0.08)',
                        whiteSpace: 'pre-line',
                        overflowX: 'auto',
                        border: theme === 'dark' ? '1.5px solid #23262e' : 'none',
                      }}
                    >
                      {processedContent}
                      {/* 显示token、price和用时，或者实时计时器 */}
                      {!isUser && msg.isLoading && (
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ color: theme === 'dark' ? '#bbb' : '#888', fontSize: 13 }}>
                            用时: {aiTimer}s
                          </span>
                        </div>
                      )}
                      {!isUser && !msg.isLoading && (msg.tokens !== undefined || msg.price !== undefined || msg.usedTime) && (
                        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          {msg.usedTime && (
                            <span style={{ color: theme === 'dark' ? '#bbb' : '#888', fontSize: 13 }}>
                              用时: {msg.usedTime}s
                            </span>
                          )}
                          {msg.tokens !== undefined && (
                            <span style={{
                              display: 'inline-block',
                              background: theme === 'dark' ? '#262a32' : '#eaf3ff',
                              color: theme === 'dark' ? '#4f8cff' : '#4f8cff',
                              borderRadius: 8,
                              fontSize: 12,
                              padding: '2px 8px'
                            }}>
                              Token: {msg.tokens !== null ? msg.tokens : '--'}
                            </span>
                          )}
                          {msg.price !== undefined && (
                            <span style={{
                              display: 'inline-block',
                              background: theme === 'dark' ? '#262a32' : '#eaf3ff',
                              color: theme === 'dark' ? '#4f8cff' : '#4f8cff',
                              borderRadius: 8,
                              fontSize: 12,
                              padding: '2px 8px'
                            }}>
                              金额: ¥{msg.price !== null ? Number(msg.price).toFixed(4) : '--'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {agent?.inputType === 'dialogue' ? (
                <div style={{ width: '100%' }}>
                  <Input.TextArea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="请输入你的问题，按Enter发送"
                    autoSize={{ minRows: 1, maxRows: 1 }}
                    disabled={loading}
                    style={{ borderRadius: 14, fontSize: 15, background: theme === 'dark' ? '#23262e' : '#f7f8fa', border: theme === 'dark' ? '1.5px solid #23262e' : `1.5px solid ${mainColor2}`, color: theme === 'dark' ? '#eee' : '#333', minHeight: 36, height: 36, resize: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <Button
                      icon={<span style={{ fontSize: 18 }}>🧠</span>}
                      style={{
                        borderRadius: 20,
                        fontWeight: 600,
                        fontSize: 15,
                        background: theme === 'dark' ? '#23262e' : '#fff',
                        color: theme === 'dark' ? '#4f8cff' : '#4f8cff',
                        border: '1.5px solid #4f8cff',
                        boxShadow: 'none',
                        padding: '2px 18px',
                        height: 36
                      }}
                      onClick={() => sendMessage('deepthink')}
                    >深度思考</Button>
                    <Button
                      icon={<span style={{ fontSize: 18 }}>🌐</span>}
                      style={{
                        borderRadius: 20,
                        fontWeight: 600,
                        fontSize: 15,
                        background: theme === 'dark' ? '#23262e' : '#fff',
                        color: theme === 'dark' ? '#4f8cff' : '#4f8cff',
                        border: '1.5px solid #4f8cff',
                        boxShadow: 'none',
                        padding: '2px 18px',
                        height: 36
                      }}
                      onClick={() => sendMessage('search')}
                    >联网搜索</Button>
                    <Button type="primary" onClick={sendMessage} loading={loading} style={{ borderRadius: 18, fontWeight: 600, fontSize: 16, height: 36, minWidth: 80, background: mainColor, border: 'none', marginLeft: 'auto' }}>发送</Button>
                  </div>
                </div>
              ) : (
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <Button 
                    type="primary" 
                    onClick={() => setWorkflowInputVisible(true)}
                    style={{ borderRadius: 18, fontWeight: 600, fontSize: 18, height: 48, minWidth: 120, background: mainColor, border: 'none', textAlign: 'center' }}
                  >
                    开始
                  </Button>
                </div>
              )}
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
        theme={theme}
      />
      
      {/* 个人中心模态框 */}
      <ProfileModal
        visible={profileVisible}
        onCancel={() => setProfileVisible(false)}
        user={user}
        theme={theme}
      />

      {/* 工作流参数输入模态框 */}
      <WorkflowInputModal
        visible={workflowInputVisible}
        onCancel={() => setWorkflowInputVisible(false)}
        onSubmit={handleWorkflowSubmit}
        agent={agent}
        theme={theme}
      />

      {/* 用户管理弹窗 */}
      <UserListModal theme={theme} />
    </Layout>
  );
}

// 新增LogoTitle组件
function LogoTitle({ onClick, theme, marginTop = 0 }) {
  // 根据theme动态设置颜色
  const textColor = theme === 'dark' ? '#eee' : '#888';
  
  return (
    <div className="logo-title" style={{ display: 'flex', alignItems: 'center', height: 64, padding: '0 16px', cursor: 'pointer', userSelect: 'none', marginTop }} onClick={onClick}>
      <img src="/logo-zeta-vista.png" alt="logo" style={{ height: 48, marginRight: 12 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: 600, fontSize: 26, letterSpacing: 2, color: mainColorSolid, lineHeight: 1, textAlign: 'center', width: '100%' }}>智大蓝图</span>
        <span style={{ fontWeight: 700, fontSize: 11, color: textColor, letterSpacing: 3, marginTop: 2, userSelect: 'none', textAlign: 'center', width: '100%' }}>ZETA VISTA</span>
      </div>
    </div>
  );
}

// 卡片极简配色
const cardIcons = [
  <UserOutlined style={{ fontSize: 28, color: '#4f8cff' }} />,
  <PlusOutlined style={{ fontSize: 28, color: '#4f8cff' }} />,
  <HistoryOutlined style={{ fontSize: 28, color: '#4f8cff' }} />,
  <LoginOutlined style={{ fontSize: 28, color: '#4f8cff' }} />
];
const cardBg = '#fff';
const cardBorder = '#e4e8ef';

// 热门推荐只显示随机减去后的智能体
function getRandomSubset(arr, removeCount) {
  if (arr.length <= removeCount) return arr;
  const copy = [...arr];
  for (let i = 0; i < removeCount; i++) {
    const idx = Math.floor(Math.random() * copy.length);
    copy.splice(idx, 1);
  }
  return copy;
}

// 主题切换按钮（提取到外部，便于复用）
function ThemeSwitch({ theme, setTheme }) {
  return (
    <Button
      className="theme-switch-btn"
      shape="circle"
      icon={theme === 'dark' ? <BulbOutlined /> : <MoonOutlined />}
      onClick={() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      }}
      style={{
        marginLeft: 16,
        background: theme === 'dark' ? 'transparent' : '#fff',
        border: theme === 'dark' ? '1.5px solid #444' : '1.5px solid #eee',
        color: theme === 'dark' ? '#eee' : '#333',
        boxShadow: 'none',
      }}
      title={theme === 'dark' ? '切换为浅色模式' : '切换为深色模式'}
    />
  );
}

// 聊天历史本地存储相关
function saveChatHistory(history, agentId) {
  const key = `chatHistory_${agentId}`;
  localStorage.setItem(key, JSON.stringify(history));
}
function loadChatHistory(agentId) {
  const key = `chatHistory_${agentId}`;
  return JSON.parse(localStorage.getItem(key) || '[]');
}

// ChatPageWrapper 支持根据 URL id 自动查找 agent
function ChatPageWrapper({ theme, setTheme, user, setUser }) {
  const navigate = useNavigate();
  const params = useParams();
  const chatId = params.id || null;
  const [agents, setAgents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [agent, setAgent] = React.useState(null);

  React.useEffect(() => {
    // console.log('【前端调试】ChatPageWrapper开始请求 /api/agents/list');
    axios.get(`${API_BASE}/api/agents/list`, {
      params: { username: user?.username }
    })
      .then(res => {
        // console.log('【前端调试】ChatPageWrapper API响应成功:', res.data);
        // 新增：完整打印所有智能体
        // console.log('【前端调试】全部agents.json内容如下：');
        res.data.forEach((agent, idx) => {
          // console.log(`#${idx + 1}:`, agent);
        });
        setAgents(res.data);
        setLoading(false);
      })
      .catch(error => {
        // console.error('【前端调试】ChatPageWrapper API请求失败:', error);
        setLoading(false);
      });
  }, [user?.username]);

  React.useEffect(() => {
    if (!loading && chatId && agents.length > 0) {
      // chatId 可能是智能体id或历史id，优先查找智能体id
      const found = agents.find(a => a.id === chatId);
      setAgent(found || null);
    }
  }, [loading, chatId, agents]);

  return <ChatPage theme={theme} setTheme={setTheme} agent={agent} chatId={chatId} navigate={navigate} user={user} setUser={setUser} />;
}
function HomePage({ theme, setTheme, user, setUser }) {
  // 分类配置
const categories = [
  { key: 'hot', name: '热门推荐', icon: '🔥' },
  { key: 'essay', name: '作文&批改', icon: '✍️' },
  { key: 'teaching', name: 'AI教学', icon: '🎓' },
  { key: 'creative', name: 'AI创意教学', icon: '🎨' },
  { key: 'materials', name: '教案课件', icon: '📚' },
  { key: 'public', name: '公开课专区', icon: '🎬' },
  { key: 'games', name: '学科小游戏', icon: '🎮' },
  { key: 'exam', name: '考试专区', icon: '📝' },
  { key: 'assistant', name: 'AI助手', icon: '🤖' },
  { key: 'research', name: 'AI课题&论文', icon: '📊' }
];
// 分类映射函数
const getAgentCategories = (agent) => {
  const agentName = agent.name.toLowerCase();
  const cats = [];
  if (agentName.includes('作文') || agentName.includes('批改') || agentName.includes('默写') || agentName.includes('同步')) cats.push('essay');
  if (agentName.includes('教学') || agentName.includes('老师') || agentName.includes('课程') || agentName.includes('智能问答')) cats.push('teaching');
  if (agentName.includes('创意') || agentName.includes('歌曲') || agentName.includes('梦想') || agentName.includes('单词成歌曲')) cats.push('creative');
  if (agentName.includes('教案') || agentName.includes('课件') || agentName.includes('逐字稿') || agentName.includes('转换') || agentName.includes('音视频成文字')) cats.push('materials');
  if (agentName.includes('公开课') || agentName.includes('视频') || agentName.includes('音视频') || agentName.includes('图生图')) cats.push('public');
  if (agentName.includes('游戏') || agentName.includes('单词') || agentName.includes('随机')) cats.push('games');
  if (agentName.includes('考试') || agentName.includes('测试') || agentName.includes('练习') || agentName.includes('数学批改')) cats.push('exam');
  if (agentName.includes('助手') || agentName.includes('问答') || agentName.includes('智能') || agentName.includes('高情商回复') || agentName.includes('家长通知')) cats.push('assistant');
  if (agentName.includes('课题') || agentName.includes('论文') || agentName.includes('研究')) cats.push('research');
  cats.push('hot');
  return [...new Set(cats)];
};

  const { showUserList } = useUserList();
  const statusOrder = { configured: 0, review: 1, pending: 2 };
  const [agents, setAgents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [tabKey, setTabKey] = React.useState('hot');
  const [loginVisible, setLoginVisible] = React.useState(false);
  const [profileVisible, setProfileVisible] = React.useState(false);
  const navigate = useNavigate();
  const [agentConfigVisible, setAgentConfigVisible] = React.useState(false);
  const [editingAgent, setEditingAgent] = React.useState(null);

  // 颜色变量
  const mainBg = theme === 'dark' ? '#18191c' : '#f7f8fa';
  const siderBg = theme === 'dark' ? '#18191c' : '#fff';
  const siderBorder = theme === 'dark' ? '#23262e' : '#f0f0f0';
  const menuItemColor = theme === 'dark' ? '#bbb' : '#333';
  const menuItemActiveBg = theme === 'dark' ? '#23262e' : '#f4f8ff';
  const menuItemActiveColor = mainColorSolid;
  const cardBg = theme === 'dark' ? 'rgba(36,40,48,0.98)' : '#fff';
  const cardBorder = theme === 'dark' ? '#444' : '#e8f4ff';
  const cardShadow = theme === 'dark' ? '0 4px 24px 0 rgba(79,140,255,0.13)' : '0 4px 24px 0 rgba(79,140,255,0.08)';
  const cardHoverBg = theme === 'dark' ? '#23262e' : '#f4f8ff';
  const cardTitleColor = mainColorSolid;
  const cardTitleHover = '#6f6fff';
  const descColor = theme === 'dark' ? '#bbb' : '#666';
  const headerBg = theme === 'dark' ? '#23262e' : '#f5f6fa';
  const buttonBg = theme === 'dark' ? '#23262e' : 'transparent';
  const buttonBorder = theme === 'dark' ? '#444' : '#f0f0f0';
  const buttonTextColor = theme === 'dark' ? '#eee' : '#333';
  const cardUnconfiguredBorder = theme === 'dark' ? '#444' : '#e4e8ef';

  React.useEffect(() => {
    // console.log('【前端调试】HomePage开始请求 /api/agents/list');
    axios.get(`${API_BASE}/api/agents/list`, {
      params: { username: user?.username }
    })
      .then(res => {
        // console.log('【前端调试】HomePage API响应成功:', res.data);
        setAgents(res.data);
        setLoading(false);
      })
      .catch(error => {
        // console.error('【前端调试】HomePage API请求失败:', error);
        // console.error('错误详情:', {
        //   message: error.message,
        //   status: error.response?.status,
        //   statusText: error.response?.statusText,
        //   data: error.response?.data
        // });
        setLoading(false);
      });
  }, [user?.username]);

  // 智能问答助手卡片

  // 卡片美化样式
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

  // 定义已配置的智能体ID列表


  // 为智能体添加配置状态标识和显示名
  const agentsWithStatus = agents.map(agent => ({
    ...agent,
    isConfigured: agent.status === 'configured',
    displayName: agent.name,
    categories: getAgentCategories(agent)
  }));

  // 兜底去重，确保每个智能体id只出现一次
  const uniqueAgents = agentsWithStatus.filter(
    (agent, idx, arr) => arr.findIndex(a => a.id === agent.id) === idx
  );
  
  // 按分类分组
  const agentsByCategory = {};
  categories.forEach(cat => {
    agentsByCategory[cat.key] = uniqueAgents.filter(agent => agent.categories.includes(cat.key));
  });

  // 首页卡片点击事件
  const handleCardClick = (agent) => {
    if ((agent.status === 'pending' || agent.status === 'review') && (!user || !user.isAdmin)) {
      message.info('仅管理员可访问');
      return;
    }
    navigate(`/chat/${agent.id}`);
  };

  // 登录处理
  const handleLogin = async (values) => {
    try {
      const { username, password } = values;
      const user = await loginUser(username, password);
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setLoginVisible(false);
        message.success(`欢迎回来${user.username}！`);
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
      const user = await registerUser(username, password, email);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
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
    localStorage.removeItem('user');
    message.success('已退出登录');
  };
  // 个人中心处理
  const handleProfile = () => {
    setProfileVisible(true);
  };

return (
  <Layout style={{ minHeight: '100vh', background: mainBg }}>
    <Sider width={220} style={{ background: siderBg, borderRight: `1.5px solid ${siderBorder}` }}>
      <LogoTitle onClick={() => navigate('/')} theme={theme} marginTop={20} />
      <Menu mode="inline" selectedKeys={[tabKey]} onClick={e => setTabKey(e.key)} style={{ background: 'transparent', border: 'none', marginTop: 20 }}>
        {categories.map(cat => (
          <Menu.Item
            key={cat.key}
            className="category-tab"
            style={{
              color: tabKey === cat.key ? menuItemActiveColor : menuItemColor,
              background: tabKey === cat.key ? menuItemActiveBg : 'transparent',
              borderRadius: 10,
              margin: '4px 0',
              fontWeight: tabKey === cat.key ? 700 : 500,
              transition: 'all 0.2s',
              userSelect: 'none',
            }}
          >
            {cat.name}
          </Menu.Item>
        ))}
      </Menu>
    </Sider>
    <Layout style={{ background: mainBg }}>
      <Header style={{ background: theme === 'dark' ? '#23262e' : '#f5f6fa', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="home-search-bar" style={{
            display: 'flex',
            alignItems: 'center',
            height: 36,
              background: theme === 'dark' ? '#23262e' : '#fff',
              border: `1.5px solid ${theme === 'dark' ? '#444' : '#d9d9d9'}`,
            borderRadius: 16,
            padding: '0 10px',
                color: theme === 'dark' ? '#eee' : '#333',
            marginRight: 24,
            minWidth: 220,
            maxWidth: 300,
            boxSizing: 'border-box',
            boxShadow: 'none',
          }}>
            <SearchOutlined className="home-search-icon" style={{ color: theme === 'dark' ? '#888' : '#bbb', fontSize: 16, marginRight: 6 }} />
            <input
              className="home-search-input"
              type="text"
              placeholder="搜索智能体"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: theme === 'dark' ? '#eee' : '#333',
                fontSize: 15,
                width: '100%'
            }}
          />
          </div>
          <div className="top-btn-group" style={{ display: 'flex', gap: 8, marginLeft: 32 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {['首页', '知识库', '个人空间', '创建智能体'].map((text, idx) => (
                <Button
                  key={text}
                  type="text"
                  className="nav-btn"
                  icon={<span style={{ fontSize: 20 }}>{['🏠', '📒', '👤', '➕'][idx]}</span>}
                  style={{
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 16,
                    padding: '4px 18px',
                    color: tabKey === (['home', 'knowledge', 'user', 'create'][idx]) ? mainColorSolid : buttonTextColor,
                    background: tabKey === (['home', 'knowledge', 'user', 'create'][idx]) ? menuItemActiveBg : buttonBg,
                    border: tabKey === (['home', 'knowledge', 'user', 'create'][idx]) ? `1.5px solid ${mainColorSolid}` : `1.5px solid ${buttonBorder}`,
                    marginRight: 2,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  onClick={() => {
                    if (text === '首页') navigate('/');
                    if (text === '知识库') message.info('知识库功能开发中');
                    if (text === '个人空间') message.info('个人空间功能开发中');
                    if (text === '创建智能体') window.open('http://118.145.74.50:24131/apps', '_blank');
                  }}
                >
                  {text}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title={user ? user.username : '未登录'}>
            <Dropdown
              overlay={
                <Menu>
                  {user ? (
                    <>
                      <Menu.Item key="profile" onClick={handleProfile}>个人中心</Menu.Item>
                      {user.isAdmin && <Menu.Item key="userlist" onClick={showUserList}>用户管理</Menu.Item>}
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
                style={{
                  cursor: 'pointer',
                  background: theme === 'dark' ? mainColorSolid : '#fff',
                  color: theme === 'dark' ? '#fff' : mainColorSolid,
                  marginLeft: 8,
                  boxShadow: 'none',
                }}
              />
            </Dropdown>
          </Tooltip>
          <ThemeSwitch theme={theme} setTheme={setTheme} />
        </div>
      </Header>
      <Content
        style={{
          margin: '32px 0 24px 0',
          padding: '0 0',
          minHeight: 600,
          background: 'transparent', // 保持透明，继承外层
          border: 'none',
          borderRadius: 0,
          boxShadow: 'none',
          width: '100%'
        }}
      >
        {loading ? <Spin /> : (
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="category-scrollbar" style={{
              display: 'flex',
              width: '100%',
              borderBottom: theme === 'dark' ? '1.5px solid #23262e' : '1.5px solid #eee',
              background: 'transparent',
              marginBottom: 16,
              paddingLeft: 8,
              paddingRight: 8,
              overflowX: 'visible', // 不要滚动
            }}>
              {categories.map(cat => (
                <div
                  key={cat.key}
                  className="category-tab"
                  onClick={() => setTabKey(cat.key)}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    textAlign: 'center',
                    padding: '12px 0',
                    cursor: 'pointer',
                    color: tabKey === cat.key
                      ? (theme === 'dark' ? '#4f8cff' : mainColorSolid)
                      : (theme === 'dark' ? '#fff' : '#333'),
                    fontWeight: tabKey === cat.key ? 700 : 500,
                    borderBottom: tabKey === cat.key
                      ? `2.5px solid ${theme === 'dark' ? '#4f8cff' : mainColorSolid}`
                      : '2.5px solid transparent',
                    background: 'transparent',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    userSelect: 'none',
                    marginRight: 0
                  }}
                >
                  {cat.name}
                </div>
              ))}
            </div>
            {/* 分类内容区 */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 16,
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    padding: '0 16px',
                  }}>
              {/* 新增：最左上角自定义卡片 */}
              <div
                className="agent-config-card"
                style={{
                  background: cardBg,
                  border: `2px dashed ${mainColorSolid}`,
                  borderRadius: 16,
                  boxShadow: cardShadow,
                  padding: 14,
                  width: 210,
                  height: 180,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                  color: descColor,
                  position: 'relative',
                  minWidth: 210,
                  minHeight: 180
                }}
              >
                <div className="agent-config-icon" style={{ fontSize: 32, marginBottom: 10 }}>⚙️</div>
                <div className="agent-config-title" style={{ fontWeight: 700, fontSize: 16, color: cardTitleColor, marginBottom: 10, textAlign: 'center' }}>智能体管理</div>
                <Button
                  className="agent-config-btn"
                  type="primary"
                  style={{ width: '90%', marginBottom: 8, borderRadius: 8, fontWeight: 600 }}
                  onClick={() => {
                    if (!user) {
                      message.info('请先登录后再配置智能体');
                    } else if (!user.isAdmin) {
                      message.info('仅管理员可配置智能体');
                    } else {
                      setAgentConfigVisible(true);
                      setEditingAgent(agents[0] || null);
                    }
                  }}
                >配置智能体</Button>
                <Button
                  className="agent-create-btn"
                  style={{ width: '90%', borderRadius: 8, fontWeight: 600 }}
                  onClick={() => {
                    if (!user) {
                      message.info('请先登录后再创建智能体');
                    } else {
                      window.open('http://118.145.74.50:24131/apps', '_blank');
                    }
                  }}
                >创建智能体</Button>
              </div>
              {agentsByCategory[tabKey]
                      .filter(a => a.name.includes(search) || a.description.includes(search))
                      .sort((a, b) => (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3))
                      .map((agent, i) => (
                        <div
                          key={agent.id}
                          className="agent-card"
                          style={{
                            background: cardBg,
                            border: agent.isConfigured === false
                              ? `2px solid ${cardUnconfiguredBorder}`
                              : `2px solid ${cardBorder}`,
                            borderRadius: 16,
                            boxShadow: cardShadow,
                            padding: 14,
                            width: 210,
                            height: 180,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
                            marginBottom: 16,
                            color: descColor,
                          }}
                          tabIndex={-1}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => handleCardClick(agent)}
                          onMouseEnter={e => {
                            e.currentTarget.style.boxShadow = '0 8px 32px 0 rgba(79,180,255,0.18)';
                            e.currentTarget.style.background = cardHoverBg;
                            e.currentTarget.querySelector('.card-title').style.color = cardTitleHover;
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.boxShadow = cardShadow;
                            e.currentTarget.style.background = cardBg;
                            e.currentTarget.querySelector('.card-title').style.color = cardTitleColor;
                          }}
                        >
                          <div className="agent-card-icon" style={{ marginBottom: 12 }}>{cardIcons[i % cardIcons.length]}</div>
                          <div className="card-title" style={{ fontWeight: 700, fontSize: 16, color: cardTitleColor, marginBottom: 6, textAlign: 'center' }}>{agent.name}</div>
                          <div style={{ color: descColor, fontSize: 13, textAlign: 'center', marginBottom: 4, height: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '20px', wordBreak: 'break-all' }}>{agent.description}</div>
                          {agent.isConfigured !== undefined && (
                            <div style={{ textAlign: 'center', marginTop: 2 }}>
                              {agent.isConfigured
                                ? <Tag color="green" style={{ fontSize: 12, borderRadius: 8 }}>已配置</Tag>
                                : agent.status === 'review' ? (
                                  <Tag color="orange" style={{ fontSize: 12, borderRadius: 8 }}>审核中</Tag>
                                ) : (
                                  <Tag color="default" style={{ fontSize: 12, borderRadius: 8, border: `1px solid #e0e3e8`, color: '#bbb', background: '#f6f8fa' }}>待配置</Tag>
                                )
                              }
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
          </div>
        )}
      </Content>
    </Layout>
    {/* 登录模态框 */}
    <LoginModal
      visible={loginVisible}
      onCancel={() => setLoginVisible(false)}
      onLogin={handleLogin}
      onRegister={handleRegister}
      theme={theme}
    />
    {/* 个人中心模态框 */}
    <ProfileModal
      visible={profileVisible}
      onCancel={() => setProfileVisible(false)}
      user={user}
      theme={theme}
    />
    {/* 配置弹窗 */}
    <AgentConfigModal
      visible={agentConfigVisible}
      onCancel={() => setAgentConfigVisible(false)}
      agents={agents}
      editingAgent={editingAgent}
      setEditingAgent={setEditingAgent}
      onSave={data => { setAgentConfigVisible(false); console.log('保存配置', data); }}
    />
  </Layout>
  );
}
function App() {
  // 强制桌面端模式
  useEffect(() => {
  }, []);

  const [page, setPage] = useState('home');
  const [chatType, setChatType] = useState('qa');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tabKey, setTabKey] = useState('hot');
  const [currentAgent, setCurrentAgent] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  // 移除本地的userListVisible状态，使用Context

  // 主题切换副作用
  useEffect(() => {
    localStorage.setItem('theme', theme); // 切换时写入localStorage
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
      document.body.style.background = '#18191c';
    } else {
      document.body.setAttribute('data-theme', 'light');
      document.body.style.background = '#f7f8fa';
    }
  }, [theme]);

  useEffect(() => {
    // console.log('【前端调试】开始请求 /api/agents/list');
    axios.get(`${API_BASE}/api/agents/list`, {
      params: { username: user?.username }
    })
      .then(res => {
        // console.log('【前端调试】API响应成功:', res.data);
        setAgents(res.data);
        setLoading(false);
      })
      .catch(error => {
        // console.error('【前端调试】API请求失败:', error);
        console.error('错误详情:', {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });
        setLoading(false);
      });
  }, [user?.username]);

  // 登录处理
  const handleLogin = async (values) => {
    try {
      const { username, password } = values;
      const user = await loginUser(username, password);
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setLoginVisible(false);
        message.success(`欢迎回来${user.username}！`);
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
      const user = await registerUser(username, password, email);
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      setLoginVisible(false);
      message.success('注册成功！欢迎使用智大蓝图！');
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败，请重试');
    }
  };

  // 获取用户信息
  const fetchUser = async (username) => {
    const user = await getUserFromServer(username);
    setUser(user);
  };

  // 登出处理
  const handleLogout = () => {
    setUser(null);
    clearUser();
    localStorage.removeItem('user');
    message.success('已退出登录');
  };

  // 个人中心处理
  const handleProfile = () => {
    setProfileVisible(true);
  };


  
  // 定义分类配置
  const categories = [
    { key: 'hot', name: '热门推荐', icon: '🔥' },
    { key: 'essay', name: '作文&批改', icon: '✍️' },
    { key: 'teaching', name: 'AI教学', icon: '🎓' },
    { key: 'creative', name: 'AI创意教学', icon: '🎨' },
    { key: 'materials', name: '教案课件', icon: '📚' },
    { key: 'public', name: '公开课专区', icon: '🎬' },
    { key: 'games', name: '学科小游戏', icon: '🎮' },
    { key: 'exam', name: '考试专区', icon: '📝' },
    { key: 'assistant', name: 'AI助手', icon: '🤖' },
    { key: 'research', name: 'AI课题&论文', icon: '📊' }
    // 已删除幼儿园专区、幼儿园观察记录、粉笔专区
  ];
  useEffect(() => {
    const handler = (e) => {
      const tag = e.target.tagName;
      if (
        !['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'].includes(tag) &&
        !e.target.closest('input, textarea, button, select, [contenteditable]')
      ) {
        e.target.blur && e.target.blur();
        if (window.getSelection) {
          const sel = window.getSelection();
          if (sel && sel.removeAllRanges) sel.removeAllRanges();
        }
      }
    };
    document.addEventListener('focusin', handler, true);
    return () => document.removeEventListener('focusin', handler, true);
  }, []);

  const isMobile = useIsMobile();

  // 如果未登录，直接进入登录页
  if (!user) {
    return <LoginPage setUser={setUser} />;
  }

  if (page === 'chat') {
    return <ChatPageWrapper theme={theme} setTheme={setTheme} user={user} setUser={setUser} />;
  }

  // 新增HomePage组件，原首页内容全部移到HomePage
  

  // 全局点击空白处自动失焦
  const handleGlobalClick = (e) => {
    if (
      document.activeElement &&
      ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName) &&
      !e.target.closest('input, textarea, [contenteditable], button, .ant-modal, .ant-dropdown, .ant-select, .ant-picker')
    ) {
      document.activeElement.blur();
    }
  };

  // 全局禁止非输入类元素获得焦点（终极兜底，移除所有选区）
  

  // 首页内容
  return (
      <UserListProvider>
        <Router>
          <div onClick={handleGlobalClick} style={{ minHeight: '100vh' }}>
            <Routes>
              <Route path="/" element={<HomePage theme={theme} setTheme={setTheme} user={user} setUser={setUser} />} />
              <Route path="/chat/new" element={<ChatPageWrapper theme={theme} setTheme={setTheme} user={user} setUser={setUser} />} />
              <Route path="/chat/:id" element={<ChatPageWrapper theme={theme} setTheme={setTheme} user={user} setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            {/* 全局用户管理弹窗 */}
            <UserListModal theme={theme} />
          </div>
        </Router>
      </UserListProvider>
  );
}

export default App; 

// 游戏HTML渲染器：用iframe隔离渲染小游戏HTML，提升兼容性和美观度
function GameHtmlRenderer({ htmlString, theme }) {
  // 根据theme动态设置颜色
  const bgColor = theme === 'dark' ? '#2f3136' : '#fff';
  const iframeBgColor = theme === 'dark' ? '#2f3136' : '#fff';
  
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: 500,
        background: bgColor,
        borderRadius: 18,
        margin: '32px 0',
        boxShadow: '0 4px 24px 0 rgba(79,140,255,0.10)',
        padding: 0,
        overflow: 'auto',
        maxWidth: 900,
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <iframe
        style={{
          width: '100%',
          minHeight: 500,
          background: iframeBgColor,
          borderRadius: 18,
          border: 'none',
          boxShadow: '0 2px 8px 0 rgba(79,140,255,0.08)'
        }}
        srcDoc={htmlString}
        sandbox="allow-scripts allow-same-origin"
        title="小游戏"
      />
    </div>
  );
}

// 充值按钮和弹窗组件
function RechargeButton({ user, onSuccess }) {
  const [visible, setVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [orderId, setOrderId] = useState('');
  const [waiting, setWaiting] = useState(false);
  const timerRef = useRef();

  // 轮询充值状态
  useEffect(() => {
    if (!orderId) return;
    timerRef.current = setInterval(async () => {
              const res = await fetch(`${API_BASE}/api/pay/manual/status?orderId=${orderId}`);
      const data = await res.json();
      if (data.success && data.paid) {
        clearInterval(timerRef.current);
        message.success('充值成功');
        setVisible(false);
        setAmount('');
        setOrderId('');
        setWaiting(false);
        onSuccess && onSuccess();
      }
    }, 2000);
    return () => clearInterval(timerRef.current);
  }, [orderId, onSuccess]);

  // 关闭弹窗时清理状态
  const handleClose = () => {
    setVisible(false);
    setAmount('');
    setOrderId('');
    setWaiting(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleManualPay = async () => {
    const rechargeAmount = parseFloat(amount);
    if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
      message.error('请输入有效的充值金额');
      return;
    }
    setWaiting(true);
    // 请求后端生成充值订单，等待管理员确认
    const res = await fetch(`${API_BASE}/api/pay/manual`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user.username, amount: rechargeAmount })
    });
    const data = await res.json();
    if (data.success && data.orderId) {
      setOrderId(data.orderId);
    } else {
      setWaiting(false);
      message.error('充值请求失败');
    }
  };

  return (
    <>
      <Button type="primary" size="small" onClick={() => setVisible(true)} style={{ marginLeft: 8 }}>
        充值
      </Button>
      <Modal
        title="账户充值"
        open={visible}
        onCancel={handleClose}
        footer={null}
        destroyOnClose
      >
        <Input
          placeholder="请输入充值金额"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          type="number"
          min={0.01}
          style={{ marginBottom: 16 }}
          disabled={waiting}
        />
        <div style={{ display: 'flex', gap: 16 }}>
          <Button type="primary" onClick={handleManualPay} loading={waiting} disabled={waiting}>
            微信充值
          </Button>
          <Button disabled type="default" style={{ color: '#bbb', borderColor: '#eee' }}>
            支付宝（待配置）
          </Button>
        </div>
        {/* 充值弹窗内容始终显示二维码 */}
        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <div style={{ marginBottom: 8 }}>请使用微信扫码付款，付款后联系管理员或等待后台确认到账</div>
          <img src="/WeChat.jpg" alt="微信收款码" style={{ width: 180, margin: '16px 0' }} />
        </div>
        {waiting && (
          <div style={{ marginTop: 8, textAlign: 'center', color: '#4f8cff' }}>
            <div>等待后台确认充值...</div>
          </div>
        )}
      </Modal>
    </>
  );
}

function AgentConfigModal({ visible, onCancel, agents, onSave, editingAgent, setEditingAgent }) {
  const [form] = Form.useForm();
  const [inputs, setInputs] = React.useState(editingAgent?.inputs || []);
  const [inputType, setInputType] = React.useState(editingAgent?.inputType || 'parameter');
  const [apiKey, setApiKey] = React.useState(editingAgent?.apiKey || '');
  const [apiUrl, setApiUrl] = React.useState(editingAgent?.apiUrl || '');
  const [quickConfigVisible, setQuickConfigVisible] = React.useState(false);
  const [quickConfigText, setQuickConfigText] = React.useState('');
  useEffect(() => {
    if (editingAgent && editingAgent.id && agents && agents.length > 0) {
      const found = agents.find(a => a.id === editingAgent.id);
      setApiKey(found?.apiKey || '');
      // 如果API URL为空，自动填充默认值
      setApiUrl(found?.apiUrl || 'http://118.145.74.50:24131/v1/chat-messages');
    } else {
      setApiKey('');
      setApiUrl('http://118.145.74.50:24131/v1/chat-messages');
    }
  }, [editingAgent?.id, agents]);
  // console.log(agents)
  React.useEffect(() => {
    if (editingAgent) {
      setInputs(editingAgent.inputs || []);
      // 只允许 config 或 dialogue
      if (editingAgent.inputType === 'dialogue') {
        setInputType('dialogue');
      } else {
        setInputType('config');
      }
      setApiKey(editingAgent.apiKey || '');
      // 如果API URL为空，自动填充默认值
      setApiUrl(editingAgent.apiUrl || 'http://118.145.74.50:24131/v1/chat-messages');
    }
  }, [editingAgent]);

  const handleAddInput = () => {
    setInputs([...inputs, { name: '', type: 'text', options: [], required: true }]);
  };
  const handleInputChange = (idx, key, value) => {
    const newInputs = [...inputs];
    // 如果是修改name，且label等于旧name或label为空，则同步label
    if (key === 'name') {
      const oldName = newInputs[idx].name;
      if (!newInputs[idx].label || newInputs[idx].label === oldName) {
        newInputs[idx].label = value;
        console.log('同步label', newInputs[idx].label);
      }
    }
    newInputs[idx][key] = value;
    setInputs(newInputs);
  };
  const handleRemoveInput = (idx) => {
    setInputs(inputs.filter((_, i) => i !== idx));
  };
  // 一键配置逻辑
// 一键配置逻辑
const handleQuickConfig = () => {
  try {
    console.log('开始解析JSON:', quickConfigText);
    const obj = JSON.parse(quickConfigText);
    console.log('解析后的对象:', obj);
    
    // 支持多种格式的inputs字段
    let inputsData = null;
    
    // 格式1: { data: [{ inputs: {...} }] }
    if (obj.data && Array.isArray(obj.data) && obj.data[0] && obj.data[0].inputs) {
      inputsData = obj.data[0].inputs;
      console.log('找到格式1 - data数组中的inputs:', inputsData);
    }
    // 格式2: { inputs: {...} }
    else if (obj.inputs) {
      inputsData = obj.inputs;
      console.log('找到格式2 - 直接的inputs:', inputsData);
    }
    // 格式3: 直接是inputs对象
    else if (typeof obj === 'object' && !obj.data) {
      // 检查是否直接是inputs对象
      const hasInputsKeys = Object.keys(obj).some(key => 
        typeof obj[key] === 'string' || typeof obj[key] === 'object'
      );
      if (hasInputsKeys) {
        inputsData = obj;
        console.log('找到格式3 - 直接作为inputs对象:', inputsData);
      }
    }
    
    if (!inputsData) {
      throw new Error('未找到有效的inputs字段，支持的格式：\n1. { data: [{ inputs: {...} }] }\n2. { inputs: {...} }\n3. 直接的参数对象');
    }
    
    const newInputs = Object.entries(inputsData).map(([key, value]) => {
      console.log(`处理参数 ${key}:`, value, '类型:', typeof value, '是否数组:', Array.isArray(value));
      
      // 支持数组类型参数自动识别
      if (Array.isArray(value)) {
        // 判断数组元素类型
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
          // 假设为文件数组
          console.log(`参数 ${key} 识别为文件数组`);
          return { name: key, type: 'array', itemType: 'file', options: [], required: true };
        } else {
          // 普通字符串数组
          console.log(`参数 ${key} 识别为文本数组`);
          return { name: key, type: 'array', itemType: 'text', options: [], required: true };
        }
      } else if (typeof value === 'object' && value !== null) {
        // 单文件对象
        console.log(`参数 ${key} 识别为单文件`);
        return { name: key, type: 'file', options: [], required: true };
      } else {
        // 文本类型
        console.log(`参数 ${key} 识别为文本`);
        return { name: key, type: 'text', options: [], required: true };
      }
    });
    
    console.log('生成的参数配置:', newInputs);
    setInputs(newInputs);
    setQuickConfigVisible(false);
    setQuickConfigText('');
    message.success(`已自动添加 ${newInputs.length} 个参数`);
  } catch (e) {
    console.error('一键配置解析失败:', e);
    message.error(`解析失败: ${e.message}\n\n请检查JSON格式是否正确，支持以下格式：\n1. { data: [{ inputs: {...} }] }\n2. { inputs: {...} }\n3. 直接的参数对象`);
  }
};
const handleSave = async () => {
  // 先格式化inputs，保证每个参数对象格式正确
  const formattedInputs = inputs.map(input => {
    const obj = {
      name: input.name,
      type: input.type,
      label: input.label || input.name,
      required: input.required !== undefined ? input.required : true
    };
    if (input.description) obj.description = input.description;
    if (input.type === 'select' && Array.isArray(input.options)) {
      obj.options = input.options.map(opt => {
        if (typeof opt === 'string') {
          return { value: opt, label: opt };
        } else if (typeof opt === 'object' && opt !== null) {
          return { value: opt.value || opt.label, label: opt.label || opt.value };
        }
        return null;
      }).filter(Boolean);
    }
    // 添加数组类型支持
    if (input.type === 'array' && input.itemType) {
      obj.itemType = input.itemType;
    }
    return obj;
  });
  try {
    // 这里做inputType的映射
    const realInputType = inputType === 'config' ? 'parameter' : inputType;
    await axios.post(`${API_BASE}/api/agents/update-key`, {
      id: editingAgent.id,
      apiKey,
      apiUrl: apiUrl || 'http://118.145.74.50:24131/v1/chat-messages',
      inputs: formattedInputs,
      inputType: realInputType
    });
    // 自动写入前端全局agents/localStorage，刷新页面生效
    let agents = JSON.parse(localStorage.getItem('agents') || '[]');
    const finalApiUrl = apiUrl || 'http://118.145.74.50:24131/v1/chat-messages';
    agents = agents.map(a => a.id === editingAgent.id ? { ...a, apiKey, apiUrl: finalApiUrl, inputs: formattedInputs, inputType: realInputType } : a);
    localStorage.setItem('agents', JSON.stringify(agents));
    message.success('API Key、API URL 和参数已保存，页面即将刷新');
    setTimeout(() => window.location.reload(), 800);
  } catch (e) {
    message.error('API Key 或参数保存失败');
  }
};
  return (
    <Modal open={visible} onCancel={onCancel} onOk={handleSave} title="配置智能体" width={600}
      okText="保存" cancelText="取消">
      <Form form={form} layout="vertical">
        <Form.Item label="选择智能体">
          <Select
            value={editingAgent?.id}
            onChange={id => setEditingAgent(agents.find(a => a.id === id))}
          >
            {agents.map(a => <Select.Option key={a.id} value={a.id}>{a.name}</Select.Option>)}
          </Select>
        </Form.Item>
        <Form.Item label="API Key">
          <Input value={apiKey} onChange={e => setApiKey(e.target.value)} />
        </Form.Item>
        <Form.Item label="API URL">
          <Input 
            value={apiUrl} 
            onChange={e => setApiUrl(e.target.value)} 
            placeholder="留空将使用默认值: http://118.145.74.50:24131/v1/chat-messages"
          />
        </Form.Item>
        <Form.Item label="输入类型">
          <Select value={inputType} onChange={setInputType}>
            <Select.Option value="dialogue">对话类</Select.Option>
            <Select.Option value="config">配置类</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="输入参数">
          <Space style={{ marginBottom: 8 }}>
            <Button icon={<PlusOutlined />} onClick={handleAddInput}>添加参数</Button>
            <Button icon={<SettingOutlined />} onClick={() => setQuickConfigVisible(true)} type="dashed">一键配置</Button>
          </Space>
          {inputs.map((input, idx) => (
            <Space key={idx} style={{ display: 'flex', marginBottom: 8 }} align="start">
              <Input
                placeholder="参数名"
                value={input.name}
                onChange={e => handleInputChange(idx, 'name', e.target.value)}
                style={{ width: 100 }}
              />
              <Select
                value={input.type}
                onChange={v => handleInputChange(idx, 'type', v)}
                style={{ width: 100 }}
              >
                <Select.Option value="text">文本</Select.Option>
                <Select.Option value="file">文件</Select.Option>
                <Select.Option value="array">数组</Select.Option>
                <Select.Option value="select">下拉选择</Select.Option>
                <Select.Option value="upload">文档上传</Select.Option>
              </Select>
              {input.type === 'array' && (
                <Select
                  value={input.itemType || 'text'}
                  onChange={v => handleInputChange(idx, 'itemType', v)}
                  style={{ width: 100 }}
                  placeholder="元素类型"
                >
                  <Select.Option value="text">文本</Select.Option>
                  <Select.Option value="file">文件</Select.Option>
                </Select>
              )}
              {input.type === 'select' && (
                <Input
                  placeholder="选项,逗号分隔"
                  value={input.options?.join(',') || ''}
                  onChange={e => handleInputChange(idx, 'options', e.target.value.split(','))}
                  style={{ width: 160 }}
                />
              )}
              {/* 新增必填Checkbox */}
              <Checkbox
                checked={input.required || false}
                onChange={e => handleInputChange(idx, 'required', e.target.checked)}
              >必填</Checkbox>
              <Button icon={<DeleteOutlined />} onClick={() => handleRemoveInput(idx)} danger />
            </Space>
          ))}
        </Form.Item>
      </Form>
      {/* 一键配置弹窗 */}
      <Modal open={quickConfigVisible} onCancel={() => setQuickConfigVisible(false)} onOk={handleQuickConfig} title="一键配置参数" okText="自动添加" cancelText="取消">
        <Input.TextArea
          value={quickConfigText}
          onChange={e => setQuickConfigText(e.target.value)}
          rows={8}
          placeholder="请粘贴包含inputs字段的JSON代码"
        />
      </Modal>
    </Modal>
  );
}

// 修改 forceDesktopStyles，只移除强制横屏部分，保留其它移动端适配CSS
const forceDesktopStyles = `
  /* 强制桌面端布局 */
  @media (max-width: 768px) {
    body {
      min-width: 1200px !important;
      overflow-x: auto !important;
      transform: scale(1) !important;
    }
    #root {
      min-width: 1200px !important;
    }
    .ant-layout {
      min-width: 1200px !important;
    }
    .ant-layout-sider {
      width: 220px !important;
      min-width: 220px !important;
    }
    .ant-layout-content {
      min-width: 980px !important;
    }
    /* 强制所有组件保持桌面端尺寸 */
    .ant-card {
      min-width: 210px !important;
    }
    .ant-modal {
      min-width: 600px !important;
    }
    .ant-drawer {
      min-width: 400px !important;
    }
    .ant-form-item {
      min-width: 200px !important;
    }
  }
`;
