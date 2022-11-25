const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use("/", express.static("public"));

const maximum = 4;
let roomMember = {};

io.on("connection", (socket) => {
  socket.on("join", (roomId) => {
    //console.log(socket.adapter.rooms);
    //console.log(socket);
    //console.log(io.adapter);

    console.log(`${socket.id}가 서버로 join(roomId) 보냄`);

    const roomClients = io.sockets.adapter.rooms[roomId];
    let numberOfClients = 0;
    if (roomClients) numberOfClients = Object.values(roomClients).length;

    //console.log("rooms",io.sockets.adapter.rooms[roomId], roomClients, numberOfClients);

    // These events are emitted only to the sender socket.
    let socketMessage = "room_joined";
    if (numberOfClients == 0) {
      console.log(`서버가 ${socket.id}로 roomCreated(roomId) 보냄`);
      socket.join(roomId);
      socketMessage = "room_created";
    } else if (numberOfClients < maximum) {
      console.log(`서버가 ${socket.id}로 roomJoined(roomId) 보냄`);
      socket.join(roomId);
    } else {
      console.log(`서버가 ${socket.id}로 fullRoom(roomId) 보냄`);
      socket.emit("full_room", roomId);
      return;
    }

    memberSockets = [];
    for ( memberSocket in socket.adapter.rooms[roomId]){
      memberSockets.push(memberSocket);
    }
    roomMember[roomId]=memberSockets;
    
    socket.emit(socketMessage, {roomId, memberSockets});
    socket.broadcast.to(roomId).emit("member_joined", {memberSockets, sender:socket.id}); //자기 자신 제외, 같은 방 다른 멤버들에게 member_joined
  });

  // offer : join한 member에게 offer를 보냄 (자신의 RTCSeccionDescription)
  socket.on("webrtc_offer", (event) => {
    console.log(`${socket.id}가 서버로 offer(event) 보냄`);

    io.sockets.socket(event.receiver).send("webrtc_offer", {sender:socket.id ,sdp:event.sdp});
    console.log('\n');
  });

  // answer : offer를 보낸 user에게 answer를 보냄 (자신의 RTCSessionDescription)
  socket.on("webrtc_answer", (event) => {
    console.log(`${socket.id}가 서버로 answer(event) 보냄`);

    io.sockets.socket(event.receiver).send("webrtc_answer", {sender:socket.id ,sdp:event.sdp});
    console.log('\n');
  });

  // candidate : 자신의 ICECandidate 정보를 signal(offer 또는 answer)을 주고 받은 상대에게 전송
  socket.on("webrtc_ice_candidate", (event) => {
    console.log(`${socket.id}가 서버로 iceCandidate(event) 보냄`);

    io.sockets.socket(event.receiver).send("webrtc_ice_candidate", {sender:socket.id, candidate: event.candidate});
    console.log('\n');
  });
});

// START THE SERVER =================================================================
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
