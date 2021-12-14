import { Router } from 'express'

import ClanController from '../controllers/clan.controller.js'
import IndexController from '../controllers/index.controller.js'

const router = Router()

router.get("/", ClanController.Get)
router.get("/amount/:amount", ClanController.Get)
router.get("/count", ClanController.GetCount)

router.get("/id/:uuid", ClanController.GetByID)
router.get("/xp/:xp", ClanController.GetByXP)

router.get("*", IndexController.GetFailure)

export default router