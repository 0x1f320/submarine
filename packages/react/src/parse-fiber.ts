import {
	ClassComponentTag,
	ContextConsumerTag,
	didFiberRender,
	type Fiber,
	ForwardRefTag,
	FragmentTag,
	FunctionComponentTag,
	getDisplayName,
	getFiberId,
	getNearestHostFiber,
	getTimings,
	HostComponentTag,
	HostRootTag,
	hasMemoCache,
	isCompositeFiber,
	isHostFiber,
	MemoComponentTag,
	SimpleMemoComponentTag,
	SuspenseComponentTag,
	setFiberId,
	shouldFilterFiber,
} from "bippy";
import type { ComponentKind, ComponentNode } from "./types.js";

function resolveKind(fiber: Fiber): ComponentKind {
	switch (fiber.tag) {
		case FunctionComponentTag:
			return "function";
		case ClassComponentTag:
			return "class";
		case HostComponentTag:
			return "host";
		case HostRootTag:
			return "root";
		case MemoComponentTag:
		case SimpleMemoComponentTag:
			return "memo";
		case ForwardRefTag:
			return "forward-ref";
		case SuspenseComponentTag:
			return "suspense";
		case ContextConsumerTag:
			return "context";
		case FragmentTag:
			return "fragment";
		default:
			return "other";
	}
}

function resolveName(fiber: Fiber): string {
	const displayName = getDisplayName(fiber.type);
	if (displayName) return displayName;

	if (fiber.tag === HostComponentTag) return fiber.type as string;
	if (fiber.tag === HostRootTag) return "#root";
	if (fiber.tag === FragmentTag) return "#fragment";
	if (fiber.tag === SuspenseComponentTag) return "Suspense";

	return "#anonymous";
}

function resolveHostTag(fiber: Fiber): string | null {
	if (isHostFiber(fiber)) return fiber.type as string;
	const host = getNearestHostFiber(fiber);
	return host ? (host.type as string) : null;
}

function resolveProps(fiber: Fiber): Record<string, unknown> {
	const raw = fiber.memoizedProps;
	if (!raw || typeof raw !== "object") return {};

	const result: Record<string, unknown> = {};
	for (const key of Object.keys(raw)) {
		if (key === "children") continue;
		const value = raw[key];
		if (typeof value === "function") {
			result[key] = `ƒ ${(value as { name?: string }).name || "anonymous"}`;
		} else {
			result[key] = value;
		}
	}
	return result;
}

function resolveTimings(
	fiber: Fiber,
): { selfTime: number; totalTime: number } | null {
	const t = getTimings(fiber);
	if (t.selfTime === 0 && t.totalTime === 0) return null;
	return t;
}

export interface ParseOptions {
	/** Include host (DOM) fibers in the tree. Default: false */
	includeHost?: boolean;
	/** Maximum tree depth. Default: Infinity */
	maxDepth?: number;
}

export function parseFiber(
	fiber: Fiber,
	options: ParseOptions = {},
	depth = 0,
): ComponentNode | null {
	const { includeHost = false, maxDepth = Number.POSITIVE_INFINITY } = options;

	if (depth > maxDepth) return null;

	const skip = !includeHost && isHostFiber(fiber) && fiber.tag !== HostRootTag;

	if (skip || shouldFilterFiber(fiber)) {
		return collectSkippedChildren(fiber, options, depth);
	}

	setFiberId(fiber);

	const node: ComponentNode = {
		id: getFiberId(fiber),
		name: resolveName(fiber),
		kind: resolveKind(fiber),
		props: isCompositeFiber(fiber) ? resolveProps(fiber) : {},
		timings: resolveTimings(fiber),
		rendered: didFiberRender(fiber),
		memoized: hasMemoCache(fiber),
		hostTag: resolveHostTag(fiber),
		depth,
		children: [],
	};

	let child = fiber.child;
	while (child) {
		const childNode = parseFiber(child, options, depth + 1);
		if (childNode) {
			if (isVirtualNode(childNode)) {
				node.children.push(...childNode.children);
			} else {
				node.children.push(childNode);
			}
		}
		child = child.sibling;
	}

	return node;
}

function collectSkippedChildren(
	fiber: Fiber,
	options: ParseOptions,
	depth: number,
): ComponentNode | null {
	const children: ComponentNode[] = [];

	let child = fiber.child;
	while (child) {
		const childNode = parseFiber(child, options, depth);
		if (childNode) {
			if (isVirtualNode(childNode)) {
				children.push(...childNode.children);
			} else {
				children.push(childNode);
			}
		}
		child = child.sibling;
	}

	if (children.length === 0) return null;

	return {
		id: -1,
		name: "#virtual",
		kind: "other",
		props: {},
		timings: null,
		rendered: false,
		memoized: false,
		hostTag: null,
		depth,
		children,
	} satisfies ComponentNode;
}

function isVirtualNode(node: ComponentNode): boolean {
	return node.id === -1 && node.name === "#virtual";
}
