const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const initRoomRoutes = require('./routes/rooms');
const errorHandler = require('./errorHandler');

function init(context) {
  const app = express();
  const port = process.env.PORT || 3000;
  app.use(bodyParser.json());

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

  app.use((req, res, next) => {
    req.context = context;
    next();
  });

  app.use('/', initRoomRoutes());

  const displayErrors = process.env.NODE_ENV === 'development';
  app.use(errorHandler.init(displayErrors));

  // eslint-disable-next-line no-console
  const server = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

  return { server };
}

module.exports = {
  init,
};
