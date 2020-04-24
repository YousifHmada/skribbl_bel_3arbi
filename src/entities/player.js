const { v4: uuidv4 } = require('uuid');
const moniker = require('moniker');

function init() {
  return class Player {
    constructor({ id, nickname, socket } = {}) {
      if (socket === undefined) throw new Error('socket is required!');
      this.nickname = nickname || moniker.choose();
      this.id = id || uuidv4();
      this.isHost = false;
      this.room = null;
      this.playerGameStats = null;
      this.socket = socket;
      this.socket.on('disconnect', this.leaveRoom.bind(this));
    }

    joinRoom(room) {
      this.room = room;
    }

    leaveRoom() {
      this.socket.removeAllListeners();
      this.socket = null;
      const { room } = this;
      this.room = null;
      room.onPlayerLeft(this);
    }

    getMetadata() {
      return {
        id: this.id,
        nickname: this.nickname,
        isHost: this.isHost, // TODO
        playerGameStats: this.playerGameStats
      };
    }

    emit(...args) {
      try {
        this.socket.emit(...args);
        // eslint-disable-next-line no-console
        console.log(`[Player ${this.id}]`, ...args);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    broadcast(...args) {
      try {
        this.socket.broadcast.emit(...args);
        // eslint-disable-next-line no-console
        console.log(`[Player ${this.id}][broadcast]`, ...args);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  };
}

module.exports = {
  init
};
