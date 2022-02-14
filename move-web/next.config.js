module.exports = {
	reactStrictMode: true,
};

module.exports = {
	endpoint: process.env.API_ENDPOINT || "http://localhost:3001",
	serverHost: process.env.SERVER_HOST || "http://localhost:3000",
	apiToken:
		process.env.API_TOKEN ||
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwidXNlcm5hbWUiOiJwbGF0emkiLCJwZXJtaXNzaW9ucyI6WyJhZ2VudHM6cmVhZCIsIm1ldHJpY3M6cmVhZCJdLCJpYXQiOjE1OTgwNzYwMDZ9.de0TrN9z6qqP5Db1EpJLuhG1-FGWFlEhjFyUvbkg5RY",
};

module.exports = {
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
};