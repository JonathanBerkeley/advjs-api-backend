import PlayerDAO from "../dao/player.dao.js"
import Controller from "./controller.js"

const MAX_RETURN = 3

/**
 * @description
 * Controller handles API data requests for Player collection
 * @export
 * @class Player
 * @extends {Controller}
 */
export default class Player extends Controller {
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

            if (amount > await PlayerDAO.GetCount()) {
                res.status(400).json({ "Error": "Requested too many documents" })
            }

            const players = await PlayerDAO.GetRouter(req.headers, amount)

            res.status(200).json(players)
        })
    }

    static async GetCount(req, res) {
        super.Query(req, res, async () => {
            const playerCount = await PlayerDAO.GetCount()
            res.status(200).json({ playerCount })
        })
    }

    static async GetByID(req, res) {
        super.Query(req, res, async () => {
            let uuid = req.params.uuid

            const result = await PlayerDAO.GetByID(uuid)
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

            const result = await PlayerDAO.GetRouter(
                req.headers,
                MAX_RETURN,
                { xp: { $lte: xp } },
                { xp: -1 }
            )
            res.status(200).json({ result })
        })
    }

    static async GetByLevel(req, res) {
        super.Query(req, res, async () => {
            let level = req.params.level

            if (super.IsNumeric(level)) {
                level = parseInt(level)
            }
            else {
                res.status(400).json({ "Error": "Must be numeric" })
                return
            }

            const result = await PlayerDAO.GetRouter(
                req.headers,
                MAX_RETURN,
                { level: { $lte: level } },
                { level: -1 }
            )
            res.status(200).json({ result })
        })
    }

    static async GetByGames(req, res) {
        super.Query(req, res, async () => {
            let games = req.params.games

            if (super.IsNumeric(games)) {
                games = parseInt(games)
            }
            else {
                res.status(400).json({ "Error": "Must be numeric" })
                return
            }

            const result = await PlayerDAO.GetRouter(
                req.headers,
                MAX_RETURN,
                { games: { $lte: games } },
                { games: -1 }
            )
            res.status(200).json({ result })
        })
    }

    static async GetByWins(req, res) {
        super.Query(req, res, async () => {
            let wins = req.params.wins

            if (super.IsNumeric(wins)) {
                wins = parseInt(wins)
            }
            else {
                res.status(400).json({ "Error": "Must be numeric" })
                return
            }

            const result = await PlayerDAO.GetRouter(
                req.headers,
                MAX_RETURN,
                { wins: { $lte: wins } },
                { wins: -1 }
            )
            res.status(200).json({ result })
        })
    }

    static async GetByUsername(req, res) {
        super.Query(req, res, async () => {
            let username = req.params.username

            const result = await PlayerDAO.GetRouter(
                req.headers,
                await PlayerDAO.GetCount(true),
                { username: username }
            )
            res.status(200).json({ result })
        })
    }

    static async GetByAccount(req, res) {
        super.Query(req, res, async () => {
            let account = req.params.account

            const result = await PlayerDAO.GetRouter(
                req.headers,
                1,
                { account: account }
            )
            res.status(200).json({ result })
        })
    }

    static async GetByClan(req, res) {
        super.Query(req, res, async () => {
            let clan = req.params.clan

            const result = await PlayerDAO.GetRouter(
                req.headers,
                MAX_RETURN,
                { clan: (clan == "null") ? null : clan }
            )
            res.status(200).json({ result })
        })
    }
    //#endregion
}