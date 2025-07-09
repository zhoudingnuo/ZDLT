import React, { useState, useEffect } from 'react';
import { Button, Input, Tag } from 'antd';
import {
  Search,
  Grid3X3,
  Clock,
  Users,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Star,
  Plus,
  MessageSquare,
  Folder,
  UserPlus,
  X,
} from 'lucide-react';

export default function V0Interface() {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 900);
  const sidebarWidth = collapsed ? 56 : 256;

  // 响应式自动收起/展开
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 900 && !collapsed) setCollapsed(true);
      if (window.innerWidth >= 900 && collapsed) setCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  // 导航项配置
  const navs = [
    { icon: <Search size={20} />, label: '搜索' },
    { icon: <Folder size={20} />, label: '项目' },
    { icon: <Clock size={20} />, label: '最近' },
    { icon: <Users size={20} />, label: '社区' },
  ];
  const favs = [
    { icon: <Star size={20} />, label: '收藏项目' },
    { icon: <MessageSquare size={20} />, label: '收藏对话' },
    { icon: <Clock size={20} />, label: '最近' },
  ];
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff' }}>
      {/* 侧边栏 */}
      <div
        style={{
          width: sidebarWidth,
          position: 'fixed',
          left: 0,
          top: 0,
          height: '100vh',
          background: '#1a1a1a',
          borderRight: '1px solid #222',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 100,
          transition: 'width 0.2s',
        }}
      >
        {/* 头部+收起按钮 */}
        <div style={{ padding: 16, borderBottom: '1px solid #222', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo-zeta-vista.png" alt="logo" style={{ width: 28, height: 28, borderRadius: 6, marginRight: collapsed ? 0 : 8, objectFit: 'cover' }} />
            {!collapsed && (
              <span style={{ fontWeight: 700, fontSize: 18, color: '#4f8cff', letterSpacing: 2 }}>智大蓝图</span>
            )}
          </div>
          <Button
            size="small"
            style={{ background: 'none', border: 'none', color: '#bbb', fontSize: 18, width: 28, height: 28, padding: 0 }}
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? '展开' : '收起'}
            icon={collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          />
        </div>
        {/* 新建对话按钮 */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: collapsed ? '12px 0' : '16px 0 0 0' }}>
          {collapsed ? (
            <Button
              type="primary"
              shape="circle"
              icon={<Plus size={20} />}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                background: '#222',
                color: '#fff',
                borderColor: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 16,
                transition: 'width 0.2s',
              }}
            />
          ) : (
            <Button
              type="primary"
              icon={<Plus size={20} />}
              style={{
                width: 160,
                height: 36,
                borderRadius: 18,
                background: '#222',
                color: '#fff',
                borderColor: '#333',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 16,
                transition: 'width 0.2s',
              }}
            >
              <span style={{ marginLeft: 8 }}>新建对话</span>
            </Button>
          )}
        </div>
        {/* 导航 */}
        <div style={{ flex: 1, padding: collapsed ? 8 : 16 }}>
          {navs.map((item, idx) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: collapsed ? 0 : 12,
                padding: 8,
                color: '#bbb',
                borderRadius: 6,
                cursor: 'pointer',
                marginBottom: 4,
                fontSize: 18,
                transition: 'background 0.2s',
                justifyContent: collapsed ? 'center' : 'flex-start',
              }}
            >
              {item.icon}
              {collapsed ? null : <span style={{ fontSize: 15 }}>{item.label}</span>}
            </div>
          ))}
          {/* 可折叠分区 */}
          <div style={{ paddingTop: collapsed ? 8 : 16 }}>
            {favs.map((item, idx) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: collapsed ? 0 : 8,
                  padding: 8,
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: 18,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
              >
                {item.icon}
                {collapsed ? null : <span style={{ fontSize: 15 }}>{item.label}</span>}
              </div>
            ))}
          </div>
          {/* 空状态 */}
          {!collapsed && (
            <div style={{ paddingTop: 32, textAlign: 'center', color: '#666', fontSize: 13 }}>
              <p>你还没有创建任何</p>
              <p>对话。</p>
            </div>
          )}
        </div>
        {/* 新功能横幅 */}
        {!collapsed && (
          <div style={{ padding: 16, borderTop: '1px solid #222' }}>
            <div style={{ background: '#222', borderRadius: 10, padding: 12, position: 'relative' }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>新功能</div>
              <div style={{ color: '#aaa', fontSize: 12, lineHeight: 1.6 }}>
                v0 现在支持多标签页和多浏览器同步消息流
              </div>
            </div>
          </div>
        )}
      </div>
      {/* 主内容区 */}
      <div style={{ flex: 1, marginLeft: sidebarWidth, transition: 'margin-left 0.2s', display: 'flex', flexDirection: 'column' }}>
        {/* 顶部栏 */}
        <div style={{ borderBottom: '1px solid #222', padding: 16, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 16 }}>
          <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent' }}>升级</Button>
          <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent' }}>反馈</Button>
          <div style={{ width: 32, height: 32, background: '#52c41a', borderRadius: '50%' }}></div>
        </div>
        {/* 主内容区域 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          {/* GitHub 同步横幅 */}
          <div style={{ marginBottom: 48, display: 'flex', alignItems: 'center', gap: 8, background: '#1a1a1a', border: '1px solid #333', borderRadius: 999, padding: '8px 24px' }}>
            <Tag color="green" style={{ fontSize: 12, background: '#52c41a', color: '#fff', border: 'none' }}>新</Tag>
            <span style={{ fontSize: 14 }}>将你的生成内容同步到 GitHub</span>
            <span style={{ color: '#40a9ff', fontSize: 14, cursor: 'pointer' }}>立即体验</span>
          </div>
          {/* 主标题1 */}
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 48, textAlign: 'center' }}>我可以帮你做什么？</h1>
          {/* 输入区 */}
          <div style={{ width: '100%', maxWidth: 640, marginBottom: 32 }}>
            <div style={{ position: 'relative' }}>
              <Input
                placeholder="请输入你想让 v0 帮你做什么..."
                style={{ width: '100%', background: '#1a1a1a', borderColor: '#333', color: '#fff', height: 48, paddingRight: 120 }}
              />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8 }}>
                <Button size="small" style={{ color: '#bbb', background: 'none', border: 'none' }}>
                  <span>✨</span>
                </Button>
                <Button size="small" style={{ color: '#bbb', background: 'none', border: 'none' }}>
                  <span>⬆️</span>
                </Button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, color: '#888', fontSize: 13 }}>
              <span>v0-1.5-md</span>
            </div>
          </div>
          {/* 快捷操作 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 64, justifyContent: 'center' }}>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📷</span>
              <span>克隆截图</span>
            </Button>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📄</span>
              <span>从 Figma 导入</span>
            </Button>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>⬆️</span>
              <span>上传项目</span>
            </Button>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>📄</span>
              <span>着陆页</span>
            </Button>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>➕</span>
              <span>注册表单</span>
            </Button>
          </div>
          {/* 社区内容区 */}
          <div style={{ width: '100%', maxWidth: 1200 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>来自社区的灵感</h2>
                <p style={{ color: '#888', fontSize: 13 }}>探索社区正在用 v0 构建什么。</p>
              </div>
              <Button type="link" style={{ color: '#bbb', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, padding: 0 }}>浏览全部</Button>
            </div>
            {/* 社区项目网格 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
              {/* 项目1 */}
              <div style={{ background: '#1a1a1a', borderRadius: 12, overflow: 'hidden', border: '1px solid #222', cursor: 'pointer', transition: 'border 0.2s' }}>
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #fa8c16 0%, #f5222d 100%)', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)' }}></div>
                  <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>仪表盘</div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>赛博朋克风格界面</div>
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontWeight: 500, marginBottom: 8 }}>赛博朋克仪表盘设计</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
                    <div style={{ width: 20, height: 20, background: '#fa8c16', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', color: '#fff' }}>E</div>
                    <span>2.1K 分叉</span>
                  </div>
                </div>
              </div>
              {/* 项目2 */}
              <div style={{ background: '#1a1a1a', borderRadius: 12, overflow: 'hidden', border: '1px solid #222', cursor: 'pointer', transition: 'border 0.2s' }}>
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)' }}></div>
                  <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>分析</div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>金融数据可视化</div>
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontWeight: 500, marginBottom: 8 }}>金融仪表盘</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
                    <div style={{ width: 20, height: 20, background: '#52c41a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', color: '#fff' }}>F</div>
                    <span>2.02K 分叉</span>
                  </div>
                </div>
              </div>
              {/* 项目3 */}
              <div style={{ background: '#1a1a1a', borderRadius: 12, overflow: 'hidden', border: '1px solid #222', cursor: 'pointer', transition: 'border 0.2s' }}>
                <div style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #595959 0%, #1a1a1a 100%)', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)' }}></div>
                  <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 4 }}>认证</div>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>简洁登录界面</div>
                  </div>
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ fontWeight: 500, marginBottom: 8 }}>双栏登录卡片</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#888' }}>
                    <div style={{ width: 20, height: 20, background: '#1890ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', color: '#fff' }}>T</div>
                    <span>7.3K 分叉</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 