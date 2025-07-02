# 前端变更记录

## 2024-06-09 对话框整体上移优化
- 将主对话卡片mainCardStyle的margin由`40px auto`调整为`20px auto`，整体上移。
- 将Content的margin由24调整为12。
- 目的：让对话区距离顶部更近，视觉更居中美观。

## 2024-06-09 智能体对话区再上移&标题字体优化
- mainCardStyle的margin由`20px auto`进一步调整为`8px auto`，Content的margin由12调整为8。
- 所有智能体对话页面均复用mainCardStyle和chatContentStyle，布局完全统一。
- 顶部蓝色"智大蓝图"标题字体由22px调大为26px。

## 重要变更

- 2024-12-30：为parameter类型（参数上传类）智能体添加tokens和price的赋值和渲染逻辑，现在所有智能体都支持显示Token消耗和金额信息。
- 2024-12-30：工作流响应中提取tokens和price信息，支持workflow_finished和message_end事件中的usage数据。
- 2024-06：parameter类型（参数上传类）智能体的消息区已不再显示Token/金额消耗信息，仅dialogue类型（如智能问答助手）显示Token/金额。
- 2024-06：parameter类型智能体不再进行tokens/price的赋值和计算，仅dialogue类型进行相关处理。

---
其余历史变更见上文。

# 智能体前端渲染规范

## 智能体类型与渲染规则

- 智能体分为两类：
  - inputType: 'dialogue' —— 前端渲染文本输入框（仅智能问答助手）
  - inputType: 'parameter' —— 前端渲染"开始"按钮，点击后弹出参数配置弹窗
- 参数配置弹窗的所有参数项自动根据 agents.json 的 inputs 字段渲染，类型、必填、label、下拉选项等自动适配。
- 用户在网页端配置参数并保存后，inputType 和 inputs 字段会自动同步，前端渲染方式和参数项会自动更新，无需手动维护。

## 示例
- 智能问答助手（qa-module）：inputType: 'dialogue'，显示文本输入框
- 其它智能体：inputType: 'parameter'，显示"开始"按钮，弹窗参数项自动渲染 