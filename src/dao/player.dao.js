import DAO from "./dao.js"
import ClanDAO from "../dao/clan.dao.js"
import AccountDAO from "../dao/account.dao.js"

var player

/**
 * @description
 * Player collection's Data Access Object class.
 * Player collection API queries access the database through this class
 * @export
 * @class PlayerDAO
 * @extends {DAO}
 */
export default class PlayerDAO extends DAO {
    static async InjectDB(connection) {
        if (player) return

        try {
            player = await super.RetrieveTable(connection, "player")
        }
        catch (ex) { this.#LogError(ex, "InjectDB", true) }
    }

    //#region Getters
    static async Get(amount = 1, query = {}, sort = { "xp": 1 }) {
        try {
            const result = await player
                .find(query)
                .sort(sort)
                .limit(parseInt(amount))
                .toArray()

            return result
        }
        catch (ex) { this.#LogError(ex, "Get") }
    }

    static async GetEmbed(amount = 1, query = {}, sort = { "xp": 1 }) {
        try {
            const result = await player
                .find(query)
                .sort(sort)
                .limit(parseInt(amount))
                .toArray()

            for (let i = 0; i < result.length; ++i) {
                const account = await AccountDAO.GetByID(result[i].account)
                result[i].account = {
                    "_id": account._id,
                    "name": account.name
                }
                result[i].clan = await ClanDAO.GetByID(result[i].clan)
            }
            
            return result
        }
        catch (ex) { this.#LogError(ex, "GetEmbed") }
    }

    static async GetRouter(header, amount = 1, query = {}, sort = { "xp": 1 }) {
        try {
            // If embed was requested, lookup IDs present in result and embed objects
            return (header.response === "embed") ?
                await this.GetEmbed(amount, query, sort)
                : await this.Get(amount, query, sort)
        }
        catch (ex) { this.#LogError(ex, "GetRouter") }
    }

    static GetCount(estimate = false) {
        try {
            return (estimate) ? player.estimatedDocumentCount() : player.countDocuments()
        }
        catch (ex) { this.#LogError(ex, "GetCount") }
    }

    static async GetByID(uuid) {
        try {
            return await player.findOne({
                "_id": uuid
            })
        }
        catch (ex) { this.#LogError(ex, "GetByID") }
    }
    //#endregion

    //#region Utility
    static #LogError(exception, location = undefined, exit = false) {
        super.LogError("PlayerDAO", exception, location, exit)
    }
    //#endregion
}