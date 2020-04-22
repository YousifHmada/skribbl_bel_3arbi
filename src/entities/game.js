
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
    this.state = 'paused'; // states: Created, Running, Paused, Finished
    this.setSettings(...args);
  }

  setSettings({
    rounds = 3,
    drawTime = 60,
  }) {
    if (this.state !== 'created') throw new Error();
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
    this.players = this.players.splice(index);
  }

  hasPlayer(playerId) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].id === playerId) return true;
    }
    return false;
  }

  generatePlayerId() {
    let id;
    do {
      id = generateRandomId(5);
    } while (this.hasPlayer(id));
    return id;
  }
}
module.exports = Game;
