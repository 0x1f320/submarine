import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { useTheme } from "@/hooks/use-theme";

type Theme = ReturnType<typeof useTheme>["theme"];

const themeIcons: Record<Theme, React.ReactNode> = {
	light: (
		<svg
			className="size-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="5" />
			<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
		</svg>
	),
	dark: (
		<svg
			className="size-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
		</svg>
	),
	system: (
		<svg
			className="size-4"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
			<path d="M8 21h8M12 17v4" />
		</svg>
	),
};

const nextTheme: Record<Theme, Theme> = {
	system: "light",
	light: "dark",
	dark: "system",
};

export function Header({
	theme,
	onThemeChange,
}: {
	theme: Theme;
	onThemeChange: (theme: Theme) => void;
}) {
	return (
		<header
			data-tauri-drag-region
			className="flex items-center justify-between flex-1 h-full px-4 bg-background"
		>
			<div className="flex items-center gap-2">
				<h1 className="text-sm font-semibold">Dashboard</h1>
				<Badge variant="secondary" className="text-xs font-normal">
					localhost:3000
				</Badge>
			</div>

			<div className="flex items-center gap-2">
				<Button size="sm" variant="default" className="h-7 gap-2.5 text-xs">
					<span className="size-1.5 rounded-full bg-current animate-pulse shrink-0" />
					Recording
				</Button>
				<Button size="sm" variant="outline" className="h-7 text-xs">
					Clear
				</Button>
				<Button
					size="icon"
					variant="ghost"
					className="size-7"
					onClick={() => onThemeChange(nextTheme[theme])}
				>
					{themeIcons[theme]}
				</Button>
			</div>
		</header>
	);
}
