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

import ModalAgent from "components/ModalAgent";
import { addTime } from "utils/helperTimePlayed";
import { useRouter } from "next/router";

export default function pong() {
	const { authUserTherapist, authUserPatient } = useContext(AuthContext);
	// si el front se sirve en el mismo sitio que el servidor
	const [agentConnected, setAgentConnected] = useState(null);
	const [agentSelected, setAgentSelected] = useState(null);
	const [modalIsOpen, setModalIsOpen] = useState(true);
	let valY = 0;

	// Estados para reloj
	const [initial, setInitial] = useState(null);
	const [dataTime, setDataTime] = useState(null);

	// Estado para almacenar informacion de datesPlayed
	const [datesPlayed, setDatesPlayed] = useState(null);
	const [loadDatesPlayed, setLoadDatesPlayed] = useState(true);

	//
	const [typeUser, setTypeUser] = useState("");
	const router = useRouter();
	const idGame = "4E06EyUJCD83UPNsaMBB";

	const unityContext = new UnityContext({
		loaderUrl: "/Games/Pong/Build/pong.loader.js",
		dataUrl: "/Games/Pong/Build/pong.data",
		frameworkUrl: "/Games/Pong/Build/pong.framework.js",
		codeUrl: "/Games/Pong/Build/pong.wasm",
	});

	const unityStyle = {
		height: "80vh",
		width: "100vw",
	};

	let timePlayed = null;

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

	useSocket("agent/message", (newAgent) => {
		valY = -(newAgent.metrics[1].value / 20);

		if (newAgent.agent.uuid === agentSelected) {
			console.log(`ValY = ${valY}`);

			unityContext.send("PlayerPaddle", "MoveInY", valY);
		}
	});

	useSocket("agent/disconnected", (newAgent) => {
		setAgentConnected(null);
		console.log("agent Disconnected", `Agent Desconectado ${newAgent.id}`);
	});

	useSocket("agent/connected", (newAgent) => {
		setAgentConnected(newAgent);
		console.log("agent Connected", newAgent);
	});

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
							PONG: [{ date: currentDate, timePlayed }],
						};
						createDatesPlayed(data);
					} else if (!loadDatesPlayed && datesPlayed) {
						// Se Busca si existe la fecha actual
						if (datesPlayed.PONG === undefined) {
							const data = {
								...datesPlayed,
								PONG: [{ date: currentDate, timePlayed }],
							};

							return updateDatesPlayed(datesPlayed.id, data);
						}

						const findDate = datesPlayed.PONG.find(
							(item) => item.date === currentDate
						);
						if (findDate) {
							// si coincide fecha, sumar tiempo
							datesPlayed.PONG.forEach((item) => {
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
								PONG: [...datesPlayed.PONG, { date: currentDate, timePlayed }],
							};
							updateDatesPlayed(datesPlayed.id, data);
						}
					}
				}
			}
			unityContext.removeAllEventListeners();
		};
	}, [unityContext]);

	return (
		<>
			<div className="wrapper">
				{/* <h1>{timeFormat(diff)}</h1> */}

				<div>
					<ModalAgent
						setSelected={setAgentSelected}
						modalIsOpen={modalIsOpen}
						setModalIsOpen={setModalIsOpen}
					/>
					{agentSelected !== null && (
						<>
							<Unity
								unityContext={unityContext}
								devicePixelRatio={2}
								style={unityStyle}
							/>
						</>
					)}
				</div>
			</div>

			<style jsx>
				{`
					.wrapper {
						background-color: #0d6efd;
						width: 100vw;
						height: 100vh;
						display: flex;
						justify-content: center;
						align-items: center;
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
