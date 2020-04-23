const EventEmiiter = require('events');

function init() {
  return class Game {
    constructor({ settings } = {}) {
      this.players = [];
      this.turn = 0;
      this.state = 'created'; // States: created, running, ended
      this.setSettings(settings);
      this.timer = null;
      this.eventEmitter = new EventEmiiter(); // Events: start, end, switchTurns
    }

    on(...args) {
      this.eventEmitter.on(...args);
    }

    off(...args) {
      this.eventEmitter.off(...args);
    }

    setSettings({ rounds = 3, drawTime = 60 } = {}) {
      if (this.state !== 'created') throw new Error('game should be in "created" state!');
      this.rounds = rounds;
      this.drawTime = drawTime;
    }

    addPlayer(player) {
      this.players.push(player);
    }

    removePlayer(player) {
      const index = this.players.findIndex((currentPlayer) => currentPlayer === player);
      if (index < 0) throw new Error();
      this.players.splice(index, 1);
      if (this.state === 'running') {
        if (index < this.turn) {
          this.turn -= 1;
        } else if (index === this.turn) {
          this.resetTimer();
          this.eventEmitter.emit('switchTurns', this.getPlayerInTurn());
        }
        if (!this.hasEnoughPlayers()) {
          this.end();
        }
      }
    }

    hasAvailableRounds() {
      return this.availableRounds > 0;
    }

    hasEnoughPlayers() {
      return this.players.length > 1;
    }

    switchTurns() {
      this.turn = (this.turn + 1) % this.players.length;
    }

    getPlayerInTurn() {
      return this.players[this.turn];
    }

    onTimerEnd() {
      if (this.turn + 1 >= this.players.length) {
        this.availableRounds -= 1;
      }
      if (this.hasEnoughPlayers() && this.hasAvailableRounds()) {
        this.switchTurns();
        this.resetTimer();
        this.eventEmitter.emit('switchTurns', this.getPlayerInTurn());
      } else {
        this.end();
      }
    }

    startTimer() {
      this.timer = setTimeout(this.onTimerEnd.bind(this), this.drawTime * 1000);
    }

    resetTimer() {
      this.clearTimer();
      this.startTimer();
    }

    clearTimer() {
      clearTimeout(this.timer);
      this.timer = null;
    }

    start() {
      switch (this.state) {
        case 'created':
          if (!this.hasEnoughPlayers()) throw new Error('not enough players to start game!');
          this.state = 'running';
          this.availableRounds = this.rounds;
          this.startTimer();
          this.eventEmitter.emit('start', this.getPlayerInTurn());
          break;
        default:
          throw new Error('game should be in "created" state!');
      }
    }

    end() {
      switch (this.state) {
        case 'running':
          this.clearTimer();
          this.state = 'ended';
          this.eventEmitter.emit('end');
          break;
        default:
          throw new Error('game should be in "running" state!');
      }
    }

    reset() {
      switch (this.state) {
        case 'ended':
          this.state = 'created';
          this.turn = 0;
          break;
        default:
          throw new Error('game should be in "ended" state!');
      }
    }

    delete() {
      if (this.state === 'running') {
        this.clearTimer();
      }
      this.eventEmitter.removeAllListeners();
      this.eventEmitter = null;
      this.players = null;
    }
  };
}

module.exports = {
  init
};

// const players = [
//   { name: 'yousif', id: 13 },
//   { name: 'osama', id: 22 },
//   { name: 'ebrahim', id: 44 },
// ];

// const game = new Game();
// game.on('start', (player) => {
//   console.log('game started', player);
// });
// game.on('end', () => {
//   console.log('game ended');
// });
// game.on('switchTurns', (player) => {
//   console.log('switch turns', player);
// });

// setTimeout(() => {
//   game.removePlayer(players[2]);
// }, 1500);

// players.forEach(game.addPlayer.bind(game));
// game.start();
