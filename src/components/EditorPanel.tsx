import React from 'react';
import { Wand2 } from 'lucide-react';

interface EditorPanelProps {
    markdownInput: string;
    onInputChange: (value: string) => void;
    editorScrollRef: React.RefObject<HTMLTextAreaElement>;
    onEditorScroll: () => void;
    scrollSyncEnabled: boolean;
}

export default function EditorPanel({ markdownInput, onInputChange, editorScrollRef, onEditorScroll, scrollSyncEnabled }: EditorPanelProps) {
    return (
        <div className="border-r border-[#00000015] flex flex-col relative z-30 bg-transparent flex-1 min-h-0">
            <textarea
                ref={editorScrollRef}
                data-testid="editor-input"
                className="w-full flex-1 p-8 md:p-10 resize-none bg-transparent outline-none font-mono text-[15px] md:text-[16px] leading-[1.8] no-scrollbar text-[#1d1d1f] placeholder-[#86868b]"
                value={markdownInput}
                onChange={(e) => onInputChange(e.target.value)}
                onScroll={scrollSyncEnabled ? onEditorScroll : undefined}
                placeholder="在这里输入 Markdown 内容..."
                spellCheck={false}
            />

            <div className="flex-shrink-0 flex items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-t border-[#00000010] bg-[#fbfbfd]/50 backdrop-blur-md">
                <div className="flex items-center gap-2 min-w-0">
                    <Wand2 size={14} className="text-[#0066cc] shrink-0" />
                    <span className="text-[12.5px] font-medium text-[#1d1d1f]">
                        <span className="hidden sm:inline">支持 Markdown 语法，实时预览排版效果</span>
                        <span className="sm:hidden">Markdown 实时预览</span>
                    </span>
                </div>
            </div>
        </div>
    );
}
