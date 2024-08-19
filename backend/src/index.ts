import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import rootRouter from "./routes/root.route.js";
import { app, server } from "./socket/socket.js";

config();

const Port = process.env.PORT || 3001;

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json

app.use("/api", rootRouter);

server.listen(Port, () => {
	console.log(`Server started at http://localhost:${Port}`);
});
