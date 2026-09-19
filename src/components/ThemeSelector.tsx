import { THEMES } from '../lib/themes';
import type { Theme } from '../lib/themes';

interface ThemeSelectorProps {
    activeTheme: string;
    onThemeChange: (themeId: string) => void;
}

// 仅用于 UI 展示的主题品牌色：从各主题自身样式中提取第一个色彩值（strong → h1 → a）
function getThemeAccent(theme: Theme): string {
    for (const key of ['strong', 'h1', 'a'] as const) {
        const style = theme.styles[key] ?? '';
        const match = style.match(/#[0-9a-fA-F]{3,8}/);
        if (match) return match[0];
    }
    return '#1d1d1f';
}

export default function ThemeSelector({ activeTheme, onThemeChange }: ThemeSelectorProps) {
    const selectedTheme = THEMES.find(t => t.id === activeTheme);

    return (
        <div className="flex items-center flex-wrap gap-2 lg:gap-4 px-4 lg:px-6 py-3 border-r border-transparent md:border-[#00000012] shrink-0">
            <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-widest hidden xl:block shrink-0">排版风格</span>

            <div className="flex items-center gap-1 bg-[#00000008] p-1 rounded-full shrink-0">
                {THEMES.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        className={`flex items-center gap-1.5 h-8 px-3.5 rounded-full text-[13px] transition-all duration-200 ${activeTheme === theme.id
                            ? 'bg-white text-[#1d1d1f] font-semibold shadow-[0_1px_3px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)]'
                            : 'text-[#86868b] font-medium hover:text-[#1d1d1f] hover:bg-white/60'
                            }`}
                    >
                        <span
                            aria-hidden="true"
                            className="w-1.5 h-1.5 rounded-full shrink-0 ring-1 ring-black/10"
                            style={{ backgroundColor: getThemeAccent(theme) }}
                        />
                        {theme.name.split(' ')[0]}
                    </button>
                ))}
            </div>

            {/* Theme description */}
            <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-[#00000015] min-w-0">
                <p className="text-[13px] text-[#86868b] font-normal tracking-tight truncate">
                    <span className="text-[#1d1d1f] font-medium mr-1 shrink-0">{selectedTheme?.name}：</span>
                    <span className="truncate">{selectedTheme?.description}</span>
                </p>
            </div>
        </div>
    );
}
