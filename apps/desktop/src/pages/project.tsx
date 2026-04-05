import { useEffect } from "react";
import { Outlet, useParams } from "react-router";
import { RouteSidebar } from "@/components/route-sidebar";
import { useProjects } from "@/hooks/use-projects";
import { useProjectStore } from "@/stores/project-store";

export function Project() {
	const { projectId, pageId } = useParams();
	const { data: projects } = useProjects();
	const { selectedProject, selectProject } = useProjectStore();

	useEffect(() => {
		if (!projects || !projectId) return;
		if (selectedProject?.id === Number(projectId)) return;
		const project = projects.find((p) => p.id === Number(projectId));
		selectProject(project ?? null);
	}, [projectId, projects, selectedProject, selectProject]);

	const numericProjectId = Number(projectId);

	return (
		<div className="flex h-full">
			<RouteSidebar projectId={numericProjectId} />
			<div className="flex-1 overflow-y-auto">
				{pageId ? (
					<Outlet />
				) : (
					<div className="flex items-center justify-center h-full text-sm text-muted-foreground">
						Select a route
					</div>
				)}
			</div>
		</div>
	);
}
