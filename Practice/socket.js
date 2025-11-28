const io = require("socket.io")(3000, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Joining room
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(socket.id, "joined room:", roomName);
  });

  // Sending message to that room only
  socket.on("sendMessage", ({ roomName, msg }) => {
    io.to(roomName).emit("receiveMessage", msg);
  });
});

const socket = io("http://localhost:3000");

// Join a room
socket.emit("joinRoom", "friends");

// Send message to only that room
socket.emit("sendMessage", {
  roomName: "friends",
  msg: "Hey everyone!"
});

// Receive message
socket.on("receiveMessage", (msg) => {
  console.log("New message:", msg);
});

//SetUp Socket

const { Server: SocketIOServer } = require("socket.io");
const Message = require("./models/messages.model");
const ChannelMessage = require("./models/channelMessages.model");

// Function to set up Socket.IO
const setUpSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173", // Use environment variable for frontend URL
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Map to store userId-socketId mapping
  const userSocketMap = new Map();
  console.log("userSocketMap", userSocketMap);

  /**
   * Function to handle socket disconnection
   * @param {Object} socket - The socket instance
   */
  const disconnect = (socket) => {
    for (const [userId, socketId] of userSocketMap) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId); // Remove user from the map
        console.log(
          `User with ID: ${userId} removed from userSocketMap with socket ID: ${socket.id}`
        );
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    //this is for when we store the userId when if he is online...
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createdMessage = await Message.create({
      sender: message.sender,
      recipient: message.recipient,
      content: message.content,
      messageType: message.messageType,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender")
      .populate("recipient");

    //if its in Online
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }

    if (recipientSocketId) {
      //if its in Online
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
  };

  const channelSendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const createChannelMessage = await ChannelMessage.create({
      senderId: message.sender,
      channelId: message.channelId,
      message: message.message,
    });

    const channelMessageData = await ChannelMessage.findById(
      createChannelMessage._id
    ).populate("senderId");

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveChannelMessage", channelMessageData);
    }

    for (const member of message.members) {
      if (member.userId !== message.sender) {
        console.log("member.userId>>>>", member);

        const receiptSocketId = userSocketMap.get(member.userId);
        // 67763065f1381e3ad3081ebc-rahul
        // 677e340ddf374af42770e189-test-3

        if (receiptSocketId) {
          io.to(receiptSocketId).emit(
            "receiveChannelMessage",
            channelMessageData
          );
        }
      }
    }
  };

  // Handle new socket connections
  io.on("connection", (socket) => {
    //this is the scoket coming from the clientSide
    const userId = socket.handshake.query.userId; // Extract userId from query

    if (userId) {
      userSocketMap.set(userId, socket.id); // Store userId-socketId mapping
      console.log(
        `New connection: User ID: ${userId}, Socket ID: ${socket.id}`
      );
    } else {
      console.log("New connection with no user ID provided.");
    }

    //Receving the Messages from persoanl
    socket.on("sendMessage", sendMessage);

    //receiving the message from Channel
    socket.on("channelSendMessage", channelSendMessage);

    // Handle socket disconnection
    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });

  return io;
};

module.exports = setUpSocket;


//in APP.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const helmet = require("helmet"); // Security middleware
const morgan = require("morgan"); // Logging
const http = require("http");
const setUpSocket = require("./socket");

dotenv.config();

const app = express();
const server = http.createServer(app);
// Initialize Socket.IO
setUpSocket(server);
// Start Server
server.listen(port, () => {
  console.log(`🚀 Server is running on port with ${port}`);
});

