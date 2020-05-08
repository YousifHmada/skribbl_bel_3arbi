const EventEmiiter = require('events');

function calcDistance(str1, str2) {
  distance_matrix = [[0]];
  for (let i = 0; i < str2.length; i++) {
    distance_matrix[i + 1] = [i + 1];
  }
  for (let i = 0; i < str1.length; i++) {
    distance_matrix[0][i + 1] = i + 1;
  }
  for (let i = 0; i < str2.length; i++) {
    for (let j = 0; j < str1.length; j++) {
      distance_matrix[i + 1][j + 1] =
        Math.min(distance_matrix[i][j + 1], distance_matrix[i][j], distance_matrix[i + 1][j]) + (str2[i] == str1[j] ? 0 : 1);
    }
  }

  return distance_matrix[str2.length][str1.length];
}

function init(context) {
  return class Game {
    constructor(settings = {}) {
      this.players = [];
      this.turn = 0;
      this.state = 'created'; // States: created, running
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

    setSettings({ rounds = 2, drawTime = 60 } = {}) {
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

    getTimeLeft() {
      if (this.timer) {
        return Math.ceil((this.timer._idleStart + this.timer._idleTimeout) / 1000 - process.uptime());
      }
      return null;
    }

    hasAllPlayersGuessedCorrect() {
      for (let i = 0; i < this.players.length; i++) {
        if (!this.players[i].gameData.correctGuessTimeStamp && !this.players[i].hasTurnPriviledges) {
          return false;
        }
      }
      return true;
    }

    hasEnoughPlayers() {
      return this.players.length > 1;
    }

    getCurrentPlayer() {
      return this.players[this.turn];
    }

    async getWordChoices() {
      return context.plugins.firebase.getWords(3);
    }

    hasRoundsLeft() {
      return this.roundsLeft > 0;
    }

    getScore() {
      return this.players.reduce((prev, cur) => {
        prev[cur.id] = cur.gameData.score;
        return prev;
      }, {});
    }

    updateScore() {
      const maxScore = 500;
      const winners = this.players.filter((player) => player.gameData.correctGuessTimeStamp);
      winners.forEach((player) => {
        debugger;
        console.log('score', Math.floor((player.gameData.correctGuessTimeStamp / this.drawTime) * maxScore));
        player.gameData.score += Math.floor((player.gameData.correctGuessTimeStamp / this.drawTime) * maxScore);
      });
      const currentPlayer = this.getCurrentPlayer();
      currentPlayer.gameData.score += Math.floor((winners.length / (this.players.length - 1)) * maxScore);
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
          this.clearTimer();
          this.dispatchNewTurn();
        }
        if (!this.hasEnoughPlayers()) {
          this.end();
        }
      }
    }

    switchTurns() {
      this.turn = (this.turn + 1) % this.players.length;
    }

    onWordGuessed(player, input, ack) {
      const length = this.currentWord.length;
      const distance = calcDistance(this.currentWord, input);
      if (distance === 0) {
        // Correct guess
        ack(undefined, { correct: true });
        player.broadcast('wordGussed', { title: player.nickname, correct: true });
        const timeLeft = this.getTimeLeft();
        this.updateTimer(0.5 * timeLeft);
        player.gameData.correctGuessTimeStamp = timeLeft;
        if (this.hasAllPlayersGuessedCorrect()) {
          this.endTimer();
        }
      } else if (distance <= Math.ceil(length / 4)) {
        // Close guess
        ack(undefined, { correct: false, close: true });
        player.broadcast('wordGussed', { title: player.nickname, correct: false, close: true });
      } else {
        // Wrong guess
        ack(undefined, { correct: false, close: false });
        player.broadcast('wordGussed', { title: player.nickname, correct: false, close: false, word: input });
      }
    }

    resetGameData() {
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].resetGameData();
      }
    }

    async dispatchNewTurn() {
      // TOdo : clean this crap
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].gameData.correctGuessTimeStamp = null;
      }
      this.currentWordChoices = await this.getWordChoices();
      this.onWordChoosen = onWordChoosen;
      this.eventEmitter.emit('newTurn', {
        player: this.getCurrentPlayer(),
        turn: this.turn,
        score: this.getScore(),
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
      this.updateScore();
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

    updateTimer(timeLeft) {
      this.clearTimer();
      this.timer = setTimeout(this.onTimerEnd.bind(this), timeLeft * 1000);
      this.eventEmitter.emit('drawTimerUpdated', timeLeft);
    }

    endTimer() {
      this.clearTimer();
      this.onTimerEnd();
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
          this.resetGameData();
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
          this.state = 'created';
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
        this.state = 'created';
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
