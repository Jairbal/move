/* eslint-disable no-console */

import PatientLayout from "components/PatientLayout";

export default function Home() {
	return <h1> HOME</h1>;
}

Home.getLayout = function getLayout(page) {
	return <PatientLayout>{page} </PatientLayout>;
};
