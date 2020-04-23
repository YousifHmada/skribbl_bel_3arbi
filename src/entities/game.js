/* eslint-disable no-console */
function generateRandomId(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

class Game {
  constructor(...args) {
    this.players = [];
    this.turn = 0;
    this.state = 'created'; // States: created, running, finished
    this.setSettings(...args);
    this.timer = null;
  }

  setSettings({
    rounds = 3,
    drawTime = 2,
  } = {}) {
    if (this.state !== 'created') throw new Error('game should be in "created" state!');
    this.rounds = rounds;
    this.drawTime = drawTime;
  }

  addPlayer(playerData) {
    const player = { ...playerData };
    const id = this.generatePlayerId();
    player.id = id;
    this.players.push(player);
    return id;
  }

  removePlayer(playerId) {
    const index = this.players.findIndex((player) => player.id === playerId);
    if (index < 0) throw new Error();
    this.players.splice(index, 1);
    if (this.state === 'running' && !this.hasEnoughPlayers()) {
      this.finishGame();
    }
  }

  hasPlayer(playerId) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === playerId) return true;
    }
    return false;
  }

  hasEnoughPlayers() {
    return this.players.length > 1;
  }

  generatePlayerId() {
    let id;
    do {
      id = generateRandomId(5);
    } while (this.hasPlayer(id));
    return id;
  }

  switchTurns() {
    this.turn = (this.turn + 1) % this.players.length;
  }

  onTimerEnd() {
    if (this.hasEnoughPlayers()) {
      this.switchTurns();
      this.resetTimer();
    } else {
      this.finishGame();
    }
  }

  startTimer() {
    this.timer = setTimeout(
      this.onTimerEnd.bind(this),
      this.drawTime * 1000,
    );
  }

  resetTimer() {
    this.clearTimer();
    this.startTimer();
  }

  clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  startGame() {
    switch (this.state) {
      case 'created':
        if (!this.hasEnoughPlayers()) throw new Error('not enough players to start game!');
        this.state = 'running';
        this.startTimer();
        console.log('Game started!');
        break;
      default:
        throw new Error('game should be in "created" state!');
    }
  }

  finishGame() {
    switch (this.state) {
      case 'running':
        this.clearTimer();
        this.state = 'finished';
        console.log('Game finished!');
        break;
      default:
        throw new Error('game should be in "running" state!');
    }
  }
}

module.exports = Game;
