/* eslint-disable no-param-reassign */
const createRoom = require('./host/create_room');
const deleteRoom = require('./host/delete_room');
const joinRoom = require('./player/join_room');

function init(context) {
  const useCases = {
    host: {
      createRoom: createRoom.init(context),
      deleteRoom: deleteRoom.init(context),
    },
    player: {
      joinRoom: joinRoom.init(context),
    },
  };

  Object.keys(useCases)
    .forEach((key) => { context.useCases[key] = useCases[key]; });
}

module.exports = {
  init,
};
