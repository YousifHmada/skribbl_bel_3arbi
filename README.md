# skribbl_bel_3arbi
[Open App!](https://skribbl-bel-3arbi.herokuapp.com/ "Skribbl_bel_3arbi")

# APIs
```
POST /rooms
    body: {}
    return: 200 {link: string}
    
GET /rooms/:roomId
```

# Events ⬆: send ⬇: reveive


⬆ connected => {player, room}

⬇ playerJoined => player

⬇ playerLeft => player

⬇ roomDeleted => undefined

``` 
player = {
    id,
    nickName
}
```
```
room = {
    id,
    players: [player]
}
```
