const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const MoveAgent = require("move-agent");
const { handleFatalError, pipe } = require("move-utils");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const agent = new MoveAgent();

// Socket.io / Websockets
io.on("connect", (socket) => {
	console.log(`Connected ${socket.id}`);

	pipe(agent, socket);
});

// Expres Error Handler
app.use((err, req, res, next) => {
	console.log(`Error: ${err.message}`);

	if (err.name === "UnauthorizedError") {
		return res.status(401).send({ error: err.message });
	}

	if (err.message.match(/not found/)) {
		return res.status(404).send({ error: err.message });
	}

	res.status(500).send({ error: err.message });
});

nextApp.prepare().then(() => {
	app.get("*", (req, res) => {
		return nextHandler(req, res);
	});

	server.listen(port, (err) => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
		agent.connect();
	});
});

process.on("uncaughtException", handleFatalError);
process.on("unhandledRejection", handleFatalError);
