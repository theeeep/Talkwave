import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import prisma from "../db/prisma.js";

interface DecodedToken extends JwtPayload {
	userId: string;
}

declare global {
	namespace Express {
		export interface Request {
			user: {
				id: string;
			};
		}
	}
}

const protectRoute = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized- No token provided" });
		}

		const decodedJwt = jwt.verify(
			token,
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			process.env.JWT_SECRET!,
		) as DecodedToken;

		if (!decodedJwt) {
			return res.status(401).json({ error: "Unauthorized- Invalid token" });
		}

		const user = await prisma.user.findUnique({
			where: { id: decodedJwt.userId },
			select: { id: true, fullName: true, userName: true, profilePic: true },
		});

		if (!user) {
			return res.status(404).json({ error: "User not found!" });
		}

		req.user = user;

		next();

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in signUp Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export default protectRoute;
