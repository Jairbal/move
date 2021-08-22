/* eslint-disable no-console */
import React, { createContext } from "react";
import { useRouter } from "next/router";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
	const router = useRouter();
	const subMenu = router.pathname;

	return (
		<AdminContext.Provider
			value={{
				subMenu,
			}}
		>
			{children}
		</AdminContext.Provider>
	);
};
