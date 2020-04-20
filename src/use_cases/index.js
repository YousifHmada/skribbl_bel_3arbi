const displayHelloWorld = require('./display_hello_world');

function init(context) {
  return {
    displayHelloWorld: displayHelloWorld.init(context),
  };
}

module.exports = {
  init,
};
