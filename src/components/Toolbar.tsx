import { Copy, CheckCircle2, Download, Loader2, Link2, Unlink2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolbarProps {
    onExportHtml: () => void;
    onCopy: () => void;
    copied: boolean;
    isCopying: boolean;
    scrollSyncEnabled: boolean;
    onToggleScrollSync: () => void;
}

export default function Toolbar({ onExportHtml, onCopy, copied, isCopying, scrollSyncEnabled, onToggleScrollSync }: ToolbarProps) {
    return (
        <div className="flex items-center justify-end px-4 sm:px-6 py-3 max-w-[1024px]">
            <div className="flex items-center gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    data-testid="scroll-sync-toggle"
                    onClick={onToggleScrollSync}
                    className={`apple-export-btn !bg-[#00000008] border-transparent ${scrollSyncEnabled ? 'text-[#0066cc]' : 'text-[#86868b]'}`}
                    title={scrollSyncEnabled ? '关闭滚动同步' : '开启滚动同步'}
                >
                    {scrollSyncEnabled ? <Link2 size={14} /> : <Unlink2 size={14} />}
                    <span className="hidden sm:inline">{scrollSyncEnabled ? '滚动同步开' : '滚动同步关'}</span>
                    <span className="sm:hidden">{scrollSyncEnabled ? '同步开' : '同步关'}</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    data-testid="export-html"
                    onClick={onExportHtml}
                    className="apple-export-btn !hidden lg:!flex !bg-[#00000008] border-transparent"
                >
                    <Download size={14} />
                    导出 HTML
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    data-testid="copy-button"
                    onClick={onCopy}
                    disabled={isCopying}
                    className={copied ? "apple-copy-btn-success apple-copy-btn" : isCopying ? "apple-copy-btn opacity-80 cursor-not-allowed" : "apple-copy-btn"}
                >
                    {copied ? <CheckCircle2 size={16} /> : isCopying ? <Loader2 className="animate-spin" size={16} /> : <Copy size={16} />}
                    <span className="hidden sm:inline">{copied ? '已复制！请贴往公众号' : isCopying ? '正在打包图片...' : '复制到公众号'}</span>
                    <span className="sm:hidden">{copied ? '已复制' : isCopying ? '打包中...' : '复制'}</span>
                </motion.button>
            </div>
        </div>
    );
}
