const {
  getGameRoundModelByCode,
  getWxMpUsersModel
} = require('../helpers/model')
const {
  componentAPI,
  setOpenOauth,
  getOpenOauth
} = require('../helpers/wxopen')

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

      let gameRound = await gameRoundModel.findOne({
        where: {
          number
        }
      })

      let WxMpUsersModel = getWxMpUsersModel()

      let WxMpUser = await WxMpUsersModel.findOne({
        where: {
          appid: gameRound.appid
        }
      })

      async function getUserToken(openid){
        const token = await redis.get('userToken');
        return token;
      }
      async function saveUserToken(openid, token){
        await redis.set([openid+'_userToken'], JSON.stringify(userToken));
      }

      console.log('WxMpUser====:',WxMpUser);

      let options = {
        getUserToken:getUserToken,
        saveUserToken:saveUserToken,
        componentApi:componentAPI,
        appId:WxMpUser.appid
      }

      setOpenOauth(options);
      let oauth = getOpenOauth()

      //redirect_url
      let AuthorizeURL = oauth.getAuthorizeURL("http://testwx.natapp4.cc/ztoupiao/5bef76ffca27afcf956433baac0ea1ef/wxopen_oauth/gameshare-done",'','snsapi_userinfo')
      console.log('AuthorizeURL***********:',AuthorizeURL);
      ctx.redirect(AuthorizeURL)
    } catch (error) {
      console.log(error);
    }
  }
}
