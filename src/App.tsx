import { useEffect, useState, useRef } from 'react';
import { PenLine, Eye } from 'lucide-react';
import { md, preprocessMarkdown, applyTheme } from './lib/markdown';
import { makeWeChatCompatible, cleanInternalAttributes } from './lib/wechatCompat';
import { defaultContent } from './defaultContent';
import Header from './components/Header';
import ThemeSelector from './components/ThemeSelector';
import Toolbar from './components/Toolbar';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';

export default function App() {
    const [markdownInput, setMarkdownInput] = useState<string>(() => {
        const saved = localStorage.getItem('wetype-draft');
        return saved || defaultContent;
    });
    const [renderedHtml, setRenderedHtml] = useState<string>('');
    const [activeTheme, setActiveTheme] = useState<string>('sspai');
    const [copied, setCopied] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [activePanel, setActivePanel] = useState<'editor' | 'preview'>('editor');
    const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
    const previewRef = useRef<HTMLDivElement>(null);
    const editorScrollRef = useRef<HTMLTextAreaElement>(null);
    const previewScrollRef = useRef<HTMLDivElement>(null);
    const scrollSyncLockRef = useRef<'editor' | 'preview' | null>(null);
    const scrollLockReleaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Auto-save draft
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem('wetype-draft', markdownInput);
        }, 500);
        return () => clearTimeout(timeout);
    }, [markdownInput]);

    // Core rendering
    useEffect(() => {
        const rawHtml = md.render(preprocessMarkdown(markdownInput));
        const styledHtml = applyTheme(rawHtml, activeTheme);
        setRenderedHtml(styledHtml);
    }, [markdownInput, activeTheme]);

    // Scroll sync cleanup
    useEffect(() => {
        scrollSyncLockRef.current = null;
        if (scrollLockReleaseTimeoutRef.current) {
            clearTimeout(scrollLockReleaseTimeoutRef.current);
            scrollLockReleaseTimeoutRef.current = null;
        }
    }, []);

    const syncScrollPosition = (
        sourceElement: HTMLElement,
        targetElement: HTMLElement,
        sourcePanel: 'editor' | 'preview'
    ) => {
        if (!scrollSyncEnabled) return;
        if (scrollSyncLockRef.current && scrollSyncLockRef.current !== sourcePanel) return;

        const sourceMaxScroll = sourceElement.scrollHeight - sourceElement.clientHeight;
        const targetMaxScroll = targetElement.scrollHeight - targetElement.clientHeight;
        if (sourceMaxScroll <= 0) {
            targetElement.scrollTop = 0;
            return;
        }

        const scrollRatio = sourceElement.scrollTop / sourceMaxScroll;
        scrollSyncLockRef.current = sourcePanel;
        targetElement.scrollTop = scrollRatio * Math.max(targetMaxScroll, 0);

        if (scrollLockReleaseTimeoutRef.current) {
            clearTimeout(scrollLockReleaseTimeoutRef.current);
        }
        scrollLockReleaseTimeoutRef.current = setTimeout(() => {
            if (scrollSyncLockRef.current === sourcePanel) {
                scrollSyncLockRef.current = null;
            }
            scrollLockReleaseTimeoutRef.current = null;
        }, 50);
    };

    const handleEditorScroll = () => {
        const editorElement = editorScrollRef.current;
        const previewElement = previewScrollRef.current;
        if (!editorElement || !previewElement) return;
        syncScrollPosition(editorElement, previewElement, 'editor');
    };

    const handlePreviewScroll = () => {
        const previewElement = previewScrollRef.current;
        const editorElement = editorScrollRef.current;
        if (!previewElement || !editorElement) return;
        syncScrollPosition(previewElement, editorElement, 'preview');
    };

    const handleCopy = async () => {
        if (!previewRef.current) return;
        setIsCopying(true);
        try {
            const finalHtmlForCopy = await makeWeChatCompatible(renderedHtml, activeTheme);

            const blob = new Blob([finalHtmlForCopy], { type: 'text/html' });
            const textBlob = new Blob([previewRef.current.innerText], { type: 'text/plain' });

            const clipboardItem = new ClipboardItem({
                'text/html': blob,
                'text/plain': textBlob
            });
            await navigator.clipboard.write([clipboardItem]);

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed', err);
            alert('复制格式失败，请检查浏览器剪贴板权限');
        } finally {
            setIsCopying(false);
        }
    };

    const handleExportHtml = () => {
        const cleanHtml = cleanInternalAttributes(renderedHtml);
        const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `WeType_Article_${new Date().getTime()}.html`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Word/paragraph count
    const wordCount = markdownInput.replace(/\s/g, '').length;
    const charCount = markdownInput.length;
    const paragraphCount = markdownInput.split(/\n\s*\n/).filter(p => p.trim()).length;

    return (
        <div className="flex flex-col h-screen overflow-hidden antialiased bg-[#fbfbfd] transition-colors duration-300">

            <Header />

            {/* 移动端 Tab 切换 */}
            <div className="md:hidden glass-toolbar flex items-center z-[90]">
                <button
                    data-testid="tab-editor"
                    onClick={() => setActivePanel('editor')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors border-b-2 ${activePanel === 'editor' ? 'text-[#0066cc] border-[#0066cc]' : 'text-[#86868b] border-transparent'}`}
                >
                    <PenLine size={15} />
                    编辑
                </button>
                <button
                    data-testid="tab-preview"
                    onClick={() => setActivePanel('preview')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-semibold transition-colors border-b-2 ${activePanel === 'preview' ? 'text-[#0066cc] border-[#0066cc]' : 'text-[#86868b] border-transparent'}`}
                >
                    <Eye size={15} />
                    预览
                </button>
            </div>

            {/* 工具栏 (桌面端) */}
            <div className="glass-toolbar hidden md:grid grid-cols-[45fr_55fr] px-0 z-[90]">
                <ThemeSelector activeTheme={activeTheme} onThemeChange={setActiveTheme} />
                <Toolbar
                    onExportHtml={handleExportHtml}
                    onCopy={handleCopy}
                    copied={copied}
                    isCopying={isCopying}
                    scrollSyncEnabled={scrollSyncEnabled}
                    onToggleScrollSync={() => setScrollSyncEnabled((prev) => !prev)}
                />
            </div>

            {/* 移动端工具栏 */}
            <div className="md:hidden glass-toolbar z-[90]">
                <div className="overflow-x-auto no-scrollbar border-b border-[#00000010]">
                    <ThemeSelector activeTheme={activeTheme} onThemeChange={setActiveTheme} />
                </div>
                <Toolbar
                    onExportHtml={handleExportHtml}
                    onCopy={handleCopy}
                    copied={copied}
                    isCopying={isCopying}
                    scrollSyncEnabled={scrollSyncEnabled}
                    onToggleScrollSync={() => setScrollSyncEnabled((prev) => !prev)}
                />
            </div>

            {/* 编辑区 & 预览区 */}
            <main className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-[45fr_55fr] relative">
                <div className={`${activePanel === 'editor' ? 'flex' : 'hidden'} md:flex flex-col overflow-hidden`}>
                    <EditorPanel
                        markdownInput={markdownInput}
                        onInputChange={setMarkdownInput}
                        editorScrollRef={editorScrollRef}
                        onEditorScroll={handleEditorScroll}
                        scrollSyncEnabled={scrollSyncEnabled}
                    />
                </div>
                <div className={`${activePanel === 'preview' ? 'flex' : 'hidden'} md:flex flex-col overflow-hidden`}>
                    <PreviewPanel
                        renderedHtml={renderedHtml}
                        previewRef={previewRef}
                        previewScrollRef={previewScrollRef}
                        onPreviewScroll={handlePreviewScroll}
                        scrollSyncEnabled={scrollSyncEnabled}
                    />
                </div>
            </main>

            {/* 状态栏 */}
            <div className="glass-toolbar flex items-center justify-center gap-6 px-4 py-1.5 text-[12px] text-[#86868b] z-[90]">
                <span>{charCount} 字符</span>
                <span>{wordCount} 字</span>
                <span>{paragraphCount} 段</span>
                <span className="ml-auto mr-0">v{__APP_VERSION__}</span>
            </div>
        </div>
    );
}
