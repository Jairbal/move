import Link from "next/link";
import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "context/AuthContext";
// import { PatientPageContext } from "context/PatientPageContext";

export default function PatientLayout({ children }) {
	const {
		user,
		authUserPatient,
		authUserTherapist,
		handleSingOut,
		resetStatesAuth,
	} = useContext(AuthContext);

	const router = useRouter();
	const subMenu = router.pathname;

	let displayName = "";
	if (authUserPatient) {
		const stringsplit = authUserPatient.name.split(" ");
		const [firstName] = stringsplit;
		displayName = firstName;
	}

	useEffect(() => {
		if (authUserTherapist) {
			router.replace("/admin/pacientes");
		}
		if (user === null) {
			resetStatesAuth();
		}
	}, [authUserTherapist, user]);

	if (!authUserPatient) {
		return null;
	}

	return (
		<>
			<div className="container-fluid ">
				<div className="row flex-nowrap min-vh-100  width-100">
					<div className="  col-auto px-sm-2 px-0 bg-dark">
						<div className="d-flex flex-column align-items-center align-items-xl-start  pt-2 text-white  min-vh-100 ">
							<Link
								href="/"
								className="d-flex align-items-center pb-3 mb-xl-0 me-xl-auto text-white text-decoration-none cursorPointer"
							>
								<span className="fs-5 d-none d-sm-inline m-3 elementClick cursorPointer">
									MO
									<strong className="text-primary">VE</strong>
								</span>
							</Link>
							<hr />
							<ul className="nav nav-pills flex-column mb-auto align-items-xl-start">
								<li
									className={`elementClick nav-item pb-4 ${
										subMenu === "/actividades" && "nav-link pt-0 ps-0 pe-0"
									} ${subMenu === null && "nav-link pt-0 ps-0 pe-0"}`}
								>
									<Link href="/actividades">
										<p
											className="align-middle px-0 cursorPointer"
											data-bs-toggle="tooltip"
											title="Actividades"
										>
											<i id="Actividades" className="fs-4 bi bi-joystick" />
											<span className="ms-1 d-none d-md-inline">
												Actividades
											</span>
										</p>
									</Link>
								</li>
								<li
									className={`elementClick nav-item pb-4  ${
										subMenu === "/estadisticas" && "nav-link pt-0 ps-0 pe-0"
									}`}
								>
									<Link href="/estadisticas">
										<p
											className="align-middle px-0 cursorPointer"
											data-bs-toggle="tooltip"
											title="/Estadísticas"
										>
											<i
												id="Estadísticas"
												className="fs-4 bi bi-clipboard-data"
											/>
											<span className="ms-1 d-none d-md-inline">
												Estadisticas
											</span>
										</p>
									</Link>
								</li>
								<li
									className={`elementClick nav-item pb-4  ${
										subMenu === "/ajustes" && "nav-link pt-0 ps-0 pe-0"
									}`}
								>
									<Link href="/ajustes">
										<p
											className="align-middle px-0 cursorPointer"
											data-bs-toggle="tooltip"
											title="Ajustes"
										>
											<i id="Ajustes" className="fs-4 bi bi-gear-fill" />
											<span className="ms-1 d-none d-md-inline">Ajustes</span>
										</p>
									</Link>
								</li>
							</ul>

							<hr />
							<div className="dropdown p-1 pb-4 cursorPointer elementClick">
								<p
									className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
									id="dropdownUser1"
									data-bs-toggle="dropdown"
									aria-expanded="false"
								>
									<img
										src="https://github.com/mdo.png"
										alt="perfil"
										width="35"
										height="35"
										className="rounded-circle"
									/>
									<span className="d-none d-sm-inline mx-1">
										{authUserPatient ? displayName : "####"}
									</span>
								</p>
								<ul
									className="dropdown-menu dropdown-menu-dark text-small shadow"
									aria-labelledby="dropdownUser1"
								>
									<li onClick={handleSingOut}>
										{" "}
										<p className="dropdown-item">Cerrar Sesión</p>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="col py-3 bg-light vh-100 scroll scroll-x">
						{children}
					</div>
				</div>
			</div>

			<style jsx>
				{`

					.sidebar {
						position: fixed;
						display: flex;
						flex-direction: column;
						width: 200px
						height: 100%
					}

					.elementClick:active {
						transform: scale(0.97);
					}
				`}
			</style>
		</>
	);
}
