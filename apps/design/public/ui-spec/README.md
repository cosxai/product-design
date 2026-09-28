# MetaRoom UI 规范

基于 COSX Design System 3.0，服务客户门户与 Ops 工作台两个产品面。

## 目录

- `site/`：COSX 设计系统站（入口 `site/Home.dc.html`）。首页、颜色 / 字体 / 间距与形状 / 动效 4 个基础页，按钮 / 输入框 / 下拉选择 / 状态徽章 / 对话框 5 个组件页；中英文与深色模式，偏好存在浏览器里。`site/_gen.js` 是生成这些页面的模板函数。

- `ui-spec/MetaRoom Components.dc.html`：组件规范，共 22 节（基础、按钮、输入、选择、上传、徽章、页面状态、反馈、浮层与操作栏、数据展示、手机、中英文、布局与导航、Agent 对话、头像与成员、分享、看板、编辑与签署、表单扩展、图表、系统级、设置页）
- `ui-spec/MetaRoom Navigation.dc.html`：导航方案对比与结论
- `pages/`：真实页面与共用外壳
  - `MetaRoom Customer Portal.dc.html`：客户门户关键页（首页、任务、文档、查看器、我的客户、我的内容）
  - `MetaRoom Ops Workbench.dc.html`：Ops 关键页（收件箱、审阅队列、拆分对话框）
  - `MetaRoom Auth.dc.html`：登录、邀请注册与后续步骤
  - `Portal Rail` / `Ops Rail` / `Portal Tabs`：共用外壳组件，新页面放在同一目录即可直接引用
- `assets/`：COSX 标志、第三方登录图标

## 已确定

- 外壳：1a 图标栏 + 上下文栏；项目、站点等实体按 2a，上下文栏换成实体菜单
- 菜单最多两层；实体切换器在实体菜单顶部；实体设置在实体菜单底部
- 操作栏：全局浮动组件，按状态切换（空闲 / 选择 / 模式），克制；响应式依次去掉快捷键、文字，最后收成左缘把手
- 查看器：浮动操作栏，模式是操作栏的一个状态
- 文档：第二栏为视图 + 文件夹树，内容区卡片 / 列表
- 状态：填充 = 需要人处理，描边 = 进行中，圆点 = 已知状态；只用黄、墨、一种红
- 品牌：MetaRoom 默认用 COSX 线圈标志黄色方块；客户品牌通过 `--brand-field` / `--brand-mark` 注入，文字始终用墨色

## 待定

- 完成类状态是否保留绿色（当前为墨色点）
- Lucide 是否正式作为图标库
- 客户品牌资产规格（浅 / 深 logo、方块、字标）
- 深色主题逐页检查，是否纳入第一版
- 顶栏铃铛与 Ops 收件箱是否合并
- 产品名称写 MetaRoom 还是 COSX
- 第三方登录图标换成官方文件；Microsoft 按钮文案

## 下拉菜单的展开方向

- 规则：触发器下方的空间小于菜单高度 + 12px，且上方空间更大时，向上展开；否则向下。
- 目前 COSX 设计系统的 Select 只会向下展开。临时方案是 `assets/ds-patches.js`：所有页面都已加载，自动生效。它同时修复黄底元素在深色模式下文字变浅的问题。
- 长期方案（已同意，见 `ui-spec/proposals/select-placement.md`）：在设计系统的 Select 里加入 `placement="auto" | "top" | "bottom"`（默认 auto），并同样用于 Popover、菜单和 Tooltip。

## 主题

- 三档：跟随系统（默认）、浅色、深色。跟随系统时监听 prefers-color-scheme，系统切换后页面即时跟随。
- 控件：右上角三段图标切换（显示器 / 太阳 / 月亮）。
