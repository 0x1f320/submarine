import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
	label: string;
	value: string;
	unit?: string;
	description?: string;
}

export function MetricCard({
	label,
	value,
	unit,
	description,
}: MetricCardProps) {
	return (
		<Card>
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium text-muted-foreground">
					{label}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-baseline gap-1">
					<span className="text-2xl font-semibold tabular-nums">{value}</span>
					{unit && (
						<span className="text-sm text-muted-foreground">{unit}</span>
					)}
				</div>
				{description && (
					<p className="text-xs text-muted-foreground mt-1">{description}</p>
				)}
			</CardContent>
		</Card>
	);
}
