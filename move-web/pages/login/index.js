import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import useUser from "hooks/useUser";
import Link from "next/link";
import { loginWithEmail } from "firebase/client";
import { AuthContext } from "context/AuthContext";
import styles, { globalStyles } from "../../styles/Login/styles";

export default function Login() {
	const user = useUser();
	const [viewPassword, setViewPassword] = useState(false);
	const [error, setError] = useState({
		isError: false,
		message: "",
	});
	const [data, setData] = useState({
		email: "",
		password: "",
		remember: "off",
	});

	const { email, password } = data;

	const { authUserTherapist, authUserPatient } = useContext(AuthContext);
	const router = useRouter();

	/* 	useEffect(() => {
		onAuthStateChanged((user) => setDataUser(user));
	}, []); */

	useEffect(() => {
		if (authUserTherapist) {
			router.replace("/adminpage");
		} else if (authUserPatient) {
			router.replace("/Home");
		}
	}, [authUserTherapist, authUserPatient]);

	const handleViewPassword = () => {
		if (viewPassword) {
			setViewPassword(false);
		} else {
			setViewPassword(true);
		}
	};

	const handleChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (email.trim() === "" || password.trim() === "") {
			setError({
				isError: true,
				message: "Necesita completar todos los campos !",
			});
			return;
		}

		loginWithEmail(email, password)
			.then(() => {
				setError({
					isError: false,
					message: "",
				});
			})
			.catch(() => {
				setError({
					isError: true,
					message: "Email y/o contraseña incorrectos !",
				});
			});
	};

	return (
		<>
			<main className="container">
				<h1 className="position-absolute  text-white user-select-none">
					<Link href="/">Proyecto Tesis</Link>
				</h1>

				<form
					className="shadow p-3 mb-5 bg-body rounded needs-validation"
					onSubmit={handleSubmit}
					noValidate
				>
					<h2 className="link-primary text-center user-select-none m-4">
						Inicio de Sesión
					</h2>

					<div className="form-floating mb-4">
						<input
							onChange={handleChange}
							type="email"
							name="email"
							className="form-control "
							id="floatingInput "
							placeholder="name@example.com"
							required
						/>
						<label htmlFor="floatingInput ">Email</label>
					</div>

					<div className=" form-floating input-group mb-4">
						<input
							onChange={handleChange}
							type={viewPassword ? "text" : "password"}
							name="password"
							className="form-control"
							id="floatingPassword validationServer01"
							placeholder="Password"
						/>
						<label htmlFor="floatingPassword ">Contraseña</label>
						<button
							onClick={handleViewPassword}
							className="btn btn-outline-primary "
							type="button"
							id="button-addon"
						>
							<i
								className={
									viewPassword ? "bi-eye-slash-fill" : "bi bi-eye-fill"
								}
							/>
						</button>
					</div>

					<p
						className={`text-danger  ps-2 ${
							error.isError ? "d-block" : "d-none"
						} `}
					>
						{error.message}
					</p>

					<p className="text-primary ps-2 textOutline pAutoWidth">
						{" "}
						<Link href="/">Has olvidado tu contraseña?</Link>
					</p>

					<div className="d-grid col-6 mx-auto">
						<button type="submit" className="btn btn-outline-primary m-2">
							Iniciar Sesión
						</button>
					</div>

					{user === undefined ? (
						<p>SIN LOGEAR</p>
					) : (
						<Link href="/AdminPage">LOGEADO</Link>
					)}
				</form>
			</main>

			<ul className="circles">
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
				<li />
			</ul>

			<style jsx global>
				{globalStyles}
			</style>
			<style jsx>{styles}</style>
		</>
	);
}
