# WeType - 微信公众号排版工具

## 项目概述
- 类型：微信公众号 Markdown 排版工具
- 基础项目：raphael-publish（开源，二次开发）
- 技术栈：React + TypeScript + Vite + TailwindCSS
- 部署：Vercel（https://wetype-gtsixihk7-qinchangguis-projects.vercel.app）
- 仓库：https://github.com/qinchanggui/wetype
- 本地路径：`projects/raphael-publish`
- 状态：极简版重构中

## 定位
极简微信排版工具，专注"写 → 排 → 复制"三步流程。
与桂哥AI品牌联动，作为内容创作配套工具。

## 当前主题（5个）
1. Mac — 纯净现代，万能默认
2. Claude — 温润燕麦，AI内容创作者风格
3. 微信公众号原生 — 官方绿，稳妥之选
4. 少数派 — 中文媒体标杆，红色标识
5. Notion — 极致克制，黑白灰

## 已完成
- [x] 2026-04-15：项目初始化，clone raphael-publish
- [x] 2026-04-16：部署到 Vercel
- [x] 2026-04-16：安全审查（修复 jsPDF/DOMPurify 漏洞，添加 CSP 安全头）
- [x] 2026-04-16：极简版重构
  - 主题 26→5（归档到 `src/lib/themes/archive/`）
  - 去掉 DeviceFrame 设备框架
  - 去掉 html2pdf 导出
  - 去掉 dark mode
  - 去掉 htmlToMarkdown 反向转换
  - 去掉 markdownIndexer 点击定位
  - 新增 localStorage 草稿自动保存
  - 新增底部状态栏（字符数/字数/段落数）
  - JS 体积 2410KB → 1333KB（-45%）

## 备份位置
- 主题归档：`src/lib/themes/archive/`（classic.ts、modern.ts、extra.ts）
- 功能归档：`src/lib/archive/`（htmlToMarkdown、markdownIndexer、markdownLocator、imageSelector、DeviceFrame）

## 待做
- [ ] 推送极简版到远程仓库（待覃老师确认）
- [ ] 可选：AI 辅助写作集成
- [ ] 可选：多图床支持
- [ ] 可选：一键发布草稿到公众号 API
