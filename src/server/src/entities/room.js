const { v4: uuidv4 } = require('uuid');

function init(context) {
  return class Room {
    constructor({ socketNsp }) {
      if (socketNsp === undefined) throw new Error('socketNsp is required!');
      this.id = socketNsp.name;
      this.hostId = uuidv4();
      this.game = new context.entities.Game();
      this.game.on('gameStart', this.onGameStart.bind(this));
      this.game.on('newTurn', this.onNewTurn.bind(this));
      this.game.on('wordChoosen', this.onWordChoosen.bind(this));
      this.game.on('gameover', this.onGameover.bind(this));
      this.game.on('drawTimerStarted', this.onDrawTimerStarted.bind(this));
      this.game.on('drawTimerUpdated', this.onDrawTimerUpdated.bind(this));
      this.game.on('drawTimerEnded', this.onDrawTimerEnded.bind(this));
      this.socketNsp = socketNsp;
      this.socketNsp.on('connection', this.onConnection.bind(this));
      // eslint-disable-next-line no-console
      console.log(`[Room ${this.id}] created!`);
    }

    getPlayerGameStats(player) {
      this.game.getPlayerStats(player.id);
    }

    onConnection(socket) {
      try {
        const player = new context.entities.Player({
          ...socket.handshake.query,
          socket,
          room: this,
          game: this.game
        });
        if (player.id === this.hostId) {
          player.addHostPriviledges();
        }
        this.game.addPlayer(player);
        player.emit('connected', {
          me: player.getMetadata(),
          game: this.game.getMetadata()
        });
        player.broadcast('playerJoined', player.getMetadata());
      } catch ({ stack }) {
        try {
          socket.emit('connect_error', stack);
          // eslint-disable-next-line no-empty
        } catch (_) {}
      }
    }

    onGameStart(gameSettings) {
      this.emit('gameStarted', gameSettings);
    }

    onGameover(score) {
      this.emit('gameover', score);
    }

    onNewTurn({ player, score, turn, roundsLeft, wordChoices }) {
      for (let i = 0; i < this.game.players.length; i++) {
        this.game.players[i].removeTurnPriviledges();
      }
      player.addTurnPriviledges();
      player.emit('newTurn', { turn, score, roundsLeft, wordChoices });
      player.broadcast('newTurn', { turn, score, roundsLeft });
    }

    onWordChoosen({ player, word }) {
      player.emit('wordChoosen', word);
      player.broadcast(
        'wordChoosen',
        word
          .split('')
          .map(() => '-')
          .join('')
      );
    }

    onDrawTimerStarted() {
      this.emit('drawTimerStarted');
    }

    onDrawTimerUpdated(timeLeft) {
      this.emit('drawTimerUpdated', timeLeft);
    }

    onDrawTimerEnded() {
      this.emit('drawTimerEnded');
    }

    getMetadata() {
      return {
        id: this.id,
        link: `/rooms${this.id}`,
        hostId: this.hostId
      };
    }

    onPlayerLeft(player) {
      this.emit('playerLeft', player.getMetadata());
      this.game.removePlayer(player);
      if (this.game.players.length === 0) {
        this.delete();
      } else {
        if (player.isHost) {
          this.game.players[0].addHostPriviledges();
          this.hostId = this.game.players[0].id;
          this.emit('hostChanged', this.game.players[0].getMetadata());
        }
      }
    }

    onBoardUpdated(player, data) {
      player.broadcast('boardUpdated', data);
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
