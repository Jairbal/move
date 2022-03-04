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

	useEffect(() => {
		let isTherapist = false;
		if (user) {
			fetchTherapist(user.uid)
				.then((therapist) => {
					if (therapist.length > 0) {
						setAuthUserTherapist(therapist[0]);
						isTherapist = true;
						localStorage.setItem("typeUser", "therapist");
					}
				})
				.catch((err) => console.log(err));

			if (!isTherapist) {
				fetchPatient(user.uid)
					.then((patient) => {
						if (patient.length > 0) {
							setAuthUserPatient(patient[0]);
							localStorage.setItem("typeUser", "patient");
						}
					})
					.catch((err) => console.log(err));
			}
			localStorage.setItem("userId", user.uid);
		}
	}, [user]);

	const resetStatesAuth = () => {
		setAuthUserTherapist(undefined);
		setAuthUserPatient(undefined);
		router.replace("/");
	};

	const handleSingOut = () => {
		localStorage.removeItem("userId");
		localStorage.removeItem("typeUser");
		singOut();
		resetStatesAuth();
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				authUserTherapist,
				authUserPatient,
				handleSingOut,
				resetStatesAuth,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
