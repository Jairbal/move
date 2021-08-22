import PatientLayout from "components/PatientLayout";
import { fetchPatientsTest } from "firebase/client";
import { useEffect } from "react";

export default function actividades({ patients, lastDocument }) {
	useEffect(() => {
		fetchPatientsTest().then((obj) => {
			console.log(obj);
		});
	}, []);

	console.log(lastDocument);
	return <h1> ACTIVIDADES</h1>;
}

actividades.getLayout = function getLayout(page) {
	return <PatientLayout>{page} </PatientLayout>;
};

export async function getServerSideProps() {
	// eslint-disable-next-line global-require
	const firebase = require("firebase/app");
	const db = firebase.firestore();
	const document = [];
	let lastDocument;
	db.collection("patients")
		.orderBy("createdAt", "desc")
		.limit(3)
		.onSnapshot(({ docs }) => {
			lastDocument = docs[docs.length - 1] || null;
			docs.map((doc) => {
				const data = doc.data();
				const { id } = doc;
				const { createdAt } = data;

				const options = { year: "numeric", month: "long", day: "numeric" };
				const date = new Date(createdAt.seconds * 1000);
				const normalizedCreatedAt = new Intl.DateTimeFormat(
					"es-ES",
					options
				).format(date);

				document.push({ ...data, id, createdAt: normalizedCreatedAt });
			});
		});
	return { props: { patients: document, lastDocument } };
}
