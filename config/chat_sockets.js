
const socketIO = require('socket.io');

module.exports.chatSockets = function(socketServer) {
    const io = socketIO(socketServer, {
        cors: {
            origin: "http://localhost:8000", // Allow requests from this origin
            methods: ["GET", "POST"],
            credentials: true // Allows credentials to be included
        }
    });

    io.on('connection', function(socket) {
        console.log('New connection received:', socket.id);

        socket.on('disconnect', function() {
            console.log('Socket disconnected:', socket.id);
        });

        socket.on('join_room', function(data) {
            console.log('Joining request received:', data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined', { user_email: data.user_email });
        });

        socket.on('send_message', function(data) {
            io.in(data.chatroom).emit('receive_message', data);
        });
    });
};