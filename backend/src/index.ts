import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import rootRouter from "./routes/root.route.js";

config();

const app = express();
const Port = process.env.PORT || 3002;

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json

app.use("/api", rootRouter);

app.listen(Port, () => {
	console.log(`Server started at http://localhost:${Port}`);
});
