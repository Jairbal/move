/* eslint-disable array-callback-return */
/* eslint-disable no-console */
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyBnUH3v4rbxTfCeMZc1YJ7aM8D5bBYq38Q",
	authDomain: "proyectotesis-870e8.firebaseapp.com",
	projectId: "proyectotesis-870e8",
	storageBucket: "proyectotesis-870e8.appspot.com",
	messagingSenderId: "562669487788",
	appId: "1:562669487788:web:2c29976c0067815c9b4109",
	measurementId: "G-8N3TJXRY4H",
};

// Evitar que se inicialize la aplicación otra vez
// eslint-disable-next-line no-unused-expressions
!firebase.apps.length && firebase.initializeApp(firebaseConfig);

// Inicializar base de datos Firestore
const db = firebase.firestore();

// Mapear la informacion del usuario autenticado
const mapUserFormFirebaseAuthToUser = (user) => {
	const { email, displayName, emailVerified, uid } = user;
	return {
		email,
		displayName,
		emailVerified,
		uid,
	};
};

// Verifica si existe un usuario autentificado
export const onAuthStateChanged = (onChange) =>
	firebase.auth().onAuthStateChanged((user) => {
		if (user) {
			const normalizedUser = mapUserFormFirebaseAuthToUser(user);
			onChange(normalizedUser);
		}
	});

// Autenticar con correo y contraseña
export const loginWithEmail = (email, password) =>
	firebase
		.auth()
		.signInWithEmailAndPassword(email, password)
		.then((dataUser) => {
			const { user } = dataUser;
			return mapUserFormFirebaseAuthToUser(user);
		});

// Crear cuenta con correo y contraseña
export const createWithEmail = (email, password) =>
	firebase.auth().createUserWithEmailAndPassword(email, password);

// Subir archivos (como imagenes)
export const uploadImage = async (folder, file) => {
	try {
		const ref = firebase.storage().ref(`${folder}/${Date.now()}_${file.name}`);
		const task = await ref.put(file);
		return task;
	} catch (error) {
		console.log(error);
		return error;
	}
};

// Registrar usuario paciente
export const registerPatient = async (data) => {
	let avatar = null;
	if (data.avatar) {
		const urlImg = await uploadImage("avatar", data.avatar);
		// eslint-disable-next-line no-param-reassign
		avatar = urlImg.ref.fullPath;
	}
	const {
		uid,
		name,
		age,
		ci,
		phone,
		sex,
		address,
		profession,
		hobbie,
		description,
		email,
	} = data;

	const document = {
		uid,
		name,
		age,
		ci,
		phone,
		sex,
		address,
		profession,
		hobbie,
		description,
		email,
		avatar,
		createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
	};
	return db.collection("patients").add(document);
};

// Actualizar datos de paciente
export const updatePatient = async (data, id) => {
	let avatar = null;
	if (data.containAvatar) {
		avatar = data.containAvatar;
	}
	if (data.avatar) {
		const urlImg = await uploadImage("avatar", data.avatar);
		// eslint-disable-next-line no-param-reassign
		avatar = urlImg.ref.fullPath;
	}
	const {
		name,
		age,
		ci,
		phone,
		sex,
		address,
		profession,
		hobbie,
		description,
	} = data;

	const document = {
		name,
		age,
		ci,
		phone,
		sex,
		address,
		profession,
		hobbie,
		description,
		avatar,
		updateAt: firebase.firestore.Timestamp.fromDate(new Date()),
	};
	return db.collection("patients").doc(id).update(document);
};

// Consultar los pacientes registrados
// eslint-disable-next-line arrow-body-style
export const fetchPatients = async (cbData, cbLastDoc) => {
	return db
		.collection("patients")
		.orderBy("createdAt", "desc")
		.limit(3)
		.onSnapshot(({ docs }) => {
			const lastDocument = docs[docs.length - 1] || null;
			const document = [];
			docs.map((doc) => {
				const data = doc.data();
				const { id } = doc;
				const { createdAt } = data;

				const options = { year: "numeric", month: "long", day: "numeric" };
				const date = new Date(createdAt.seconds * 1000);
				const normalizedCreatedAt = new Intl.DateTimeFormat(
					"es-ES",
					options
				).format(date);

				document.push({ ...data, id, createdAt: normalizedCreatedAt });
			});
			cbData(document);
			cbLastDoc(lastDocument);
		});
};

// Siguiente pagina de pacientes
export const nextPatients = (cbData, lastDocument, setLastDocument) => {
	db.collection("patients")
		.orderBy("createdAt", "desc")
		.startAfter(lastDocument)
		.limit(3)
		.onSnapshot(({ docs }) => {
			const nextlastDocument = docs[docs.length - 1] || null;

			setLastDocument(nextlastDocument);
			docs.map((doc) => {
				const data = doc.data();
				const { id } = doc;
				const { createdAt } = data;

				const date = new Date(createdAt.seconds * 1000);
				const normalizedCreatedAt = new Intl.DateTimeFormat("en", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}).format(date);
				cbData((state) => [
					...state,
					{ ...data, id, createdAt: normalizedCreatedAt },
				]);
			});
		});
};

export const fetchGames = async (cbData) =>
	db
		.collection("games")
		.get()
		.then(({ docs }) => {
			const document = [];
			docs.map((doc) => {
				const data = doc.data();
				const { id } = doc;
				document.push({ ...data, id });
			});
			cbData(document);
		});

// Consultar Administrador (usado para consultar al admin logeado)
export const fetchTherapist = (uid) =>
	db
		.collection("therapists")
		.where("uid", "==", uid)
		.get()
		.then((querySnapshot) => {
			const document = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				const { id } = doc;
				document.push({ ...data, id });
			});
			return document;
		});

// Consultar Paciente (Usado para consultar al paciente logeado)
export const fetchPatient = (uid) =>
	db
		.collection("patients")
		.where("uid", "==", uid)
		.get()
		.then((querySnapshot) => {
			const document = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				const { id } = doc;
				const { createdAt } = data;

				const options = { year: "numeric", month: "long", day: "numeric" };
				const date = new Date(createdAt.seconds * 1000);
				const normalizedCreatedAt = new Intl.DateTimeFormat(
					"es-ES",
					options
				).format(date);

				document.push({ ...data, id, createdAt: normalizedCreatedAt });
			});
			return document;
		});

export const searchFilterPatient = (name) =>
	db
		.collection("patients")
		.where("name", "==", name)
		.get()
		.then((querySnapshot) => {
			const document = [];
			querySnapshot.forEach((doc) => {
				const data = doc.data();
				const { id } = doc;
				const { createdAt } = data;

				const options = { year: "numeric", month: "long", day: "numeric" };
				const date = new Date(createdAt.seconds * 1000);
				const normalizedCreatedAt = new Intl.DateTimeFormat(
					"es-ES",
					options
				).format(date);

				document.push({ ...data, id, createdAt: normalizedCreatedAt });
			});
			return document;
		});

// Obtener enlace de descarga de Imagenes
export const getUrlImg = (path) =>
	firebase.storage().ref().child(path).getDownloadURL();

// Eliminar documento
export const deleteDoc = async (collection, id) => {
	await db.collection(collection).doc(id).delete();
};

// Eliminar Imagen
export const deleteImg = (path) =>
	firebase.storage().ref().child(path).delete();

// Desconectarse
export const singOut = () => firebase.auth().signOut();
