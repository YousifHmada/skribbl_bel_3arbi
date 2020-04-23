function init() {
  return class Player {
    constructor({ nickname, socket } = {}) {
      if (socket === undefined) throw new Error('socket is required!');
      this.nickname = nickname;
      this.room = null;
      this.socket = socket;
      this.socket.on('disconnect', this.leaveRoom.bind(this));
    }

    joinRoom(room) {
      this.room = room;
    }

    leaveRoom() {
      this.room.onPlayerLeft(this);
      this.socket.removeAllListeners();
      this.socket = null;
      this.room = null;
    }

    getMetadata() {
      return {
        nickname: this.nickname,
      };
    }
  };
}

module.exports = {
  init,
};
