/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import useSocket from "hooks/useSocket";

export default function asteroid() {
	// si el front se sirve en el mismo sitio que el servidor
	const [metrics, setMetrics] = useState([0, 0]);
	const [agentConnected, setAgentConnected] = useState(null);

	/* 	const socketAgentConnected = useSocket("agent/connected", (newAgent) => {
		setAgentConnected(newAgent);
		console.log("agent Connected", newAgent);
	}); */

	const socketAgentMessage = useSocket("agent/message", (newAgent) => {
		// setMetrics(newAgent.metrics);
		unityContext.send("Player", "setMoveX", newAgent.metrics[0].value);
		unityContext.send("Player", "setMoveY", newAgent.metrics[1].value);
	});

	const socketAgentDisConnected = useSocket(
		"agent/disconnected",
		(newAgent) => {
			setAgentConnected(null);
			setMetrics(null);
			console.log("agent Disconnected", `Agent Desconectado ${newAgent.id}`);
		}
	);

	const unityContext = new UnityContext({
		loaderUrl: "/Games/Asteroid/Build/asteroid.loader.js",
		dataUrl: "/Games/Asteroid/Build/asteroid.data",
		frameworkUrl: "/Games/Asteroid/Build/asteroid.framework.js",
		codeUrl: "/Games/Asteroid/Build/asteroid.wasm",
	});

	const unityStyle = {
		height: "90vh",
		width: "90vw",
	};

	if (metrics) {
		return (
			<>
				<div>
					<Unity unityContext={unityContext} style={unityStyle} />
				</div>
				<style jsx>
					{`
						div {
							width: 100vw;
							height: 100vh;
							background-color: #0d6efd;
							display: flex;
							justify-content: center;
							align-items: center;
						}
					`}
				</style>
			</>
		);
	}
	return <div>Por favor, conecte un dispositivo...</div>;
}
