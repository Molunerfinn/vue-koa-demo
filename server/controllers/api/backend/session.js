const {
  getUsersModel,
  getGameRoundModelByCode,
  getWxMpUsersModel
} = require('../../../helpers/model')
// const {
//   getWxJsConfig
// } = require('../../helpers/weixin')
//
const secret = require('../../../config/secret')
let bcrypt = require('bcryptjs')
let jwt = require( 'jsonwebtoken')

export default class Sesssion {
  /**
   * 取得游戏相关信息，并返回客户端，初始化游戏
   * @param {*}
   * @return {*}
   */
  static async login(ctx) {
    try {
      console.log('-----------login-----------');
      console.log('ctx.request.body--:', ctx.request.body);
      let params = ctx.request.body
      let cellphone = params.cellphone
      let secret = params.secret

      let users = getUsersModel()

      let userInfo = await users.findOne({
        attributes: ['id', 'cellphone', 'encrypted_password'],
        where: {
          cellphone: cellphone
        }
      })

      console.log('userInfo---:', userInfo);

      if (userInfo != null) {

        let valid = bcrypt.compareSync(secret, userInfo.encrypted_password); // false

        if (valid) {
          const userToken = {
            name: userInfo.user_name,
            id: userInfo.id
          }
          const token = jwt.sign(userToken, secret.jwtSecret) // 签发token
          ctx.body = {
            success: true,
            token: token // 返回token
          }

        } else {
          ctx.body = {
            success: false, // success标志位是方便前端判断返回是正确与否
            info: '用户明和密码不匹配！'
          }
        }
      } else {
        ctx.body = {
           success: false,
           info: '用户不存在！' // 如果用户不存在返回用户不存在
         }
      }

    } catch (e) {
      console.log('error!:', e);
    }
  }

  static async check(ctx) {
    try {
      console.log('-----------check-----------');
      let params = ctx.request.body
      let username = params.username
      let secret = params.secret

      let users = getusers()

      let userInfo = await users.findOne({
        attributes: ['username', 'password'],
        where: {
          username: username
        }
      })

      if (userInfo != null) {
        let password = userInfo.password
        let secretString = 'md5' + username + password + 'md5'
        if (secret == md5(secretString)) {
          ctx.body = {
            res: 'login success!'
          }
        } else {
          ctx.body = {
            res: 'Wrong password !'
          }
          throw ('Wrong password !')
        }
      } else {
        ctx.body = {
          res: 'Wrong username !'
        }
        throw ('Wrong username !')
      }

    } catch (e) {
      console.log('error!:', e);
    }
  }

  static async modifyGameRound(ctx) {
    try {
      console.log('==================modifyGameRound=================');
      let body = ctx.request.body;
      console.log('body---:', body);
      let number = body.number
      let code = body.code
      let duration = body.duration
      let gamename = body.name;
      let gamedesc = body.desc;

      let GameRoundModel = getGameRoundModelByCode(code)
      let gameRound = await GameRoundModel.findOne({
        where: {
          number: number
        }
      })

      gameRound = await gameRound.update({
        name: gamename,
        desc: gamedesc,
        duration: duration
      })
      ctx.body = gameRound
    } catch (e) {
      console.log('error!:', e);
    }
  }

  static async getGameRoundInfo(ctx) {
    console.log('=============getGameRoundInfo===========');
    let params = ctx.request.body
    let userId = params.id
    let gameRoundModel = getGameRoundModelByCode('backend');

    let gameRounds = await gameRoundModel.findAll({
      where: {
        user_id: userId
      }
    })

    ctx.body = gameRounds
  }

  static async addGameRound(ctx) {
    let body = ctx.request.body;
    console.log('body---:', body);
    let gamename = body.name;
    let gamedesc = body.desc;
    let code = body.code;
    let duration = body.duration
    let user_id = body.user_id

    let gameRound = {
      user_id: user_id,
      name: gamename,
      desc: gamedesc,
      code: code,
      duration: duration,
      start_at: '2019-07-22',
      end_at: '2019-09-22'

    }
    let GameRoundModel = getGameRoundModelByCode(code)
    gameRound = await GameRoundModel.create(gameRound)
    console.log('gameRound----:', gameRound);
    ctx.body = gameRound
  }

  static async removeGameRound(ctx) {
    let body = ctx.request.body;
    console.log('body---:', body);
    let number = body.number
    let code = body.code

    let GameRoundModel = getGameRoundModelByCode(code)
    let res = await GameRoundModel.destroy({
      where: {
        number: number
      }
    })
    ctx.body = res
  }

  static async getWxMpUsers(ctx){
    console.log('==================getWxMpUsers================');
    let body = ctx.request.body;
    let user_id = body.user_id

    let UsersModel = getUsersModel()
    let WxMpUsersModel = getWxMpUsersModel()

    let user = await UsersModel.findOne({
      where:{
        id:user_id
      }
    })
    console.log('user=========:',user);

    if(user.appid){
      let WxMpUsers = await WxMpUsersModel.findAll({
        where:{
          appid:user.appid
        }
      })
      console.log('WxMpUsers=============:',WxMpUsers);
      ctx.body = WxMpUsers
    }
  }
}
