/* eslint-disable no-console */
import { auth } from "firebase/admin";

// Create user (Email, password)
export default (_req, res) => {
	const { body } = _req;
	const { name, email, password } = JSON.parse(body);
	const stringsplit = name.split(" ");
	const displayName = stringsplit[0];
	auth
		.createUser({
			email,
			emailVerified: false,
			password,
			displayName,
		})
		.then((userRecord) => res.send({ uid: userRecord.uid }))
		.catch((err) => {
			console.log("Error al crear nuevo usuario: ", err);
		});
};
