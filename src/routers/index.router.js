import { Router } from 'express'

import IndexController from '../controllers/index.controller.js'

const router = Router()

router.get("/", IndexController.GetIndex)
router.get("*", IndexController.GetFailure)

export default router