/* eslint-disable no-param-reassign */
const playerEntity = require('./player');
const roomEntity = require('./room');
const customErrorEntity = require('./customError');

function init(context) {
  const entities = {
    Player: playerEntity.init(context),
    Room: roomEntity.init(context),
    CustomerError: customErrorEntity.init(context),
  };
  Object.keys(entities)
    .forEach((key) => { context.entities[key] = entities[key]; });
}

module.exports = {
  init,
};
