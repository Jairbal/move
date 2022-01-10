/* eslint-disable camelcase */
import useHandleImg from "hooks/useHandleImg";
import AdminLayout from "components/AdminLayout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContext";
import { fetchDevices } from "firebase/client";

export default function ajustes() {
<<<<<<< HEAD
	// eslint-disable-next-line no-unused-vars
	const [paths, setPaths, handleImg] = useHandleImg();
	return (
		<>
			<div className="container d-grid ">
				<div className="row gap-3">
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
					<div className="col-10 bg-white">
						<h4 className="fw-bold mt-2">Dispositivos Existentes</h4>
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
=======
  const { authUserTherapist } = useContext(AuthContext);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    if (authUserTherapist) {
      fetchDevices(setDevices);
    }
  }, [authUserTherapist]);
>>>>>>> 284dc2a88272c00c18800fa0e2d23e16ea6e3e90

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
          {/* Fila 2 Columna 2  */}
          <div className="col-10 bg-white">
            <h4 className="fw-bold mt-2">Dispositivos agregados</h4>
            <table className="table">
              <thead className="user-select-none">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Versión</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">ID</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
				  {devices.map((device) => (
					  <tr key={device.id}>
					  <th scope="row">1</th>
					  <td>{device._v}</td>
					  <td>{device.name}</td>
					  <td>{device.deviceId}</td>
					  <td>
						<i className="bi bi-trash link-primary cursorPointer fs-5" />
					  </td>
					</tr>
				  ))}
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
