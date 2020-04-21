/* eslint-disable no-console */
const socketIO = require('socket.io');

function init(context) {
  const io = socketIO(context.plugins.express.server);

  function createRoom(roomId) {
    const roomNsp = io.of(`/${roomId}`);
    console.log(`Room : ${roomId} created!`);

    roomNsp.on('connection', onPlayerConnected);

    function getNumPlayers() {
      return Object.keys(roomNsp.sockets).length;
    }

    function onPlayerConnected(socket) {
      console.log('playerConnected', { numPlayers: getNumPlayers() });
      socket.broadcast.emit('playerConnected', { numPlayers: getNumPlayers() });

      socket.on('disconnect', onPlayerDisconnected);

      function onPlayerDisconnected() {
        console.log('playerDisconnected', { numPlayers: getNumPlayers() });
        socket.broadcast.emit('playerDisconnected', { numPlayers: getNumPlayers() });
      }
    }
  }

  function deleteRoom(roomId) {
    io.nsps[`/${roomId}`].removeAllListeners();
    delete io.nsps[`/${roomId}`];
  }

  function hasRoom(roomId) {
    return io.nsps[`/${roomId}`] !== undefined;
  }

  return { createRoom, deleteRoom, hasRoom };
}


module.exports = {
  init,
};
