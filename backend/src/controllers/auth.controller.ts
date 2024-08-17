import bcryptjs from "bcryptjs";
import type { Request, Response } from "express";
import prisma from "../db/prisma.js";
import generateToken from "../utils/generateToken.js";

export const singup = async (req: Request, res: Response) => {
	try {
		const { fullName, userName, password, confirmPassword, gender } = req.body;

		if (!fullName || !userName || !password || !confirmPassword || !gender) {
			return res.status(400).json({ error: "All fields are required" });
		}
		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Passoword don't match" });
		}

		const user = await prisma.user.findUnique({ where: { userName } });

		if (user) {
			return res.status(400).json({ error: "Username already exists" });
		}

		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
		const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

		const newUser = await prisma.user.create({
			data: {
				fullName,
				userName,
				password: hashedPassword,
				gender,
				profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
			},
		});

		if (newUser) {
			// generate token
			generateToken(newUser.id, res);

			res.status(201).json({
				id: newUser.id,
				fullName: newUser.fullName,
				userName: newUser.userName,
				profilePic: newUser.profilePic,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in signUp Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const login = async (req: Request, res: Response) => {
	try {
		const { userName, password } = req.body;
		const user = await prisma.user.findUnique({ where: { userName } });

		if (!user) {
			return res.status(400).json({ error: "Invalid Credentials" });
		}

		const isPasswordCorrect = bcryptjs.compare(password, user.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid Credentials" });
		}

		generateToken(user.id, res);

		res.status(200).json({
			id: user.id,
			fullName: user.fullName,
			userName: user.userName,
			profilePic: user.profilePic,
		});

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in signUp Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
export const logout = async (req: Request, res: Response) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out sucessfully" });

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in signUp Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMe = async (req: Request, res: Response) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: req.user.id } });
		if (!user) {
			return res.status(404).json({ error: "User not found!" });
		}
		res.status(200).json({
			id: user.id,
			fullName: user.fullName,
			userName: user.userName,
			profilePic: user.profilePic,
		});
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in signUp Controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
