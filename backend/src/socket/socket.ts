import http from "node:http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5002"],
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId: string) => {
	return userSocketMap[receiverId];
};

const userSocketMap: { [key: string]: string } = {}; // {userId: socketId}

// io.on will listen to all incoming connection
io.on("connection", (socket) => {
	console.log("a user connected", socket.id);

	const userId = socket.handshake.query.userId as string;

	if (userId) userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events, can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("a user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };
