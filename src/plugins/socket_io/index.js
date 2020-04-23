/* eslint-disable no-console */
const socketIO = require('socket.io');

function init(context) {
  const io = socketIO(context.plugins.express.server);

  function createRoom(id) {
    const socketNsp = io.of(`/${id}`);
    console.log(`[Socket.io] Nsp : ${id} created!`);
    const room = new context.entities.Room({ id, socketNsp });
    return room;
  }

  function removeNsp(nsp) {
    nsp.removeAllListeners();
    delete io.nsps[nsp.name];
    console.log(`[Socket.io] Nsp : ${nsp.name} deleted!`);
  }

  function hasRoom(id) {
    return io.nsps[`/${id}`] !== undefined;
  }

  return { createRoom, removeNsp, hasRoom };
}

module.exports = {
  init,
};
