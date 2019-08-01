const {
  getUsersModel,

} = require('../../../helpers/model')
// const {
//   getWxJsConfig
// } = require('../../helpers/weixin')
//

export default class Users {
  /**
   * 取得游戏相关信息，并返回客户端，初始化游戏
   * @param {*}
   * @return {*}
   */
  static async show(ctx) {
    console.log( " ctx.state.user ", ctx.state.user )
    let user =  {
      roles: ['admin'],
      introduction: 'I am a super administrator',
      avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
      name: 'Super Admin'
    }
    
    ctx.body=user
  }


}
