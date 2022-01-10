/* eslint-disable camelcase */
import { useEffect, useState, useContext } from "react";
import AdminLayout from "components/AdminLayout";
import { AuthContext } from "context/AuthContext";
import { fetchGames } from "firebase/client";
import Link from "next/link";

export default function juegos() {
	const { authUserTherapist } = useContext(AuthContext);

	const [allGames, setAllGames] = useState([]);

	useEffect(() => {
		if (authUserTherapist) {
			fetchGames(setAllGames);
		}
	}, [authUserTherapist]);

	return (
		<div className="d-flex bg-white scroll">
			{allGames.map((game) => (
				<Link href={game.link} key={game.id}>
					<div className="card  user-select-none cursorPointer cardClick m-1 mb-2 text-primary">
						<img
							src={game.cover}
							width={300}
							height={150}
							className="card-img rounded-3 bgGame "
							alt={game.name}
						/>
						<div className="rounded-3">
							<h5 className="card-title fw-bold">{game.name}</h5>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
}

juegos.getLayout = function getLayout(page) {
	return <AdminLayout>{page} </AdminLayout>;
};
