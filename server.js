import http from "http";
import { Server } from "socket.io";

const httpServer = http.createServer();

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const users = new Map();

io.on("connection", (socket) => {
    console.log("connected");
    socket.on('join_room', (roomId) => {
        console.log("joined", roomId);
        socket.join(roomId);
    });

    socket.on("typing", () => {
        socket.broadcast.emit("user typing", true);
    });

    socket.on("stop_typing", () => {
        socket.broadcast.emit("user typing", false);
    });

    socket.on("send_message", (data) => {
        console.log("sending message has been initialised");
        io.in(data.roomId).emit('receive_msg', data);
    });

    socket.on("disconnect", (reason) => {
        console.log(`Socket has been disconnected ${reason}`);
    });
});

const PORT = process.env.PORT || 1100;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});