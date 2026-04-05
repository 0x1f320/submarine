import type { CommitData as SharedCommitData } from "@submarine/types";
import { io, type Socket } from "socket.io-client";

import { subscribe } from "./instrument.js";
import type { CommitData, Unsubscribe } from "./types.js";

export interface ConnectOptions {
	/** Socket.IO server URL (e.g. "http://localhost:9284"). */
	url: string;
}

/** Active socket instance, if connected. */
let socket: Socket | null = null;
let unsubscribe: Unsubscribe | null = null;

/**
 * Connect to the Submarine backend via Socket.IO and start forwarding
 * React commit data automatically.
 *
 * Returns a cleanup function that disconnects the socket and removes the
 * instrumentation listener.
 */
export function connect(options: ConnectOptions): Unsubscribe {
	if (socket?.connected) {
		return () => disconnect();
	}

	socket = io(options.url, {
		transports: ["websocket"],
		reconnection: true,
		reconnectionAttempts: Infinity,
		reconnectionDelay: 1000,
		reconnectionDelayMax: 5000,
	});

	unsubscribe = subscribe((data: CommitData) => {
		if (!socket?.connected) return;

		const payload: SharedCommitData = {
			phase: data.phase,
			tree: data.tree,
			timestamp: data.timestamp,
		};

		socket.emit("commit", payload);
	});

	return () => disconnect();
}

function disconnect(): void {
	unsubscribe?.();
	unsubscribe = null;

	if (socket) {
		socket.disconnect();
		socket = null;
	}
}
