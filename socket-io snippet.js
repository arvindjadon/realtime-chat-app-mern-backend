/*
npm install socket.io
*/

import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("sent_message", (data) => {
    console.log(data);
    // socket.broadcast.emit("receive_message", data);
    socket.to(data.room).emit("received_message", data);
  });
});

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
