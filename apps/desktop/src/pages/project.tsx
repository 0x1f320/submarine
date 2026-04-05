import { useEffect } from "react";
import { useParams } from "react-router";
import { MetricCard } from "@/components/metric-card";
import { RenderList } from "@/components/render-list";
import { Timeline } from "@/components/timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjects } from "@/hooks/use-projects";
import { useProjectStore } from "@/stores/project-store";

export function Project() {
	const { projectId } = useParams();
	const { data: projects } = useProjects();
	const { selectedProject, selectProject } = useProjectStore();

	useEffect(() => {
		if (!projects || !projectId) return;
		if (selectedProject?.id === Number(projectId)) return;
		const project = projects.find((p) => p.id === Number(projectId));
		selectProject(project ?? null);
	}, [projectId, projects, selectedProject, selectProject]);

	return (
		<div className="p-4 space-y-4">
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
		</div>
	);
}
