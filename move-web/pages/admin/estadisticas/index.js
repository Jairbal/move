/* eslint-disable camelcase */
/* eslint-disable no-lonely-if */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import AdminLayout from "components/AdminLayout";
import { fetchPatient, readDatesPlayed } from "firebase/client";
import { addTime } from "utils/helperTimePlayed";

export default function estadisticas({ uid }) {
	const [dataTimePlayed, setDataTimePlayed] = useState(null);

	const [patient, setPatient] = useState();
	// Estados del total jugado para cada juego
	const [timePong, setTimePong] = useState(null);
	const [timeSpace, setTimeSpace] = useState(null);
	const [timePacman, setTimePacman] = useState(null);
	// Estado para la sumatoria del tiempo total
	const [totalTime, setTotalTime] = useState(null);

	// Estado para unir los 3 arrays de fechas de juego
	const [totalDataPlayed, setTotalDataPlayed] = useState(null);

	// Estados para obtener solo el tiempo de cada tipo de juego
	// y utilizarlo en la grafica
	const [GraphPong, setGraphPong] = useState([]);
	const [GraphSpace, setGraphSpace] = useState([]);
	const [GraphPacman, setGraphPacman] = useState([]);

	// Auxiliar para contabilizar el # en la tabla
	let aux = 0;
	const timeIsComplete = "00:20";

	// Sumara el total de los tiempos existentes en el array
	const AddAllTimes = (timesArray) => {
		let time;
		timesArray.forEach((data) => {
			if (!time) {
				time = data.timePlayed;
			} else {
				time = addTime(time, data.timePlayed);
			}
		});
		return time;
	};

	// Array de todas las fechas jugadas
	const datesGraph = (totalDataPlayed) => {
		const arrayDates = [];
		totalDataPlayed
			.sort((x, y) => x.date.localeCompare(y.date))
			.forEach((data) => {
				if (!arrayDates.includes(data.date)) {
					arrayDates.push(data.date);
				}
			});
		return arrayDates;
	};

	// Reestructurar los arrays de data jugada
	// para incluirlo todo en la gráfica
	const handleDataForGraph = (totalData, onlyDates) => {
		const arrayGraphPong = [];
		const arrayGraphSpace = [];
		const arrayGraphPacman = [];

		let auxDate;

		totalData
			.sort((x, y) => x.date.localeCompare(y.date))
			.forEach((data) => {
				if (data.date === auxDate) {
					if (data.name === "SPACE") {
						arrayGraphSpace.pop();
						arrayGraphSpace.push(data.timePlayed.replace(":", "."));
					} else if (data.name === "PONG") {
						arrayGraphPong.pop();
						arrayGraphPong.push(data.timePlayed.replace(":", "."));
					} else if (data.name === "PACMAN") {
						arrayGraphPacman.pop();
						arrayGraphPacman.push(data.timePlayed.replace(":", "."));
					}
				} else {
					if (data.name === "SPACE") {
						arrayGraphPong.push("0");
						arrayGraphSpace.push(data.timePlayed.replace(":", "."));
						arrayGraphPacman.push("0");
					} else if (data.name === "PONG") {
						arrayGraphPong.push(data.timePlayed.replace(":", "."));
						arrayGraphSpace.push("0");
						arrayGraphPacman.push("0");
					} else if (data.name === "PACMAN") {
						arrayGraphPong.push("0");
						arrayGraphSpace.push("0");
						arrayGraphPacman.push(data.timePlayed.replace(":", "."));
					}
				}

				auxDate = data.date;
			});
		setGraphPong(arrayGraphPong);
		setGraphSpace(arrayGraphSpace);
		setGraphPacman(arrayGraphPacman);
	};

	// Combina la data fecha y tiempo de cada juego en un Array
	const gameDataByDate = (dataPong, dataSpace, dataPacman) => {
		if (Array.isArray(dataPong)) {
			dataPong.forEach((data) => {
				data.name = "PONG";
			});
		}
		if (Array.isArray(dataSpace)) {
			dataSpace.forEach((data) => {
				data.name = "SPACE";
			});
		}
		if (Array.isArray(dataPacman)) {
			dataPacman.forEach((data) => {
				data.name = "PACMAN";
			});
		}

		setTotalDataPlayed(dataPong.concat(dataSpace, dataPacman));
		handleDataForGraph(dataPong.concat(dataSpace, dataPacman));
	};

	useEffect(() => {
		if (uid) {
			fetchPatient(uid).then((document) => setPatient(document[0]));
		}
	}, [uid]);

	useEffect(() => {
		if (!dataTimePlayed && patient) {
			readDatesPlayed(uid, setDataTimePlayed);
		}
	}, [patient]);

	useEffect(() => {
		if (dataTimePlayed) {
			setTimePong(AddAllTimes(dataTimePlayed.PONG));
			setTimeSpace(AddAllTimes(dataTimePlayed.SPACE));
			setTimePacman(AddAllTimes(dataTimePlayed.PACMAN));

			// Metodo para unir los tres arrays de juegos
			gameDataByDate(
				dataTimePlayed.PONG,
				dataTimePlayed.SPACE,
				dataTimePlayed.PACMAN
			);
			// Nuevo array con el tiempo total de cada juego
			// Para proceder a obtener la sumatoria total
			const allTimes = [
				{ timePlayed: AddAllTimes(dataTimePlayed.PONG) },
				{ timePlayed: AddAllTimes(dataTimePlayed.SPACE) },
				{ timePlayed: AddAllTimes(dataTimePlayed.PACMAN) },
			];
			setTotalTime(AddAllTimes(allTimes));
		}
	}, [dataTimePlayed]);

	const data = {
		labels: totalDataPlayed ? datesGraph(totalDataPlayed) : null,
		datasets: [
			{
				label: "PONG",
				data: GraphPong,
				borderColor: "#0d6efd",
			},
			{
				label: "SPACE",
				data: GraphSpace,
				borderColor: "#00bb2d",
			},
			{
				label: "PACMAN",
				data: GraphPacman,
				borderColor: "#ffff00",
			},
		],
	};

	const noData = {
		labels: ["**/**/****", "**/**/****", "**/**/****"],
		datasets: [
			{
				label: "Sin Información",
				data: ["4", "2", "3"],
				borderColor: "#0d6efd",
			},
		],
	};

	const options = {
		responsive: true,

		scales: {
			x: {
				grid: {
					display: false,
				},
			},
		},
		plugins: {
			title: {
				display: true,
				text: "Gráfica",
				font: {
					size: 30,
				},
			},
			legend: {
				position: "bottom",
				labels: {
					padding: 28,
					boxWidth: 15,
					fontFamily: "Poppins",
					fontColor: "black",
				},
			},
			tooltip: {
				backgroundColor: "#0d6efd",
				padding: 20,
				titleFont: {
					size: 16,
				},
				bodyFont: {
					size: 14,
					spacing: 10,
				},
				mode: "x",
			},
		},
		elements: {
			line: {
				borderWidth: 5,
				fill: false,
			},
			point: {
				radius: 6,
				borderWidth: 4,
				backgroundColor: "white",
				hoverRadius: 8,
				hoverBorderWidth: 4,
			},
		},
		layout: {
			padding: {
				right: 50,
				left: 50,
			},
		},
	};

	return (
		<>
			<div className="container d-grid">
				<div className="row gap-3">
					{!uid ? (
						<div className="p-3 m-auto">
							<h1>Seleccione al paciente</h1>
							<p>Desde la sección Pacientes</p>
						</div>
					) : null}
					<div className="col-auto bg-white p-3 m-auto m-xl-0">
						<h4 className="fw-bold ">Información</h4>

						<p>
							<strong>Descripción:</strong> <br />{" "}
							{patient ? patient.description : "********"}
						</p>
						<p>
							<strong>Edad del paciente:</strong> <br />{" "}
							{patient ? `${patient.age} años` : "********"}
						</p>
						<div className="row">
							<div className="col-auto d-flex flex-column">
								<strong>Tiempo total:</strong>
								<span className="ms-4">PONG:</span>
								<span className="ms-4 ">SPACE:</span>
								<span className="ms-4 ">PACMAN:</span>
							</div>
							<div className="col-auto d-flex flex-column">
								<span>{totalTime || "********"}</span>
								<span>{timePong || "********"}</span>
								<span>{timeSpace || "********"}</span>
								<span>{timePacman || "********"}</span>
							</div>
						</div>
					</div>

					<div className="col bg-white p-3 h-auto">
						<div className="scroll heighTable">
							<table className="table">
								<thead className="user-select-none">
									<tr>
										<th scope="col">#</th>
										<th scope="col">Fecha</th>
										<th scope="col">Nombre</th>
										<th scope="col">Tiempo (mm:ss)</th>
										<th scope="col">Estado</th>
									</tr>
								</thead>
								{uid ? (
									<tbody>
										{totalDataPlayed
											? totalDataPlayed
													.sort((x, y) => x.date.localeCompare(y.date))
													.map((item) => {
														aux += 1;
														let isComplete = false;

														if (item.timePlayed >= timeIsComplete) {
															isComplete = true;
														}

														return (
															<tr key={aux}>
																<th scope="row">{aux}</th>
																<td>{item.date}</td>
																<td>{item.name}</td>
																<td>{item.timePlayed}</td>
																<td>
																	<span
																		className={`badge ${
																			isComplete ? "bg-success" : "bg-secondary"
																		}`}
																	>
																		{isComplete ? "Completado" : "Insuficiente"}
																	</span>
																</td>
															</tr>
														);
													})
											: null}
									</tbody>
								) : (
									<tbody>
										<tr>
											<th scope="row">*</th>
											<td>**/**/****</td>
											<td>******** </td>
											<td>********</td>
											<td>
												<span className="badge bg-secondary">********</span>
											</td>
										</tr>
									</tbody>
								)}
							</table>
						</div>
					</div>
				</div>

				<div className="row gap-3 mt-3">
					<div className="col bg-white p-3">
						<Line data={uid ? data : noData} options={options} />
					</div>
				</div>
			</div>
			<style jsx>
				{`
					.photo {
						font-size: 50px;
						height: 69.6px;
						object-fit: contain;
					}

					.avatarSelectedPatient {
						font-size: 35px;
						width: 50px;
						object-fit: contain;
						margin: 0;
					}

					.heighTable {
						height: 95%;
					}
				`}
			</style>
		</>
	);
}

estadisticas.getLayout = function getLayout(page) {
	return <AdminLayout>{page} </AdminLayout>;
};

export async function getServerSideProps(ctx) {
	const { query } = ctx;
	const { uid } = query;
	let vUid = null;

	if (uid) {
		vUid = uid;
	}

	return {
		props: { uid: vUid }, // will be passed to the page component as props
	};
}
