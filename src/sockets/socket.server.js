
const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model.js");
const aiService = require("../services/ai.service.js");
const messageModel = require("../models/message.model.js");

function initSocketServer(httpServer) {
  const io = new Server(httpServer);

  io.use(async (socket, next) => {

    const cookies = cookie.parseCookie(
      socket.handshake.headers.cookie || ""
    );


    if (!cookies.token) {
      return next(new Error("No token provided"));
    }

    try {
      const decoded = jwt.verify(
        cookies.token,
        process.env.JWT_SECRET
      );

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    // event listener
    socket.on("ai-message",async(messagePayload)=>{

      // payload {
        // chat:chatId,
        // content:content
    // }

      await messageModel.create({
        chat:messagePayload.chat,
        user:socket.user._id,
        content:messagePayload.content,
        role:"user"
      })

      const chatHistory = (await messageModel.find({
        chat:messagePayload.chat
      }).sort({createdAt:-1}).limit(20).lean()).reverse();

      // short term memory
      const response = await aiService.generateResponse(chatHistory.map(item => {
        return {
          role : item.role,
          parts : [{text : item.content}]
        }
      }));

      await messageModel.create({
        chat:messagePayload.chat, 
        user:socket.user._id,
        content:response,
        role:"model"
      })

      
      socket.emit('ai-response',{
        content : response,
        chat : messagePayload.chat
      })
    })
  });

  return io;
}

module.exports = initSocketServer;
