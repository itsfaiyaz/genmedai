import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() => {
                let current = theme;
                if (current === 'system') {
                    current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                setTheme(current === "dark" ? "light" : "dark");
            }}
            className="relative p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
            title="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-900 dark:text-white" />
            <Moon className="absolute top-2 left-2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-900 dark:text-white" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
