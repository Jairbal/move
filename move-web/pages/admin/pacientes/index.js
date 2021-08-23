/* eslint-disable camelcase */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import { useEffect, useState, useContext } from "react";
import CardPatient from "components/CardPatient";
import CardGame from "components/CardGame";
import ModalDeletePatient from "components/ModalDeletePatient";
import ModalFormPatient from "components/ModalFormPatient";
import AdminLayout from "components/AdminLayout";
import { AuthContext } from "context/AuthContext";
import {
  fetchPatients,
  nextPatients,
  searchFilterPatient,
  fetchGames,
} from "firebase/client";

export default function pacientes() {
  const { authUserTherapist } = useContext(AuthContext);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);

  // states de busqueda
  const [inputSearch, setInputSearch] = useState(""); // Lee el input
  const [searchPatient, setSearchPatient] = useState(null); // lee la busqueda
  const [allGames, setAllGames] = useState([]);

  const [allPatients, setAllPatients] = useState([]);
  // eslint-disable-next-line no-underscore-dangle
  const [lastPatient, setLastPatient] = useState();

  const handleMorePatients = async () => {
    nextPatients(setAllPatients, lastPatient, setLastPatient);
  };

  useEffect(() => {
    if (authUserTherapist) {
      fetchGames(setAllGames);
      fetchPatients(setAllPatients, setLastPatient);
    }
  }, [authUserTherapist]);

  const handleUpdateOpenModal = () => {
    setIsUpdate(true);
  };

  const handleReadInputSearch = (e) => {
    e.preventDefault();
    if (!e.target.value) {
      setInputSearch(null);
      setSearchPatient(null);
    } else {
      setInputSearch(e.target.value.toUpperCase());
    }
  };

  const handleSearchPatient = (e) => {
    e.preventDefault();
    if (inputSearch) {
      searchFilterPatient(inputSearch)
        .then((patient) => setSearchPatient(patient))
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className="container d-grid">
        <div className="row gap-3 ">
          <div className="col-auto bg-white m-auto m-xl-0">
            <form className="d-flex m-2 ">
              <button
                type="button"
                className="btn btn-outline-primary me-2"
                data-bs-toggle="modal"
                data-bs-target="#registerUserModal"
                title="Agregar Pacientes"
              >
                <i className="bi bi-person-plus-fill" />
              </button>
              <input
                onChange={handleReadInputSearch}
                className="form-control me-2"
                type="search"
                placeholder="Buscar por nombre o cédula"
                aria-label="Search"
              />
              <button
                onClick={handleSearchPatient}
                className="btn btn-outline-primary"
                type="submit"
              >
                <i className="bi bi-search" />
              </button>
            </form>
            <hr />
            <div className="listPatient scroll">
              {searchPatient
                ? searchPatient.map((patient) => (
                    <CardPatient
                      key={patient.id}
                      patient={patient}
                      setSelectedPatient={setSelectedPatient}
                      selectedPatient={selectedPatient}
                    />
                  ))
                : allPatients.map((patient) => (
                    <CardPatient
                      key={patient.id}
                      patient={patient}
                      setSelectedPatient={setSelectedPatient}
                      selectedPatient={selectedPatient}
                    />
                  ))}
            </div>
            <div className="d-flex justify-content-center m-1">
              {!lastPatient ? null : (
                <button
                  onClick={handleMorePatients}
                  className="btn btn-outline-secondary rounded-circle"
                  type="button"
                >
                  <i className="bi bi-chevron-double-down" />
                </button>
              )}
            </div>
          </div>

          {selectedPatient && (
            <>
              <div className="col bg-white">
                <label className="fw-bolder fs-4  d-flex align-items-center">
                  {selectedPatient.urlAvatar ? (
                    <img
                      src={selectedPatient.urlAvatar}
                      alt="perfil"
                      width={50}
                      height={50}
                      className="rounded-circle m-3"
                    />
                  ) : (
                    <i className="bi bi-person-circle rounded-circle avatarSelectedPatient m-3" />
                  )}
                  {selectedPatient.name}
                </label>
                <p className="fw-bold me-3">
                  Fecha de registro:{" "}
                  <span className="fw-normal">{selectedPatient.createdAt}</span>
                </p>
                <div className="d-flex">
                  <p className="fw-bold me-3">
                    Edad:{" "}
                    <span className="fw-normal">{selectedPatient.age}</span>
                  </p>
                  <p className="fw-bold me-3">
                    CI: <span className="fw-normal">{selectedPatient.ci}</span>
                  </p>
                  <p className="fw-bold me-3">
                    Celular:{" "}
                    <span className="fw-normal">{selectedPatient.phone}</span>
                  </p>
                </div>
                <p className="fw-bold me-3">
                  Dirección:{" "}
                  <span className="fw-normal">
                    {selectedPatient.address
                      ? selectedPatient.description
                      : "no definido"}
                  </span>
                </p>
                <p className="fw-bold me-3">
                  Sexo: <span className="fw-normal">{selectedPatient.sex}</span>
                </p>
                <p className="fw-bold me-3">
                  Correo electrónico:{" "}
                  <span className="fw-normal">{selectedPatient.email}</span>
                </p>

                <p className="fw-bold me-3">
                  Profesión/Ocupación:{" "}
                  <span className="fw-normal">
                    {selectedPatient.profession
                      ? selectedPatient.profession
                      : "no definido"}
                  </span>
                </p>
                <p className="fw-bold me-3">
                  Deporte/Hobbie:{" "}
                  <span className="fw-normal">
                    {selectedPatient.hobbie
                      ? selectedPatient.hobbie
                      : "no definido"}
                  </span>
                </p>
                <p className="fw-bold me-3">
                  Diagnóstico:{" "}
                  <span className="fw-normal">
                    {selectedPatient.description
                      ? selectedPatient.description
                      : "no definido"}
                  </span>
                </p>

                <button
                  onClick={handleUpdateOpenModal}
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#registerUserModal"
                  className="btn btn-outline-primary me-3 mb-3 mb-xl-0"
                >
                  Actualizar información
                </button>
                <button
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#deletePatientModal"
                  className="btn btn-outline-danger"
                >
                  Eliminar Paciente
                </button>
              </div>
              <div className="col bg-white scroll listGames">
                {allGames.map((game) => (
                  <CardGame
                    game={game}
                    key={game.id}
                    selectedPatient={selectedPatient}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Delete Patient */}
      <div
        className="modal fade"
        id="deletePatientModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <ModalDeletePatient
          idPatient={selectedPatient && selectedPatient.id}
          uid={selectedPatient && selectedPatient.uid}
        />
      </div>
      {/*  Modal Form Patient */}
      <div
        className="modal fade"
        id="registerUserModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <ModalFormPatient
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
          selectedPatient={selectedPatient}
        />
      </div>

      <style jsx>
        {`
          .listGames,
          .listPatient {
            height: 650px;
          }

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

pacientes.getLayout = function getLayout(page) {
  return <AdminLayout>{page} </AdminLayout>;
};
