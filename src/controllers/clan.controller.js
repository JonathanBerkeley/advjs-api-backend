import ClanDAO from "../dao/clan.dao.js"
import Controller from "./controller.js"

/**
 * @description
 * Controller handles API data requests for Clan collection
 * @export
 * @class Clan
 * @extends {Controller}
 */
export default class Clan extends Controller {
    //#region Getters
    static async Get(req, res) {
        super.Query(req, res, async () => {
            let amount = req.params.amount

            if (!amount) amount = 10

            if (super.IsNumeric(amount)) {
                amount = parseInt(amount)
            }
            else {
                res.status(400).json({ "Error": "Must be numeric" })
                return
            }

            if (amount > await ClanDAO.GetCount()) {
                res.status(400).json({ "Error": "Requested too many documents" })
            }

            const clans = await ClanDAO.GetRouter(req.headers, amount)

            res.status(200).json(clans)
        })
    }

    static async GetCount(req, res) {
        super.Query(req, res, async () => {
            const clanCount = await ClanDAO.GetCount()
            res.status(200).json({ clanCount })
        })
    }

    static async GetByID(req, res) {
        super.Query(req, res, async () => {
            let uuid = req.params.uuid

            const result = await ClanDAO.GetByID(uuid)

            res.status(200).json({ result })
        })
    }

    static async GetByXP(req, res) {
        super.Query(req, res, async () => {
            let xp = req.params.xp

            if (super.IsNumeric(xp)) {
                xp = parseInt(xp)
            }
            else {
                res.status(400).json({ "Error": "Must be numeric" })
                return
            }

            const result = await ClanDAO.GetRouter(
                req.headers,
                await ClanDAO.GetCount(true),
                { xp: { $lte: xp } },
                { xp: -1 }
            )

            res.status(200).json({ result })
        })
    }
    //#endregion
}