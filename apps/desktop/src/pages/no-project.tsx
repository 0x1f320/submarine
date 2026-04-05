import { useEffect } from "react";
import { useProjects } from "@/hooks/use-projects";
import { useProjectStore } from "@/stores/project-store";

export function NoProject() {
	const { data: projects } = useProjects();
	const selectProject = useProjectStore((s) => s.selectProject);
	const hasProjects = projects && projects.length > 0;

	useEffect(() => {
		selectProject(null);
	}, [selectProject]);

	return (
		<div className="flex h-full items-center justify-center">
			<div className="flex flex-col items-center gap-3 select-none">
				<svg
					className="size-10 text-muted-foreground/40"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth={1.5}
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
				</svg>
				<div className="flex flex-col items-center gap-2">
					<p className="text-sm font-medium text-muted-foreground">
						No project selected
					</p>
					<p className="text-xs text-muted-foreground/60 text-center whitespace-nowrap">
						{hasProjects ? (
							"Select a project from the sidebar to get started"
						) : (
							<>
								Add{" "}
								<code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.6875rem]">
									@submarine/react
								</code>{" "}
								to your web page and run it to start profiling
							</>
						)}
					</p>
				</div>
			</div>
		</div>
	);
}
