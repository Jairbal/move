/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
import { useState, useEffect, useContext } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import useSocket from "hooks/useSocket";
import { AuthContext } from "context/AuthContext";
import {
	readDatesPlayed,
	createDatesPlayed,
	updateDatesPlayed,
} from "firebase/client";
import { timeResult, addTime, timeFormat } from "utils/helperTimePlayed";

export default function pacman() {
	const { authUserTherapist, authUserPatient } = useContext(AuthContext);
	// si el front se sirve en el mismo sitio que el servidor
	const [metrics, setMetrics] = useState([0, 0]);
	const [agentConnected, setAgentConnected] = useState(null);
	let valX = 0;
	let valY = 0;

	// Estados para reloj
	const [diff, setDiff] = useState(null);
	const [initial, setInitial] = useState(null);
	const [initialTime, setInitialTime] = useState(null);

	// Estado para almacenar informacion de datesPlayed
	const [datesPlayed, setDatesPlayed] = useState(null);
	const [loadDatesPlayed, setLoadDatesPlayed] = useState(true);

	/* 	const socketAgentConnected = useSocket("agent/connected", (newAgent) => {
		setAgentConnected(newAgent);
		console.log("agent Connected", newAgent);
	}); */

	const tick = () => {
		setDiff(new Date(+new Date() - initial));
	};

	// Inicia el reloj
	const start = () => {
		if (initial === null) {
			setInitial(+new Date());
			const firstTime = new Date();
			setInitialTime(firstTime);
		}
	};

	useEffect(() => {
		if (!datesPlayed && authUserPatient) {
			// Leer fechas jugadas del paciente
			readDatesPlayed(authUserPatient.uid, setDatesPlayed);
			setLoadDatesPlayed(false);
		}

		if (diff) {
			requestAnimationFrame(tick);
		}

		// Evento que se llama al dar click en el boton jugar
		unityContext.on("timeValidate", (validateTime) => {
			start();
		});

		return () => {
			unityContext.removeEventListener("timeValidate");
		};
	}, [diff, datesPlayed]);

	useEffect(() => {
		if (initial) {
			requestAnimationFrame(tick);
		}
		return () => {
			if (initial != null) {
				if (!authUserTherapist) {
					const finalTime = new Date();
					const timePlayed = timeResult(initialTime, finalTime);
					const currentDate = `${finalTime.getDate()}/${
						finalTime.getMonth() + 1
					}/${finalTime.getFullYear()}`;
					if (!datesPlayed && loadDatesPlayed) {
						// si no encuentra información
						// crea el documento
						const data = {
							uid: authUserPatient.uid,
							PACMAN: [{ date: currentDate, timePlayed }],
						};
						createDatesPlayed(data);
					} else if (!loadDatesPlayed && datesPlayed) {
						// Se Busca si existe la fecha actual

						if (datesPlayed.PACMAN === undefined) {
							const data = {
								...datesPlayed,
								PACMAN: [{ date: currentDate, timePlayed }],
							};

							return updateDatesPlayed(datesPlayed.id, data);
						}

						const findDate = datesPlayed.PACMAN.find(
							(item) => item.date === currentDate
						);
						if (findDate) {
							// si coincide fecha, sumar tiempo
							datesPlayed.PACMAN.forEach((item) => {
								if (item.date === findDate.date) {
									item.timePlayed = addTime(item.timePlayed, timePlayed);
								}
							});

							const data = {
								...datesPlayed,
							};
							updateDatesPlayed(datesPlayed.id, data);
						} else {
							// si no coincide la fecha, crear nueva fecha
							const data = {
								...datesPlayed,
								PACMAN: [
									...datesPlayed.PACMAN,
									{ date: currentDate, timePlayed },
								],
							};
							updateDatesPlayed(datesPlayed.id, data);
						}
					}
				}
			}
		};
	}, [initial]);

	const socketAgentMessage = useSocket("agent/message", (newAgent) => {
		if (newAgent.metrics[0].value < -80) {
			valX = -1;
		} else if (
			newAgent.metrics[0].value > -80 &&
			newAgent.metrics[0].value < -40
		) {
			valX = -0.5;
		} else if (
			newAgent.metrics[0].value > -40 &&
			newAgent.metrics[0].value < 40
		) {
			valX = 0;
		} else if (
			newAgent.metrics[0].value > 40 &&
			newAgent.metrics[0].value < 80
		) {
			valX = 0.5;
		} else if (newAgent.metrics[0].value > 80) {
			valX = 1;
		}

		console.log(`metric ${newAgent.metrics[0].value}`);
		console.log(`valX ${valX}`);

		if (newAgent.metrics[1].value < -50) {
			valY = -1;
		} else if (
			newAgent.metrics[1].value > -50 &&
			newAgent.metrics[1].value < -25
		) {
			valY = -0.5;
		} else if (
			newAgent.metrics[1].value > -25 &&
			newAgent.metrics[1].value < 25
		) {
			valY = 0;
		} else if (
			newAgent.metrics[1].value > 25 &&
			newAgent.metrics[1].value < 50
		) {
			valY = 0.5;
		} else if (newAgent.metrics[1].value > 50) {
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
			<div>
				<h1>{timeFormat(diff)}</h1>
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
							flex-direction: column;
							justify-content: center;
							align-items: center;
						}

						h1 {
							text-align: center;
							color: white;
							text-shadow: 3px 1px #0d6efd;
							font-size: 50px;
							margin: 0;
						}
					`}
				</style>
			</div>
		);
	}
	return <div>Por favor, conecte un dispositivo...</div>;
}
