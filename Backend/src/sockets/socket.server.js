const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");

const {
    createMemory,
    queryMemory
} = require("../services/vector.service");

// Safe resolver for cookie.parse across CommonJS / ESM interop
const parseCookies = cookie.parse || cookie.default?.parse;

function initSocketServer(httpServer) {

    const io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:5173",
            allowedHeaders: ["Content-Type", "Authorization"],
            credentials: true
        }
    });

    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const rawCookie = socket.handshake.headers?.cookie || "";
            const cookies = typeof parseCookies === "function" ? parseCookies(rawCookie) : {};

            const token = cookies.token || socket.handshake.auth?.token;

            if (!token) {
                return next(new Error("Authentication error: No token provided"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = user;
            next();

        } catch (err) {
            next(new Error("Authentication error: Invalid token"));
        }
    });

    io.on("connection", (socket) => {

        socket.on("ai-message", async (messagePayload) => {
            try {
                if (!messagePayload?.chat || !messagePayload?.content?.trim()) {
                    return socket.emit("ai-error", {
                        message: "Chat ID and message content are required."
                    });
                }

                // 1. Save user message in MongoDB
                const message = await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: messagePayload.content,
                    role: "user"
                });

                // 2. Store user message in Pinecone & retrieve relevant memories + chat history
                const [, memory, chatHistory] = await Promise.all([
                    createMemory({
                        messageId: message._id,
                        chunkText: messagePayload.content,
                        title: "User message",
                        userId: socket.user._id,
                        chatId: messagePayload.chat,
                        role: "user"
                    }),

                    queryMemory({
                        queryText: messagePayload.content,
                        limit: 3,
                        userId: socket.user._id
                    }),

                    messageModel.find({
                        chat: messagePayload.chat
                    })
                        .sort({ createdAt: -1 })
                        .limit(20)
                        .lean()
                        .then(messages => messages.reverse())
                ]);

                // 3. Short-term memory (conversation history)
                const stm = chatHistory.map(item => ({
                    role: item.role,
                    parts: [{ text: item.content }]
                }));

                // 4. Long-term memory (only inject if relevant memories exist)
                const ltm = memory && memory.length > 0
                    ? [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: `These are some previous relevant messages. Use them as context to generate a response:\n\n${memory.map(item => item.chunk_text).join("\n")}`
                                }
                            ]
                        }
                    ]
                    : [];

                // 5. Generate AI response
                const response = await aiService.generateResponse([
                    ...ltm,
                    ...stm
                ]);

                // 6. Send response to frontend immediately
                socket.emit("ai-response", {
                    content: response,
                    chat: messagePayload.chat
                });

                // 7. Save AI response in MongoDB
                const responseMessage = await messageModel.create({
                    chat: messagePayload.chat,
                    user: socket.user._id,
                    content: response,
                    role: "model"
                });

                // 8. Store AI response in Pinecone
                await createMemory({
                    messageId: responseMessage._id,
                    chunkText: response,
                    title: "AI response",
                    userId: socket.user._id,
                    chatId: messagePayload.chat,
                    role: "model"
                });

            } catch (error) {
                console.error("AI message error:", error);

                socket.emit("ai-error", {
                    message: error.message || "Something went wrong processing your message."
                });
            }
        });

    });
}

module.exports = initSocketServer;