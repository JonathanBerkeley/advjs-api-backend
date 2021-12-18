import express from 'express'
import cors from 'cors'

import AdminRouter from './routers/admin.router.js'
import ClanRouter from './routers/clan.router.js'
import PlayerRouter from './routers/player.router.js'
import AccountRouter from './routers/account.router.js'
import IndexRouter from './routers/index.router.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


//#region CORs
// Adapted from https://stackoverflow.com/a/53437992
const origins = ["http://localhost:3001", "https://mainuser.dev", "http://api.mainuser.dev"]

app.use(cors({
    origin: function(origin, callback) {
        if (!origin) return callback(null, true)

        if(origins.indexOf(origin) === -1)
            return callback(new Error("CORS unrecognized origin"), false)

        return callback(null, true)
    }
}))
//#endregion

app.use('/dev', AdminRouter)
app.use('/player', PlayerRouter)
app.use('/account', AccountRouter)
app.use('*', IndexRouter)

export default app