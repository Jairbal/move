import { auth } from "firebase/admin";
// Delete user (Email, password)
export default (_req, res) => {
	const { body } = _req;
	const { uid } = JSON.parse(body);
	auth
		.deleteUser(uid)
		.then(() => {
			res.status(200).end();
		})
		.catch(() => {
			res.status(404).end();
		});
};
