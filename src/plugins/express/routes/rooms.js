const express = require('express');

function init() {
  const router = express.Router();

  router.post('', async (req, res, next) => {
    try {
      const data = await req.context.useCases.host.createRoom();
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  router.get('/:roomId', async (req, res, next) => {
    try {
      res.sendfile(req.context.plugins.ui.roomPage);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = init;
