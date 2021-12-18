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
// app.use(cors())

app.use('/dev', AdminRouter)
app.use('/clan', ClanRouter)
app.use('/player', PlayerRouter)
app.use('/account', AccountRouter)
app.use('*', IndexRouter)

export default app