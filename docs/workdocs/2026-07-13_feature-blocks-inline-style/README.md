# @cosxai/blocks v0.6.0 — 数据驱动样式

**Branch**: `feature/blocks-inline-style-v0.6`
**Created**: 2026-07-13
**Status**: In Progress
**Related plans**: `/Users/benjamin/.claude/plans/mesh-golang-sso-peppy-teapot.md`（本地 plan file，非仓库路径）

## Overview

改造 @cosxai/blocks 从"输出 Tailwind className"到"输出 inline style"。

**动机**：htmlproc（mesh 侧 PDF 渲染服务）没有 Tailwind CSS bundle，Chromium 拿到的 HTML 里 arbitrary Tailwind 类（`text-[9px]`、`tracking-[0.2em]`）全部 no-op → 下载出的 PDF 视觉塌成裸 HTML。

**方案**：BlockRenderer 直接输出 `style={...}` 而不是 `className="..."`。任何 renderer（SPA / htmlproc / 未来第三方）装了 @cosxai/blocks 就能独立渲染，不依赖外部 CSS bundle。

**新增**：Cascade 模型 —— `block.style` > `docStyle[block.type]` > `INTERNAL_DEFAULTS[block.type]`。让 doc 数据可以携带 per-doc 主题（doc-level），单个 block 可以局部覆盖（block-level）。

## Cross-repo scope

- **product-design（本 repo）**：@cosxai/blocks v0.6.0 breaking release
- **product-mesh**: `feature/block-doc-style-cascade` 加 `documents.draft_style` + `document_commits.style` + htmlproc bump
- **product-meta**: `feature/block-doc-style-cascade` bump blocks 版本 + 删 `@source` + 加 DocStyleEditorPanel

## Implementation

### Phase 1 · 基础

- [ ] `src/styles.ts`（**新**）：`BlockStyle`（CSSProperties 白名单子集）、`DocStyle`、`INTERNAL_DEFAULTS`（20 个 block type 默认样式）、`resolveStyle(block, docStyle) → CSSProperties`。runtime 剥离黑名单属性（`position: fixed`、`transform`、`z-index`）避免破坏 consumer 的 DocumentWatermark。
- [ ] `src/blocks.ts`：`BaseBlock` 加 `style?: BlockStyle`。20 个具体 block 因此自动获得可选 style override。

### Phase 2 · Renderer 重构

- [ ] `src/BlockRenderer.tsx`：全部 20 个 block type 分支 `className: "..."` 改成 `style={resolveStyle(block, docStyle)}`。逐一从原类名翻译等价 CSSProperties 到 `INTERNAL_DEFAULTS`。
- [ ] `BlockList` 接受可选 `docStyle?: DocStyle` prop 并向下传给每个 BlockRenderer。
- [ ] `BlockRenderer` 接受可选 `docStyle?: DocStyle` prop。

### Phase 3 · 公开面

- [ ] `src/index.ts`：新增 export `BlockStyle`, `DocStyle`, `INTERNAL_DEFAULTS`, `resolveStyle`。
- [ ] `package.json`：`version 0.5.0 → 0.6.0`。
- [ ] `README.md`：更新 0.5.0 → 0.6.0 迁移 notes（0.5.0 里那段 Slide/Doc/BrandProvider 的过时描述一并清理）。

### Phase 4 · 测试基础

**推迟到 follow-up**：monorepo 目前没有 vitest 基础设施，新装 vitest + @testing-library + jsdom + config 需要仓库级 setup（devDep + workflow）。本 PR 靠：
- @cosxai/blocks TypeScript strict 类型 gate
- product-meta 侧 BlockDocViewer 端到端 smoke（Deliverable 3）
- product-mesh 侧 htmlproc PDF 视觉 smoke（Deliverable 2）

Follow-up：新开 `chore/blocks-vitest-harness` 分支加 vitest 基础 + resolveStyle / stripBlacklisted / cascade 单测。

### Phase 5 · Publish

- [ ] `pnpm build && pnpm test && pnpm typecheck` 全绿
- [ ] Commit + push + PR
- [ ] Merge 后 tag `blocks-v0.6.0` → npm publish workflow 自动 Trusted Publishing

## Technical Decisions

**D1 · Cascade 优先级**：`block.style > docStyle[type] > INTERNAL_DEFAULTS[type]`。三层任一缺失可用，老 doc 无 style 数据也能画出跟今天完全一样的视觉（走 INTERNAL_DEFAULTS）。

**D2 · Style shape = CSSProperties 白名单**：不做语义 tokens（`fontSize: "h1"` 那种），直接 CSS values。TS 允许全 CSSProperties，runtime `resolveStyle` 剥离黑名单（防 `position: fixed`、`transform` 破坏 consumer 的 fixed containing block）。

**D3 · 颜色保留 var(--ck-accent, #hex)**：INTERNAL_DEFAULTS 内 accent 相关值用 `var(--ck-accent, #4f46e5)` 形式。SPA BrandProvider 写 :root → workspace 主色跟着变；htmlproc 无 :root → 回退到 hex 兜底；第三方 renderer 什么都不用配也能出。

**D4 · 不做黑白 tokens**：`text-zinc-500` 这类直接翻译成 `color: '#71717a'` 硬编码。未来如果要做 dark theme 支持，可以升级成语义 tokens，但当前范围外。

## Risks

1. **无既有测试基础** —— 20 个 block type 不可能测全。Deliverable 1 里新建 harness，覆盖代表性 4 个 block × 3 层 cascade + 黑名单剥离。SPA + htmlproc 端到端 smoke 兜底。
2. **INTERNAL_DEFAULTS 视觉回归风险** —— 逐一翻译 className 到 CSSProperties 容易漏。SPA 测试环境 vs prod 视觉 diff 是最终 gate。
3. **breaking API 版本发布顺序** —— npm publish 必须先，否则 mesh + SPA 的 PR 拉不到 0.6.0。所以本 repo PR 先合、tag、npm publish 完成后另外两个 repo 才能开工。

## References

- Full plan: `/Users/benjamin/.claude/plans/mesh-golang-sso-peppy-teapot.md`
- Consumers: `product-mesh/cmd/htmlproc/renderer.mjs`, `product-meta/web/src/components/block-doc/BlockDocViewer.tsx`
- 前置 PR：product-meta#82（block_doc 下载路径统一，已合），product-mesh#127（同上，已合）
