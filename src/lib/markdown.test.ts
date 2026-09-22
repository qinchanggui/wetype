import { describe, expect, it } from 'vitest';
import { applyTheme, md, postProcessHtml, preprocessMarkdown } from './markdown';
import { makeWeChatCompatible } from './wechatCompat';

function renderMarkdown(markdown: string) {
    return md.render(preprocessMarkdown(markdown));
}

async function renderForWeChat(markdown: string) {
    return makeWeChatCompatible(applyTheme(postProcessHtml(renderMarkdown(markdown)), 'sspai'), 'sspai');
}

describe('preprocessMarkdown', () => {
    it('keeps bold rendering intact next to trailing punctuation', () => {
        const html = renderMarkdown('2025年初，伦敦黄金市场的一个月拆借利率一度升至**5%**。');

        expect(html).toContain('<strong>5%</strong>。');
        expect(html).not.toContain('**5%**');
    });

    it('repairs bold segments that start with a symbol and attach to previous text', () => {
        const html = renderMarkdown('利率变化至**-5%**。');
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const strong = doc.querySelector('strong');

        expect(strong?.textContent?.replace(/\u200B/g, '')).toBe('-5%');
    });

    it('does not merge separate bold blocks across blank lines', () => {
        const html = renderMarkdown('**5 %**\n\n**5%**');
        const doc = new DOMParser().parseFromString(html, 'text/html');

        expect(doc.querySelectorAll('strong')).toHaveLength(2);
    });
});

describe('WeChat output hygiene (zero-width chars)', () => {
    it('emits no zero-width spaces in the final clipboard HTML', async () => {
        const final = await renderForWeChat('- **2 倍档**：AI 替我完成日常编码，我负责审核和修改；');

        expect(final).not.toContain('\u200B');
    });

    it('keeps absorbed CJK punctuation inside strong without invisible chars', async () => {
        const final = await renderForWeChat('- **2 倍档**：AI 替我完成日常编码，我负责审核和修改；');
        const doc = new DOMParser().parseFromString(final, 'text/html');
        const strong = doc.querySelector('li strong');

        expect(strong?.textContent).toBe('2 倍档：');
    });

    it('emits well-formed style attributes (no leading/duplicated semicolons)', async () => {
        const final = await renderForWeChat('- **2 倍档**：AI 替我完成日常编码，我负责审核和修改；');
        const doc = new DOMParser().parseFromString(final, 'text/html');

        const styled = Array.from(doc.querySelectorAll('[style]'));
        expect(styled.length).toBeGreaterThan(0);
        for (const el of styled) {
            const style = el.getAttribute('style') || '';
            expect(style.startsWith(';')).toBe(false);
            expect(style.includes(';;')).toBe(false);
            expect(style.trim().length).toBeGreaterThan(0);
        }
    });

    it('wraps inline-only list items in a p (WeChat native li structure)', async () => {
        const final = await renderForWeChat('- **2 倍档**：AI 替我完成日常编码，我负责审核和修改；');
        const doc = new DOMParser().parseFromString(final, 'text/html');
        const li = doc.querySelector('li');
        const wrapper = li?.querySelector('p') ?? null;

        // exactly one wrapper p, holding the whole inline run
        expect(li?.querySelectorAll('p')).toHaveLength(1);
        expect(wrapper?.textContent).toBe('2 倍档：AI 替我完成日常编码，我负责审核和修改；');
        // strong survives inside the wrapper with its theme style
        const strong = wrapper?.querySelector('strong');
        expect(strong?.textContent).toBe('2 倍档：');
        expect(strong?.getAttribute('style')).toContain('font-weight: 700');
        // wrapper must not add vertical space inside the list item
        expect(wrapper?.getAttribute('style')).toMatch(/margin:\s*0/);
    });
});

describe('XSS sanitization (DOMPurify in postProcessHtml)', () => {
    it('strips event handlers from raw HTML img tags', () => {
        const html = postProcessHtml(md.render('<img src=x onerror="alert(1)">'));
        expect(html).not.toContain('onerror');
    });

    it('strips inline script blocks', () => {
        const html = postProcessHtml(md.render('hello <script>alert(1)</script> world'));
        expect(html).not.toContain('<script');
        expect(html).toContain('hello');
    });

    it('strips svg onload handlers', () => {
        const html = postProcessHtml(md.render('<svg onload="alert(1)"></svg>'));
        expect(html.toLowerCase()).not.toContain('onload');
    });

    it('keeps data: image URIs (magic-paste screenshots)', () => {
        const html = postProcessHtml(md.render('![shot](data:image/png;base64,iVBORw0KGgo=)'));
        expect(html).toContain('data:image/png;base64,iVBORw0KGgo=');
    });

    it('keeps inline style attributes (theming mechanism)', () => {
        const html = postProcessHtml(md.render('<span style="color: red;">红</span>'));
        expect(html).toContain('color: red');
    });
});

describe('applyTheme', () => {
    it('groups consecutive standalone images into an image grid', () => {
        const html = '<p><img src="a.png" /></p><p><img src="b.png" /></p>';
        const themed = applyTheme(html, 'apple');
        const doc = new DOMParser().parseFromString(themed, 'text/html');
        const grid = doc.querySelector('.image-grid');

        expect(grid).not.toBeNull();
        expect(grid?.querySelectorAll('img')).toHaveLength(2);
    });

    it('keeps highlighted comments non-italic for apple', () => {
        const rawHtml = renderMarkdown('```javascript\n// 中文注释\nconst raphael = 1;\n```');
        const themed = applyTheme(rawHtml, 'apple');
        const doc = new DOMParser().parseFromString(themed, 'text/html');
        const code = doc.querySelector('pre code');
        const comment = doc.querySelector('.hljs-comment');

        expect(code?.getAttribute('style')).toContain('font-style: normal !important;');
        expect(code?.getAttribute('style')).toContain('white-space: pre;');
        expect(comment?.getAttribute('style')).toContain('font-style: normal;');
    });

    it('does not override block-code font inheritance', () => {
        const rawHtml = renderMarkdown('```javascript\n// terminal theme\nconst raphael = 1;\n```');
        const themed = applyTheme(rawHtml, 'sspai');
        const doc = new DOMParser().parseFromString(themed, 'text/html');
        const container = doc.querySelector('body > div');
        const pre = doc.querySelector('pre');
        const code = doc.querySelector('pre code');

        expect(container?.getAttribute('style')).toContain('-apple-system');
        expect(pre?.getAttribute('style')).not.toContain('font-family:');
        expect(code?.getAttribute('style')).not.toContain('font-family:');
    });

    it('emits well-formed style attributes on the preview path too', () => {
        const themed = applyTheme(renderMarkdown('- **标签**：说明文字\n\n# 标题\n\n> 引用'), 'sspai');
        const doc = new DOMParser().parseFromString(themed, 'text/html');

        const styled = Array.from(doc.querySelectorAll('[style]'));
        expect(styled.length).toBeGreaterThan(0);
        for (const el of styled) {
            const style = el.getAttribute('style') || '';
            expect(style.startsWith(';')).toBe(false);
            expect(style.includes(';;')).toBe(false);
            expect(style.trim().length).toBeGreaterThan(0);
        }
    });
});

describe('golden fixture: WeChat regression invariants', () => {
    const ARTICLE = `# 标题：冒号测试

大多数人停在 1~2 倍，**差距不在模型，而在一个词**：Harness。

## 二级标题：路线图

- **2 倍档**：AI 替我完成日常编码，我负责审核和修改；
- **5 倍档**：AI 替我跑完整个研发流程，我只把关关键代码；

1. **运行与组合层**：插件、配置、CLI 接入；
2. **会话与状态层**：会话数据、持久化。

> 引用块里的**加粗**与文字。

\`\`\`javascript
// 注释
const x = 1;
\`\`\`
`;

    it('keeps every WeChat hardening invariant through the full pipeline', async () => {
        const final = await renderForWeChat(ARTICLE);

        // 1. no zero-width break-opportunity characters survive
        expect(final).not.toContain('\u200B');

        // 2. all style attributes are valid CSS (no leading/duplicated semicolons)
        const doc = new DOMParser().parseFromString(final, 'text/html');
        for (const el of Array.from(doc.querySelectorAll('[style]'))) {
            const style = el.getAttribute('style') || '';
            expect(style.startsWith(';')).toBe(false);
            expect(style.includes(';;')).toBe(false);
        }

        // 3. list items are wrapped in WeChat's native li>p structure
        const listItems = Array.from(doc.querySelectorAll('li'));
        expect(listItems.length).toBeGreaterThanOrEqual(4);
        for (const li of listItems) {
            expect(li.querySelector('p')).not.toBeNull();
        }

        // 4. bold labels keep their styling with CJK punctuation absorbed
        const strongs = Array.from(doc.querySelectorAll('li strong'));
        expect(strongs.map(s => s.textContent)).toContain('2 倍档：');
        expect(strongs.every(s => (s.getAttribute('style') || '').includes('font-weight: 700'))).toBe(true);

        // 5. paragraph-level bold survives untouched
        const paragraphStrong = Array.from(doc.querySelectorAll('p strong'))
            .find(s => s.textContent?.includes('差距不在模型'));
        expect(paragraphStrong).toBeTruthy();

        // 6. code highlighting still works with the curated language set
        expect(doc.querySelector('.hljs-comment')).not.toBeNull();
    });

    it('separates inherited declarations from theme styles (headings keep full style on WeChat paste)', async () => {
        const final = await renderForWeChat(ARTICLE);
        const doc = new DOMParser().parseFromString(final, 'text/html');

        // Every declaration must be well-formed: one property + one value.
        // A second property-like token inside a value means two declarations
        // were merged without a ';' separator — invalid CSS that browsers
        // drop silently in preview but WeChat's paste sanitizer chokes on.
        for (const el of Array.from(doc.querySelectorAll('[style]'))) {
            const style = el.getAttribute('style') || '';
            for (const decl of style.split(';')) {
                const trimmed = decl.trim();
                if (!trimmed) continue;
                const colon = trimmed.indexOf(':');
                expect(colon).toBeGreaterThan(0);
                expect(trimmed.slice(0, colon).trim()).toMatch(/^[a-zA-Z-]+$/);
                expect(trimmed.slice(colon + 1)).not.toMatch(/(?:^|\s)[a-z-]{2,}\s*:/);
            }
        }

        // The h1 keeps its last theme declaration and the inherited font-family
        // as two separate declarations (the old bug glued them together).
        const h1Style = doc.querySelector('h1')?.getAttribute('style') || '';
        expect(h1Style).toContain('letter-spacing: -0.01em');
        expect(h1Style).toContain('font-family: -apple-system');
        expect(h1Style).not.toContain('letter-spacing: -0.01em font-family');

        // Same invariant on h2 (border-left is its last theme declaration).
        const h2 = doc.querySelector('h2');
        const h2Style = h2?.getAttribute('style') || '';
        expect(h2).not.toBeNull();
        expect(h2Style).not.toContain('border-left: 4px solid #d71a1b font-family');
        expect(h2Style).toContain('font-family: -apple-system');
    });
});
