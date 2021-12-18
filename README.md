# Rest API
Version 0.5.3    
MongoDB API for a videogame database    

# Project styleguide

### General
- No semicolon termination
- Class containment for related variables
- ES imports
- Newline between functions / classes / logical blocks
- Foreign imports seperated from local imports
- 4 spaces indentation
- ```// Space at beginning of line comment```

### Naming    
```js
const CONSTANT_GLOBAL    
static CONSTANT_STATIC    

var localVariable    
const localConst    
let blockVariable    
let #_privateVariable    

let longLiteralNumber = 1_000_000    
```

### Functions
```js
PascalCase(args) {
    // Code
}
```

### Classes
- Prefer static over singleton    
- Object oriented style    
```js
class PascalCase {
    // Code
}
```

# Get requests
```
/
  Goes to index, includes any combination after /
  e.g /abcdefg

/clan
  /                 -> returns clans, default 10 
  /amount/:amount   -> returns amount of clans
  /count            -> returns amount of clans in database
  /id/:uuid         -> returns clan with given uuid
  /xp/:xp           -> returns list of clans with XP under given amount
                    -> sorted from highest to lowest, limited to 1000 results by default

/player
  /                   -> returns players, default 10
  /amount/:amount     -> returns amount of players
  /count              -> returns amount of players in database
  /id/:uuid           -> returns player with given uuid
  /username/:username -> returns player with given username
  /account/:account   -> returns player with given account uuid
  /clan/:clan         -> returns list of players in given clan (uuid)
  /xp/:xp             -> returns list of players with XP under given amount
                      -> sorted from highest to lowest, limited to 1000 results by default
  /level/:level       -> returns list of players with level under given amount
                      -> sorted from highest to lowest, limited to 1000 results by default
  /games/:game        -> returns list of players with games under given amount
                      -> sorted from highest to lowest, limited to 1000 results by default
  /wins/:wins         -> returns list of players with level under given amount
                      -> sorted from highest to lowest, limited to 1000 results by default

/account
  /count              -> returns amount of accounts in database

/index
  /                   -> returns index.html homepage file
  /:x/:y              -> unknown paths return 404.html file

```

### Get requests with admin authorization
```
/dev
  /                   -> displays API internal data

/account
  /                   -> returns accounts, default 10
  /amount/:amount     -> returns amount of accounts
  /id/:uuid           -> returns account with given uuid
  /name/:name         -> returns account with given name
  /email/:email       -> returns account with given account email
```

# Post requests
```
/account
  /register           -> registers an account
                      -> requires ["name", "email", "password"] in JSON body
  /login              -> logs in, returns auth_token 
                      -> requires ["email", "password"] in JSON body
  /logout             -> logs out, returns success (true/false)
                      -> requires JWT in "Authorization" header as a Bearer token
  /admin              -> registers an admin account
                      -> requires ["name", "email", "password"] in JSON body
```

# Delete requests
```
/account
  /delete             -> deletes an account
                      -> requires ["password"] in JSON body
                      -> and JWT in "Authorization" header as a Bearer token
```

# Put requests
```
/account
  /update             -> updates account email
                      -> requires ["email"] in JSON body
                      -> and JWT in "Authorization" header as a Bearer token
```