import type { Fiber, RenderPhase } from "bippy";

export interface ComponentNode {
	/** Stable ID persisted across re-renders */
	id: number;
	/** Display name (e.g. "App", "Button", "div") */
	name: string;
	/** Component type classification */
	kind: ComponentKind;
	/** Current props snapshot */
	props: Record<string, unknown>;
	/** Render timing (only available with React Profiler) */
	timings: { selfTime: number; totalTime: number } | null;
	/** Whether this fiber rendered in the last commit */
	rendered: boolean;
	/** Whether React Compiler memo cache is active */
	memoized: boolean;
	/** Associated DOM element tag name, if any */
	hostTag: string | null;
	/** Depth in the component tree (0 = root) */
	depth: number;
	/** Children component nodes */
	children: ComponentNode[];
}

export type ComponentKind =
	| "function"
	| "class"
	| "host"
	| "memo"
	| "forward-ref"
	| "suspense"
	| "context"
	| "fragment"
	| "root"
	| "other";

export interface CommitData {
	/** The phase that triggered this commit */
	phase: RenderPhase;
	/** Parsed component tree for this root */
	tree: ComponentNode;
	/** Raw fiber root (for advanced use) */
	fiberRoot: Fiber;
	/** Timestamp of the commit */
	timestamp: number;
}

export type CommitListener = (data: CommitData) => void;

export type Unsubscribe = () => void;
