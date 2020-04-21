const express = require('express');

function init() {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      res.sendfile(req.context.plugins.ui.createRoomPage);
    } catch (error) {
      next(error);
    }
  });

  router.post('/rooms', async (req, res, next) => {
    try {
      const roomId = await req.context.useCases.host.createRoom();
      const link = `/rooms/${encodeURIComponent(roomId)}`;
      res.send({ link });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/rooms/:roomId', async (req, res, next) => {
    try {
      const { roomId } = req.params;
      await req.context.useCases.host.deleteRoom(roomId);
      res.send();
    } catch (error) {
      next(error);
    }
  });

  router.get('/rooms/:roomId', async (req, res, next) => {
    try {
      const { roomId } = req.params;
      await req.context.useCases.player.joinRoom(roomId);
      res.sendfile(req.context.plugins.ui.roomPage);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

module.exports = init;
