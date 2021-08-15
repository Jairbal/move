/* eslint-disable valid-typeof */
import Head from "next/head";
import React, { useEffect } from "react";
import { AuthProvider } from "context/AuthContext";
import "bootstrap/dist/css/bootstrap.css";

import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	useEffect(() => {
		// eslint-disable-next-line no-unused-expressions
		typeof document !== undefined
			? // eslint-disable-next-line global-require
			  require("bootstrap/dist/js/bootstrap")
			: null;
	}, []);

	return (
		<>
			<Head>
				<title>Proyecto Tesis</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
				<link
					href="https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap"
					rel="stylesheet"
				/>
			</Head>

			{/* eslint-disable-next-line react/jsx-props-no-spreading */}
			<AuthProvider>
				<Component {...pageProps} />
			</AuthProvider>
		</>
	);
}

export default MyApp;
