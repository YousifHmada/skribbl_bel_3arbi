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

  return router;
}

module.exports = init;
