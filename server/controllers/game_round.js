const messageContent = require('../constant')
const { getGameRoundModelByCode } = require('../../helpers/model')


export default class GameRoundController{
    /**
     * show game round
     *  /game/:code/:number/entry
     *  /ztoupiao/:number/entry
     * @param {*} req
     * @param {*} res
     */
    static async entry(ctx) {
        try {
            let code = ctx.params.code
            let number = ctx.params.number
            console.log("showRoundByNumber= ", ctx.params)
            let Model = getGameRoundModelByCode(code)
            let round = await Model.findOne({
                //attributes: ['id', 'name', 'state', 'start_at', 'end_at'],
                where: {
                    number
                }
            })
            ctx.body = round
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, { expose: true })
        }
    }
}
