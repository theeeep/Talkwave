import type { Response } from "express";
import jwt from "jsonwebtoken";

const generateToken = (userId: string, res: Response) => {
	// Generate Token
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // in miliseconds
		httpOnly: true, // prevent XSS cross site scripting
		sameSite: "strict", // CSRF attack cross-site request forgery
		secure: process.env.NODE_ENV !== "development", // HTTPS
	});

	return token;
};

export default generateToken;
