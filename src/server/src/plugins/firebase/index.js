// eslint-disable-next-line no-unused-vars
const db = require('./db');

function init() {
  return class GameWords {
    constructor(numWordsReq) {
      this.numWordsReq = numWordsReq;
      this.result = [];
    }
    generate() {
      const wordsBank = db.init().wordsBank;
      const max = wordsBank.length;
      this.result = [];
      while (this.numWordsReq > this.result.length) {
        let generateNum = Math.floor(Math.random() * max); // (Exclusive MAX)
        let genWord = wordsBank[generateNum];
        if (this.numWordsReq > max || !this.result.includes(genWord)) this.result.push(genWord);
      }
    }
    use3words() {
      let words = this.result.slice(0, 3);
      this.result.pop();
      this.result.pop();
      this.result.pop();
      return words;
    }
  };
}

module.exports = {
  init
};
