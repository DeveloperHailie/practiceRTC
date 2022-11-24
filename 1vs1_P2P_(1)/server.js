const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use("/", express.static("public"));

io.on("connection", (socket) => {
  socket.on("join", (roomId) => {
    console.log(socket.adapter.rooms);
    console.log(socket);
    console.log(io.adapter);

    console.log(`${socket.id}가 서버로 join(roomId) 보냄`);

    const roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 };
    let numberOfClients;
    if (!io.sockets.adapter.rooms[roomId]) numberOfClients = 0;
    else numberOfClients = Object.values(roomClients).length;

    //console.log("rooms",io.sockets.adapter.rooms[roomId], roomClients, numberOfClients);

    // These events are emitted only to the sender socket.
    if (numberOfClients == 0) {
      console.log(`서버가 ${socket.id}로 roomCreated(roomId) 보냄`);
      socket.join(roomId);
      socket.emit("room_created", roomId);
    } else if (numberOfClients == 1) {
      console.log(`서버가 ${socket.id}로 roomJoined(roomId) 보냄`);
      socket.join(roomId);
      socket.emit("room_joined", roomId);
    } else {
      console.log(`서버가 ${socket.id}로 fullRoom(roomId) 보냄`);
      socket.emit("full_room", roomId);
    }
    console.log('\n');
  });

  // These events are emitted to all the sockets connected to the same room except the sender.
  socket.on("start_call", (roomId) => {
    console.log(`${socket.id}가 서버로 startCall(roomId) 보냄`);
    console.log(`서버가 전송자랑 같은방에 있는 애한테 startCall(roomId) 보냄`);
    socket.broadcast.to(roomId).emit("start_call");
    console.log('\n');
  });
  socket.on("webrtc_offer", (event) => {
    console.log(`${socket.id}가 서버로 offer(event) 보냄`);
    console.log("받은값",event);
    console.log(`서버가 전송자랑 같은방에 있는 애한테 offer(event.sdp) 보냄`);
    socket.broadcast.to(event.roomId).emit("webrtc_offer", event.sdp);
    console.log('\n');
  });
  socket.on("webrtc_answer", (event) => {
    console.log(`${socket.id}가 서버로 answer(event) 보냄`);
    console.log("받은값",event);
    console.log(`서버가 전송자랑 같은방에 있는 애한테 answer(event.sdp) 보냄`);
    socket.broadcast.to(event.roomId).emit("webrtc_answer", event.sdp);
    console.log('\n');
  });
  socket.on("webrtc_ice_candidate", (event) => {
    console.log(`${socket.id}가 서버로 iceCandidate(event) 보냄`);
    console.log("받은값",event);
    console.log(`서버가 전송자랑 같은방에 있는 애한테 iceCandidate(event) 보냄`);
    socket.broadcast.to(event.roomId).emit("webrtc_ice_candidate", event);
    console.log('\n');
  });
});

// START THE SERVER =================================================================
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
