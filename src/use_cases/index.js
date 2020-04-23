/* eslint-disable no-param-reassign */
const createRoom = require('./host/create_room');
const genNickname = require('./system/generate_nickname.js');

function init(context) {
  const useCases = {
    host: {
      createRoom: createRoom.init(context),
    },
    player: {
    },
    system: {
      genNickname: genNickname.init(context),
    },
  };

  Object.keys(useCases)
    .forEach((key) => { context.useCases[key] = useCases[key]; });
}

module.exports = {
  init,
};
