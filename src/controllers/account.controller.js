import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

import AccountDAO from "../dao/account.dao.js"
import Controller from "./controller.js"
import AccountRestrictions from "./controller.js"

const MAX_RETURN = 1000
const NAME_LENGTH = AccountRestrictions.NAME_LENGTH
const EMAIL_LENGTH = AccountRestrictions.EMAIL_LENGTH
const PASSWORD_LENGTH = AccountRestrictions.PASSWORD_LENGTH
const SECRET_PASSWORD = "VbxZ5bj94*ySwS35EU#bYJ@qe"

export class UserAccount {
    constructor({ _id, name, email, password } = {}) {
        this._id = _id
        this.name = name
        this.email = email
        this.password = password
    }

    ToJson() {
        return {
            _id: this._id,
            name: this.name,
            email: this.email
        }
    }

    async ComparePassword(plainTxt) {
        return await bcrypt.compare(plainTxt, this.password)
    }

    Encoded() {
        return jwt.sign({
            exp: ~~(Date.now() / 1_000) + 14_400,
            ...this.ToJson()
        },
            process.env.SECRET_KEY
        )
    }

    static async Decoded(accountJWT) {
        return jwt.verify(accountJWT, process.env.SECRET_KEY, (err, res) => {
            if (err) return err
            return new UserAccount(res)
        })
    }
}

// Helper function to check if request has admin authentication
const IsAuthorized = async (req, id) => {
    const accJWT = (req.get("Authorization")) 
        ? req.get("Authorization").slice("Bearer ".length) : undefined
    if (!accJWT) return { error: "Not authorized" }

    const acc = await UserAccount.Decoded(accJWT)

    var { error } = acc
    if (error) return error

    if (id === acc._id) {
        return null
    }

    if (!(await AccountDAO.CheckAdmin(acc.email))) {
        return { error: "Not authorized" }
    }
}

/**
 * @description
 * Controller handles API data requests for Account collection
 * @export
 * @class Account
 * @extends {Controller}
 */
export default class Account extends Controller {
    //#region Getters
    static async Get(req, res) {
        super.Query(req, res, async () => {
            let error = await IsAuthorized(req)
            if (error) {
                res.status(401).json(error)
                return
            }

            let amount = req.params.amount

            if (!amount) amount = 10

            if (super.IsNumeric(amount)) {
                amount = parseInt(amount)
            }
            else {
                res.status(400).json({ "Error": "Must be numeric" })
                return
            }

            if (amount > await AccountDAO.GetCount()) {
                res.status(400).json({ "Error": "Requested too many documents" })
            }

            const accounts = await AccountDAO.Get(amount)

            res.status(200).json(accounts)
        })
    }

    static async GetCount(req, res) {
        super.Query(req, res, async () => {
            const accountCount = await AccountDAO.GetCount()
            res.status(200).json({ accountCount })
        })
    }

    static async GetByID(req, res) {
        super.Query(req, res, async () => {
            let uuid = req.params.uuid
            let error = await IsAuthorized(req, uuid)
            if (error) {
                res.status(401).json(error)
                return
            }

            const result = await AccountDAO.GetByID(uuid)
            res.status(200).json({ result })
        })
    }

    static async GetByName(req, res) {
        super.Query(req, res, async () => {
            let error = await IsAuthorized(req)
            if (error) {
                res.status(401).json(error)
                return
            }

            let name = req.params.name

            const result = await AccountDAO.Get(
                await AccountDAO.GetCount(true),
                { name: name }
            )
            res.status(200).json({ result })
        })
    }

    static async GetByEmail(req, res) {
        super.Query(req, res, async () => {
            let error = await IsAuthorized(req)
            if (error) {
                res.status(401).json(error)
                return
            }

            let email = req.params.email

            const result = await AccountDAO.Get(
                await AccountDAO.GetCount(true),
                { email: email }
            )
            res.status(200).json({ result })
        })
    }
    //#endregion

    //#region Logins
    /**
     * @description
     * Register a new account to the database, with basic validation.
     * Code based on in-class example.
     * @static
     * @param {*} req
     * @param {*} res
     * @memberof Account
     */
    static async Register(req, res) {
        super.Query(req, res, async () => {
            const body = req.body
            let errors = {}

            //#region Validation
            if (!body) {
                res.status(400).json({ "Error": "Invalid body" })
                return
            }

            if (!(body.name && body.email && body.password)) {
                res.status(400).json({ "Error": "Body missing required content" })
                return
            }

            if (!super.ValidateName(body.name))
                errors.name = `Name too short, must be ${NAME_LENGTH} or more characters.`

            if (!super.ValidateEmail(body.email))
                errors.email = "Email invalid"

            if (!super.ValidatePassword(body.password))
                errors.password = `Password must be ${PASSWORD_LENGTH} or more characters`

            if (!super.ContainsLowerCase(body.password) || !super.ContainsUpperCase(body.password))
                errors.security = "Password needs at least one uppercase and lowercase character"

            if (Object.keys(errors).length > 0) {
                res.status(400).json(errors)
                return
            }
            //#endregion

            const accountInfo = {
                name: body.name,
                email: body.email,
                password: await bcrypt.hash(body.password, 10)
            }

            const createResult = await AccountDAO.CreateUser(accountInfo)
            if (!createResult.success)
                errors.email = createResult.error

            const accFromDB = await AccountDAO.GetByEmail(body.email)
            if (accFromDB && accFromDB.length < 1)
                errors.error = "Internal server error"

            if (Object.keys(errors).length > 0) {
                res.status(500).json(errors)
                return
            }

            const acc = new UserAccount(accFromDB)
            res.json({
                auth_token: acc.Encoded(),
                info: acc.ToJson()
            })
        })
    }

    static async Login(req, res) {
        super.Query(req, res, async () => {
            const { email, password } = req.body

            //#region Validation
            if (!super.ValidateEmail(email)) {
                res.status(400).json({ error: "Invalid email" })
                return
            }

            if (!super.ValidatePassword(password)) {
                res.status(400).json({ error: "Invalid password" })
                return
            }

            const accountData = await AccountDAO.GetByEmail(email)
            if (!accountData) {
                res.status(400).json({ error: "Unrecognized email" })
                return
            }

            const acc = new UserAccount(accountData)
            if (!(await acc.ComparePassword(password))) {
                res.status(400).json({ error: "Password incorrect" })
                return
            }
            //#endregion

            const login = await AccountDAO.Login(acc.email, acc.Encoded())
            if (!login.success) {
                res.status(500).json({ error: login.error })
                return
            }
            res.json({ auth_token: acc.Encoded(), info: acc.ToJson() })
        })
    }

    static async Logout(req, res) {
        super.Query(req, res, async () => {
            const accJWT = super.ParseJWT(req)
            if (!accJWT) res.status(401)

            const accInflate = await UserAccount.Decoded(accJWT)

            var { error } = accInflate
            if (error) {
                res.status(400).json({ error })
                return
            }

            const result = await AccountDAO.Logout(accInflate.email)
            var { error } = result
            if (error) {
                res.status(500).json({ error })
                return
            }
            res.json(result)
        })
    }

    static async Delete(req, res) {
        super.Query(req, res, async () => {
            let { password } = req.body

            if (!super.ValidatePassword(password)) {
                res.status(400).json({ error: "Invalid password" })
                return
            }

            const accJWT = super.ParseJWT(req)
            if (!accJWT) res.status(401)
            const accInflate = await UserAccount.Decoded(accJWT)
            var { error } = accInflate
            if (error) {
                res.status(400).json({ error })
                return
            }

            const acc = new UserAccount(
                await AccountDAO.GetByEmail(accInflate.email)
            )
            if (!(await acc.ComparePassword(password))) {
                res.status(400).json({ error: "Password incorrect" })
            }

            const result = await AccountDAO.Delete(accInflate.email)
            var { error } = result
            if (error) {
                res.status(500).json({ error })
                return
            }
            res.json(result)
        })
    }

    static async Update(req, res) {
        super.Query(req, res, async () => {
            const { email } = req.body

            if (!super.ValidateEmail(email)) {
                res.status(400).json({ error: "Invalid email" })
                return
            }

            const accJWT = super.ParseJWT(req)
            if (!accJWT) res.status(401)
            const accInflate = await UserAccount.Decoded(accJWT)

            var { error } = accInflate
            if (error) {
                res.status(400).json({ error })
                return
            }

            const updateResult = await AccountDAO.Update(
                accInflate.email,
                email
            )
            var { error } = updateResult
            if (error) {
                res.status(400).json({ error })
                return
            }

            const accFromDB = AccountDAO.GetByEmail(accInflate.email)
            const acc = new UserAccount(accFromDB)

            res.json({
                auth_token: acc.Encoded(),
                success: true
            })
        })
    }
    //#endregion

    //#region Actions
    static async CreateAdmin(req, res) {
        try {
            let secret = req.get("Secret")
            if (!secret || secret != SECRET_PASSWORD) {
                res.status(401).json({ "Error" : "Not authorized" })
                return
            }

            const body = req.body
            let errors = {}

            //#region Validation
            if (!body) {
                res.status(400).json({ "Error": "Invalid body" })
                return
            }

            if (!(body.name && body.email && body.password)) {
                res.status(400).json({ "Error": "Body missing required content" })
                return
            }

            if (!super.ValidateName(body.name))
                errors.name = `Name too short, must be ${NAME_LENGTH} or more characters.`

            if (!super.ValidateEmail(body.email))
                errors.email = "Email invalid"

            if (!super.ValidatePassword(body.password))
                errors.password = `Password must be ${PASSWORD_LENGTH} or more characters`

            if (!super.ContainsLowerCase(body.password) || !super.ContainsUpperCase(body.password))
                errors.security = "Password needs at least one uppercase and lowercase character"

            if (Object.keys(errors).length > 0) {
                res.status(400).json(errors)
                return
            }
            //#endregion

            const accountInfo = {
                name: body.name,
                email: body.email,
                password: await bcrypt.hash(body.password, 10)
            }

            const createResult = await AccountDAO.CreateUser(accountInfo)
            if (!createResult.success)
                errors.email = createResult.error

            const accFromDB = await AccountDAO.GetByEmail(body.email)
            if (accFromDB && accFromDB.length < 1)
                errors.error = "Internal server error"

            if (Object.keys(errors).length > 0) {
                res.status(500).json(errors)
                return
            }

            const adminResult = await AccountDAO.CreateAdmin(body.email)
            var { error } = adminResult
            if (error) {
                res.status(500).json({ error })
                return
            }

            const acc = new UserAccount(accFromDB)
            const accJWT = acc.Encoded()
            await AccountDAO.Login(acc.email, accJWT)

            res.json({
                auth_token: accJWT,
                info: acc.ToJson()
            })
        }
        catch (ex) { 
            console.error(`[ Exception ] => Account threw: [ ${ex} ] in [ CreateAdmin ]`)
        }
    }
    //#endregion
}