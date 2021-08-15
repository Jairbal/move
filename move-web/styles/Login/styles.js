/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unused-vars */
import css from "styled-jsx/css";
import { colors, breakpoints } from "../theme";
import "bootstrap-icons/font/bootstrap-icons.css";

export default css`
	main {
		display: grid;
		place-items: center;
		height: 100vh;
		padding: 0;
	}
	form {
		background: #fff;
		border-radius: 0.625rem;
	}

	.textOutline:hover {
		text-decoration: underline;
	}

	.pAutoWidth {
		width: 12.8125rem;
	}

	.circles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		z-index: -1;
	}

	.circles li {
		position: absolute;
		display: block;
		list-style: none;
		width: 1.25rem;
		height: 1.25rem;
		background: rgba(255, 255, 255, 0.6);
		animation: animate 25s linear infinite;
		bottom: -9.375rem;
	}

	.circles li:nth-child(1) {
		left: 25%;
		width: 5rem;
		height: 5rem;
		animation-delay: 0s;
	}

	.circles li:nth-child(2) {
		left: 10%;
		width: 1.25rem;
		height: 1.25rem;
		animation-delay: 2s;
		animation-duration: 12s;
	}

	.circles li:nth-child(3) {
		left: 70%;
		width: 1.25rem;
		height: 1.25rem;
		animation-delay: 4s;
	}

	.circles li:nth-child(4) {
		left: 40%;
		width: 3.75rem;
		height: 3.75rem;
		animation-delay: 0s;
		animation-duration: 18s;
	}

	.circles li:nth-child(5) {
		left: 65%;
		width: 1.25rem;
		height: 1.25rem;
		animation-delay: 0s;
	}

	.circles li:nth-child(6) {
		left: 75%;
		width: 6.875rem;
		height: 6.875rem;
		animation-delay: 3s;
	}

	.circles li:nth-child(7) {
		left: 35%;
		width: 9.375rem;
		height: 9.375rem;
		animation-delay: 7s;
	}

	.circles li:nth-child(8) {
		left: 50%;
		width: 1.5625rem;
		height: 1.5625rem;
		animation-delay: 15s;
		animation-duration: 45s;
	}

	.circles li:nth-child(9) {
		left: 20%;
		width: 0.9375rem;
		height: 0.9375rem;
		animation-delay: 2s;
		animation-duration: 35s;
	}

	.circles li:nth-child(10) {
		left: 85%;
		width: 150px;
		height: 9.375rem;
		animation-delay: 0s;
		animation-duration: 11s;
	}

	.circles li:nth-child(11) {
		left: 70%;
		width: 3.125rem;
		height: 3.125rem;
		animation-delay: 1s;
		animation-duration: 11s;
	}

	.circles li:nth-child(12) {
		left: 85%;
		width: 5rem;
		height: 5rem;
		animation-delay: 2s;
		animation-duration: 11s;
	}

	.circles li:nth-child(13) {
		left: 10%;
		width: 7.5rem;
		height: 7.5rem;
		animation-delay: 0s;
		animation-duration: 11s;
	}

	@keyframes animate {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 1;
			border-radius: 0;
		}

		100% {
			transform: translateY(-1000px) rotate(720deg);
			opacity: 0;
			border-radius: 50%;
		}
	}

	@media (min-width: ${breakpoints.mobile}) {
		form {
			width: ${breakpoints.mobile};
		}
	}
`;

export const globalStyles = css.global`
	body {
		background: ${colors.primary};
		background: -webkit-linear-gradient(
			to left,
			${colors.primary},
			${colors.secundary}
		);
		width: 100%;
		height: 100vh;
	}
`;
