const path = require('path');
// eslint-disable-next-line no-unused-vars
function init(context) {
  return {
    createRoomPage: path.resolve('./src/plugins/ui/create_room.html'),
    roomPage: path.resolve('./src/plugins/ui/room.html'),
  };
}

module.exports = {
  init,
};
