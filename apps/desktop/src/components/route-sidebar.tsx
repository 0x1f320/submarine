import { NavLink } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { usePages } from "@/hooks/use-pages";

export function RouteSidebar({ projectId }: { projectId: number }) {
	const { data: pages, isLoading } = usePages(projectId);

	return (
		<aside className="flex flex-col w-56 shrink-0 border-r bg-sidebar overflow-y-auto">
			<div className="flex flex-col gap-1 px-2 pt-4">
				<span className="px-2 text-xs font-medium text-muted-foreground">
					Routes
				</span>
				<nav className="flex flex-col gap-0.5">
					{isLoading ? (
						<>
							<div className="flex items-center gap-2 h-8 px-2">
								<Skeleton className="h-3.5 w-32 rounded" />
							</div>
							<div className="flex items-center gap-2 h-8 px-2">
								<Skeleton className="h-3.5 w-24 rounded" />
							</div>
						</>
					) : !pages || pages.length === 0 ? (
						<p className="px-2 py-1 text-xs text-muted-foreground/60">
							No routes yet
						</p>
					) : (
						pages.map((page) => {
							const path = extractPath(page.url);
							return (
								<NavLink
									key={page.id}
									to={`/projects/${projectId}/pages/${page.id}`}
									className={({ isActive }) =>
										`flex items-center gap-2 h-8 px-2 rounded-md transition-colors text-sm text-left ${
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
										<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
										<path d="M14 2v4a2 2 0 0 0 2 2h4" />
									</svg>
									<span className="truncate font-mono text-xs">{path}</span>
								</NavLink>
							);
						})
					)}
				</nav>
			</div>
		</aside>
	);
}

function extractPath(url: string): string {
	try {
		return new URL(url).pathname || "/";
	} catch {
		return url;
	}
}
