function init() {
  const map = new Map();
  function logMap() {
    console.log(map.keys());
  }

  return {
    set: (key, data) => { map.set(key, data); logMap(); },
    get: (key) => map.get(key),
    has: (key) => map.has(key),
  };
}

module.exports = { init };
