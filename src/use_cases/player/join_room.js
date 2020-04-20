
function init(context) {
  return async function joinRoom(userId, roomId) {
    context.plugins.socketIo.joinRoom(userId, roomId);
  };
}

module.exports = {
  init,
};
