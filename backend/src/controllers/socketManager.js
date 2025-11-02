import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server, {
    // cors: {
    //   origin: "*",
    //   methods: ["GET", "POST"],
    // },
    cors: {
      origin: [
        "https://video-chat-dusky-psi.vercel.app",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("join-call", (path) => {
      console.log("=== JOIN CALL ===");
      console.log("Socket ID:", socket.id);
      console.log("Path:", path);

      if (!connections[path]) connections[path] = [];

      connections[path].push(socket.id);
      timeOnline[socket.id] = Date.now();

      console.log("All users in room:", connections[path]);

      // Notify existing users
      // for (let id of connections[path]) {
      //   if (id !== socket.id) {
      //     io.to(id).emit("user-joined", socket.id, connections[path]);
      //   }
      // }

      connections[path].forEach((socketId) => {
        console.log("Emitting user-joined to:", socketId);
        io.to(socketId).emit("user-joined", socket.id, connections[path]);
      });

      // Send chat history
      if (messages[path]) {
        messages[path].forEach((msg) => {
          io.to(socket.id).emit(
            "chat-message",
            msg.data,
            msg.sender,
            msg["socketId-Sender"]
          );
        });
      }
    });

    // socket.on("signal", ({ to, from, signal }) => {
    //   io.to(to).emit("signal", { from, signal });
    // });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {
      const [matchingRoom, found] = Object.entries(connections).reduce(
        ([room, isFound], [roomKey, roomValue]) => {
          if (!isFound && roomValue.includes(socket.id)) {
            return [roomKey, true];
          }
          return [room, isFound];
        },
        [null, false]
      );

      if (found) {
        if (!messages[matchingRoom]) messages[matchingRoom] = [];

        messages[matchingRoom].push({
          sender,
          data,
          "socketId-Sender": socket.id,
        });
        console.log("message", matchingRoom, ":", sender, ":", data);

        connections[matchingRoom].forEach((id) => {
          io.to(id).emit("chat-message", data, sender, socket.id);
        });
      }
    });

    socket.on("disconnect", () => {
      for (const [k, v] of Object.entries(connections)) {
        if (v.includes(socket.id)) {
          v.forEach((id) => io.to(id).emit("user-left", socket.id));
          connections[k] = v.filter((id) => id !== socket.id);
          if (connections[k].length === 0) {
            delete connections[k];
            delete messages[k];
          }
        }
      }
    });
  });

  return io;
};

export default connectToSocket;
