import type { Request, Response } from "express";
import prisma from "../db/prisma.js";

export const sendMessage = async (req: Request, res: Response) => {
	try {
		const { message } = req.body;
		const { id: recieverId } = req.params;
		const senderId = req.user.id;

		// Check is there any conversation betwenn sender and reciever
		let conversation = await prisma.conversation.findFirst({
			where: {
				participantIds: {
					hasEvery: [senderId, recieverId],
				},
			},
		});

		// if not then create connection between sender and reviever for conversation
		// the very first message is being sent, that's why we need to create a new conversation
		if (!conversation) {
			conversation = await prisma.conversation.create({
				data: {
					participantIds: {
						set: [senderId, recieverId],
					},
				},
			});
		}

		// new message between sender & reciever
		const newMessage = await prisma.messages.create({
			data: {
				senderId,
				body: message,
				conversationId: conversation.id,
			},
		});

		// add message to conversation & update the conversations
		if (newMessage) {
			conversation = await prisma.conversation.update({
				where: {
					id: conversation.id,
				},
				data: {
					messages: {
						connect: {
							id: newMessage.id,
						},
					},
				},
			});
		}

		res.status(201).json(newMessage);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in sendMessage Controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getMessages = async (req: Request, res: Response) => {
	try {
		const { id: userToChatWithId } = req.params; // this id of the user that i'm going to talk with
		const senderId = req.user.id; // this id is of mine

		const conversation = await prisma.conversation.findFirst({
			where: { participantIds: { hasEvery: [senderId, userToChatWithId] } },
			include: {
				messages: {
					orderBy: {
						createdAt: "asc",
					},
				},
			},
		});

		if (!conversation) {
			return res.status(200).json([]);
		}

		res.status(200).json(conversation.messages);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in sendMessage Controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const getUsers = async (req: Request, res: Response) => {
	try {
		const authUserId = req.user.id;

		const users = await prisma.user.findMany({
			where: {
				id: {
					not: authUserId, // exclude auth user
				},
			},
			select: {
				id: true,
				fullName: true,
				profilePic: true,
			},
		});

		res.status(200).json(users);
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	} catch (error: any) {
		console.log("Error in sendMessage Controller: ", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
