import "./app.css";
import { Outlet } from "react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useResize } from "@/hooks/use-resize";
import { useTheme } from "@/hooks/use-theme";
import { Header } from "./components/header";
import { ResizeHandle } from "./components/resize-handle";
import { Sidebar } from "./components/sidebar";

const SIDEBAR_MIN = 176;
const SIDEBAR_MAX = 308;

function App() {
	const { theme, setTheme } = useTheme();
	const { width: sidebarWidth, handleProps } = useResize(
		SIDEBAR_MIN,
		SIDEBAR_MAX,
		(SIDEBAR_MIN + SIDEBAR_MAX) / 2,
	);

	return (
		<TooltipProvider>
			<div className="flex flex-col h-screen overflow-hidden">
				<div
					data-tauri-drag-region
					className="flex items-center h-11 shrink-0 border-b"
				>
					<div
						data-tauri-drag-region
						className="shrink-0 border-r h-full"
						style={{ width: sidebarWidth }}
					/>
					<Header theme={theme} onThemeChange={setTheme} />
				</div>

				<div className="flex flex-1 min-h-0">
					<Sidebar width={sidebarWidth} />
					<ResizeHandle {...handleProps} />

					<main className="flex-1 overflow-y-auto">
						<Outlet />
					</main>
				</div>
			</div>
		</TooltipProvider>
	);
}

export default App;
