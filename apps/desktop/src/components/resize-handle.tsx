export function ResizeHandle(props: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className="w-1 cursor-col-resize hover:bg-border active:bg-ring transition-colors shrink-0"
			{...props}
		/>
	);
}
