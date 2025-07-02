# 前端智能体对话系统

## 项目简介
这是一个基于React和Ant Design的智能体对话系统前端，支持多种AI智能体的交互，包括作文批改、默写批改、智能问答等功能。

## 主要功能

### 1. 智能体对话
- 支持多种智能体：语文作文批改、语文默写批改、智能问答助手等
- 实时对话界面，支持流式响应
- 历史对话管理，按智能体分类存储
- AI思考中状态显示，实时计时

### 2. 用户系统
- 用户注册/登录功能
- 个人中心管理
- 管理员用户管理功能
- 用户角色权限控制
- 用户余额管理和充值功能
- 充值记录查看

### 3. 图片上传
- 统一图片上传到免费图床（imgbb）
- 支持remote_url格式传递
- 自动base64转换和URL获取

### 4. 深色模式支持
- 完整的深色模式切换功能
- 所有组件都支持深色/浅色主题
- 动态颜色适配，包括：
  - 首页卡片、按钮、文字
  - 聊天界面、消息气泡
  - 所有弹窗和模态框
  - 侧边栏、头部导航
  - 输入框、表格、列表
  - 小游戏iframe渲染器

### 5. 充值系统
- 手动充值功能（个人收款码）
- 充值审核流程（管理员）
- 用户充值记录查看
- 余额不足提醒

### 6. 界面优化
- 极简设计风格
- 响应式布局
- 卡片悬浮效果
- 统一的颜色主题
- 流畅的动画过渡

### 智能问答助手输入框优化
- 智能问答助手（qa-module）对话输入框高度变矮，下方新增"深度思考""联网搜索"按钮，风格参考deepseek。
- 仅对qa-module生效，其他智能体不受影响。

## 技术栈
- React 18
- Ant Design 5
- React Router 6
- Axios
- React Markdown
- LocalStorage

## 深色模式实现

### 主题管理
- 使用`useState`统一管理theme状态
- 通过`document.body.setAttribute('data-theme', theme)`设置全局主题
- 所有组件通过props接收theme参数

### 颜色系统
```javascript
// 深色模式颜色配置
const darkColors = {
  bg: '#23262e',           // 主背景
  card: '#2f3136',         // 卡片背景
  text: '#eee',            // 主文字
  textSecondary: '#bbb',   // 次要文字
  border: '#444',          // 边框
  input: '#3a3d42'         // 输入框背景
};

// 浅色模式颜色配置
const lightColors = {
  bg: '#fff',              // 主背景
  card: '#fff',            // 卡片背景
  text: '#333',            // 主文字
  textSecondary: '#666',   // 次要文字
  border: '#d9d9d9',       // 边框
  input: '#fff'            // 输入框背景
};
```

### 组件适配
所有主要组件都已适配深色模式：
- `HomePage` - 首页卡片和导航
- `ChatPage` - 聊天界面和消息
- `LoginModal` - 登录弹窗
- `ProfileModal` - 个人中心弹窗
- `UserListModal` - 用户管理弹窗
- `WorkflowInputModal` - 参数配置弹窗
- `GameHtmlRenderer` - 小游戏渲染器
- `LogoTitle` - Logo组件

### 全局样式
通过CSS选择器自动适配Ant Design组件：
```css
body[data-theme="dark"] .ant-layout { background: #23262e; }
body[data-theme="dark"] .ant-card { background: #2f3136; }
body[data-theme="dark"] .ant-input { background: #3a3d42; }
```

## 开发说明

### 启动项目
```bash
npm install
npm start
```

### 构建项目
```bash
npm run build
```

### 深色模式开发规范
1. 所有写死的颜色都要改为动态设置
2. 使用theme参数判断当前主题
3. 颜色变量统一管理
4. 测试深色/浅色模式切换

## 更新日志

### 2024-12-19 - API地址统一配置
- **问题**：外网访问时API地址配置不一致，导致部分功能无法正常使用
- **解决方案**：
  1. 统一所有API调用使用公网地址：`http://29367ir756de.vicp.fun:45262`
  2. 修改 `App.jsx` 中的API_BASE配置
  3. 更新 `userUtils.js` 中的API_BASE配置
  4. 修改 `package.json` 中的代理配置
  5. 将所有相对路径API调用改为完整URL调用
- **影响**：外网用户现在可以正常使用所有功能，包括智能体列表、用户登录、文件上传等

### 2025-01-XX - 新增文档上传功能
- **功能**：新增 `upload` 类型参数，支持对接 Dify 文件上传接口
- **实现**：
  1. 在 AgentConfigModal 中新增"文档上传"参数类型选项
  2. 在 WorkflowInputModal 中实现 upload 类型的表单渲染和文件处理
  3. 自动调用 Dify `/files/upload` 接口，使用智能体 API Key 认证
  4. 返回完整的 file_info 结构作为主API参数
- **影响**：用户现在可以上传文档文件，系统会自动处理并传递给智能体

### 2025-01-XX - 修复语法错误和智能体排序
- **问题**：HomePage组件中存在不完整的JSX表达式，导致语法错误
- **修复**：
  1. 删除了函数体内部不完整的JSX表达式（第2943-2947行）
  2. 添加了缺失的`agentsByCategory`生成逻辑
  3. 确保所有智能体状态和排序都严格依赖agents.json的status字段
- **影响**：前端现在可以正常启动和运行，卡片排序和状态显示完全正确

### 2025-01-XX - 添加API调试和错误处理
- **问题**：前端请求后端API时没有错误处理，导致调试困难
- **修复**：
  1. 为所有`/api/agents/full`请求添加了详细的错误处理和调试日志
  2. 在后端添加了调试输出，显示API请求和返回数据
  3. 确保前端能正确捕获和显示API错误信息
- **影响**：现在可以更容易地排查前端和后端之间的通信问题

### 2024-12-19
- 新增充值审核功能，管理员可在用户管理界面审核充值订单
- 用户可在个人中心查看充值记录和状态
- 完善深色模式功能，所有组件支持主题切换
- 修复历史对话、计时器、AI思考气泡等显示问题
- 优化界面美观度和用户体验
- 统一图片上传参数格式
- 修复智能体配置和API端点问题

### 2024-12-18
- 实现基础深色模式切换
- 优化首页UI设计
- 修复历史对话管理
- 完善计时器功能

## 注意事项
- 确保所有新加组件都支持深色模式
- 图片上传统一使用remote_url格式
- 历史对话按智能体分开存储
- 主题切换按钮在App组件中统一管理

## 核心组件

### WorkflowInputModal
工作流参数输入组件，支持：
- 文件上传（图片转base64）
- 参数验证和组装
- 标准Dify API格式兼容

#### 参数组装逻辑（2024-12-28更新）
```javascript
// 简化图片对象格式（避免复杂字段导致错误）
const imageObj = {
  remote_url: url, // 上传后获得的URL
  filename: fileObj.name,
  size: fileObj.size
};

// 标准inputs格式
const inputs = {
  image: imageObj, // 图片字段名与agents.json配置一致
  text: "课文名称",
  mode: "开启" // 只能为"开启"或"关闭"
};
```

#### 关键优化点
1. **字段名一致性**：图片字段名使用 `image`，与 agents.json 配置一致
2. **参数验证**：mode 字段严格限制为 "开启" 或 "关闭"
3. **空值处理**：使用 safe 函数过滤 None、空字符串等无效值
4. **调试信息**：完整的参数组装过程日志输出
5. **错误处理**：详细的错误分类和用户提示
6. **简化图片对象**：避免复杂字段导致 "Invalid upload file id" 错误

### ChatPage
聊天页面组件，支持：
- 消息展示和滚动
- 用户登录状态管理
- 网络诊断功能
- 主题切换

## 开发指南

### 启动项目
```bash
npm install
npm start
```

### 构建项目
```bash
npm run build
```

### 代码规范
- 使用 ES6+ 语法
- 组件采用函数式编程
- 状态管理使用 React Hooks
- 样式采用内联样式和CSS变量

## 配置说明

### 智能体配置
智能体配置在 `backend/agents.json` 中定义，包含：
- API 地址和密钥
- 输入参数定义
- 工作流标识

### 主题配置
- 支持深色/浅色主题切换
- 全局CSS变量管理
- Ant Design 组件主题适配

## 更新日志

### 2024-12-28
- 优化 WorkflowInputModal 参数组装逻辑
- 实现标准 Dify API 格式兼容
- 添加详细的调试信息和错误处理
- 修复参数验证和空值处理问题
- **修复 "Invalid upload file id" 错误**：简化图片对象格式，避免复杂字段导致错误

### 2024-12-27
- 实现全局深色/浅色主题切换
- 优化UI组件深色模式适配
- 完善用户登录注册功能

### 2024-12-26
- 实现文件上传和参数配置功能
- 添加工作流支持
- 优化聊天界面和用户体验

### 2024-06-30
- "语文作文批改"已配置并在首页/分类页置顶显示。
- 修复了四个顶部按钮的样式问题，确保所有按钮样式统一美观。
- "创建智能体"按钮点击后跳转到Dify应用管理页面(http://118.145.74.50:24131/apps)。

### 2024-07-01
- 消息渲染逻辑已一键优化：
  - 只显示AI返回的`result`字段内容（优先）或`content.result`字段内容。
  - 兼容小游戏HTML自动渲染。
  - 彻底避免字典包裹和文本误渲染，无论后端返回何种结构，前端只显示核心内容。
- 参数弹窗彻底修复：仅有file类型字段时才会触发文件上传，无file字段时绝不上传，彻底解决"请先选择文件"误报和接口调用问题。
- 支持Dify工作流API参数自动适配，inputs对象自动组装。

### 2024-06-09
- 修复了语文课文默写批改模块：上传图片后依然提示"请选择学生默写课文"的问题。
- 原因：表单上传文件字段名与配置不一致，现已统一为动态字段名，确保表单校验和数据提交正常。
- 修复AI回复气泡重复显示usedTime和aiTimer的问题，现在AI思考中只显示实时计时，回复完成后只显示最终耗时。
- 优化AI思考中气泡渲染，AI思考时显示友好气泡"AI正在思考..."和实时计时，避免调试JSON输出。

## 注意事项

1. **PowerShell 兼容性**：Windows PowerShell 不支持 `&&` 语法，请使用分号或分别执行命令
2. **文件编码**：批处理文件建议使用 ANSI/GBK 编码，避免 UTF-8 BOM
3. **API 兼容性**：确保前端参数格式与后端 Dify API 标准一致
4. **网络配置**：确保后端服务正常运行，前端能正常访问 API

## 技术支持

如有问题，请检查：
1. 控制台错误信息
2. 网络连接状态
3. 后端服务状态
4. API 参数格式

## 2024-06-30 UI修复说明

- 修复了头像登录Dropdown和Tooltip重叠导致的UI问题。
- 现在只用Tooltip包裹Avatar，Dropdown的overlay只放菜单项，避免了登录状态提示和下拉菜单重叠。
- 优化了登录状态提示和下拉菜单交互体验。
- 修复了课文默写批改模块的SSE数据流解析问题，现在能正确处理Dify工作流返回的streaming格式数据，提取最终结果并格式化显示。
- 修复了Invalid Host header问题，通过设置DANGEROUSLY_DISABLE_HOST_CHECK环境变量允许外网访问，解决花生壳等内网穿透工具的访问限制。
- 新增cross-env依赖，确保环境变量在Windows PowerShell中正确设置。
- 新增start-external脚本，专门用于外网访问，设置HOST=0.0.0.0支持所有网络接口。

## 启动命令说明

- `npm start` - 标准启动，仅支持localhost访问
- `npm run start-network` - 网络模式，支持局域网访问
- `npm run start-external` - 外网模式，支持所有网络访问（推荐用于花生壳等内网穿透）

## 新增功能说明

- 新增ReactMarkdown rehype-raw插件，支持AI输出内容中的HTML标签（如<font>、<span>等）渲染。
- 自动去除AI输出中的<font>标签，优化表格渲染体验。
- 建议AI输出标准Markdown表格格式，前端已自动兼容常见表格格式。
- 聊天内容区高度自适应，最大高度撑满窗口，支持大段内容滚动。
- Markdown内容区自动换行，表格、长文本不溢出。
- 滚动条样式美化，体验更好。
- 适配移动端和大屏。
- 聊天主内容区最大宽度提升至1400px，宽度95vw，气泡最大宽度95%，体验更宽敞。
- 聊天内容区padding更紧凑，整体更现代。
- 支持大屏和移动端自适应，体验更好。
- ReactMarkdown已加className，表格样式更美观。
- 渲染前自动修正AI输出的伪表格为标准Markdown表格，保证表格100%正常显示。
- 表格边框、背景、字体更清晰，兼容深浅色主题。
- AI生成回答时，气泡旁会显示计时器，显示用时，提升交互体验。
- 表格修正逻辑更强，自动补全所有"|"分隔的表格为标准Markdown表格，保证渲染成功。
- 支持历史对话保存、切换、删除，左侧可随时恢复历史会话。
- 自动去除Markdown内容首尾空行，优化渲染区域样式，消除大块空白。
- 优化参数配置弹窗，word_list参数不再重复显示description和多行示例，只保留多行示例说明。

## 全局用户管理弹窗

- 用户管理弹窗（UserListModal）为全局唯一，由Context（UserListContext）统一管理。
- 只有管理员账号（如ZDLT/Administrator2025）登录后，头像下拉菜单才会显示"用户管理"入口。
- 无论在首页、聊天页还是其他页面，点击"用户管理"都能弹出同一个全局弹窗，状态不会丢失。
- 该弹窗支持查看所有注册用户信息（用户名、邮箱、注册时间、最后登录、角色等），并支持后续扩展。
- 相关代码见：`src/contexts/UserListContext.js`、`src/App.jsx`。

## 启动说明

1. 进入frontend目录，安装依赖：
   ```bash
   npm install
   ```
2. 启动前端服务：
   ```bash
   npm start
   ```
3. 如需自定义API地址，请修改`.env`文件。

## 图片上传逻辑说明（2024-06-09）
- 智能体图片上传已自动区分：
  - 作文批改等需要 Dify 本地文件的智能体（如 id 为 chinese-correction、chinese-essay、composition-correction），前端会自动上传到 `/api/upload-dify-file`，并组装完整文件信息（local_file、remote_url、related_id 等字段）。
  - 其它智能体则继续用 imgbb 免费图床，前端上传到 `/api/upload-image`，仅传 url 字段。
- 该流程已自动判断，无需手动切换。

## 语文作文批改图片上传说明

- 语文作文批改相关 agent（如 chinese-essay、composition-correction 等）上传图片时，前端会自动将图片上传到 imgbb 免费图床，获取图片直链 url。
- 提交参数时，图片字段会以 from_variable_selector: [imageUrl, "text"] 格式传递给 dify 接口。
- 不能直接上传本地图片文件。
- 如需更换图床，请修改后端 /api/upload-image 实现。

## 2024-UI优化记录

### 登录窗口深色模式美化
- Modal背景：#23262e
- 输入框背景：#262a32
- 边框：#444
- 字体：#eee
- 按钮风格与主题主色一致
- 统一圆角、阴影，提升质感
- 登录状态持久化：用户信息存储于localStorage，刷新后自动恢复

涉及文件：src/App.jsx, src/utils/userUtils.js

---
如有问题请联系开发者。

- 备份文件App_backup.jsx也已同步一键修改消息渲染逻辑，保持与主程序一致。

## 2024-更新记录

### 分类栏优化
- 首页顶部分类栏改为flex等分宽度，所有分类一屏显示，不再出现横向滚动条。
- 相关代码见：`src/App.jsx` HomePage 分类栏部分。

## 前端开发规范

- 智能体根据输入方式分为两类：参数上传类（如语文作文批改、语文课文默写批改、单词消消乐）和智能对话类（如智能问答助手）。
- 前端对话页面需根据输入方式的不同，分别渲染"开始"按钮（参数上传类）和类似智能问答助手的对话框、深度思考按钮等（智能对话类）。

## 图生图等多文件上传智能体修复

### 问题描述
图生图（image-to-image）等多文件上传智能体在使用时出现以下错误：
```json
{
    "code": "invalid_param",
    "message": "No matching enum found for value 'None'",
    "status": 400
}
```

### 问题原因
- 前端 `WorkflowInputModal` 组件在处理多文件上传（`input.type === 'array' && input.itemType === 'file'`）时，缺少专门的参数处理分支
- 导致 antd Upload 组件的原始 fileList 对象（包含 `originFileObj`、`percent`、`uid` 等前端字段）直接传递给后端
- 后端解析时遇到 `None` 或非法枚举值，导致参数验证失败

### 解决方案
在 `WorkflowInputModal` 的 `handleSubmit` 方法中补充多文件上传处理分支：

```javascript
} else if (input.type === 'array' && input.itemType === 'file') {
  // 多文件上传
  const fileList = form.getFieldValue(input.name);
  if ((!fileList || fileList.length === 0) && input.required) {
    message.error(`请先选择${input.label}`);
    setLoading(false);
    return;
  }
  const uploadedFiles = [];
  for (const fileItem of fileList || []) {
    if (fileItem.originFileObj) {
      const base64 = await fileToBase64(fileItem.originFileObj);
      const uploadRes = await axios.post('/api/upload-image', { base64 });
      const imageUrl = uploadRes.data.url;
      uploadedFiles.push({
        type: 'image',
        transfer_method: 'remote_url',
        remote_url: imageUrl
      });
    }
  }
  // 深度过滤，确保每个对象只包含需要的字段
  inputs[input.name] = uploadedFiles.map(f => ({
    type: f.type,
    transfer_method: f.transfer_method,
    remote_url: f.remote_url
  })).filter(f => f.remote_url);
}
```

### 修复效果
- 确保多文件上传时，每个图片对象只包含后端需要的字段（`type`、`transfer_method`、`remote_url`）
- 彻底移除 `originFileObj`、`percent`、`uid` 等前端字段
- 解决图生图等多文件上传智能体的参数传递问题
- 与单文件上传（如语文默写批改）保持一致的参数处理逻辑

### 相关文件
- `frontend/src/App.jsx` - WorkflowInputModal 组件
- `backend/agents.json` - 智能体配置（图生图等）

## 智能体审核配置模块

### 功能描述
新增智能体审核配置模块，允许管理员审核智能体状态，将审核中的智能体修改为已配置状态。

### 功能特性
- **状态管理**：支持三种智能体状态（待配置、审核中、已配置）
- **审核功能**：管理员可以审核通过或拒绝"审核中"状态的智能体
- **状态转换**：
  - 待配置 → 审核中：配置API Key后自动转换
  - 审核中 → 已配置：管理员审核通过
  - 审核中 → 待配置：管理员拒绝后重置
- **分类展示**：按状态分类显示智能体列表
- **操作记录**：记录审核时间和拒绝原因
- **自动刷新**：审核通过后页面自动刷新，确保新状态立即生效

### 后端API
- `GET /api/admin/agents/status` - 获取所有智能体状态（按状态分组）
- `POST /api/admin/agents/:agentId/approve` - 审核通过智能体
- `POST /api/admin/agents/:agentId/reject` - 拒绝智能体配置

### 前端组件
- `AgentReviewModal` - 智能体审核配置弹窗组件
- 集成在 `UserListModal` 中，管理员可通过"审核智能体"按钮访问

### 使用流程
1. 管理员登录后，点击右上角头像 → 用户管理
2. 在用户管理页面点击"审核智能体"按钮
3. 在智能体审核页面查看不同状态的智能体
4. 对"审核中"状态的智能体进行审核操作
5. 审核通过后智能体状态变为"已配置"，页面自动刷新以应用新状态
6. 刷新后用户可以使用已配置的智能体

### 相关文件
- `backend/app.js` - 智能体状态审核API
- `frontend/src/App.jsx` - AgentReviewModal 组件
- `backend/agents.json` - 智能体状态配置 