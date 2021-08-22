/* eslint-disable camelcase */
import { useEffect, useState, useContext } from "react";
import AdminLayout from "components/AdminLayout";
import CardGame from "components/CardGame";
import { AuthContext } from "context/AuthContext";
import { fetchGames } from "firebase/client";

export default function juegos() {
	const { authUserTherapist } = useContext(AuthContext);

	const [allGames, setAllGames] = useState([]);

	useEffect(() => {
		if (authUserTherapist) {
			fetchGames(setAllGames);
		}
	}, [authUserTherapist]);

	return (
		<>
			<div className="row">
				<div className="col-auto col-xl-6 m-auto bg-white scroll listGames">
					{allGames.map((game) => (
						<CardGame game={game} key={game.id} />
					))}
				</div>
			</div>
			<style jsx>
				{`
					.photo {
						font-size: 50px;
						height: 69.6px;
						object-fit: contain;
					}

					.avatarSelectedPatient {
						font-size: 35px;
						width: 50px;
						object-fit: contain;
						margin: 0;
					}
				`}
			</style>
		</>
	);
}

juegos.getLayout = function getLayout(page) {
	return <AdminLayout>{page} </AdminLayout>;
};
