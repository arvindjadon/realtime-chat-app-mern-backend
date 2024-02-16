// importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// app config
const app = express();
const port = process.env.PORT || 9000;
const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(cors());

// DB config
const connection_url =
  "mongodb+srv://admin:ttt2KAYfwKOiLgVb@cluster0.jbn68ct.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  // useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// ????
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

// api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// app.post("/api/v1/messages/new", (req, res) => {
app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

// listen
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
