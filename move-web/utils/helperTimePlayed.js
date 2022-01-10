// Da Formato al tiempo
export const timeFormat = (date) => {
	if (!date) return "00:00";
	let mm = date.getUTCMinutes();
	let ss = date.getSeconds();
	//	const cm = Math.round(date.getMilliseconds() / 10);

	mm = mm < 10 ? `0${mm}` : mm;
	ss = ss < 10 ? `0${ss}` : ss;
	// cm = cm < 10 ? `0${cm}` : cm;

	// return `${mm}:${ss}:${cm}`;

	return `${mm}:${ss}`;
};

// Calcula el tiempo resultante (tiempo jugado)
export const timeResult = (startTime, finalTime) => {
	const result = new Date(+finalTime - startTime);
	return timeFormat(result);
};

// Suma los minutos y segundos
export const addTime = (timePlayed, currentTimePlayed) => {
	// formato mm:ss
	// Divido el string en minutos y segundos
	// y los convierto en int
	const splitStartTime = timePlayed.split(":", 2);
	const mmStartTime = parseInt(splitStartTime[0], 10);
	const ssStartTime = parseInt(splitStartTime[1], 10);

	const splitFinalTime = currentTimePlayed.split(":", 2);
	const mmFinalTime = parseInt(splitFinalTime[0], 10);
	const ssFinalTime = parseInt(splitFinalTime[1], 10);

	// Suma total de segundos y minutos
	let ssAdd = ssStartTime + ssFinalTime;
	let mmAdd = mmStartTime + mmFinalTime;

	// Si la suma de segundos es igual o mayor a 60
	if (ssAdd >= 60) {
		ssAdd -= 60;
		mmAdd += 1;
	}

	mmAdd = mmAdd < 10 ? `0${mmAdd}` : mmAdd;
	ssAdd = ssAdd < 10 ? `0${ssAdd}` : ssAdd;

	return `${mmAdd}:${ssAdd}`;
};
