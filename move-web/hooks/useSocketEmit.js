import { useEffect } from "react";
import io from "socket.io-client";

const socket = io();

export default function useSocketEmit(eventName, message) {
	useEffect(() => {
		socket.emmit(eventName, message);

		return function useSocketCleanup() {
			socket.off(eventName, message);
		};
	}, [eventName, message]);

	return socket;
}
