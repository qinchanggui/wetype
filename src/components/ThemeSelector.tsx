import { THEMES } from '../lib/themes';

interface ThemeSelectorProps {
    activeTheme: string;
    onThemeChange: (themeId: string) => void;
}

export default function ThemeSelector({ activeTheme, onThemeChange }: ThemeSelectorProps) {
    const selectedTheme = THEMES.find(t => t.id === activeTheme);

    return (
        <div className="flex items-center flex-wrap gap-2 lg:gap-4 px-4 lg:px-6 py-3 border-r border-transparent md:border-[#00000015] shrink-0">
            <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-widest hidden xl:block shrink-0">排版风格</span>

            <div className="flex items-center gap-1.5 bg-[#00000008] p-1 rounded-full backdrop-blur-md shrink-0">
                {THEMES.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all ${activeTheme === theme.id
                            ? 'bg-white text-[#1d1d1f] shadow-sm'
                            : 'text-[#86868b] hover:text-[#1d1d1f]'
                            }`}
                    >
                        {theme.name.split(' ')[0]}
                    </button>
                ))}
            </div>

            {/* Theme description */}
            <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-[#00000015]">
                <p className="text-[13px] text-[#86868b] font-medium tracking-wide truncate max-w-[300px] xl:max-w-[450px]">
                    <span className="text-[#1d1d1f] font-semibold mr-1">{selectedTheme?.name}：</span>
                    {selectedTheme?.description}
                </p>
            </div>
        </div>
    );
}
