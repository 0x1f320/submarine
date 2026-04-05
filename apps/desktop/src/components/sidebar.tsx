import { NavLink } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { useProjectStore } from "@/stores/project-store";

export function Sidebar({ width }: { width: number }) {
	const { data: projects, isLoading } = useProjects();
	const selectProject = useProjectStore((s) => s.selectProject);

	return (
		<aside
			className="flex flex-col border-r bg-sidebar shrink-0"
			style={{ width }}
		>
			<div className="flex flex-col gap-1 px-2 pt-4">
				<span className="px-2 text-xs font-medium text-muted-foreground">
					Projects
				</span>
				<nav className="flex flex-col gap-0.5">
					{isLoading ? (
						<>
							<div className="flex items-center gap-2 h-8 px-2">
								<Skeleton className="size-4 rounded shrink-0" />
								<Skeleton className="h-3.5 w-24 rounded" />
							</div>
							<div className="flex items-center gap-2 h-8 px-2">
								<Skeleton className="size-4 rounded shrink-0" />
								<Skeleton className="h-3.5 w-20 rounded" />
							</div>
							<div className="flex items-center gap-2 h-8 px-2">
								<Skeleton className="size-4 rounded shrink-0" />
								<Skeleton className="h-3.5 w-16 rounded" />
							</div>
						</>
					) : !projects || projects.length === 0 ? (
						<p className="px-2 py-1 text-xs text-muted-foreground/60">
							No projects yet
						</p>
					) : (
						projects.map((project) => (
							<NavLink
								key={project.id}
								to={`/projects/${project.id}`}
								onClick={() => selectProject(project)}
								className={({ isActive }) =>
									`flex items-center gap-2 h-8 px-2 rounded-md transition-colors text-sm ${
										isActive
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
									}`
								}
							>
								<svg
									className="size-4 shrink-0"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
								>
									<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
								</svg>
								<span className="truncate">{project.name}</span>
							</NavLink>
						))
					)}
				</nav>
			</div>
		</aside>
	);
}
