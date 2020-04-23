function init(context) {
  return class Room {
    constructor({ id, socketNsp }) {
      if (id === undefined || socketNsp === undefined) throw new Error('id & socketNsp are required!');
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}] created!`);
      this.players = [];
      this.id = id;
      this.socketNsp = socketNsp;
      this.socketNsp.on('connection', this.onConnection.bind(this));
    }

    onConnection(socket) {
      const player = new context.entities.Player({
        ...socket.handshake.query,
        socket,
      });
      player.joinRoom(this);
      this.players.push(player);
      this.emit('playerJoined', player.getMetadata());
    }

    getMetadata() {
      return {
        players: this.players.map((player) => player.getMetadata()),
      };
    }

    onPlayerLeft(player) {
      const index = this.players.findIndex((currentPlayer) => player === currentPlayer);
      this.players.splice(index, 1);
      this.emit('playerLeft', player.getMetadata());
    }

    emit(...args) {
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}]`, ...args);
      this.socketNsp.emit(...args);
    }

    delete() {
      this.onPlayerLeft = () => {};
      this.players.forEach((player) => player.leaveRoom());
      this.players = null;
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}] deleted!`);
      context.plugins.socketIO.removeNsp(this.socketNsp);
      this.socketNsp = null;
    }
  };
}

module.exports = {
  init,
};
