import { useEffect, useState } from "react";
import { commands } from "@/bindings";
import { Button } from "@/components/ui/button";
import type { useTheme } from "@/hooks/use-theme";
import { useProjectStore } from "@/stores/project-store";

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
	const selectedProject = useProjectStore((s) => s.selectedProject);
	const title = selectedProject?.name ?? "Submarine";

	const [port, setPort] = useState<number | null>(null);
	useEffect(() => {
		commands.getSocketPort().then(setPort);
	}, []);

	return (
		<header
			data-tauri-drag-region
			className="flex items-center justify-between flex-1 h-full px-4 bg-background"
		>
			<h1 data-tauri-drag-region className="text-sm font-semibold select-none">
				{title}
			</h1>

			<div className="flex items-center gap-2">
				{port !== null && (
					<span className="flex items-center gap-2.5 rounded-md border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground select-none">
						<span className="relative flex size-2">
							<span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75" />
							<span className="relative inline-flex size-2 rounded-full bg-green-500" />
						</span>
						http://localhost:{port}
					</span>
				)}
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
