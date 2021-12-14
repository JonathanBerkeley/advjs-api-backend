import { Router } from 'express'

import AdminController from '../controllers/admin.controller.js'
import IndexController from '../controllers/index.controller.js'

const router = Router()

router.get("/", AdminController.GetDev)

router.get("*", IndexController.GetFailure)

export default router