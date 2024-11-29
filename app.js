const { log } = require("console");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const port = process.env.PORT || 3000;
const path = require("path");

const io = require("socket.io")(http); //socket is connected with the server

let users = 0;
let limit = 0;
io.on("connection", (socket) => {
  //connection who are connecting to the server
  console.log("a user connected");

  //sending
  //   socket.emit("custom-Event", "Message from the Server SIde");
  //   socket.on("fromClient", (data) => {
  //     console.log("getting message from the clientSIDE>>>>>>>>>>", data);
  //   });
  //   socket.send("what is this message why we should we to write this");
  //----------------------------------------------------------------------------------------
  //================================================================================================

  //Sends the message to all connected clients, including the sender.
  // users++
  //   io.sockets.emit("allConnectedUsers",`${users}--are connected`)
  //-----------------------------------------------------------------------------------------
  //================================================================================================

  // ends the message to all connected clients except the sender.
  // users++

  // socket.emit("connectedOne", "HI Ra huka");
  // socket.broadcast.emit("exceptSender", `${users}--are connected`);
  //-----------------------------------------------------------------------------------------
  //================================================================================================

  //Creating Rooms--and welcoming them...
  socket.join("groupId");
  io.sockets.in("groupId").emit("joinTheRoom", "Welcome to the group");
  // limit++
  // console.log("What is the limit man >>>>>>>>>>>>>>",limit);

  // if(limit>=5){
  //   io.sockets.in("groupId").emit("limitReached", "Limit reached");
  // }
  //================================================================================================

  socket.on("disconnect", () => {
    // users--;
    // io.sockets.emit("allConnectedUsers", `${users}--are disConnected`);
    // socket.broadcast.emit("exceptSender", `${users}--are disConnected`);

    //who are disconnected.....
    console.log("a user disconnected");
  });
});

//================================================================================================

//custom namespaces
// const chatNamespaces = io.of("/groups");
// chatNamespaces.on("connection", (socket) => {
//   console.log("a user connected to the chat room");
//   chatNamespaces.emit("message", "Welcome to the chat room");
//   chatNamespaces.on("send-message", (message) => {
//     console.log(message);
//   });
//   chatNamespaces.on("disconnect", () => {
//     console.log("a user disconnected from the chat room");
//   });
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

http.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
