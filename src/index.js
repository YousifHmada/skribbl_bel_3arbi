const fs = require('fs');
const { connect: connectPlugins } = require('./plugins');
const { init: initUseCases } = require('./use_cases');

function getConfig() {
  const text = fs.readFileSync('config.json');
  return JSON.parse(text);
}

async function main() {
  const context = {
    config: getConfig(),
    plugins: {},
  };
  await connectPlugins(context);
  context.useCases = initUseCases(context);
}

main();
