
```js
Clan {
    _id
    name
    created_date
    xp
    players[]
}

Player {
    _id
    username
    avatar
    xp
    level
    games
    wins
    damage_done
    account
    clan?
}

Account {
    _id
    name
    email
    password
}
```
Clans -One-to-many-> Players    
Players -One-to-one-> Accounts    