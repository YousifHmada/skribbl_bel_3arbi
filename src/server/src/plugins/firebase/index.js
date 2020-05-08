// eslint-disable-next-line no-unused-vars
const db = require('./db');

function init() {
  async function getWords(count) {
    return db.get(count);
  }
  return {
    getWords
  };
}

module.exports = {
  init
};
