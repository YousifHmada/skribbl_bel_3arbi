function init(context) {
  return async function deleteRoom(roomId) {
    await context.plugins.socketIO.deleteRoom(roomId);
  };
}

module.exports = {
  init,
};
