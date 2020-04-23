function init() {
  return class Player {
    constructor({ nickname, socket } = {}) {
      if (socket === undefined) throw new Error('socket is required!');
      this.nickname = nickname;
      this.id = socket.id; // Just a unique id, any unique id will do
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
