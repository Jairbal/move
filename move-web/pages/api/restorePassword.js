/* eslint-disable no-console */
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default (_req, res) => {

	const auth = getAuth();
	const { body } = _req;
	const { email } = JSON.parse(body);
	console.log("hola");

	sendPasswordResetEmail(auth, email)
		.then(() => {
			// Password reset email sent!
			console.log("Correo enviado");
			res.send({ Message: "Correo enviado" });
		})
		.catch((error) => {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.log(`${errorCode}: ${errorMessage} `);
		});
};
