import Config from "../main.js"
import Controller from "./controller.js"

/**
 * @description
 * Handles non-API specific requests
 * @export
 * @class IndexController
 * @extends {Controller}
 */
export default class IndexController extends Controller {
    /**
     * @description
     * Sends homepage
     * @static
     * @memberof IndexController
     */
    static async GetIndex(req, res) {
        super.Query(req, res, async () => {
            res.sendFile("./web_html/index.html", { root: Config.ROOT_DIR })
        })
    }

    /**
     * @description
     * Sends 404 page to unknown requests
     * @static
     * @memberof IndexController
     */
    static async GetFailure(req, res) {
        super.Query(req, res, async () => {
            res.sendFile("./web_html/404.html", { root: Config.ROOT_DIR })
        })
    }
}