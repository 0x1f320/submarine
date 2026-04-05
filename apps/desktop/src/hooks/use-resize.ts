import { useCallback, useRef, useState } from "react";

export function useResize(min: number, max: number, initial: number) {
	const [width, setWidth] = useState(initial);
	const dragging = useRef(false);
	const startX = useRef(0);
	const startWidth = useRef(0);

	const onPointerDown = useCallback(
		(e: React.PointerEvent) => {
			dragging.current = true;
			startX.current = e.clientX;
			startWidth.current = width;
			e.currentTarget.setPointerCapture(e.pointerId);
		},
		[width],
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!dragging.current) return;
			const delta = e.clientX - startX.current;
			setWidth(Math.min(max, Math.max(min, startWidth.current + delta)));
		},
		[min, max],
	);

	const onPointerUp = useCallback(() => {
		dragging.current = false;
	}, []);

	return {
		width,
		handleProps: { onPointerDown, onPointerMove, onPointerUp },
	};
}
