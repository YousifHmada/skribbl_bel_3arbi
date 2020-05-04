/* eslint-disable no-param-reassign */
const expressPlugin = require('./express');
const firebasePlugin = require('./firebase');
const socketIOPlugin = require('./socket_io');
const localStoragePlugin = require('./local_storage');
const uiPlugin = require('./ui');

async function init(context) {
  context.plugins.firebase = await firebasePlugin.init(context);
  context.plugins.localStorage = await localStoragePlugin.init(context);
  context.plugins.ui = await uiPlugin.init(context);
  context.plugins.express = await expressPlugin.init(context);
  context.plugins.socketIO = await socketIOPlugin.init(context);
}

module.exports = {
  init
};
