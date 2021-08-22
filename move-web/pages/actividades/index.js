import PatientLayout from "components/PatientLayout";
import { fetchPatientsTest } from "firebase/client";
import { useEffect } from "react";

export default function actividades() {
	useEffect(() => {
		fetchPatientsTest().then((obj) => {
			console.log(obj);
		});
	}, []);

	return <h1> ACTIVIDADES</h1>;
}

actividades.getLayout = function getLayout(page) {
	return <PatientLayout>{page} </PatientLayout>;
};
