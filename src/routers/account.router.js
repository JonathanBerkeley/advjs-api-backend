import { Router } from 'express'

import AccountController from '../controllers/account.controller.js'
import IndexController from '../controllers/index.controller.js'

const router = Router()

//#region GET
router.get("/", AccountController.Get)
router.get("/amount/:amount", AccountController.Get)
router.get("/count", AccountController.GetCount)

router.get("/id/:uuid", AccountController.GetByID)
router.get("/token", AccountController.GetByToken)
router.get("/name/:name", AccountController.GetByName)
router.get("/email/:email", AccountController.GetByEmail)

router.get("*", IndexController.GetFailure)
//#endregion

//#region POST
router.post("/register", AccountController.Register)
router.post("/login", AccountController.Login)
router.post("/logout", AccountController.Logout)
router.post("/admin", AccountController.CreateAdmin)
//#endregion

//DELETE
router.delete("/delete", AccountController.Delete)

//PUT
router.put("/update", AccountController.Update)

export default router