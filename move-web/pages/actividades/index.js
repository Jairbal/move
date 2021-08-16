import PatientLayout from "components/PatientLayout";

export default function actividades() {
	return <h1> ACTIVIDADES</h1>;
}

actividades.getLayout = function getLayout(page) {
	return <PatientLayout>{page} </PatientLayout>;
};
