/* eslint-disable no-console */
import { deleteDoc } from "firebase/client";

export default function ModalDeletePatient({ idPatient, uid = null }) {
	const handleDeletePatient = () => {
		deleteDoc("patients", idPatient)
			.then(() => {
				if (uid) {
					fetch("http://localhost:3000/api/deleteUser", {
						method: "post",
						body: JSON.stringify({ uid }),
					})
						.then((response) => {
							if (response.status === 200) {
								console.log("USUARIO ELIMINADO");
							}
						})
						.catch((err) => console.log(err));
				}

				const buttonClose = document.getElementById("modalDeletePatientClose");
				buttonClose.click();
			})
			.catch((err) => console.log(err));
	};

	return (
		<>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title" id="exampleModalLabel">
							Esta usted seguro/a de eliminar al paciente ?
						</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						/>
					</div>
					<div className="modal-footer">
						<button
							id="modalDeletePatientClose"
							type="button"
							className="btn btn-outline-secondary"
							data-bs-dismiss="modal"
						>
							Cancelar
						</button>
						<button
							type="button"
							onClick={handleDeletePatient}
							form="registerForm"
							className="btn btn-outline-danger"
						>
							Eliminar Paciente
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
