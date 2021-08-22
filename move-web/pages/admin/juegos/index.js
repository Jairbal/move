/* eslint-disable camelcase */
import AdminLayout from "components/AdminLayout";

export default function juegos() {
	return (
		<>
			<h1>JUEGOS</h1>
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
