import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
    themeMode: 'light' | 'dark';
    onToggleTheme: () => void;
}

export default function Header({ themeMode, onToggleTheme }: HeaderProps) {
    return (
        <header className="glass flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-[100]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center bg-[#0066cc] dark:bg-[#0a84ff] shadow-[0_2px_8px_rgba(0,102,204,0.25)] dark:shadow-[0_2px_12px_rgba(10,132,255,0.25)]">
                    <span className="text-white dark:text-white font-bold text-sm">W</span>
                </div>
                <span className="font-bold text-lg tracking-tight text-black dark:text-white">WeType<span className="hidden sm:inline"> - 微信公众号排版工具</span></span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onToggleTheme}
                    className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                    title={themeMode === 'light' ? '切换暗色模式' : '切换亮色模式'}
                >
                    {themeMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
            </div>
        </header>
    );
}
