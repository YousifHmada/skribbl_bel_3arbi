const socketIO = require('socket.io');

function init(context) {
  const io = socketIO(context.plugins.express.server);
  io.sockets.on('connection', newConnectionHandler);

  function newConnectionHandler(socket) {
    const socketId = socket.id;
    const { userId } = socket.handshake.query;

    // eslint-disable-next-line no-console
    console.log('new connection: ', socket.id);

    context.plugins.localStorage.set(userId, socketId);

    socket.on('mouseMovement', mouseMovementHandler);
  }

  function mouseMovementHandler(data) {
    const { roomId } = data;
    io.sockets.in(roomId).emit('mouseMoved', data);
  }

  function joinRoom(userId, roomId) {
    const socketId = context.plugins.localStorage.get(userId);
    const socket = io.sockets.connected[socketId];

    socket.join(roomId);
    io.sockets.in(roomId).emit('playerJoined', { playerId: userId });
  }

  return { joinRoom };
}


module.exports = {
  init,
};
