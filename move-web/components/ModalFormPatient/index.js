/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerPatient, updatePatient, deleteImg } from "firebase/client";
import useHandleImg from "hooks/useHandleImg";
import * as yup from "yup";
import Image from "next/image";

export default function ModalFormPatient({
	isUpdate,
	setIsUpdate,
	selectedPatient,
}) {
	const validationSchemaRegister = yup.object().shape({
		name: yup
			.string()
			.required("Los nombres completos son requeridos")
			.matches(
				/^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ'])?$/,
				"Nombres no válidos"
			),
		age: yup
			.string()
			.required("La edad es requerida")
			.matches(/^[0-9]+$/, "Verifique el campo edad"),
		ci: yup
			.string()
			.required("El número de cédula es requerido")
			.matches(/^(0[1-9]|1[0-9]|2[0-4]|30)[0-5]\d{6}\d{1}/, "Cédula no válida")
			.matches(/^[0-9]+$/, "Verifique el campo cédula")
			.min(10, "no puede ser menos de 10 caracteres")
			.max(10, "No puede ser más de 10 caracteres"),
		phone: yup
			.string()
			.required("El número de teléfono es requerido")
			.matches(/^09[0-9]{8}$/, "Número de teléfono no válido")
			.max(10, "El numero no debe ser mas de 10 caracteres"),
		email: yup
			.string()
			.required("El correo es requerido")
			.matches(
				/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
				"Correo no válido"
			),
		password: yup
			.string()
			.required("La contraseña es requerida")
			.min(6, "La contraseña debe tener más de 6 caracteres"),
		repeatPassword: yup
			.string()
			.oneOf([yup.ref("password"), null], "La contraseña no coincide")
			.required("Verifique el campo repetir contraseña"),
	});

	const validationSchemaUpdate = yup.object().shape({
		name: yup
			.string()
			.required("Los nombres completos son requeridos")
			.matches(
				/^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ'])?$/,
				"Nombres no válidos"
			),
		age: yup
			.string()
			.required("La edad es requerida")
			.matches(/^[0-9]+$/, "Verifique el campo edad"),
		ci: yup
			.string()
			.required("El número de cédula es requerido")
			.matches(/^(0[1-9]|1[0-9]|2[0-4]|30)[0-5]\d{6}\d{1}/, "Cédula no válida")
			.matches(/^[0-9]+$/, "Verifique el campo cédula")
			.min(10, "no puede ser menos de 10 caracteres")
			.max(10, "No puede ser más de 10 caracteres"),
		phone: yup
			.string()
			.required("El número de teléfono es requerido")
			.matches(/^09[0-9]{8}$/, "Número de teléfono no válido")
			.max(10, "El numero no debe ser mas de 10 caracteres"),
	});

	const [verifiedEmail, setVerifiedEmail] = useState(null);
	const [avatar, setAvatar] = useState(null);
	const [paths, setPaths, handleImg] = useHandleImg();
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm({
		resolver: yupResolver(
			isUpdate ? validationSchemaUpdate : validationSchemaRegister
		),
	});

	const handleImage = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setAvatar(e.target.files[0]);
		}
	};

	const hanldeUpdateCloseModal = () => {
		setIsUpdate(false);
		setPaths(null);
		reset();
	};

	useEffect(() => {
		const myModal = document.getElementById("registerUserModal");
		myModal.addEventListener("hidden.bs.modal", hanldeUpdateCloseModal);
		if (isUpdate) {
			setValue("name", selectedPatient.name);
			setValue("age", selectedPatient.age);
			setValue("ci", selectedPatient.ci);
			setValue("phone", selectedPatient.phone);
			setValue("sex", selectedPatient.sex);
			setValue("address", selectedPatient.address);
			setValue("profession", selectedPatient.profession);
			setValue("hobbie", selectedPatient.hobbie);
			setValue("description", selectedPatient.description);
		}
		// @refresh reset
		return () => {
			myModal.removeEventListener("hidden.bs.modal", hanldeUpdateCloseModal);
			// @refresh reset
		};
	}, [isUpdate]);

	const onSubmit = (values) => {
		// eslint-disable-next-line no-console
		if (isUpdate) {
			console.log("entro", values);
			if (avatar) {
				console.log("con avatar", avatar);
				if (selectedPatient.avatar) {
					deleteImg(selectedPatient.avatar);
				}
				updatePatient({ ...values, avatar }, selectedPatient.id);
			} else {
				if (selectedPatient.avatar) {
					values.containAvatar = selectedPatient.avatar;
				}
				updatePatient(values, selectedPatient.id);
			}
			setAvatar(null);
			setVerifiedEmail(null);
			setIsUpdate(false);
			setPaths(null);
			reset();
			// @refresh reset
			const buttonClose = document.getElementById("modalClose");
			buttonClose.click();
		} else {
			const { name, email, password } = values;
			fetch("http://localhost:3000/api/createUser", {
				method: "post",
				body: JSON.stringify({ name, email, password }),
			})
				.then((res) => res.json())
				.then((json) => {
					const { uid } = json;
					values.uid = uid;
					values.name = name.toUpperCase();
					if (avatar) {
						registerPatient({ ...values, avatar });
					} else {
						registerPatient(values);
					}
					setAvatar(null);
					setVerifiedEmail(null);
					setIsUpdate(false);
					setPaths(null);
					reset();
					const buttonClose = document.getElementById("modalClose");
					buttonClose.click();
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	return (
		<div className="modal-dialog modal-dialog-scrollable ">
			<div className="modal-content">
				<div className="modal-header">
					<h5 className="modal-title" id="exampleModalLabel">
						{isUpdate ? "Actualizar paciente" : "Registrar nuevo paciente"}
					</h5>
					<button
						type="button"
						className="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
					/>
				</div>
				<div className="modal-body p-10 scroll">
					<form
						id="registerForm"
						onSubmit={handleSubmit(onSubmit)}
						autoComplete="off"
					>
						<div className=" row gap-3">
							<div className="col-lg">
								<div className="mb-3">
									<label htmlFor="inputName" className="form-label">
										Nombre
									</label>
									<input
										{...register("name")}
										type="text"
										className="form-control mb-3"
										id="inputName"
										name="name"
									/>
									{errors.name && (
										<span className="text-danger text-small d-block mb-2">
											{errors.name.message}
										</span>
									)}
									<label htmlFor="inputAge" className="form-label">
										Edad
									</label>
									<input
										{...register("age")}
										type="number"
										className="form-control mb-3"
										id="inputAge"
										name="age"
									/>
									{errors.age && (
										<span className="text-danger text-small d-block mb-2">
											{errors.age.message}
										</span>
									)}
									<label htmlFor="inputCI" className="form-label">
										Cedula
									</label>
									<input
										{...register("ci")}
										type="text"
										className="form-control mb-3"
										id="inputCI"
										name="ci"
									/>
									{errors.ci && (
										<span className="text-danger text-small d-block mb-2">
											{errors.ci.message}
										</span>
									)}

									<label htmlFor="inputPhone" className="form-label">
										Celular
									</label>
									<input
										{...register("phone", {
											minLength: 10,
											maxLength: 10,
										})}
										type="text"
										className="form-control mb-3"
										id="inputPhone"
										name="phone"
									/>
									{errors.phone && (
										<span className="text-danger text-small d-block mb-2">
											{errors.phone.message}
										</span>
									)}
									<label htmlFor="inputFM" className="form-label">
										Sexo
									</label>
									<select
										{...register("sex")}
										className="form-select mb-3"
										aria-label="Default select example"
										id="inputFM"
										name="sex"
									>
										<option value="Seleccionar" disabled>
											Seleccionar
										</option>
										<option value="Masculino">Masculino</option>
										<option value="Femenino">Femenino</option>
									</select>
									<label htmlFor="inputAddres" className="form-label">
										Dirección / Ciudad
									</label>
									<input
										{...register("address")}
										type="text"
										className="form-control mb-3"
										id="inputAddres"
										name="address"
									/>
									<label htmlFor="inputProfession" className="form-label">
										Profesión / Ocupación
									</label>
									<input
										{...register("profession")}
										type="text"
										className="form-control mb-3"
										id="inputProfession"
										name="profession"
									/>
									<label htmlFor="inputSport" className="form-label">
										Deporte / Hobbie
									</label>
									<input
										{...register("hobbie")}
										type="text"
										className="form-control mb-3"
										id="inputSport"
										name="hobbie"
									/>
									<label htmlFor="inputDescription" className="form-label">
										Diagnóstico
									</label>
									<textarea
										{...register("description")}
										className="form-control scroll"
										id="inputDescription"
										placeholder="Descripción ..."
										name="description"
									/>
								</div>
							</div>
							{isUpdate ? (
								<div className="mb-3 d-flex flex-column align-items-center">
									{selectedPatient.urlAvatar || paths?.avatar ? (
										// eslint-disable-next-line jsx-a11y/img-redundant-alt
										<img
											className="rounded-circle photo"
											src={
												paths?.avatar ? paths.avatar : selectedPatient.urlAvatar
											}
											alt="Picture of the author"
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
											handleImage(e);
											handleImg(e);
										}}
									/>
									<label
										type="button"
										className="btn btn-outline-primary mt-3"
										htmlFor="avatar"
									>
										Agregar Foto
									</label>
								</div>
							) : (
								<div className="col-lg">
									<label htmlFor="InputEmail" className="form-label">
										Correo Electrónico
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
									{verifiedEmail && (
										<span className="text-danger text-small d-block mb-2">
											{verifiedEmail}
										</span>
									)}
									<div className="mb-3">
										<label htmlFor="inputPassword" className="form-label">
											Contraseña
										</label>
										<input
											{...register("password", {
												required: "La contraseña es requerida",
												minLength: {
													value: 6,
													message:
														"La contraseña debe tener más de 6 caracteres",
												},
											})}
											type="password"
											className="form-control mb-3"
											id="inputPassword"
											name="password"
										/>
										{errors.password && (
											<span className="text-danger text-small d-block mb-2">
												{errors.password.message}
											</span>
										)}
										<label htmlFor="inputRepeatPassword" className="form-label">
											Repetir Contraseña
										</label>
										<input
											{...register("repeatPassword", {
												required: "La contraseña es requerida",
											})}
											type="password"
											className="form-control mb-4"
											id="inputRepeatPassword"
											name="repeatPassword"
										/>
										{errors.repeatPassword && (
											<span className="text-danger text-small d-block mb-2">
												{errors.repeatPassword.message}
											</span>
										)}
										<div className="mb-3 d-flex flex-column align-items-center">
											{paths?.avatar ? (
												<Image
													className="rounded-circle photo"
													src={paths.avatar}
													alt="Picture of the author"
													width={70}
													height={69.6}
													name="avatar"
												/>
											) : (
												<i className="bi bi-person-circle photo fs-1" />
											)}
											<input
												id="avatar"
												accept="image/*"
												type="file"
												name="avatar"
												className="d-none "
												onChange={(e) => {
													handleImage(e);
													handleImg(e);
												}}
											/>
											<label
												type="button"
												className="btn btn-outline-primary mt-3"
												htmlFor="avatar"
											>
												Agregar Foto
											</label>
										</div>
									</div>
								</div>
							)}
						</div>
					</form>
				</div>
				<div className="modal-footer">
					<button
						id="modalClose"
						type="button"
						className="btn btn-outline-secondary"
						data-bs-dismiss="modal"
					>
						Cancelar
					</button>
					<button
						type="submit"
						form="registerForm"
						className="btn btn-outline-primary"
					>
						{isUpdate ? "Actualizar Paciente" : "Registrar Paciente"}
					</button>
				</div>
			</div>
		</div>
	);
}
