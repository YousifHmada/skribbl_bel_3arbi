const path = require('path');
// eslint-disable-next-line no-unused-vars
function init(context) {
  return {
    publicDir: path.resolve('../app/build'),
    createRoomPage: path.resolve('./src/plugins/ui/pages/create_room.html'),
    roomPage: path.resolve('./src/plugins/ui/pages/room.html')
  };
}

module.exports = {
  init
};
