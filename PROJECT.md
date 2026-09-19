# WeType - 微信公众号排版工具

## 项目概述
- 类型：微信公众号 Markdown 排版工具
- 基础项目：raphael-publish（开源，二次开发）
- 技术栈：React + TypeScript + Vite + TailwindCSS
- 部署：Vercel（GitHub main 推送自动部署）
- 仓库：https://github.com/qinchanggui/wetype
- 状态：v1.0.20，极简版 + 稳定性/安全/性能/视觉四轮加固完成

## 定位
极简微信排版工具，专注"写 → 排 → 复制"三步流程。
与桂哥AI品牌联动，作为内容创作配套工具。

## 当前主题（3个，活跃于 src/lib/themes/modern.ts）
1. sspai 少数派 — 红色标识，默认选中
2. wechat 微信原生 — 官方绿
3. apple Mac — 纯净现代

（历史 26 套主题与 Claude/Notion 等已随 archive 目录清理，git 历史可找回；如需恢复主题，从 themes/archive 的历史版本移植进 modern.ts 即可）

## 已完成
- [x] 2026-04-15：项目初始化，clone raphael-publish
- [x] 2026-04-16：部署到 Vercel；安全审查（CSP 头）；极简版重构（26→5 主题、去设备框架/PDF导出/暗色模式，JS -45%）
- [x] 2026-09-19：微信粘贴断行根治（v1.0.15-17）
  - 剥离 U+200B 零宽字符（Unicode 断行机会字符）
  - style 属性规范化（消除前导分号/双分号的非法 CSS）
  - 列表项内容包裹 `<p>` 对齐微信原生 li 结构（关键修复：li 内加粗丢失+断行）
  - 真机验证通过
- [x] 2026-09-19：安全加固（v1.0.18）
  - DOMPurify 接入渲染管线，修复粘贴富文本 XSS（onerror/svg onload 剥离，data: 图片保留）
  - CSP 放开任意图床（img-src/connect-src），修复"外链图转 Base64"核心承诺失效
  - 去掉 script-src 'unsafe-inline'
- [x] 2026-09-19：性能（v1.0.18）highlight.js 全量→core+17 语言，JS 1335KB→512KB（-62%）
- [x] 2026-09-19：UI 视觉质感升级（v1.0.19）：CJK 字体系统、Header/工具栏层次、渐变徽标、CTA 三层阴影、主题品牌色点、focus-visible 焦点环、prefers-reduced-motion、清理 ~200 行死 CSS
- [x] 2026-09-20：仓库卫生与工程加固（v1.0.20）
  - 删除死代码：src/lib/archive/（8 文件）、themes/archive/（3）、extra.ts、indexerRules.ts、vite.config.js/.d.ts（tsc 排泄物）
  - 卸载死依赖 jspdf；包名 raphael-publish→wetype
  - applyTheme 源头样式拼接修复（joinStyles，预览路径同样产出合法 CSS）
  - golden fixture 回归测试：微信加固不变量（无零宽字符/合法 style/li>p 结构/加粗存活/代码高亮）本地可拦截

## 测试
- `pnpm test`：17 个单测（微信管线不变量 + XSS 消毒 + 主题渲染 + golden fixture）
- CI：lint + test + build（GitHub Actions，每次推送）

## 待做（需外部凭据，按需启动）
- [ ] 可选：AI 辅助写作集成（需 LLM API Key）
- [ ] 可选：多图床支持（需图床账号/Token；CSP 已就绪）
- [ ] 可选：一键发布草稿到公众号 API（需公众号 AppID/Secret）

## 运维备忘
- 两枚曾暴露于聊天记录的 GitHub PAT 应保持已轮换状态
- 本地开发：pnpm install && pnpm dev；测试：pnpm test
