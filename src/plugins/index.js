const expressPlugin = require('./express');
const firebasePlugin = require('./firebase');
const socketIoPlugin = require('./socket_io');
const localStoragePlugin = require('./local_storage');

async function connect(context) {
  context.plugins.express = await expressPlugin.init(context);
  context.plugins.firebase = await firebasePlugin.init(context);
  context.plugins.socketIo = await socketIoPlugin.init(context);
  context.plugins.localStorage = await localStoragePlugin.init(context);
}

module.exports = {
  connect,
};
