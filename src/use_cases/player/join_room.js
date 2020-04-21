const CustomError = require('../../entities/customError');

function init(context) {
  return async function joinRoom(roomId) {
    if (await context.plugins.socketIO.hasRoom(roomId)) return;
    throw new CustomError("Room doesn't exist");
  };
}

module.exports = {
  init,
};
