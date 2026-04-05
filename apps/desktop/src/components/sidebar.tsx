export function Sidebar({ width }: { width: number }) {
	return (
		<aside
			className="flex flex-col border-r bg-sidebar shrink-0"
			style={{ width }}
		>
			<nav className="flex flex-col gap-0.5 px-2 pt-2">
				<NavItem label="Dashboard" active>
					<path d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5zM4 15a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4zm10 0a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-4z" />
				</NavItem>
				<NavItem label="Timeline">
					<path d="M12 6v6l4 2M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
				</NavItem>
			</nav>
		</aside>
	);
}

function NavItem({
	label,
	active = false,
	children,
}: {
	label: string;
	active?: boolean;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			className={`flex items-center gap-2 h-8 px-2 rounded-md transition-colors text-sm ${
				active
					? "bg-accent text-accent-foreground"
					: "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
			}`}
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
				{children}
			</svg>
			<span className="truncate">{label}</span>
		</button>
	);
}
