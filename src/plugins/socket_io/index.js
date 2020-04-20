const socket = require('socket.io');

function init(context) {
  const io = socket(context.plugins.express.server);
  io.sockets.on('connection', newConnection);

  function newConnection(socket) {
    const socketId = socket.id;
    const { userId } = socket.handshake.query;

    console.log('new connection: ', socket.id);

    context.plugins.localStorage.set(userId, socketId);

    socket.on('mouse', mouseMsg);

    function mouseMsg(data) {
      io.sockets.in(data.roomId).emit('mouse', data);
    }
  }

  function joinRoom(userId, roomId) {
    const socketId = context.plugins.localStorage.get(userId);
    console.log(socketId);
    const socket = io.sockets.connected[socketId];

    socket.join(roomId);
    io.sockets.in(roomId).emit('playerJoined', { playerId: userId });
  }

  function createRoom(roomId) {
    io(roomId);
  }

  return { createRoom, joinRoom };
}


module.exports = {
  init,
};
