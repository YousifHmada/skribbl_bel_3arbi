
function init(context) {
  return async function joinRoom(userId, roomId) {
    context.plugins.socketIO.joinRoom(userId, roomId);
  };
}

module.exports = {
  init,
};
