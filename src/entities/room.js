const { v4: uuidv4 } = require('uuid');

function init(context) {
  return class Room {
    constructor({ socketNsp }) {
      if (socketNsp === undefined) throw new Error('socketNsp is required!');
      this.id = socketNsp.name;
      this.hostId = uuidv4();
      this.game = new context.entities.Game();
      this.socketNsp = socketNsp;
      this.socketNsp.on('connection', this.onConnection.bind(this));
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}] created!`);
    }

    getPlayerGameStats(player) {
      this.game.getPlayerStats(player.id);
    }

    onConnection(socket) {
      const player = new context.entities.Player({
        ...socket.handshake.query,
        socket
      });
      player.joinRoom(this);
      if (player.id === this.hostId) {
        player.addHostPriviledges();
      }
      this.game.addPlayer(player);
      player.emit('connected', {
        me: player.getMetadata(),
        game: this.game.getMetadata()
      });
      player.broadcast('playerJoined', player.getMetadata());
    }

    startGame(gameSettings) {
      this.game.setSettings(gameSettings);
      this.game.start();
    }

    onPlayerLeft(player) {
      this.game.removePlayer(player);
      if (this.game.players.length === 0) {
        this.delete();
      } else {
        this.emit('playerLeft', player.getMetadata());
        if (player.isHost) {
          this.game.players[0].addHostPriviledges();
          this.emit('hostChanged', this.game.players[0].getMetadata());
        }
      }
    }

    delete() {
      this.onPlayerLeft = () => {};
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < this.game.players.length; i++) {
        this.game.players[i].leaveRoom();
      }
      this.game.delete();
      this.emit('roomDeleted');
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}] deleted!`);
      context.plugins.socketIO.removeNsp(this.socketNsp);
      this.socketNsp = null;
    }

    getMetadata() {
      return {
        link: `/rooms${this.id}`,
        hostId: this.hostId
      };
    }

    emit(...args) {
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}]`, ...args);
      this.socketNsp.emit(...args);
    }
  };
}

module.exports = {
  init
};
