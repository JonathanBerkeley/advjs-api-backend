import { MongoClient } from "mongodb"
import { dirname } from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

import app from "./server.js"
// Data access objects
import ClanDAO from "./dao/clan.dao.js"
import PlayerDAO from "./dao/player.dao.js"
import AccountDAO from "./dao/account.dao.js"

if (dotenv.config().error) {
    console.error("[ Error ] => ENV file invalid, missing or cannot be read")
}

class Config {
    static MOTD = "All problems in computer science can be solved by another level of indirection"

    static DB_URI = process.env.DB_URI
    static DB_NAME = process.env.DB_NAME
    static PORT = process.env.PORT
    static CLIENT = new MongoClient(this.DB_URI)

    static VERSION = process.env.npm_package_version
    static DEV_MODE = true
    static ROOT_DIR = dirname(fileURLToPath(import.meta.url))
}

// Main function
async function main() {
    await Config.CLIENT.connect()

    await ClanDAO.InjectDB(Config.CLIENT)
    await PlayerDAO.InjectDB(Config.CLIENT)
    await AccountDAO.InjectDB(Config.CLIENT)

    app.listen(Config.PORT, () => {
        console.assert(Config.DEV_MODE, "[ Warning ] => in production mode")

        // Formatting for console
        let urlString = `[-- http://localhost:${Config.PORT}/ --]`
        let headerLength = urlString.length - 2

        console.log(`[${'-'.repeat(headerLength)}]`)
        console.log(`[--  Server version ${Config.VERSION}  --]\n${urlString}`)
        console.log(`[${'-'.repeat(headerLength)}]`)
    })
}

// Call main
main()
    .catch((ex) => {
        console.error("Caught error: " + ex)
        process.exit(1)
    })

export default Config