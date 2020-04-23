function init(context) {
  return class Room {
    constructor({ socketNsp }) {
      if (socketNsp === undefined) throw new Error('socketNsp is required!');
      this.id = socketNsp.name;
      this.game = new context.entities.Game();
      this.socketNsp = socketNsp;
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}] created!`);
      this.socketNsp.on('connection', this.onConnection.bind(this));
    }

    onConnection(socket) {
      const player = new context.entities.Player({
        ...socket.handshake.query,
        socket
      });
      player.joinRoom(this);
      this.game.addPlayer(player);
      socket.emit('connected', {
        player: player.getMetadata(),
        room: this.getMetadata()
      });
      this.emit('playerJoined', player.getMetadata());
    }

    getMetadata() {
      return {
        id: this.id,
        players: this.game.players.map((player) => player.getMetadata())
      };
    }

    onPlayerLeft(player) {
      this.game.removePlayer(player);
      if (this.game.players.length === 0) {
        this.delete();
      }
      this.emit('playerLeft', player.getMetadata());
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
