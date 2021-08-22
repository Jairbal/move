/* eslint-disable no-unused-vars */
import { fetchPatientsTest } from "firebase/client";

export default (_req, res) => {
	fetchPatientsTest()
		.then((document) => {
			res.json(document);
		})
		.catch(() => {
			res.status(404).end();
		});
};
