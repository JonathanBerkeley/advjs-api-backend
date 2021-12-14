import Config from "../main.js"

/**
 * @description
 * Superclass for other DAO objects 
 * @export
 * @class DAO
 */
export default class DAO {
    static async RetrieveTable(connection, tablename) {
        return await connection.db(
            Config.DB_NAME
        ).collection(tablename)
    }

    static LogError(objectName, exception, location = "unset", exit) {
        console.error(`[ Exception ] => ${objectName} threw: [ ${exception} ] in [ ${location} ]`)
        if (exit)
            process.exit()
    }
}