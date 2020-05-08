# APIs

```
POST /api/rooms
    body: {}
    return: 200 room: Room

```

# Events

⬆: Events to emit<br />
⬇: Events to subscribe<br />

⬇ connected => {me: Player, game:Game} <br />
⬇ connect_error => error: Error <br />
⬇ playerJoined => player: Player <br />
⬇ playerLeft => player: Player <br />
⬇ hostChanged => host: Player <br />
⬇ roomDeleted => undefined <br />
⬆ startGame => gameSettings : GameSettings `Host Privileges` => Ack(error){} # will send an ack error if something went wrong on server <br />
⬇ gameStarted => gameSettings : GameSettings <br />
⬇ newTurn => { turn: Number, availableRounds: Number, score: Score, wordChoices: [String] } `Turn Privileges` OR <br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ turn: Number, availableRounds: Number, score: Score } <br />
⬆ chooseWord => word: string <br />
⬇ wordChoosen => word: string # word is hidden for players with no turn priviledges <br />
⬇ drawTimerStarted => undefined <br />
⬇ drawTimerUpdated => timeLeft: number # in seconds <br />
⬇ drawTimerEnded => undefined <br />
⬇ gameover => score : Score <br />
⬆ updateBoard => { action: String, ...params } `Turn Privileges` <br />
⬇ boardUpdated => { action: String, ...params } # draw line or change any of the draw settings <br />
⬆ updateProfile => { nickname: String, avatar: [Number] } # this event is limited to non running game states<br />
⬇ profileUpdated => player: Player # this event is limited to non running game states<br />

# Objects

```
Room {
    id: String,
    link: String,
    hostId: String
}

Player {
    id: String,
    nickname: String,
    isHost: Bool,
    gameData:{
        hintsLeft: number,
        score: number
    }
}

GameSettings {
    rounds: Number,
    drawTime: Number
}

Game {
    ...gameSettings,
    state: String, # created, running, ended
    turn: Number,
    availableRounds: Number,
    players: [Player]
}

Score {
    ...
    [playerId]: Number
    ...
}
```

---

# TODOs:

# Events

⬆: Events to emit <br />
⬇: Events to listen on <br />

⬆ WordHintRequested => index: Number => { letter: char } <br />
⬆ reactSent => { target: Number, reactId: Number } <br />
⬇ reactSent => { source: Number, target: Number, reactId: Number } <br />
⬆ wordGuessed => word: string => { correct: Bool, close: Bool } <br />
⬇ wordGuessed => { name: String, correct: Bool, word?: String } # word should be null in case of correct guess <br />

# Objects

```
Room {
    id: String,
    link: String,
    hostId: String
}

Player {
    id: String,
    nickname: String,
    isHost: Bool,
    gameData:{
        hintsLeft: number,
        score: number
    }
}

GameSettings {
    rounds: Number,
    drawTime: Number
}

Game {
    ...gameSettings,
    state: String, # created, running, ended
    turn: Number,
    availableRounds: Number,
    players: [Player]
}

Score {
    ...
    [playerId]: Number
    ...
}
```
