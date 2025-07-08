import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Tabs, message } from 'antd';
import { BulbOutlined, MoonOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { loginUser } from './utils/userUtils';
import axios from 'axios';

export default function LoginPage({ setUser }) {
  const [tab, setTab] = useState('code');
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [codeLoading, setCodeLoading] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [form] = Form.useForm(); // 新增form实例

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

  useEffect(() => {
    if (codeCountdown > 0) {
      const timer = setTimeout(() => setCodeCountdown(codeCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [codeCountdown]);

  // 主题相关颜色
  const bgColor = theme === 'dark' ? '#18191c' : '#f7f8fa';
  const cardBg = theme === 'dark' ? '#23262e' : '#fff';
  const fontColor = theme === 'dark' ? '#eee' : '#222';
  const labelColor = theme === 'dark' ? '#eee' : '#333';
  const inputBg = theme === 'dark' ? '#23262e' : '#fff';
  const inputBorder = theme === 'dark' ? '#444' : '#d9d9d9';
  const tabColor = theme === 'dark' ? '#eee' : '#333';
  const tabActiveColor = '#4f8cff';
  const btnBg = 'linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%)';

  // 发送验证码
  const handleSendCode = async (phone) => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      message.error('请输入有效的手机号');
      return;
    }
    setCodeLoading(true);
    try {
      await axios.post('/api/send-code', { phone });
      message.success('验证码已发送');
      setCodeCountdown(60);
    } catch (e) {
      message.error('验证码发送失败');
    }
    setCodeLoading(false);
  };

  // 验证码登录
  const onCodeLogin = async (values) => {
    setLoading(true);
    try {
      const res = await axios.post('/api/code-login', {
        phone: values.phone,
        code: values.code
      });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        message.success('登录成功');
      } else {
        message.error(res.data?.msg || '验证码错误');
      }
    } catch (e) {
      message.error('登录失败，请重试');
    }
    setLoading(false);
  };

  // 密码登录
  const onPwdLogin = async (values) => {
    setLoading(true);
    try {
      const user = await loginUser(values.username, values.password);
      if (user) {
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        message.success('登录成功');
      } else {
        message.error('用户名或密码错误');
      }
    } catch (e) {
      message.error('登录失败，请重试');
    }
    setLoading(false);
  };

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
      <div style={{
        display: 'flex',
        background: cardBg,
        borderRadius: 20,
        boxShadow: '0 4px 32px 0 rgba(0,0,0,0.22)',
        minWidth: 800,
        minHeight: 420,
        alignItems: 'stretch',
        overflow: 'hidden',
      }}>
        {/* 左侧登录表单 */}
        <div style={{
          padding: '48px 40px 32px 40px',
          width: 400,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
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
            <Tabs.TabPane tab={<span style={{ color: tab === 'code' ? tabActiveColor : tabColor }}>验证码登录</span>} key="code" />
            <Tabs.TabPane tab={<span style={{ color: tab === 'pwd' ? tabActiveColor : tabColor }}>密码登录</span>} key="pwd" />
          </Tabs>
          <div style={{ color: theme === 'dark' ? '#bbb' : '#666', fontSize: 13, marginBottom: 18 }}>
            支持手机号、用户名、邮箱登录，或使用微信扫码登录。
          </div>
          {tab === 'code' ? (
            <Form form={form} layout="vertical" onFinish={onCodeLogin} style={{ color: fontColor }}>
              <Form.Item name="phone" label={<span style={{ color: labelColor }}>手机号</span>} rules={[{ required: true, message: '请输入手机号' }, { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确' }]}> 
                <Input style={{ background: inputBg, color: fontColor, borderColor: inputBorder }} maxLength={11} prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item name="code" label={<span style={{ color: labelColor }}>验证码</span>} rules={[{ required: true, message: '请输入验证码' }]}> 
                <Input
                  style={{
                    background: inputBg,
                    color: fontColor,
                    borderColor: inputBorder,
                    boxShadow: 'none',
                  }}
                  maxLength={6}
                  prefix={<LockOutlined />}
                  addonAfter={
                    <Button
                      size="small"
                      disabled={codeCountdown > 0}
                      loading={codeLoading}
                      onClick={async () => {
                        const phone = form.getFieldValue('phone');
                        if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
                          message.error('请输入有效的手机号');
                          return;
                        }
                        await handleSendCode(phone);
                      }}
                      style={{
                        background: theme === 'dark' ? '#23262e' : '#fff',
                        color: '#4f8cff',
                        border: '1.5px solid #4f8cff',
                        borderRadius: 6,
                        fontWeight: 600,
                        boxShadow: 'none',
                        minWidth: 60,
                        height: 28,
                        fontSize: 12,
                        padding: '0 4px',
                      }}
                    >
                      {codeCountdown > 0 ? `${codeCountdown}s后重试` : '发送验证码'}
                    </Button>
                  }
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} style={{ background: btnBg, border: 'none', fontWeight: 600, borderRadius: 8 }}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form layout="vertical" onFinish={onPwdLogin} style={{ color: fontColor }}>
              <Form.Item name="username" label={<span style={{ color: labelColor }}>手机号/用户名/邮箱</span>} rules={[{ required: true, message: '请输入手机号、用户名或邮箱' }]}> 
                <Input style={{ background: inputBg, color: fontColor, borderColor: inputBorder }} prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item name="password" label={<span style={{ color: labelColor }}>密码</span>} rules={[{ required: true, message: '请输入密码' }]}> 
                <Input.Password style={{ background: inputBg, color: fontColor, borderColor: inputBorder }} prefix={<LockOutlined />} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block loading={loading} style={{ background: btnBg, border: 'none', fontWeight: 600, borderRadius: 8 }}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          )}
          {/* 忘记密码和注册 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <a href="#" style={{ color: '#4f8cff', fontSize: 13 }}>忘记密码？</a>
            <a href="#" style={{ color: '#4f8cff', fontSize: 13 }}>注册</a>
          </div>
          {/* 协议说明 */}
          <div style={{ color: theme === 'dark' ? '#888' : '#666', fontSize: 12, textAlign: 'center', marginTop: 18 }}>
            登录即代表同意 <a href="#" style={{ color: '#4f8cff' }}>服务条款</a> 和 <a href="#" style={{ color: '#4f8cff' }}>隐私政策</a>
          </div>
        </div>
        {/* 右侧二维码 */}
        <div style={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 32px',
        }}>
          <div style={{ 
            background: theme === 'dark' ? '#23262e' : '#fff',
            borderRadius: 12, 
            padding: 16, 
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.10)',
            width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px dashed #bbb',
          }}>
            {/* 灰色占位框 */}
            <div style={{ width: 140, height: 140, background: '#bbb', borderRadius: 8, opacity: 0.18 }} />
          </div>
          <div style={{ color: '#4fef4f', fontSize: 16, marginTop: 18, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span role="img" aria-label="wechat">🟩</span> 微信扫码登录
          </div>
        </div>
      </div>
      {/* 页脚 */}
      <div style={{ position: 'fixed', bottom: 18, left: 0, width: '100%', textAlign: 'center', color: theme === 'dark' ? '#888' : '#999', fontSize: 13 }}>
        备案中 · <a href="#" style={{ color: '#4f8cff' }}>Contact us</a>
      </div>
    </div>
  );
} 