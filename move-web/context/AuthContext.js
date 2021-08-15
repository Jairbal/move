/* eslint-disable no-console */
import React, { createContext, useState, useEffect } from "react";
import { fetchTherapist, fetchPatient, singOut } from "firebase/client";
import useUser from "hooks/useUser";
import { useRouter } from "next/router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const user = useUser();
	const [authUserTherapist, setAuthUserTherapist] = useState();
	const [authUserPatient, setAuthUserPatient] = useState();
	const router = useRouter();

	console.log(user);
	console.log(authUserPatient);

	useEffect(() => {
		let isTherapist = false;
		if (user) {
			fetchTherapist(user.uid)
				.then((therapist) => {
					setAuthUserTherapist(therapist[0]);
					isTherapist = true;
				})
				.catch((err) => console.log(err));

			if (!isTherapist) {
				fetchPatient(user.uid)
					.then((patient) => setAuthUserPatient(patient[0]))
					.catch((err) => console.log(err));
			}
		}
	}, [user]);

	const handleSingOut = () => {
		singOut().then(() => {
			setAuthUserTherapist(undefined);
			setAuthUserPatient(undefined);
			router.replace("/Login");
		});
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				authUserTherapist,
				authUserPatient,
				handleSingOut,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};