import { Router } from 'express'

import PlayerController from '../controllers/player.controller.js'
import IndexController from '../controllers/index.controller.js'

const router = Router()

router.get("/", PlayerController.Get)
router.get("/amount/:amount", PlayerController.Get)
router.get("/count", PlayerController.GetCount)

router.get("/id/:uuid", PlayerController.GetByID)
router.get("/username/:username", PlayerController.GetByUsername)
router.get("/account/:account", PlayerController.GetByAccount)
router.get("/clan/:clan", PlayerController.GetByClan)

router.get("/xp/:xp", PlayerController.GetByXP)
router.get("/level/:level", PlayerController.GetByLevel)
router.get("/games/:games", PlayerController.GetByGames)
router.get("/wins/:wins", PlayerController.GetByWins)

router.get("*", IndexController.GetFailure)

export default router

