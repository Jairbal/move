import {
	formatMinutesCountdown,
	formatSecondsCountdown,
} from "utils/helperTimePlayed";

export default function CountTimer({ time }) {
	return (
		<>
			<div id="countdown">
				<div id="tiles" />
				<span>{formatMinutesCountdown(time)}</span>
				<span>{formatSecondsCountdown(time)}</span>
				<div className="labels">
					<li>Mins</li>
					<li>Secs</li>
				</div>
			</div>

			<style jsx>
				{`
					#countdown {
						display: flex;
						justify-content: center;
						width: 200px;
						height: 80px;
						text-align: center;
						background: #222;
						background-image: -webkit-linear-gradient(
							top,
							#222,
							#333,
							#333,
							#222
						);
						background-image: -moz-linear-gradient(top, #222, #333, #333, #222);
						background-image: -ms-linear-gradient(top, #222, #333, #333, #222);
						background-image: -o-linear-gradient(top, #222, #333, #333, #222);
						border: 1px solid #111;
						border-radius: 5px;
						box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.6);
						margin: 0 auto;
						padding: 3px 0;
						padding-bottom: 10px;
						position: absolute;
						top: 0;
						bottom: 0;
						left: 0;
						right: 0;
					}

					#countdown:before {
						content: "";
						width: 8px;
						height: 40px;
						background: #444;
						background-image: -webkit-linear-gradient(
							top,
							#555,
							#444,
							#444,
							#555
						);
						background-image: -moz-linear-gradient(top, #555, #444, #444, #555);
						background-image: -ms-linear-gradient(top, #555, #444, #444, #555);
						background-image: -o-linear-gradient(top, #555, #444, #444, #555);
						border: 1px solid #111;
						border-top-left-radius: 6px;
						border-bottom-left-radius: 6px;
						display: block;
						position: absolute;
						top: 20px;
						left: -10px;
					}

					#countdown:after {
						content: "";
						width: 8px;
						height: 40px;
						background: #444;
						background-image: -webkit-linear-gradient(
							top,
							#555,
							#444,
							#444,
							#555
						);
						background-image: -moz-linear-gradient(top, #555, #444, #444, #555);
						background-image: -ms-linear-gradient(top, #555, #444, #444, #555);
						background-image: -o-linear-gradient(top, #555, #444, #444, #555);
						border: 1px solid #111;
						border-top-right-radius: 6px;
						border-bottom-right-radius: 6px;
						display: block;
						position: absolute;
						top: 20px;
						right: -10px;
					}

					#countdown #tiles {
						position: relative;
						z-index: 1;
					}

					span {
						width: 60px;
						max-width: 60px;
						font: bold 35px "Droid Sans", Arial, sans-serif;
						text-align: center;
						color: #111;
						background-color: #ddd;
						background-image: -webkit-linear-gradient(top, #bbb, #eee);
						background-image: -moz-linear-gradient(top, #bbb, #eee);
						background-image: -ms-linear-gradient(top, #bbb, #eee);
						background-image: -o-linear-gradient(top, #bbb, #eee);
						border-top: 1px solid #fff;
						border-radius: 3px;
						box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.7);
						margin: 0 7px;
						margin-bottom: 12px;
						padding: 7px 0;
						display: inline-block;
						position: relative;
					}

					span:before {
						content: "";
						width: 100%;
						height: 10px;
						background: #111;
						display: block;
						padding: 0 3px;
						position: absolute;
						top: 41%;
						left: -3px;
						z-index: -1;
					}

					span:after {
						content: "";
						width: 100%;
						height: 1px;
						background: #eee;
						border-top: 1px solid #333;
						display: block;
						position: absolute;
						top: 48%;
						left: 0;
					}

					#countdown .labels {
						width: 100%;
						height: 17px;
						text-align: center;
						position: absolute;
						bottom: 8px;
					}

					#countdown .labels li {
						width: 90px;
						font: bold 15px "Droid Sans", Arial, sans-serif;
						color: #0d6efd;
						text-shadow: 1px 1px 0px #000;
						text-align: center;
						text-transform: uppercase;
						display: inline-block;
					}
				`}
			</style>
		</>
	);
}
