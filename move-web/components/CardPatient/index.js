/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from "react";
import { getUrlImg } from "firebase/client";

export default function CardPatient({ patient, setSelectedPatient }) {
	const { name, age, email, createdAt, avatar } = patient;

	const [urlImg, setUrlImg] = useState(null);

	useEffect(() => {
		if (avatar) {
			getUrlImg(avatar).then((urlAvatar) => {
				// eslint-disable-next-line no-param-reassign
				patient.urlAvatar = urlAvatar;
				setUrlImg(urlAvatar);
			});
		}
	}, []);

	const handleClickPatient = () => {
		setSelectedPatient({ ...patient, urlAvatar: urlImg });
	};

	return (
		<>
			<div
				onClick={handleClickPatient}
				className="card text-white user-select-none cursorPointer cardClick m-1 mb-2"
			>
				<img
					src="/paisaje.jpg"
					width={336}
					height={150}
					className="card-img rounded-3 bgPacient "
					alt="..."
				/>
				<div className="card-img-overlay rounded-3">
					<h5 className="card-title fw-bold">{name}</h5>
					<div className="row">
						<div className="col-9 lh-1">
							<p className="card-text">{age} años</p>
							<p className="card-text">{email}</p>
							<p className="card-text">{`Registrado: ${createdAt}`}</p>
						</div>
						<div className="col">
							{urlImg ? (
								<img
									src={urlImg}
									alt="perfil"
									width={50}
									height={50}
									className="rounded-circle"
								/>
							) : (
								<i className="bi bi-person-circle photo" />
							)}
						</div>
					</div>
				</div>
			</div>

			<style jsx>
				{`
					.bgPacient {
						width: 21rem;
						height: 9.375rem;
					}

					.photo {
						font-size: 2.9375rem;
						height: 3.75rem;
						object-fit: contain;
					}

					.cardClick:active {
						transform: scale(0.98);
					}
				`}
			</style>
		</>
	);
}
