import "./app.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useResize } from "@/hooks/use-resize";
import { useTheme } from "@/hooks/use-theme";
import { Header } from "./components/header";
import { MetricCard } from "./components/metric-card";
import { RenderList } from "./components/render-list";
import { ResizeHandle } from "./components/resize-handle";
import { Sidebar } from "./components/sidebar";
import { Timeline } from "./components/timeline";

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

					<main className="flex-1 overflow-y-auto p-4 space-y-4">
						<div className="grid grid-cols-4 gap-3">
							<MetricCard
								label="Total Renders"
								value="24"
								description="+12% vs last session"
							/>
							<MetricCard
								label="Avg Render Time"
								value="2.1"
								unit="ms"
								description="-0.4ms improvement"
							/>
							<MetricCard label="Unnecessary Renders" value="7" />
							<MetricCard label="Component Count" value="18" />
						</div>

						<Tabs defaultValue="renders">
							<TabsList>
								<TabsTrigger value="renders">Component Renders</TabsTrigger>
								<TabsTrigger value="timeline">Timeline</TabsTrigger>
							</TabsList>
							<TabsContent value="renders">
								<Card>
									<CardHeader>
										<CardTitle className="text-sm">Render Activity</CardTitle>
									</CardHeader>
									<CardContent>
										<RenderList />
									</CardContent>
								</Card>
							</TabsContent>
							<TabsContent value="timeline">
								<Card>
									<CardHeader>
										<CardTitle className="text-sm">Render Timeline</CardTitle>
									</CardHeader>
									<CardContent>
										<Timeline />
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</main>
				</div>
			</div>
		</TooltipProvider>
	);
}

export default App;
