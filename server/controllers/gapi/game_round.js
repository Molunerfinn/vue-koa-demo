const {
  getGameRoundModelByCode
} = require('../../helpers/model')
const {
  setOpenOauth,
  getOpenOauth
} = require('../../helpers/wxopen');

export default class GameRoundController {
  /**
   * show game round
   * @param {*} req
   * @param {*} res
   */
  static async entry(ctx) {
    try {
      let code = ctx.params.code
      let number = ctx.params.number

      let gameRoundModel = getGameRoundModelByCode('backend');

      let gameRound = gameRoundModel.findOne({
        where: {
          number
        }
      })

      let WxMpUsersModel = getWxMpUsersModel()

      let WxMpUser = WxMpUsersModel.findOne({
        where: {
          appid: gameRound.appid
        }
      })

      setOpenOauth(WxMpUser);
      let oauth = getOpenOauth()

      //redirect_url
      let AuthorizeURL = oauth.getAuthorizeURL("http://testwx.natapp4.cc/ztoupiao/5bef76ffca27afcf956433baac0ea1ef/wxopen_oauth/gameshare-done",'','snsapi_userinfo')

      ctx.redirect(AuthorizeURL)
    } catch (error) {
      ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, {
        expose: true
      })
    }
  }
}
