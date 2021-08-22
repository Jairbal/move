/* eslint-disable no-console */

import PatientLayout from "components/PatientLayout";

export default function estadisticas() {
	return <h1> estadisticas</h1>;
}

estadisticas.getLayout = function getLayout(page) {
	return <PatientLayout>{page} </PatientLayout>;
};
