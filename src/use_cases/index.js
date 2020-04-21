/* eslint-disable no-param-reassign */
const createRoom = require('./host/create_room');
const joinRoom = require('./player/join_room');

function init(context) {
  const useCases = {
    host: { createRoom: createRoom.init(context) },
    player: { joinRoom: joinRoom.init(context) },
  };

  Object.keys(useCases)
    .forEach((key) => { context[key] = useCases[key]; });
}

module.exports = {
  init,
};
