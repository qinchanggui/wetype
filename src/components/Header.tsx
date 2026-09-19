export default function Header() {
    return (
        <header className="glass flex items-center justify-between px-4 sm:px-6 h-14 sticky top-0 z-[100]">
            <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-b from-[#0a84ff] to-[#0057d2] shadow-[0_1px_3px_rgba(0,90,220,0.35),0_4px_10px_-2px_rgba(0,102,204,0.3)] ring-1 ring-inset ring-white/25">
                    <span className="text-white font-bold text-[15px] leading-none tracking-tight">W</span>
                </div>
                <span className="font-semibold text-[15px] tracking-tight text-[#1d1d1f] leading-none pt-px">WeType</span>
                <span className="hidden sm:inline text-[13px] text-[#86868b] font-normal leading-none pt-px"> - 微信公众号排版工具</span>
            </div>
        </header>
    );
}
