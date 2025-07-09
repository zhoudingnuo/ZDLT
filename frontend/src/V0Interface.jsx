import React from 'react';
import { Button, Input, Tag } from 'antd';
// import { SearchOutlined, AppstoreOutlined, ClockCircleOutlined, TeamOutlined, DownOutlined, RightOutlined, StarOutlined, CameraOutlined, UploadOutlined, FileTextOutlined, UserAddOutlined, CloseOutlined } from '@ant-design/icons';

export default function V0Interface() {
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#000', color: '#fff' }}>
      {/* 侧边栏 */}
      <div style={{ width: 256, background: '#1a1a1a', borderRight: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
        {/* 头部 */}
        <div style={{ padding: 16, borderBottom: '1px solid #222' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 24, height: 24, background: '#fff', borderRadius: 6, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>v0</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, background: '#52c41a', borderRadius: '50%' }}></div>
              <span style={{ fontSize: 14 }}>个人</span>
              {/* <DownOutlined style={{ fontSize: 14 }} /> */}
            </div>
          </div>
          <Button block style={{ background: '#222', color: '#fff', borderColor: '#333' }}>新建对话</Button>
        </div>
        {/* 导航 */}
        <div style={{ flex: 1, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, color: '#bbb', borderRadius: 6, cursor: 'pointer', marginBottom: 4, transition: 'background 0.2s' }}>
            {/* <SearchOutlined /> */}
            <span>搜索</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, color: '#bbb', borderRadius: 6, cursor: 'pointer', marginBottom: 4, transition: 'background 0.2s' }}>
            {/* <AppstoreOutlined /> */}
            <span>项目</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, color: '#bbb', borderRadius: 6, cursor: 'pointer', marginBottom: 4, transition: 'background 0.2s' }}>
            {/* <ClockCircleOutlined /> */}
            <span>最近</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, color: '#bbb', borderRadius: 6, cursor: 'pointer', marginBottom: 4, transition: 'background 0.2s' }}>
            {/* <TeamOutlined /> */}
            <span>社区</span>
          </div>
          {/* 可折叠分区 */}
          <div style={{ paddingTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, color: '#888', cursor: 'pointer' }}>
              {/* <RightOutlined /> */}
              <span>收藏项目</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, color: '#888', cursor: 'pointer' }}>
              {/* <RightOutlined /> */}
              <span>收藏对话</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, color: '#888', cursor: 'pointer' }}>
              {/* <DownOutlined /> */}
              <span>最近</span>
            </div>
          </div>
          {/* 空状态 */}
          <div style={{ paddingTop: 32, textAlign: 'center', color: '#666', fontSize: 13 }}>
            <p>你还没有创建任何</p>
            <p>对话。</p>
          </div>
        </div>
        {/* 新功能横幅 */}
        <div style={{ padding: 16, borderTop: '1px solid #222' }}>
          <div style={{ background: '#222', borderRadius: 10, padding: 12, position: 'relative' }}>
            {/* <Button size="small" style={{ position: 'absolute', top: 4, right: 4, color: '#888', background: 'none', border: 'none' }} icon={<CloseOutlined />} /> */}
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>新功能</div>
            <div style={{ color: '#aaa', fontSize: 12, lineHeight: 1.6 }}>
              v0 现在支持多标签页和多浏览器同步消息流
            </div>
          </div>
        </div>
      </div>
      {/* 主内容区 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
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
            {/* <RightOutlined style={{ color: '#888' }} /> */}
          </div>
          {/* 主标题 */}
          <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 48, textAlign: 'center' }}>我可以帮你做什么？</h1>
          {/* 输入区 */}
          <div style={{ width: '100%', maxWidth: 640, marginBottom: 32 }}>
            <div style={{ position: 'relative' }}>
              <Input
                placeholder="请输入你想让 v0 帮你做什么..."
                style={{ width: '100%', background: '#1a1a1a', borderColor: '#333', color: '#fff', height: 48, paddingRight: 120 }}
              />
              <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8 }}>
                <Button size="small" style={{ color: '#bbb', background: 'none', border: 'none' }}>✨</Button>
                <Button size="small" style={{ color: '#bbb', background: 'none', border: 'none' }}>⬆️</Button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, color: '#888', fontSize: 13 }}>
              <span>v0-1.5-md</span>
              {/* <DownOutlined style={{ fontSize: 14 }} /> */}
            </div>
          </div>
          {/* 快捷操作 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 64, justifyContent: 'center' }}>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>📷 克隆截图</Button>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>📄 从 Figma 导入</Button>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>⬆️ 上传项目</Button>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>📄 着陆页</Button>
            <Button style={{ borderColor: '#333', color: '#fff', background: 'transparent', display: 'flex', alignItems: 'center', gap: 8 }}>➕ 注册表单</Button>
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