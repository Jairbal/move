import { useState } from "react";

function useHandleImg() {
	const [paths, setPaths] = useState(null);
	// const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		// verifica que se hayan seleccionado archivos
		if (e.target.files && e.target.files.length > 0) {
			const fileInput = e.target.files[0];
			// si el archivo seleccionado conincide con ser de tipo imagen
			if (fileInput.type.includes("image")) {
				const reader = new FileReader();
				reader.readAsDataURL(fileInput);

				reader.onload = function load() {
					setPaths({
						...paths,
						[e.target.name]: reader.result,
					});
				};
				// optimizeImg(reader.result);
			} else {
				// eslint-disable-next-line no-console
				console.log("Ha ocurrido un error");
			}
		}
	};

	return [paths, setPaths, handleFileChange];
}

export default useHandleImg;
