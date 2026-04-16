export default function Header() {
    return (
        <header className="glass flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-[100]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[#0066cc] shadow-[0_2px_8px_rgba(0,102,204,0.25)]">
                    <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-black">WeType<span className="hidden sm:inline"> - 微信公众号排版工具</span></span>
            </div>
        </header>
    );
}
