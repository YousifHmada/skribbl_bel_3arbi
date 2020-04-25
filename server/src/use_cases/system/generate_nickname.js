const moniker = require('moniker');

function init() {
  return async function genNickname() {
    return moniker.choose();
  };
}

module.exports = {
  init,
};
