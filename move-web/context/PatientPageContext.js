/* eslint-disable no-console */
import React, { createContext } from "react";
import { useRouter } from "next/router";

export const PatientPageContext = createContext();

export const PatientPageProvider = ({ children }) => {
	const router = useRouter();
	const subMenu = router.pathname;

	return (
		<PatientPageContext.Provider
			value={{
				subMenu,
			}}
		>
			{children}
		</PatientPageContext.Provider>
	);
};
