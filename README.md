# APIs
```
POST /rooms
    body: {}
    return: 200 {link: String}
    
GET /rooms/:roomId
    return room.html
```

# Events
⬆: event listener
⬇: event emmiter

⬇connected => {player: Player, room: Room}
⬇ playerJoined => player: Player
⬇ playerLeft => player: Player
⬇ roomDeleted => undefined

``` 
Player = {
    id: String,
    nickname: String,
}
 
Room = {
    id: String,
    players: [Player]
}
```
--- 
# TODOs:
# APIs
```
POST /api/rooms
    body: {}
    return: 200 {link: String}
    
❌ GET /rooms/:roomId
```

# Events
⬆: event listener
⬇: event emmiter

⬇ connected => {me: Player, game:Game}
⬇ playerJoined => player: Player
⬇ playerLeft => player: Player
⬇ roomDeleted => undefined
⬆ startGame => gameSettings : GameSettings `` Host Privileges ``
⬇ newTurn => {turn: Number, availableRounds: Number, wordChoices: [String]} `` Turn Privileges `` OR  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{turn: Number, availableRounds: Number} 
⬆ wordChoosen => word: string
⬇ wordChoosen => word: string `` NOT `` ``Turn Priviledges `` # word is hidden
⬆ WordHintRequested => index: Number => {letter: char}
⬇ drawTimerStarted => undefined 
⬇ drawTimerUpdated => timeLeft: number # in seconds
⬇ drawTimerEnded => {score: Score}
⬆ reactSent => {target: Number, reactId: Number}
⬇ reactSent => {source: Number, target: Number, reactId: Number}
⬆ wordGuessed => word: string => {correct: Bool, close: Bool}
⬇ wordGuessed => {name: String, correct: Bool, word?: String } # word should be null in case of correct guess 
⬆ boardUpdated => {action: String, ...params } `` Turn Privileges ``
⬇ boardUpdated => {action: String, ...params} # draw line or change any of the draw settings 

# Objects
``` 
player = {
    id: String,
    nickname: String,
    isHost: Bool,
    gameData:{
        hintsLeft: number,
        score: number
    }
}
 
GameSettings = {
    rounds: Number,
    drawTime: Number
}

Game = {
    ...gameSettings,
    state: String, # created, running, ended
    turn: Number,
    availableRounds: Number,
    players: [Player]
}

Score = {
    ...
    [playerId]: Number
    ...
}
```















