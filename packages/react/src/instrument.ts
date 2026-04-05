import {
	instrument as bippyInstrument,
	type Fiber,
	type FiberRoot,
	secure,
	traverseRenderedFibers,
} from "bippy";
import { type ParseOptions, parseFiber } from "./parse-fiber.js";
import type { CommitData, CommitListener, Unsubscribe } from "./types.js";

const listeners = new Set<CommitListener>();
let initialized = false;
let parseOptions: ParseOptions = {};

function handleCommitRoot(_rendererID: number, root: FiberRoot) {
	if (listeners.size === 0) return;

	const fiberRoot = root.current as Fiber;
	if (!fiberRoot) return;

	traverseRenderedFibers(root, (fiber, phase) => {
		const tree = parseFiber(fiberRoot, parseOptions);
		if (!tree) return;

		const data: CommitData = {
			phase,
			tree,
			fiberRoot: fiber,
			timestamp: performance.now(),
		};

		for (const listener of listeners) {
			listener(data);
		}
	});
}

function ensureInstrumented() {
	if (initialized) return;
	initialized = true;

	bippyInstrument(
		secure({
			onCommitFiberRoot: handleCommitRoot,
		}),
	);
}

export function subscribe(
	listener: CommitListener,
	options?: ParseOptions,
): Unsubscribe {
	ensureInstrumented();

	if (options) {
		parseOptions = options;
	}

	listeners.add(listener);

	return () => {
		listeners.delete(listener);
	};
}
