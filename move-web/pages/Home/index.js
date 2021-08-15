/* eslint-disable no-console */

export default function Home() {
	return <h1>HOME</h1>;
}

/* export async function getServerSideProps() {
	const res = await fetch("http://localhost:3000/api/patients");
	const result = await res.json();
	const patients = result.document;
	const { lastDocument } = result;

	return { props: { patients, lastDocument } };
} */

/* export async function getStaticProps() {
		const res = await fetch("http://localhost:3000/api/patients");
	const result = await res.json();
	const patients = result.document;
	const { lastDocument } = result; 
	
		return { props: { document } };
	
	
} */
