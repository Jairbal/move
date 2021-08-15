import useHandleImg from "hooks/useHandleImg";

export default function AdminSettings() {
	const [paths, setPaths, handleImg] = useHandleImg();
	return (
		<>
			<div className="container d-grid ">
				<div className="row gap-3">
					<div className="col-auto col-lg-5 bg-white  m-auto m-lg-0 d-flex flex-column align-items-center ">
						<h4 className="fw-bold mt-2">Cambio de Contraseña</h4>
						<form className="d-flex  flex-column align-items-center">
							<div className="form-floating mb-3">
								<input
									type="password"
									className="form-control"
									id="floatingPassword"
									placeholder="Contraseña"
								/>
								<label htmlFor="floatingPassword">Contraseña</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="password"
									className="form-control"
									id="floatingRepeatPassword"
									placeholder="Repetir Contraseña"
								/>
								<label htmlFor="floatingRepeatPassword">
									Repetir Contraseña
								</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="password"
									className="form-control"
									id="floatingNewPassword"
									placeholder="Nueva Contraseña"
								/>
								<label htmlFor="floatingNewPassword">Nueva contraseña</label>
							</div>
							<button type="button" className="btn btn-outline-primary mb-3">
								Cambiar contraseña
							</button>
						</form>
					</div>
					{/* Fila 1 Columna 2 */}
					<div className="col-auto m-auto mt-0 ms-lg-0 bg-white  d-flex flex-column align-items-center">
						<h4 className="fw-bold mt-2">Cambio de Foto</h4>

						{paths?.avatar ? (
							<img
								className="rounded-circle photo"
								src={paths.avatar}
								alt="avatar"
								width={70}
								height={69.6}
								name="avatar"
							/>
						) : (
							<i className="bi bi-person-circle photo" />
						)}
						<input
							id="avatar"
							accept="image/*"
							type="file"
							name="avatar"
							className="d-none "
							onChange={(e) => {
								handleImg(e);
							}}
						/>
						<label
							type="button"
							className="btn btn-outline-primary mt-3 mb-3 "
							htmlFor="avatar"
						>
							Cambiar Foto
						</label>
					</div>
				</div>
			</div>
			<hr />
			<div className="row mt-3">
				<div className="row gap-3 d-flex m-auto flex-column align-items-center">
					{/* Fila 2 Columna 1  */}
					<div className="col-10 bg-white mb-3">
						<h4 className="fw-bold mt-2">Agregar nuevo dispositivo</h4>
						<form className="d-flex flex-column flex-xl-row mb-3 mt-3 align-items-center justify-content-center ">
							<div className="form-floating  me-3 mb-3">
								<input
									type="text"
									className="form-control form-control-sm "
									id="floatingInputID"
									placeholder="ID Dispositivo"
								/>
								<label htmlFor="floatingInputID">ID Dispositivo</label>
							</div>
							<div className="form-floating  me-3 mb-3">
								<input
									type="text"
									className="form-control form-control-sm"
									id="floatingInputName"
									placeholder="Nombre del dispositivo"
								/>
								<label htmlFor="floatingInputName">
									Nombre del dispositivo
								</label>
							</div>
							<span className="text-sm mb-3 m-xl-0 me-xl-3">
								Nota: Por favor, encender el dispositivo antes de proceder a
								agregarlo
							</span>
							<button type="button" className="btn btn-outline-primary">
								Agregar
							</button>
						</form>
					</div>
					{/* Fila 2 Columna 2  */}
					<div className="col-10 bg-white">
						<h4 className="fw-bold mt-2">Dispositivos agregados</h4>
						<table className="table">
							<thead className="user-select-none">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Registrado</th>
									<th scope="col">Nombre</th>
									<th scope="col">ID</th>
									<th scope="col">Acciones</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row">1</th>
									<td>14/08/2021</td>
									<td>Dispositivo 1</td>
									<td>fd289sadas8</td>
									<td>
										<i className="bi bi-trash link-primary cursorPointer fs-5" />
									</td>
								</tr>
								<tr>
									<th scope="row">2</th>
									<td>Jacob</td>
									<td>Thornton</td>
									<td>@fat</td>
									<td>
										<i className="bi bi-trash link-primary cursorPointer fs-5" />
									</td>
								</tr>
								<tr>
									<th scope="row">3</th>
									<td>Larry the Bird</td>
									<td>Larry s Bird</td>
									<td>@twitter</td>
									<td>
										<i className="bi bi-trash link-primary cursorPointer fs-5" />
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					{/* Fila 2 Columna 1 */}
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
