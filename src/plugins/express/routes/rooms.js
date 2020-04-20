const express = require('express');

function init() {
  const router = express.Router();

  router.post('/rooms', async (req, res) => {
    const roomId = await req.context.useCases.host.createRoom();
    const link = `/rooms/${encodeURIComponent(roomId)}`;
    res.send({ link });
  });

  router.get('/rooms/:roomId', async (req, res) => {
    const { userId } = req.query;
    const { roomId } = req.params;
    await req.context.useCases.player.joinRoom(userId, roomId);

    res.send('');
    // res.redirect(`/index.html?roomId=${roomId}&userId=${userId}`)
  });

  return router;
}

module.exports = init;
