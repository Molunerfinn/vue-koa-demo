let bcrypt = require('bcryptjs')
let jwt = require( 'jsonwebtoken')

const {
  getUsersModel
} = require('../../helpers/model')
const secret = require('../../config/secret')


export default class Sessions {
  /**
   * 取得游戏相关信息，并返回客户端，初始化游戏
   * @param {*}
   * @return {*}
   */
  static async create(ctx) {
    try {
      console.log('-----------login-----------');
      console.log('ctx.request.body--:', ctx.request.body);
      let params = ctx.request.body
      let cellphone = params.cellphone
      let password = params.password

      let users = getUsersModel()

      let userInfo = await users.findOne({
        attributes: ['id', 'cellphone', 'encrypted_password'],
        where: {
          cellphone: cellphone
        }
      })

      if (userInfo != null) {

        let valid = bcrypt.compareSync(password, userInfo.encrypted_password); // false

        if (valid) {
          const userToken = {
            cellphone: userInfo.cellphone,
            id: userInfo.id
          }
          const token = jwt.sign(userToken, secret.jwtSecret, { expiresIn: '1h' } ) // 签发token
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

}
