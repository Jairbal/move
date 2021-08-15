/* eslint-disable no-console */
import React, { useEffect, useState, useContext } from "react";
import AdminLayout from "components/AdminLayout";
import Patients from "components/Patients";
import AdminSettings from "components/AdminSettings";
import { AuthContext } from "context/AuthContext";
import { useRouter } from "next/router";

import { fetchPatients, nextPatients } from "firebase/client";
import AdminStatistics from "components/AdminStatistics";

// const fetcher = (...args) => fetch(...args).then((response) => response.json());

export default function AdminPage() {
	const { authUserTherapist, authUserPatient, handleSingOut } =
		useContext(AuthContext);

	const [subMenu, setSubMenu] = useState(null);

	const [allPatients, setAllPatients] = useState([]);
	const [lastPatient, setLastPatient] = useState();

	// eslint-disable-next-line no-unused-vars
	/* 	const { error, data } = useSWR("/api/patients", fetcher, {
		initialData: patients,
	}); */

	const router = useRouter();

	useEffect(() => {
		if (authUserPatient) {
			router.replace("/Home");
		}
	}, [authUserPatient]);

	console.log(authUserTherapist);
	const handleMorePatients = () => {
		nextPatients(setAllPatients, lastPatient, setLastPatient);
	};

	useEffect(() => {
		if (authUserTherapist) {
			console.log("effect consult");
			fetchPatients(setAllPatients, setLastPatient);
		}
	}, [authUserTherapist]);

	if (!authUserTherapist) {
		return null;
	}

	return (
		<AdminLayout
			subMenu={subMenu}
			setSubMenu={setSubMenu}
			handleSingOut={handleSingOut}
		>
			{subMenu === null && (
				<Patients
					patients={allPatients}
					handleMorePatients={handleMorePatients}
				/>
			)}
			{subMenu === "Pacientes" && (
				<Patients
					patients={allPatients}
					handleMorePatients={handleMorePatients}
				/>
			)}
			{subMenu === "Estadísticas" && <AdminStatistics />}
			{subMenu === "Ajustes" && <AdminSettings />}
		</AdminLayout>
	);
}

/* export async function getServerSideProps() {
	const res = await fetch("http://localhost:3000/api/patients");
	const result = await res.json();
	const patients = result.document;
	const { lastDocument } = result;

	return { props: { patients, lastDocument } };
} */

/* export async function getStaticProps() {
		const res = await fetch("http://localhost:3000/api/patients");
	const result = await res.json();
	const patients = result.document;
	const { lastDocument } = result; 
	
		return { props: { document } };
	
	
} */
