import { useContext, useEffect, useState } from "react";
import PatientLayout from "components/PatientLayout";
import { AuthContext } from "context/AuthContext";
import { fetchGamesOfPatient } from "firebase/client";
import Link from "next/link";

export default function actividades() {
	const { authUserPatient } = useContext(AuthContext);
	const [games, setGames] = useState([]);
	useEffect(() => {
		fetchGamesOfPatient(authUserPatient.games, setGames);
	}, []);

	return (
		<div className="d-flex flex-wrap  justify-content-center">
			{games.map((game) => (
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
						{/* 						<div className="rounded-3">
							<h5 className="card-title fw-bold">
								Tiempo Jugado: {game.timePlayed}
							</h5>
						</div> */}
					</div>
				</Link>
			))}
		</div>
	);
}

actividades.getLayout = function getLayout(page) {
	return <PatientLayout>{page} </PatientLayout>;
};
