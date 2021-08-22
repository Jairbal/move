/* eslint-disable camelcase */
import { Line } from "react-chartjs-2";
import AdminLayout from "components/AdminLayout";

export default function estadisticas() {
	const data = {
		labels: ["11/08/2021", "12/08/2021", "13/08/2021"],
		datasets: [
			{
				label: "Actividad 1",
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
					<div className="col-auto bg-white p-3 m-auto m-xl-0">
						<h4 className="fw-bold ">Información</h4>

						<p>
							<strong>Caso a tratar:</strong> <br /> Lesión en el Hombro
						</p>
						<p>
							<strong>Edad del paciente:</strong> <br /> 30 años
						</p>
						<div className="row">
							<div className="col-auto d-flex flex-column">
								<strong>Tiempo total:</strong>
								<span className="ms-4">Actividad 1:</span>
								<span className="ms-4 ">Actividad 2:</span>
								<span className="ms-4 ">Actividad 3:</span>
								<span className="ms-4 ">Actividad 4:</span>
							</div>
							<div className="col-auto d-flex flex-column">
								<span>5 horas</span>
								<span>1 hora:</span>
								<span>2 horas</span>
								<span>1 hora 30 min</span>
								<span>20 min</span>
							</div>
						</div>
					</div>

					<div className="col bg-white p-3 ">
						<table className="table">
							<thead className="user-select-none">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Fecha</th>
									<th scope="col">Nombre</th>
									<th scope="col">Tiempo Cumplido</th>
									<th scope="col">Estado</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">1</th>
									<td>14/08/2021</td>
									<td>Actividad 1</td>
									<td>10 minutos</td>
									<td>
										<span className="badge bg-success">Completado</span>
									</td>
								</tr>
								<tr>
									<th scope="row">2</th>
									<td>15/08/2021</td>
									<td>Actividad 2</td>
									<td>8 minutos</td>
									<td>
										<span className="badge bg-secondary">Satisfactorio</span>
									</td>
								</tr>
								<tr>
									<th scope="row">3</th>
									<td colSpan="2">16/08/2021</td>
									<td>5 minutos</td>
									<td>
										<span className="badge bg-danger">Insatisactorio</span>
									</td>
								</tr>
								<tr>
									<th scope="row">4</th>
									<td colSpan="2">16/08/2021</td>
									<td>5 minutos</td>
									<td>
										<span className="badge bg-danger">Insatisactorio</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div className="row gap-3 mt-3">
					<div className="col bg-white p-3">
						<Line data={data} options={options} />
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
				`}
			</style>
		</>
	);
}

estadisticas.getLayout = function getLayout(page) {
	return <AdminLayout>{page} </AdminLayout>;
};
