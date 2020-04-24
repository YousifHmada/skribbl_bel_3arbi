# APIs

```
POST /api/rooms
    body: {}
    return: 200 room: Room

```

# Events

⬆: event listener
⬇: event emmiter

⬇ connected => {me: Player, game:Game}
⬇ connect_error => error: Error
⬇ playerJoined => player: Player
⬇ playerLeft => player: Player
⬇ hostChanged => host: Player
⬇ roomDeleted => undefined
⬆ startGame => gameSettings : GameSettings `Host Privileges`

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
```

---

# TODOs:

# Events

⬆: event listener
⬇: event emmiter

⬇ newTurn => { turn: Number, availableRounds: Number, wordChoices: [String] } `Turn Privileges` OR
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ turn: Number, availableRounds: Number }
⬆ wordChoosen => word: string
⬇ wordChoosen => word: string `NOT` `Turn Priviledges` # word is hidden
⬆ WordHintRequested => index: Number => { letter: char }
⬇ drawTimerStarted => undefined
⬇ drawTimerUpdated => timeLeft: number # in seconds
⬇ drawTimerEnded => { score: Score }
⬆ reactSent => { target: Number, reactId: Number }
⬇ reactSent => { source: Number, target: Number, reactId: Number }
⬆ wordGuessed => word: string => { correct: Bool, close: Bool }
⬇ wordGuessed => { name: String, correct: Bool, word?: String } # word should be null in case of correct guess
⬆ boardUpdated => { action: String, ...params } `Turn Privileges`
⬇ boardUpdated => { action: String, ...params } # draw line or change any of the draw settings

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
