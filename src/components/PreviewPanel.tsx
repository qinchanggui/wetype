import React, { useEffect, useRef } from 'react';

interface PreviewPanelProps {
    renderedHtml: string;
    previewRef: React.MutableRefObject<HTMLDivElement | null>;
    previewScrollRef: React.RefObject<HTMLDivElement>;
    onPreviewScroll: () => void;
    scrollSyncEnabled: boolean;
}

export default function PreviewPanel({
    renderedHtml,
    previewRef,
    previewScrollRef,
    onPreviewScroll,
    scrollSyncEnabled,
}: PreviewPanelProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!previewRef || !contentRef.current) return;
        previewRef.current = contentRef.current;
    }, [previewRef]);

    return (
        <div
            ref={previewScrollRef}
            data-testid="preview-scroll"
            onScroll={scrollSyncEnabled ? onPreviewScroll : undefined}
            className="relative overflow-y-auto no-scrollbar bg-[#f2f2f7]/50 flex flex-col z-20 w-full overflow-x-hidden"
        >
            <div className="mt-12 mb-32 ml-4 md:ml-6 mr-auto w-[640px] max-w-[95%] h-fit">
                <div className="bg-white rounded-[24px] overflow-hidden shadow-apple-lg ring-1 ring-[#00000008] border-t border-white/50 w-full">
                    <div
                        ref={contentRef}
                        data-testid="preview-content"
                        dangerouslySetInnerHTML={{ __html: renderedHtml }}
                        className="preview-content min-w-full"
                    />
                </div>
            </div>
        </div>
    );
}
