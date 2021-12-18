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
app.use(cors())

app.use('/dev', cors(), AdminRouter)
app.use('/clan', cors(), ClanRouter)
app.use('/player', cors(), PlayerRouter)
app.use('/account', cors(), AccountRouter)
app.use('*', cors(), IndexRouter)

export default app