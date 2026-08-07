import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { verifyToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";

let io: Server | undefined;

// Map of userId -> connected socket ids, so we can push notifications
// to a specific user across possibly multiple open tabs/devices.
const userSockets = new Map<string, Set<string>>();

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL, credentials: true },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No auth token"));
    try {
      const { userId } = verifyToken(token);
      socket.data.userId = userId;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId as string;
    if (!userSockets.has(userId)) userSockets.set(userId, new Set());
    userSockets.get(userId)!.add(socket.id);

    socket.on("disconnect", () => {
      userSockets.get(userId)?.delete(socket.id);
    });
  });

  return io;
}

interface NewNotification {
  type: "CONNECTION_REQUEST" | "CONNECTION_ACCEPTED" | "ENDORSEMENT";
  message: string;
  fromUserId: string;
}

// Persists the notification and, if the recipient is online, pushes it
// over their socket in real time.
export async function notifyUser(recipientId: string, notif: NewNotification) {
  const saved = await prisma.notification.create({
    data: { recipientId, type: notif.type, message: notif.message, fromUserId: notif.fromUserId },
  });

  const sockets = userSockets.get(recipientId);
  if (io && sockets) {
    for (const socketId of sockets) {
      io.to(socketId).emit("notification", saved);
    }
  }
}
