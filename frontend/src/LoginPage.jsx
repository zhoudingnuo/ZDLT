import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { loginUser, registerUser } from './utils/userUtils';

export default function LoginPage({ setUser }) {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
      document.body.style.background = '#18191c';
    } else {
      document.body.setAttribute('data-theme', 'light');
      document.body.style.background = '#f7f8fa';
    }
  }, [theme]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (tab === 'login') {
        const user = await loginUser(values.username, values.password);
        if (user) {
          setUser(user);
          localStorage.setItem('user', JSON.stringify(user));
          message.success('登录成功');
        } else {
          message.error('用户名或密码错误');
        }
      } else {
        const user = await registerUser(values.username, values.password, values.email);
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        message.success('注册成功');
      }
    } catch (e) {
      message.error('操作失败，请重试');
    }
    setLoading(false);
  };

  // 主题相关颜色
  const bgColor = theme === 'dark' ? '#18191c' : '#f7f8fa';
  const cardBg = theme === 'dark' ? '#23262e' : '#fff';
  const fontColor = theme === 'dark' ? '#eee' : '#222';
  const labelColor = theme === 'dark' ? '#eee' : '#333';
  const inputBg = theme === 'dark' ? '#262a32' : '#fff';
  const inputBorder = theme === 'dark' ? '#444' : '#d9d9d9';
  const tabColor = theme === 'dark' ? '#eee' : '#333';
  const tabActiveColor = '#4f8cff';
  const btnBg = 'linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%)';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: bgColor, transition: 'background 0.2s'
    }}>
      {/* 右上角主题切换按钮 */}
      <Button
        shape="circle"
        icon={theme === 'dark' ? <BulbOutlined /> : <MoonOutlined />}
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        style={{
          position: 'fixed',
          top: 32,
          right: 32,
          zIndex: 10,
          background: theme === 'dark' ? 'transparent' : '#fff',
          border: theme === 'dark' ? '1.5px solid #444' : '1.5px solid #eee',
          color: theme === 'dark' ? '#eee' : '#333',
          boxShadow: 'none',
        }}
        title={theme === 'dark' ? '切换为浅色模式' : '切换为深色模式'}
      />
      <Card style={{ width: 420, borderRadius: 16, boxShadow: '0 4px 32px 0 rgba(0,0,0,0.22)', background: cardBg, border: 'none', color: fontColor }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/logo-zeta-vista.png" alt="logo" style={{ height: 48 }} />
          <div style={{ fontWeight: 700, fontSize: 24, color: '#4f8cff', marginTop: 8 }}>智大蓝图</div>
        </div>
        <Tabs
          activeKey={tab}
          onChange={setTab}
          centered
          style={{ marginBottom: 24, color: tabColor }}
          tabBarStyle={{ color: tabColor }}
        >
          <Tabs.TabPane tab={<span style={{ color: tab === 'login' ? tabActiveColor : tabColor }}>登录</span>} key="login" />
          <Tabs.TabPane tab={<span style={{ color: tab === 'register' ? tabActiveColor : tabColor }}>注册</span>} key="register" />
        </Tabs>
        <Form layout="vertical" onFinish={onFinish} style={{ color: fontColor }}>
          <Form.Item name="username" label={<span style={{ color: labelColor }}>用户名</span>} rules={[{ required: true, message: '请输入用户名' }]}> 
            <Input style={{ background: inputBg, color: fontColor, borderColor: inputBorder }} />
          </Form.Item>
          <Form.Item name="password" label={<span style={{ color: labelColor }}>密码</span>} rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password style={{ background: inputBg, color: fontColor, borderColor: inputBorder }} />
          </Form.Item>
          {tab === 'register' && (
            <Form.Item name="email" label={<span style={{ color: labelColor }}>邮箱</span>} rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}> 
              <Input style={{ background: inputBg, color: fontColor, borderColor: inputBorder }} />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: btnBg, border: 'none', fontWeight: 600, borderRadius: 8 }}>
              {tab === 'login' ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ color: theme === 'dark' ? '#888' : '#666', fontSize: 12, textAlign: 'center', marginTop: 12 }}>
          登录即代表同意 <a href="#" style={{ color: '#4f8cff' }}>服务条款</a> 和 <a href="#" style={{ color: '#4f8cff' }}>隐私政策</a>
        </div>
      </Card>
    </div>
  );
} 