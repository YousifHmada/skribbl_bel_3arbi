const fs = require('fs');
const { init: attachPlugins } = require('./plugins');
const { init: attachUseCases } = require('./use_cases');

function getConfig() {
  const text = fs.readFileSync('config.json');
  return JSON.parse(text);
}

async function main() {
  const context = {
    config: getConfig(),
    plugins: {},
  };
  await attachPlugins(context);
  attachUseCases(context);
}

main();
