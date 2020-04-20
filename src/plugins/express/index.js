const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

function init(context) {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(bodyParser.json());

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

  app.use((req, res, next) => {
    req.context = context;
    next();
  });

  app.get('/', async (req, res) => {
    res.send(await req.context.useCases.displayHelloWorld());
  });

  // eslint-disable-next-line no-console
  app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

  return {};
}

module.exports = {
  init,
};
