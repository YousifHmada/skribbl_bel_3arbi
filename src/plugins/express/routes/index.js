const express = require('express');
const initRoomsRoutes = require('./rooms');

function init() {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      res.sendfile(req.context.plugins.ui.createRoomPage);
    } catch (error) {
      next(error);
    }
  });

  router.use('/rooms', initRoomsRoutes());

  router.get('/nickname', async (req, res, next) => {
    try {
      const nickname = await req.context.useCases.system.genNickname();
      res.send({ nickname });
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = init;
