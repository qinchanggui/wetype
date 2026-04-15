export const defaultContent = `# 欢迎使用 WeType

> 一款专为**微信公众号**设计的 Markdown 排版工具。写 Markdown，一键复制到公众号，格式完美保留。

## 快速开始

1. 在左侧输入或粘贴 **Markdown** 内容
2. 在顶部切换你喜欢的**排版风格**
3. 点击右上角「**复制到公众号**」按钮
4. 粘贴到公众号后台，搞定！

## 核心功能

### 魔法粘贴

直接从**飞书、Notion、Word**甚至任意网页复制富文本，粘贴瞬间自动转换为 Markdown。不需要会写 Markdown，粘贴就能用。

### 多图排版

支持多图并排网格布局，在微信中也能完美呈现：

![](https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop)
![](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop)

### 30 套主题

告别同质化白底模板，30 套精心打磨的视觉主题任你切换。试试在顶部切换「排版风格」，感受不同的排版效果。

### 一键复制

- **图片自动打包**：外链图片自动转 Base64，不会出现"此图片来自第三方"的报错
- **样式零丢失**：背景色、圆角、间距全部精准还原
- **表格不塌陷**：列表和表格在微信中排版正确

## 代码高亮

内置代码高亮，支持多种编程语言：

\`\`\`python
# Python 示例
def hello_wechat():
    \"\"\"WeType 排版引擎\"\"\"
    themes = load_themes()  # 加载 30 套主题
    for theme in themes:
        styled_html = apply_theme(markdown, theme)
        print(f\"{theme.name} 排版完成\")
    return styled_html
\`\`\`

## 引用样式

> 每套主题都有独特的引用样式。切换主题时，留意引用块的变化。

## 表格支持

| 功能 | 说明 |
|------|------|
| 魔法粘贴 | 从飞书/Notion/Word 粘贴，自动转 Markdown |
| 30 套主题 | 经典 / 潮流 / 更多风格 |
| 图片打包 | 外链图片自动 Base64，微信零报错 |
| 代码高亮 | 多语言语法高亮 |
| 多端预览 | 手机 / 平板 / 桌面三种视图 |
| 导出 | 支持 PDF 和 HTML 导出 |

---

**提示**：清空以上内容，开始你的创作。
`;
