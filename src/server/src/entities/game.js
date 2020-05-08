const EventEmiiter = require('events');

function init(context) {
  return class Game {
    constructor(settings = {}) {
      this.players = [];
      this.turn = 0;
      this.state = 'created'; // States: created, running, ended
      this.setSettings(settings);
      this.timer = null;
      this.eventEmitter = new EventEmiiter(); // Events: gameStart, gameover, newTurn, wordChoosen, drawTimerStarted, drawTimerUpdated, drawTimerEnded
      this.waitForWordChoiceTime = 5;
    }

    on(...args) {
      this.eventEmitter.on(...args);
    }

    off(...args) {
      this.eventEmitter.off(...args);
    }

    getTimeLeft() {
      if (this.timer) {
        return Math.ceil((this.timer._idleStart + this.timer._idleTimeout) / 1000 - process.uptime());
      }
      return null;
    }

    getMetadata() {
      return {
        rounds: this.rounds,
        drawTime: this.drawTime,
        state: this.state,
        turn: this.turn,
        roundsLeft: this.roundsLeft,
        players: this.players.map((player) => player.getMetadata())
      };
    }

    setSettings({ rounds = 3, drawTime = 10 } = {}) {
      if (this.state !== 'created') throw new Error('game should be in "created" state!');
      this.rounds = rounds;
      this.drawTime = drawTime;
    }

    getSettings() {
      return {
        rounds: this.rounds,
        drawTime: this.drawTime
      };
    }

    addPlayer(player) {
      const index = this.players.findIndex((currentPlayer) => currentPlayer === player);
      if (index < 0) {
        this.players.push(player);
      }
    }

    removePlayer(player) {
      const index = this.players.findIndex((currentPlayer) => currentPlayer === player);
      if (index < 0) throw new Error();
      this.players.splice(index, 1);
      if (this.state === 'running') {
        if (index < this.turn) {
          this.turn -= 1;
        } else if (index === this.turn) {
          if (this.waitForWordChoiceTimer) {
            clearTimeout(this.waitForWordChoiceTimer);
          }
          this.dispatchNewTurn();
        }
        if (!this.hasEnoughPlayers()) {
          this.end();
        }
      }
    }

    hasRoundsLeft() {
      return this.roundsLeft > 0;
    }

    hasEnoughPlayers() {
      return this.players.length > 1;
    }

    switchTurns() {
      this.turn = (this.turn + 1) % this.players.length;
    }

    getCurrentPlayer() {
      return this.players[this.turn];
    }

    async getWordChoices() {
      return context.plugins.firebase.getWords(3);
    }

    getScore() {
      const score = {};
      for (let i = 0; i < this.players.length; i++) {
        const { id } = this.players[i];
        score[id] = 300;
      }
      return score;
    }

    async dispatchNewTurn() {
      this.currentWordChoices = await this.getWordChoices();
      const score = this.getScore();
      this.onWordChoosen = onWordChoosen;
      this.eventEmitter.emit('newTurn', {
        player: this.getCurrentPlayer(),
        turn: this.turn,
        score,
        roundsLeft: this.roundsLeft,
        wordChoices: this.currentWordChoices
      });

      // Timer to choose a word in case of player choice timeout
      this.waitForWordChoiceTimer = setTimeout(() => {
        this.onWordChoosen = () => {};
        const index = Math.floor(Math.random() * 3); // random index between 0 and 2
        onWordChoosen.bind(this)(index);
      }, this.waitForWordChoiceTime * 1000);

      function onWordChoosen(index) {
        clearTimeout(this.waitForWordChoiceTimer); // Disable system autoWordChoose
        this.waitForWordChoiceTimer = null;
        if (index >= this.currentWordChoices.length) throw new Error('Invalid word choice!');
        this.currentWord = this.currentWordChoices[index];
        this.eventEmitter.emit('wordChoosen', {
          player: this.getCurrentPlayer(),
          word: this.currentWord
        });
        this.resetTimer();
      }
    }

    onTimerEnd() {
      this.eventEmitter.emit('drawTimerEnded');
      if (this.turn + 1 >= this.players.length) {
        this.roundsLeft -= 1;
      }
      if (this.hasEnoughPlayers() && this.hasRoundsLeft()) {
        this.switchTurns();
        this.dispatchNewTurn();
      } else {
        this.end();
      }
    }

    startTimer() {
      this.timer = setTimeout(this.onTimerEnd.bind(this), this.drawTime * 1000);
      this.eventEmitter.emit('drawTimerStarted');
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
          this.roundsLeft = this.rounds;
          setTimeout(() => {
            this.eventEmitter.emit('gameStart', this.getSettings());
            this.dispatchNewTurn();
          }, 0);
          break;
        default:
          throw new Error('game should be in "created" state!');
      }
    }

    end() {
      switch (this.state) {
        case 'running':
          this.clearTimer();
          if (this.waitForWordChoiceTimer) {
            clearTimeout(this.waitForWordChoiceTimer);
          }
          this.state = 'ended';
          this.eventEmitter.emit('gameover', this.getScore());
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
        if (this.waitForWordChoiceTimer) {
          clearTimeout(this.waitForWordChoiceTimer);
        }
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
