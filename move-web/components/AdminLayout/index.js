import Link from "next/link";
import { useContext } from "react";
import { useRouter } from "next/router";
import { AuthContext } from "context/AuthContext";

export default function AdminLayout({ handleSingOut, children }) {
	const { authUserTherapist } = useContext(AuthContext);

	const router = useRouter();
	const subMenu = router.pathname;

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
										subMenu === "/admin_pacientes" && "nav-link pt-0 ps-0 pe-0"
									} ${subMenu === null && "nav-link pt-0 ps-0 pe-0"}`}
								>
									<Link href="admin_pacientes">
										<p
											className="align-middle px-0 cursorPointer"
											data-bs-toggle="tooltip"
											title="Pacientes"
										>
											<i id="Pacientes" className="fs-4 bi bi-people-fill" />
											<span className="ms-1 d-none d-md-inline">Pacientes</span>
										</p>
									</Link>
								</li>
								<li
									className={`elementClick nav-item pb-4  ${
										subMenu === "/admin_estadisticas" &&
										"nav-link pt-0 ps-0 pe-0"
									}`}
								>
									<Link href="admin_estadisticas">
										<p
											className="align-middle px-0 cursorPointer"
											data-bs-toggle="tooltip"
											title="Estadísticas"
										>
											<i
												id="Estadísticas"
												className="fs-4 bi bi-clipboard-data"
											/>
											<span className="ms-1 d-none d-md-inline">
												Estadísticas
											</span>
										</p>
									</Link>
								</li>
								<li
									className={`elementClick nav-item pb-4  ${
										subMenu === "/admin_juegos" && "nav-link pt-0 ps-0 pe-0"
									}`}
								>
									<Link href="admin_juegos">
										<p
											className="align-middle px-0 cursorPointer"
											data-bs-toggle="tooltip"
											title="Juegos"
										>
											<i id="Juegos" className="fs-4 bi bi-joystick" />
											<span className="ms-1 d-none d-md-inline">Juegos</span>
										</p>
									</Link>
								</li>
								<li
									className={`elementClick nav-item pb-4  ${
										subMenu === "/admin_ajustes" && "nav-link pt-0 ps-0 pe-0"
									}`}
								>
									<Link href="admin_ajustes">
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
										{authUserTherapist ? authUserTherapist.name : "####"}
									</span>
								</p>
								<ul
									className="dropdown-menu dropdown-menu-dark text-small shadow"
									aria-labelledby="dropdownUser1"
								>
									<li>
										<button type="button" className=" dropdown-item" href="/">
											Perfil
										</button>
									</li>
									<li>
										<hr className="dropdown-divider" />
									</li>
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
