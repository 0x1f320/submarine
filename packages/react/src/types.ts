import type { ComponentNode } from "@submarine/types";
import type { Fiber, RenderPhase } from "bippy";

export type {
	ComponentKind,
	ComponentNode,
	RenderPhase,
	Timings,
} from "@submarine/types";

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
