const {
  getUsersModel,
  getGameRoundModelByCode
} = require('../../../helpers/model')
// const {
//   getWxJsConfig
// } = require('../../helpers/weixin')
//
// const logger = require('../../helpers/logger')
const md5 = require('md5');


export default class base {
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
        attributes: ['id', 'cellphone', 'password'],
        where: {
          cellphone: cellphone
        }
      })

      console.log('userInfo---:', userInfo);

      if (userInfo != null) {
        let password = userInfo.password
        let secretString = 'md5' + username + password + 'md5'
        if (secret == md5(secretString)) {
          ctx.body = {
            userId: userInfo.id,
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

  static async modify(ctx) {
    try {
      console.log('-----------modify-----------');
      let params = ctx.request.body
      let username = params.username
      let newpassword = params.newpassword

      let users = getusers()

      let userInfo = await users.findOne({
        where: {
          username: username
        }
      })

      if (userInfo != undefined) {
        await userInfo.update({
          password: newpassword
        })
        ctx.body = {
          res: 'modify success!'
        }
      }
    } catch (e) {
      console.log('error!:', e);
    }
  }

  static async getGameRoundInfo(ctx) {
    let params = ctx.request.body
    let userId = params.id
    let gameRoundModel = getGameRoundModelByCode('backend');

    let gameRounds = await gameRoundModel.finAll({
      where: {
        user_id: userId
      }
    })

    ctx.body = gameRounds
  }
}
