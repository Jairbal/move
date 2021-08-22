/* eslint-disable no-console */
import React, { useEffect, useState, useContext } from "react";
import AdminLayout from "components/AdminLayout";
import Patients from "components/Patients";
import AdminSettings from "components/AdminSettings";
import { AuthContext } from "context/AuthContext";
import { useRouter } from "next/router";

import { fetchPatients, nextPatients } from "firebase/client";
import AdminStatistics from "components/AdminStatistics";

const fetcher = (...args) => fetch(...args).then((response) => response.json());

export default function AdminPage() {
	const { authUserTherapist, authUserPatient, handleSingOut } =
		useContext(AuthContext);

	const [subMenu, setSubMenu] = useState(null);

	const [allPatients, setAllPatients] = useState([]);
	// eslint-disable-next-line no-underscore-dangle
	const [lastPatient, setLastPatient] = useState();

	// eslint-disable-next-line no-unused-vars
	/* const { error, data } = useSWR("/api/patients", fetcher, {
		initialData: patients,
	}); */

	const router = useRouter();

	useEffect(() => {
		if (authUserPatient) {
			router.replace("/Home");
		}
	}, [authUserPatient]);

	const handleMorePatients = async () => {
		nextPatients(setAllPatients, lastPatient, setLastPatient);
	};

	useEffect(() => {
		if (authUserTherapist) {
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
					lastPatient={lastPatient}
				/>
			)}
			{subMenu === "Pacientes" && (
				<Patients
					patients={allPatients}
					handleMorePatients={handleMorePatients}
					lastPatient={lastPatient}
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
	const lastDocument = result.nextLastDocument;
	return { props: { patients, lastDocument } };
} */

/* export async function getServerSideProps() {
	// eslint-disable-next-line global-require
	const firebase = require("firebase/app");
	const db = firebase.firestore();
	const document = [];

	const snapshot = await db
		.collection("patients")
		.orderBy("createdAt", "desc")
		.limit(3)
		.get();

	const lastDocument = JSON.stringify(snapshot.docs[0]) || null;

	snapshot.forEach((doc) => {
		const data = doc.data();
		const { id } = doc;
		const { createdAt } = data;

		const date = new Date(createdAt.seconds * 1000);
		const normalizedCreatedAt = new Intl.DateTimeFormat("en", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
		}).format(date);
		document.push({ ...data, id, createdAt: normalizedCreatedAt });
	});
	const patients = document;
	console.log(lastDocument);
	return { props: { patients, lastDocument } };
} */

/* export async function getStaticProps() {
	const res = await fetch("http://localhost:3000/api/patients");
	const result = await res.json();
	const patients = result.document;
	const lastDocument = result.nextLastDocument;
	return { props: { patients, lastDocument } };
	
	
} */
