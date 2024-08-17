import { Router } from "express";
import authRoutes from "./auth.route.js";
import messageRoutes from "./message.route.js";
const rootRouter = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/message", messageRoutes);

export default rootRouter;
