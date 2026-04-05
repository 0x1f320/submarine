import { useParams } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useCommits } from "@/hooks/use-commits";

export function PageDetail() {
	const { pageId } = useParams();
	const numericPageId = Number(pageId);
	const { data: commits, isLoading } = useCommits(numericPageId);

	if (isLoading) {
		return (
			<div className="p-4 space-y-3">
				<Skeleton className="h-5 w-48 rounded" />
				<Skeleton className="h-64 w-full rounded" />
			</div>
		);
	}

	if (!commits || commits.length === 0) {
		return (
			<div className="flex items-center justify-center h-full text-sm text-muted-foreground">
				No commits yet
			</div>
		);
	}

	const totalRenders = commits.length;
	const avgTime =
		commits.reduce((sum, c) => sum + c.totalTime, 0) / totalRenders;
	const avgComponents =
		commits.reduce((sum, c) => sum + c.componentCount, 0) / totalRenders;

	return (
		<div className="p-4 space-y-4">
			<div className="grid grid-cols-3 gap-3">
				<SummaryCard label="Total Commits" value={totalRenders.toString()} />
				<SummaryCard
					label="Avg Total Time"
					value={avgTime.toFixed(1)}
					unit="ms"
				/>
				<SummaryCard
					label="Avg Components"
					value={avgComponents.toFixed(0)}
				/>
			</div>

			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-16">#</TableHead>
							<TableHead>Phase</TableHead>
							<TableHead className="text-right">Components</TableHead>
							<TableHead className="text-right">Total Time</TableHead>
							<TableHead className="text-right">Time</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{commits.map((commit) => (
							<TableRow key={commit.id}>
								<TableCell className="font-mono text-xs text-muted-foreground">
									{commit.id}
								</TableCell>
								<TableCell>
									<span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs">
										{commit.phase}
									</span>
								</TableCell>
								<TableCell className="text-right font-mono text-sm">
									{commit.componentCount}
								</TableCell>
								<TableCell className="text-right font-mono text-sm">
									{commit.totalTime.toFixed(1)}ms
								</TableCell>
								<TableCell className="text-right text-xs text-muted-foreground">
									{new Date(commit.createdAt).toLocaleTimeString()}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

function SummaryCard({
	label,
	value,
	unit,
}: {
	label: string;
	value: string;
	unit?: string;
}) {
	return (
		<div className="rounded-md border p-3">
			<p className="text-xs text-muted-foreground">{label}</p>
			<p className="text-xl font-semibold">
				{value}
				{unit && (
					<span className="text-sm font-normal text-muted-foreground ml-0.5">
						{unit}
					</span>
				)}
			</p>
		</div>
	);
}
