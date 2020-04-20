function init(context) {
  return async function displayHelloWorld() {
    return 'hello World!';
  };
}

module.exports = {
  init,
};
