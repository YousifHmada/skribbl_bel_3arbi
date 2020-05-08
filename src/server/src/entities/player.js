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
      this.gameData = {
        score: 0
      };
      this.socket = socket;
      this.socket.on('disconnect', this.onDisconnect.bind(this));
      this.socket.on('updateProfile', this.updateProfile.bind(this));
      this.socket.on('sendReact', this.sendReact.bind(this));
      this.socket.on('guessWord', this.guessWord.bind(this));
      // Init handlers
      this.chooseWordHandler = () => {};
      this.updateBoardHandler = () => {};
      this.startGameHandler = () => {};
      this.socket.on('chooseWord', (...args) => {
        this.chooseWordHandler(...args);
      });
      this.socket.on('updateBoard', (...args) => {
        this.updateBoardHandler(...args);
      });
      this.socket.on('startGame', (...args) => {
        this.startGameHandler(...args);
      });
    }

    onDisconnect() {
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
        avatar: this.avatar,
        isHost: this.isHost, // TODO
        gameData: this.gameData
      };
    }

    addHostPriviledges() {
      this.isHost = true;
      this.startGameHandler = this.startGame;
    }

    removeHostPriviledges() {
      this.isHost = false;
      this.startGameHandler = () => {};
    }

    addTurnPriviledges() {
      this.hasTurnPriviledges = true;
      this.chooseWordHandler = this.chooseWord;
      this.updateBoardHandler = this.updateBoard;
    }

    removeTurnPriviledges() {
      this.hasTurnPriviledges = false;
      this.chooseWordHandler = () => {};
      this.updateBoardHandler = () => {};
    }

    resetGameData() {
      this.gameData = {
        score: 0
      };
    }

    guessWord(input, ack) {
      try {
        if (this.game.state !== 'running') throw new Error('game should be in running state');
        if (this.hasTurnPriviledges) throw new Error("player can't guess with turnPriviledges");
        this.game.onWordGuessed(this, input, ack);
      } catch ({ stack }) {
        ack(stack);
      }
    }

    chooseWord(index) {
      if (this.game.state !== 'running') throw new Error('game should be in running state');
      if (this.hasTurnPriviledges !== true) throw new Error('player should have turn priviledges to choose a word');
      this.game.onWordChoosen(index);
    }

    updateBoard(data, ack) {
      try {
        if (this.game.state !== 'running') throw new Error('game should be in running state');
        if (this.hasTurnPriviledges !== true) throw new Error('player should have turn priviledges to draw');
        this.room.onBoardUpdated(this, data);
      } catch ({ stack }) {
        ack(stack); // This signals an error on client!
      }
    }

    updateProfile({ nickname, avatar } = {}, ack) {
      try {
        if (this.game.state === 'running') throw new Error('game should not be in running state');
        if (nickname) {
          this.nickname = nickname;
        }
        if (avatar) {
          this.avatar = avatar;
        }
        this.room.onProfileUpdated(this);
      } catch ({ stack }) {
        ack(stack);
      }
    }

    sendReact(reaction, ack) {
      try {
        if (this.game.state !== 'running') throw new Error('game should be in running state');
        this.room.onReactSent(this, reaction);
      } catch ({ stack }) {
        ack(stack);
      }
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
