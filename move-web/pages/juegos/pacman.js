/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */

import { useState } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import useSocket from "hooks/useSocket";

export default function pacman() {
	// si el front se sirve en el mismo sitio que el servidor
	const [metrics, setMetrics] = useState([0, 0]);
	const [agentConnected, setAgentConnected] = useState(null);
	let valX = 0;
	let valY = 0;
	/* 	const socketAgentConnected = useSocket("agent/connected", (newAgent) => {
		setAgentConnected(newAgent);
		console.log("agent Connected", newAgent);
	}); */

	const socketAgentMessage = useSocket("agent/message", (newAgent) => {
		
		if(newAgent.metrics[0].value < -80) {
			valX = -1;
		} else if(newAgent.metrics[0].value > -80 && newAgent.metrics[0].value < -40) {
			valX = -0,5;
		} else if(newAgent.metrics[0].value > -40 && newAgent.metrics[0].value < 40) {
			valX = 0;
		} else if(newAgent.metrics[0].value > 40 && newAgent.metrics[0].value < 80) {
			valX = 0,5;
		} else if(newAgent.metrics[0].value > 80) {
			valX = 1;
		}

		console.log(`metric ${newAgent.metrics[0].value}`)
		console.log(`valX ${valX}`)

		if(newAgent.metrics[1].value < -50) {
			valY = -1;
		} else if(newAgent.metrics[1].value > -50 && newAgent.metrics[1].value < -25) {
			valY = -0,5;
		} else if(newAgent.metrics[1].value > -25 && newAgent.metrics[1].value < 25) {
			valY = 0;
		} else if(newAgent.metrics[1].value > 25 && newAgent.metrics[1].value < 50) {
			valY = 0,5;
		} else if(newAgent.metrics[1].value > 50) {
			valY = 1;
		}


		unityContext.send("Pacman", "setMoveX", valX);
		unityContext.send("Pacman", "setMoveY", newAgent.metrics[1].value);
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
		loaderUrl: "/Games/Pacman/Build/pacman.loader.js",
		dataUrl: "/Games/Pacman/Build/pacman.data",
		frameworkUrl: "/Games/Pacman/Build/pacman.framework.js",
		codeUrl: "/Games/Pacman/Build/pacman.wasm",
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
