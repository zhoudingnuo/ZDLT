import React, { useState } from 'react';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { loginUser, registerUser } from './utils/userUtils';

export default function LoginPage({ setUser }) {
  const [tab, setTab] = useState('login');
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#18191c'
    }}>
      <Card style={{ width: 420, borderRadius: 16, boxShadow: '0 4px 32px 0 rgba(0,0,0,0.22)', background: '#23262e', border: 'none' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img src="/logo-zeta-vista.png" alt="logo" style={{ height: 48 }} />
          <div style={{ fontWeight: 700, fontSize: 24, color: '#4f8cff', marginTop: 8 }}>智大蓝图</div>
        </div>
        <Tabs activeKey={tab} onChange={setTab} centered style={{ marginBottom: 24 }}>
          <Tabs.TabPane tab="登录" key="login" />
          <Tabs.TabPane tab="注册" key="register" />
        </Tabs>
        <Form layout="vertical" onFinish={onFinish} style={{ color: '#eee' }}>
          <Form.Item name="username" label={<span style={{ color: '#eee' }}>用户名</span>} rules={[{ required: true, message: '请输入用户名' }]}> 
            <Input style={{ background: '#262a32', color: '#eee', borderColor: '#444' }} />
          </Form.Item>
          <Form.Item name="password" label={<span style={{ color: '#eee' }}>密码</span>} rules={[{ required: true, message: '请输入密码' }]}> 
            <Input.Password style={{ background: '#262a32', color: '#eee', borderColor: '#444' }} />
          </Form.Item>
          {tab === 'register' && (
            <Form.Item name="email" label={<span style={{ color: '#eee' }}>邮箱</span>} rules={[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '邮箱格式不正确' }]}> 
              <Input style={{ background: '#262a32', color: '#eee', borderColor: '#444' }} />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ background: 'linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%)', border: 'none', fontWeight: 600, borderRadius: 8 }}>
              {tab === 'login' ? '登录' : '注册'}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ color: '#888', fontSize: 12, textAlign: 'center', marginTop: 12 }}>
          登录即代表同意 <a href="#" style={{ color: '#4f8cff' }}>服务条款</a> 和 <a href="#" style={{ color: '#4f8cff' }}>隐私政策</a>
        </div>
      </Card>
    </div>
  );
} 