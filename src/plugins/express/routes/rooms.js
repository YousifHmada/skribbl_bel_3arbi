const express = require('express');

function init() {
  const router = express.Router();

  router.post('', async (req, res, next) => {
    try {
      const roomId = await req.context.useCases.host.createRoom();
      const link = `/rooms/${encodeURIComponent(roomId)}`;
      res.send({ link });
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
