import { firestore } from "firebase/admin";

export default (_req, res) => {
	const document = [];
	let nextLastDocument;
	firestore
		.collection("patients")
		.orderBy("createdAt", "desc")
		.limit(3)
		.get()
		.then((querySnapshot) => {
			querySnapshot.forEach((doc) => {
				nextLastDocument =
					querySnapshot.docs[querySnapshot.docs.length - 1] || null;
				const data = doc.data();
				const { id } = doc;
				const { createdAt } = data;

				const date = new Date(createdAt.seconds * 1000);
				const normalizedCreatedAt = new Intl.DateTimeFormat("en", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}).format(date);
				document.push({ ...data, id, createdAt: normalizedCreatedAt });
			});
			res.json({ nextLastDocument, document });
		})
		.catch(() => {
			res.status(404).end();
		});
};
