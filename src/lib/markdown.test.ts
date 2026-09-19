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

    it('glues the strong-to-text boundary with a word joiner', async () => {
        const final = await renderForWeChat('- **2 倍档**：AI 替我完成日常编码，我负责审核和修改；');

        expect(final).toMatch(/<\/strong>\u2060AI/);
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
});
