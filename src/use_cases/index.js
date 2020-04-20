const displayHelloWorld = require('./display_hello_world');
const createRoom = require('./host/create_room');
const joinRoom = require('./player/join_room');

function init(context) {
  return {
    displayHelloWorld: displayHelloWorld.init(context),
    host: { createRoom: createRoom.init(context) },
    player: { joinRoom: joinRoom.init(context) },
  };
}

module.exports = {
  init,
};
