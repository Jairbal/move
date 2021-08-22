import { useEffect } from "react";
import { useRouter } from "next/router";

export default function admin() {
	const router = useRouter();

	useEffect(() => {
		router.replace("/admin/pacientes");
	}, []);

	return null;
}
