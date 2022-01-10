/* eslint-disable no-console */

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { restorePasswordWithEmail } from "firebase/client";

export default function ModalRestorePassword() {
	const validationSchema = yup.object().shape({
		email: yup
			.string()
			.required("El correo es requerido")
			.matches(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
				"Correo no válido"
			),
	});

	const {
		handleSubmit,
		register,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(validationSchema),
	});

	const handleRestorePassword = (values) => {
		const { email } = values;

		restorePasswordWithEmail(email)
			.then(() => {
				// eslint-disable-next-line no-alert
				alert("Correo enviado");
				const buttonClose = document.getElementById(
					"closeModalRestorePassword"
				);
				buttonClose.click();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleCloseModal = () => {
		reset();
	};

	return (
		<>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<form
							id="restorePasswordForm"
							onSubmit={handleSubmit(handleRestorePassword)}
						>
							<h5 className="modal-title" id="exampleModalLabel">
								Recuperar contraseña
							</h5>
							<label htmlFor="InputEmail" className="form-label">
								Ingrese el correo e lectrónico
							</label>
							<input
								{...register("email", {
									required: "El email es requerido",
								})}
								type="email"
								className="form-control mb-3"
								id="InputEmail"
								aria-describedby="emailHelp"
								name="email"
								autoComplete="none"
							/>
							{errors.email && (
								<span className="text-danger text-small d-block mb-2">
									{errors.email.message}
								</span>
							)}
						</form>
					</div>
					<div className="modal-footer">
						<button
							id="closeModalRestorePassword"
							type="button"
							onClick={handleCloseModal}
							className="btn btn-outline-secondary"
							data-bs-dismiss="modal"
						>
							Cancelar
						</button>
						<button
							type="submit"
							form="restorePasswordForm"
							className="btn btn-outline-primary"
						>
							Enviar
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
