const { v4: uuidv4 } = require('uuid');
const moniker = require('moniker');

function getRandomNum(max) {
  return Math.floor(Math.random() * max + 1);
}

function getRandomAvatar() {
  return [getRandomNum(17), getRandomNum(30), getRandomNum(23), -1];
}

function init() {
  return class Player {
    constructor({ id, nickname, avatar, socket, room, game } = {}) {
      if (socket === undefined) throw new Error('socket is required!');
      this.nickname = nickname || moniker.choose();
      this.avatar = avatar || getRandomAvatar();
      this.id = id || uuidv4();
      this.isHost = false;
      this.room = room;
      this.game = game;
      this.playerGameStats = null;
      this.socket = socket;
      this.socket.on('disconnect', this.onDisconnect.bind(this));
    }

    onDisconnect() {
      this.socket.removeAllListeners();
      this.socket = null;
      const { room } = this;
      this.room = null;
      room.onPlayerLeft(this);
    }

    addHostPriviledges() {
      this.isHost = true;
      this.socket.on('startGame', this.startGame.bind(this));
    }

    removeHostPriviledges() {
      this.isHost = false;
      this.socket.off('startGame');
    }

    addTurnPriviledges() {
      this.hasTurnPriviledges = true;
      this.socket.on('chooseWord', this.chooseWord.bind(this));
    }

    removeTurnPriviledges() {
      this.hasTurnPriviledges = false;
      try {
        this.socket.off('chooseWord');
      } catch (error) {}
    }

    chooseWord(index) {
      this.game.onWordChoosen(index);
    }

    startGame(gameSettings, ack) {
      try {
        if (this.isHost !== true) throw new Error('player should have host priviledges to start game');
        this.game.setSettings(gameSettings);
        this.game.start();
      } catch ({ stack }) {
        ack(stack); // This signals an error on client!
      }
    }

    getMetadata() {
      return {
        id: this.id,
        nickname: this.nickname,
        avatar: this.avatar,
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