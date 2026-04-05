import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

const mockRenders = [
	{ component: "App", duration: 2.4, count: 1 },
	{ component: "Dashboard", duration: 1.8, count: 3 },
	{ component: "MetricCard", duration: 0.3, count: 12 },
	{ component: "DataTable", duration: 4.1, count: 2 },
	{ component: "ChartPanel", duration: 3.7, count: 5 },
	{ component: "Sidebar", duration: 0.1, count: 1 },
];

function durationVariant(ms: number): "default" | "secondary" | "destructive" {
	if (ms > 3) return "destructive";
	if (ms > 1.5) return "default";
	return "secondary";
}

export function RenderList() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Component</TableHead>
					<TableHead className="text-right w-24">Duration</TableHead>
					<TableHead className="text-right w-20">Renders</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{mockRenders.map((r) => (
					<TableRow key={r.component}>
						<TableCell className="font-mono text-xs">
							{"<"}
							{r.component}
							{">"}
						</TableCell>
						<TableCell className="text-right">
							<Badge variant={durationVariant(r.duration)}>
								{r.duration.toFixed(1)} ms
							</Badge>
						</TableCell>
						<TableCell className="text-right tabular-nums">{r.count}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
