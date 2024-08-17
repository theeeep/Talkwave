import express from "express";
import {
	getMe,
	login,
	logout,
	singup,
} from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", singup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
