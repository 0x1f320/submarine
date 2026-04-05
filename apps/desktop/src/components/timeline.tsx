import { Badge } from "@/components/ui/badge";

const mockEvents = [
	{ time: "0ms", label: "mount", component: "App", width: "100%" },
	{ time: "12ms", label: "render", component: "Dashboard", width: "85%" },
	{ time: "14ms", label: "render", component: "MetricCard", width: "15%" },
	{ time: "15ms", label: "render", component: "MetricCard", width: "12%" },
	{ time: "18ms", label: "render", component: "DataTable", width: "60%" },
	{ time: "26ms", label: "effect", component: "DataTable", width: "40%" },
];

export function Timeline() {
	return (
		<div className="space-y-1.5">
			{mockEvents.map((event) => (
				<div
					key={`${event.time}-${event.component}`}
					className="flex items-center gap-3 group"
				>
					<span className="text-[11px] tabular-nums text-muted-foreground w-10 text-right shrink-0">
						{event.time}
					</span>
					<div className="flex-1 flex items-center gap-2">
						<div
							className="h-6 rounded-md bg-primary/10 group-hover:bg-primary/15 transition-colors flex items-center px-2"
							style={{ width: event.width, minWidth: "fit-content" }}
						>
							<span className="text-[11px] font-mono text-foreground truncate">
								{event.component}
							</span>
						</div>
						<Badge variant="outline" className="text-[10px] shrink-0">
							{event.label}
						</Badge>
					</div>
				</div>
			))}
		</div>
	);
}
