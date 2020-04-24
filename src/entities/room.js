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

    onConnection(socket) {
      const player = new context.entities.Player({
        ...socket.handshake.query,
        socket
      });
      player.joinRoom(this);
      if (player.id === this.hostId) {
        player.isHost = true;
      }
      this.game.addPlayer(player);
      player.emit('connected', {
        me: player.getMetadata(),
        game: this.game.getMetadata()
      });
      player.broadcast('playerJoined', player.getMetadata());
    }

    getPlayerGameStats(player) {
      this.game.getPlayerStats(player.id);
    }

    getMetadata() {
      return {
        id: this.id,
        link: `/rooms${this.id}`,
        hostId: this.hostId
      };
    }

    onPlayerLeft(player) {
      this.game.removePlayer(player);
      if (this.game.players.length === 0) {
        this.delete();
      } else {
        this.emit('playerLeft', player.getMetadata());
        if (player.isHost) {
          this.game.players[0].isHost = true;
          this.hostId = this.game.players[0].id;
          this.emit('hostChanged', this.game.players[0].getMetadata());
        }
      }
    }

    emit(...args) {
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}]`, ...args);
      this.socketNsp.emit(...args);
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
  };
}

module.exports = {
  init
};
