import DAO from "./dao.js"
import PlayerDAO from "./player.dao.js"

var clan

/**
 * @description
 * Clan collection's Data Access Object class.
 * Clan collection API queries access the database through this class
 * @export
 * @class ClanDAO
 * @extends {DAO}
 */
export default class ClanDAO extends DAO {
    static async InjectDB(connection) {
        if (clan) return

        try {
            clan = await super.RetrieveTable(connection, "clan")
        }
        catch (ex) { this.#LogError(ex, "InjectDB", true) }
    }

    //#region Getters
    static async Get(amount = 1, query = {}, sort = { "xp": 1 }) {
        try {
            const result = await clan
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
            const result = await clan
                .find(query)
                .sort(sort)
                .limit(parseInt(amount))
                .toArray()

                for (let i = 0; i < result.length; ++i)
                    for (let j = 0; j < result[i].players.length; ++j)
                        result[i].players[j] = await PlayerDAO.GetByID(result[i].players[j])

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
            return (estimate) ? clan.estimatedDocumentCount() : clan.countDocuments()
        }
        catch (ex) { this.#LogError(ex, "GetCount") }
    }

    static async GetByID(uuid) {
        try {
            return await clan.findOne({
                "_id": uuid
            })
        }
        catch (ex) { this.#LogError(ex, "GetByID") }
    }
    //#endregion

    //#region Utility
    static #LogError(exception, location = undefined, exit = false) {
        super.LogError("ClanDAO", exception, location, exit)
    }
    //#endregion
}