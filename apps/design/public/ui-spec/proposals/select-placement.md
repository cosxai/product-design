# 提案 · 浮层自动定位（Select / Popover / Menu / Tooltip）

状态：已同意，待在 COSX Design System 项目中实现。

## API
- `placement`: `'auto' | 'top' | 'bottom'`，默认 `'auto'`。Tooltip 另支持 `'left' | 'right'`。
- `offset`: 与触发器的间距，默认 6px。

## 规则
- auto：打开时测量触发器与视口。下方空间 < 菜单高度 + 12px，且上方空间更大 → 向上；否则向下。
- 两边都放不下：朝空间大的一侧展开，菜单最大高度 = 该侧空间 − 24px，内部滚动。
- 水平方向：右侧溢出时右对齐触发器。
- 打开期间滚动或窗口尺寸变化时重新计算。
- 菜单渲染到 body 层（portal），不被对话框或 overflow 裁切。
- 出入场动画方向跟随实际方向（向上展开时从下往上 settle）。

## 同时修复 · 黄底上的文字色
- Select 选中行、Tabs pills 选中项等黄底元素的文字写成了 `var(--text-primary)`，在 ink-mode 下变成亚麻色，看不见。应改为 `var(--ink)`；黄底上的次要文字用 `var(--text-on-yellow-secondary)`。

## 迁移
- 实现后删除 `assets/ds-patches.js` 以及各页面 helmet 里引用它的那行 script（site / pages / ui-spec / metaroom-auth 下所有页面，以及 `site/_gen.js`）。
