/* eslint-disable consistent-return */
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "context/AuthContext";
import { updatePassword, fetchAgents } from "firebase/client";
import AdminLayout from "components/AdminLayout";

export default function ajustes() {
	const [readNewPassword, setReadNewPassword] = useState({
		newPassword: "",
		repeatNewPassword: "",
	});
	const [messageError, setMessageError] = useState(null);
	const [validateUpdate, setValidateUpdate] = useState(null);
	const [agents, setAgents] = useState([]);

	const { handleSingOut } = useContext(AuthContext);
	let countRow = 0;

	useEffect(() => {
		fetchAgents(setAgents);
	}, []);

	const handlerReadInput = (e) => {
		setReadNewPassword({
			...readNewPassword,
			[e.target.name]: e.target.value,
		});
	};

	const { newPassword, repeatNewPassword } = readNewPassword;
	const onUpdatePassword = (e) => {
		e.preventDefault();
		// Validar State
		if (readNewPassword) {
			// Si falta un campo
			if (!newPassword || !repeatNewPassword) {
				setMessageError("Complete los campos");
				return null;
			}
			// Si tiene menos de 6 caracteres
			if (newPassword.length < 6) {
				setMessageError("Debe ingresar minimo 6 caracteres");
				return null;
			}
			// Si no se parecen las contraseñás
			if (newPassword !== repeatNewPassword) {
				setMessageError("Contraseñas no coinciden");
				return null;
			}

			// Una vez cumplida las validaciones
			updatePassword(newPassword);
			setMessageError(null);
			setValidateUpdate("Contraseña actualizada, vuelva a iniciar sesión");
			setTimeout(() => {
				handleSingOut();
			}, 4000);
		} else {
			setMessageError("Complete los campos");
		}
	};

	return (
		<>
			<div className="container d-grid ">
				<div className="row gap-3 d-flex justify-content-center">
					<div className="col-auto col-lg-5 bg-white  m-auto m-lg-0 d-flex  flex-column align-items-center ">
						<h4 className="fw-bold mt-2">Cambio de Contraseña</h4>
						<form
							onSubmit={onUpdatePassword}
							className="d-flex  flex-column  align-items-center"
						>
							<div className="form-floating mb-3">
								<input
									type="password"
									className="form-control"
									id="floatingPassword"
									name="newPassword"
									placeholder="Nueva Contraseña"
									onChange={handlerReadInput}
								/>
								<label htmlFor="floatingPassword">Nueva Contraseña</label>
							</div>
							<div className="form-floating mb-3">
								<input
									type="password"
									className="form-control"
									id="floatingRepeatPassword"
									name="repeatNewPassword"
									placeholder="Repetir Contraseña"
									onChange={handlerReadInput}
								/>
								<label htmlFor="floatingRepeatPassword">
									Repetir Contraseña
								</label>
							</div>
							{messageError && <p className="h6 text-danger">{messageError}</p>}
							{validateUpdate && (
								<p className="h6 text-success">{validateUpdate}</p>
							)}
							<p className="h6">
								<strong>Nota:</strong> Al cambiar su contraseña tendra que
								volver a iniciar sesión
							</p>
							<button type="submit" className="btn btn-outline-primary mb-3">
								Cambiar contraseña
							</button>
						</form>
					</div>
				</div>
			</div>
			<hr />
			<div className="row mt-3">
				<div className="row gap-3 d-flex m-auto flex-column align-items-center">
					{/* Fila 2 Columna 2  */}
					<div className="col-10 bg-white">
						<h4 className="fw-bold mt-2">Dispositivos agregados</h4>
						<table className="table">
							<thead className="user-select-none">
								<tr>
									<th scope="col">#</th>
									<th scope="col">Nombre</th>
									<th scope="col">ID</th>
									<th scope="col">Acciones</th>
								</tr>
							</thead>
							<tbody>
								{agents.map((agent) => {
									countRow += 1;
									return (
										<tr key={agent.id}>
											<th scope="row">{countRow}</th>
											<td>{agent.name}</td>
											<td>{agent.agentId}</td>
											<td>
												<i className="bi bi-pencil-square link-primary cursorPointer fs-5" />
											</td>
										</tr>
									);
								})}
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

ajustes.getLayout = function getLayout(page) {
	return <AdminLayout>{page} </AdminLayout>;
};
