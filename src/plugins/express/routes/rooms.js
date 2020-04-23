const express = require("express");

function init() {
  const router = express.Router();

  router.post("", async (req, res, next) => {
    try {
      const roomId = await req.context.useCases.host.createRoom();
      console.log(req.body.numRounds);
      console.log(req.body.roundTime);
      const link = `/rooms/${encodeURIComponent(roomId)}`;
      res.send({ link });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:roomId", async (req, res, next) => {
    try {
      const { roomId } = req.params;
      await req.context.useCases.host.deleteRoom(roomId);
      res.send();
    } catch (error) {
      next(error);
    }
  });

  router.get("/:roomId", async (req, res, next) => {
    try {
      const { roomId } = req.params;
      await req.context.useCases.player.joinRoom(roomId);
      // res.sendfile(req.context.plugins.ui.roomPage);
      if (res.statusCode == 200) {
        // TODO 
        res.send("200");
        res.end();
      }
    } catch (error) {
      // next(error);
      // TODO add error handeling
      res.send("400");
    }
  });
  return router;
}

module.exports = init;
