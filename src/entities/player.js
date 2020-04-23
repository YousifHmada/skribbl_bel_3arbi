const { v4: uuidv4 } = require('uuid');

function init() {
  return class Player {
    constructor({ id, nickname, socket } = {}) {
      if (socket === undefined) throw new Error('socket is required!');
      this.nickname = nickname;
      this.id = id !== undefined ? id : uuidv4();
      this.room = null;
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
        nickname: this.nickname
      };
    }
  };
}

module.exports = {
  init
};
