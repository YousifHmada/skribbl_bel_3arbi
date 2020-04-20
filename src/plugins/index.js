const expressPlugin = require('./express');
const firebasePlugin = require('./firebase');

async function connect(context) {
  const plugins = {
    express: await expressPlugin.init(context),
    firebase: await firebasePlugin.init(context),
  };
  return plugins;
}

module.exports = {
  connect,
};
