const fs = require('fs');
const { init: attachPlugins } = require('./plugins');
const { init: attachUseCases } = require('./use_cases');
const { init: attachEntities } = require('./entities');

function getConfig() {
  const text = fs.readFileSync('config.json');
  return JSON.parse(text);
}

async function main() {
  const context = {
    config: getConfig(),
    plugins: {},
    useCases: {},
    entities: {},
  };
  await attachPlugins(context);
  attachUseCases(context);
  attachEntities(context);
}

main();
