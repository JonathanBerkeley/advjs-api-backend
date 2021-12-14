import faker from "faker"

import DAO from "./dao.js"

var account, session

/**
 * @description
 * Account collection's Data Access Object class.
 * Account collection API queries access the database through this class
 * @export
 * @class AccountDAO
 * @extends {DAO}
 */
export default class AccountDAO extends DAO {
    static async InjectDB(connection) {
        if (account) return

        try {
            account = await super.RetrieveTable(connection, "account")
            session = await super.RetrieveTable(connection, "session")
        }
        catch (ex) { this.#LogError(ex, "InjectDB", true) }
    }

    //#region Getters
    static async Get(amount = 1, query = {}, sort = { "xp": 1 }) {
        try {
            const result = await account
                .find(query)
                .sort(sort)
                .limit(parseInt(amount))
                .toArray()

            return result
        }
        catch (ex) { this.#LogError(ex, "Get") }
    }

    static GetCount(estimate = false) {
        try {
            return (estimate) ? account.estimatedDocumentCount() : account.countDocuments()
        }
        catch (ex) { this.#LogError(ex, "GetCount") }
    }

    static async GetByID(uuid) {
        try {
            return await account.findOne({
                "_id": uuid
            })
        }
        catch (ex) { this.#LogError(ex, "GetByID") }
    }

    static async GetByEmail(email) {
        try {
            return await account.findOne({ email: email })
        }
        catch (ex) { this.#LogError(ex, "GetByEmail") }
    }

    static async GetUserSession(email) {
        try {
            return session.findOne({ user_id: email })
        }
        catch (ex) { return this.#LogError(ex, "GetUserSession") }
    }
    //#endregion

    //#region Logins
    static async CreateUser(accountInfo) {
        try {
            await account.insertOne({
                _id: faker.datatype.uuid(),
                name: accountInfo.name,
                email: accountInfo.email,
                password: accountInfo.password
            })
            return { success: true }
        }
        catch (ex) { return this.#LogError(ex, "CreateUser") }
    }

    static async Login(email, jwt) {
        try {
            await session.updateOne(
                { user_id: email },
                { $set: { jwt: jwt } },
                { upsert: true }
            )
            return { success: true }
        }
        catch (ex) { return this.#LogError(ex, "Login") }
    }

    static async Logout(email) {
        try {
            await session.deleteOne({ user_id: email })
            return { success: true }
        }
        catch (ex) { return this.#LogError(ex, "Logout") }
    }
    //#endregion

    //#region Actions
    static async Delete(email) {
        try {
            await account.deleteOne({ email })
            await session.deleteOne({ user_id: email })

            if (!(await this.GetByEmail(email))
                && !(await this.GetUserSession(email)))
                return { success: true }

            else { return this.#LogError("Deletion failure", "Delete") }
        }
        catch (ex) { return this.#LogError(ex, "Delete") }
    }

    static async Update(email, newEmail) {
        try {
            const result = await account.updateOne(
                { email: email },
                { $set: { email: newEmail } }
            )
            return (result.matchedCount === 0)
                ? this.#LogError("Update failure", "Update")
                : result
        }
        catch (ex) { return this.#LogError(ex, "Update") }
    }

    static async CreateAdmin(email) {
        try {
            const response = account.updateOne(
                { email },
                { $set: { isAdmin: true } }
            )
            return response
        }
        catch (ex) { return this.#LogError(ex, "CreateAdmin") }
    }

    static async CheckAdmin(email) {
        try {
            const { isAdmin } = await this.GetByEmail(email)
            return isAdmin
        }
        catch (ex) { 
            this.#LogError(ex, "CheckAdmin")
            return false
        }
    }
    //#endregion

    //#region Utility
    static #LogError(exception, location = undefined, exit = false) {
        super.LogError("AccountDAO", exception, location, exit)
        return { error: exception }
    }
    //#endregion
}