/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useContext } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import useSocket from "hooks/useSocket";
import { AuthContext } from "context/AuthContext";
import {
	readDatesPlayed,
	createDatesPlayed,
	updateDatesPlayed,
} from "firebase/client";

import ModalAgent from "components/ModalAgent";
import { addTime } from "utils/helperTimePlayed";
import { useRouter } from "next/router";

export default function space() {
	const { authUserTherapist, authUserPatient } = useContext(AuthContext);
	// si el front se sirve en el mismo sitio que el servidor
	const [metrics, setMetrics] = useState([0, 0]);
	const [agentConnected, setAgentConnected] = useState(null);
	const [agentSelected, setAgentSelected] = useState(null);
	const [modalIsOpen, setModalIsOpen] = useState(true);

	// Estados para reloj
	const [diff, setDiff] = useState(null);
	const [initial, setInitial] = useState(null);
	const [initialTime, setInitialTime] = useState(null);

	// Estado para almacenar informacion de datesPlayed
	const [datesPlayed, setDatesPlayed] = useState(null);
	const [loadDatesPlayed, setLoadDatesPlayed] = useState(true);

	// State barra de progreso unity
	const [progression, setProgression] = useState(0);
	const [isLoaded, setIsLoaded] = useState(false);

	//
	const [typeUser, setTypeUser] = useState("");
	const router = useRouter();
	const idGame = "YyULfaJWAJpqPxSiJXGZ";

	const valX = 0;
	let timePlayed = null;

	const unityContext = new UnityContext({
		loaderUrl: "/Games/Space/Build/space.loader.js",
		dataUrl: "/Games/Space/Build/space.data",
		frameworkUrl: "/Games/Space/Build/space.framework.js",
		codeUrl: "/Games/Space/Build/space.wasm",
	});

	const unityStyle = {
		height: "100vh",
		width: "100%",
	};

	useEffect(() => {
		setTypeUser(localStorage.getItem("typeUser"));
	}, []);

	useEffect(() => {
		let isValid = false;
		if (typeUser === "patient" && authUserPatient !== undefined) {
			authUserPatient.games.forEach((game) => {
				if (game.idGame === idGame) {
					isValid = true;
				}
			});
			!isValid && router.replace("/actividades");
		} else if (typeUser === null) {
			router.replace("/");
		}
	}, [typeUser, authUserPatient]);

	useEffect(() => {
		if (!datesPlayed && authUserPatient) {
			// Leer fechas jugadas del paciente
			readDatesPlayed(authUserPatient.uid, setDatesPlayed);
			setLoadDatesPlayed(false);
		}
	}, [datesPlayed]);

	useEffect(() => {
		unityContext.on("GameOver", (userName, score) => {
			timePlayed = userName;
		});

		return () => {
			if (timePlayed !== null) {
				if (!authUserTherapist) {
					const finalTime = new Date();
					const currentDate = `${finalTime.getFullYear()}/${
						finalTime.getMonth() + 1
					}/${finalTime.getDate()}`;
					if (!datesPlayed && loadDatesPlayed) {
						// si no encuentra información
						// crea el documento
						const data = {
							uid: authUserPatient.uid,
							SPACE: [{ date: currentDate, timePlayed }],
						};
						createDatesPlayed(data);
					} else if (!loadDatesPlayed && datesPlayed) {
						// Se Busca si existe la fecha actual
						if (datesPlayed.SPACE === undefined) {
							const data = {
								...datesPlayed,
								SPACE: [{ date: currentDate, timePlayed }],
							};

							return updateDatesPlayed(datesPlayed.id, data);
						}

						const findDate = datesPlayed.SPACE.find(
							(item) => item.date === currentDate
						);
						if (findDate) {
							// si coincide fecha, sumar tiempo
							datesPlayed.SPACE.forEach((item) => {
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
								SPACE: [
									...datesPlayed.SPACE,
									{ date: currentDate, timePlayed },
								],
							};
							updateDatesPlayed(datesPlayed.id, data);
						}
					}
				}
			}
			unityContext.removeAllEventListeners();
		};
	}, [unityContext]);

	const socketAgentMessage = useSocket("agent/message", (newAgent) => {
		// setMetrics(newAgent.metrics);
		unityContext.send("Player", "setMoveX", -newAgent.metrics[0].value);
	});

	const socketAgentDisConnected = useSocket(
		"agent/disconnected",
		(newAgent) => {
			setAgentConnected(null);
			setMetrics(null);
			console.log("agent Disconnected", `Agent Desconectado ${newAgent.id}`);
		}
	);

	return (
		<>
			<div className="wrapper">
				{/* <h1>{timeFormat(diff)}</h1> */}

				<div className="unity">
					<ModalAgent
						setSelected={setAgentSelected}
						modalIsOpen={modalIsOpen}
						setModalIsOpen={setModalIsOpen}
					/>
					{agentSelected !== null && (
						<>
							<Unity unityContext={unityContext} style={unityStyle} />
						</>
					)}
				</div>
			</div>

			<style jsx>
				{`
					.wrapper {
						background-color: #0d6efd;

						display: flex;
						justify-content: center;
					}

					.unity {
						width: 60vw;
						height: 100vh;
					}

					h1 {
						text-align: center;
						color: white;
						margin-bottom: 13px;
						text-shadow: 3px 1px #0d6efd;
						font-size: 50px;
						margin: 0;
					}
				`}
			</style>
		</>
	);
}
