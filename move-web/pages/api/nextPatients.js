import { firestore } from "firebase/admin";

export default (_req, res) => {
	const { body } = _req;
	const { lastPatient } = JSON.parse(body);

	const document = [];
	firestore
		.collection("patients")
		.orderBy("createdAt", "desc")
		.startAfter(lastPatient)
		.limit(3)
		.get()
		.then((querySnapshot) => {
			const nextLastDocument =
				querySnapshot.docs[querySnapshot.docs.length - 1] || null;
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				const { id } = doc;
				const { createdAt } = data;

				const date = new Date(createdAt.seconds * 1000);
				const normalizedCreatedAt = new Intl.DateTimeFormat("en", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}).format(date);
				return document.push({ ...data, id, createdAt: normalizedCreatedAt });
			});
			res.json({ nextLastDocument, document });
		})
		.catch(() => {
			res.status(404).end();
		});
};
