/* eslint-disable consistent-return */
import { useState, useContext } from "react";
import { AuthContext } from "context/AuthContext";
import PatientLayout from "components/PatientLayout";
import { updatePassword } from "firebase/client";

export default function ajustes() {
	const [readNewPassword, setReadNewPassword] = useState({
		newPassword: "",
		repeatNewPassword: "",
	});
	const [messageError, setMessageError] = useState(null);
	const [validateUpdate, setValidateUpdate] = useState(null);

	const { handleSingOut } = useContext(AuthContext);

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
	return <PatientLayout>{page} </PatientLayout>;
};
