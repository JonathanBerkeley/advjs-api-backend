import AccountDAO from "../dao/account.dao.js"
import Config from "../main.js"
import { UserAccount } from "./account.controller.js"
import Controller from "./controller.js"

export default class AdminController extends Controller {
    static async GetDev(req, res) {
        super.Query(req, res, async () => {
            const accJWT = super.ParseJWT(req)
            if (!accJWT) res.status(401)
            const acc = await UserAccount.Decoded(accJWT)

            var { error } = acc
            if (error) res.status(401).json({ error })

            if (!(await AccountDAO.CheckAdmin(acc.email))) {
                res.status(401).json({
                    error: "Not authorized"
                })
                return
            }

            res.status(200).json({
                "MOTD": Config.MOTD,
                "dev-mode": Config.DEV_MODE,
                "server-version": Config.VERSION,
                "db-uri": Config.DB_URI,
                "port": Config.PORT
            })
        })
    }
}