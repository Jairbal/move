/* eslint-disable import/prefer-default-export */
const admin = require("firebase-admin");

// firebase-keys.json no hacerlo publico
// se puede usar variables de entorno .env.local
const serviceAccount = require("./firebase-keys.json");

try {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
	// eslint-disable-next-line no-empty
} catch (e) {}

export const auth = admin.auth();
export const firestore = admin.firestore();
export const storage = admin.storage();
