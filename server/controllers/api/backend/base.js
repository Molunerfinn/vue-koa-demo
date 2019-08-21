const {
  getUsersModel,
  getGameRoundModelByCode,
  getWxMpUsersModel,
  getPostModel,
  getTermModel,
  getRelationshipModel,
  getGameAlbumModelByCode,
  getGameResultModelByCode,
  getGamePlayerModelByCode
} = require('../../../helpers/model')
const {
  ZTouPiaoGameRound, SharedPhotoRelationship
} = require('../../../models')
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
        let secretString = 'md5' + cellphone + password + 'md5'
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

  static async modifyDesc(ctx) {
    try {
      console.log('==================modifyDesc=================');
      let body = ctx.request.body;
      let number = body.number
      let code = body.code
      let gamedesc = body.desc;

      let GameRoundModel = getGameRoundModelByCode(code)
      let gameRound = await GameRoundModel.findOne({
        where: {
          number: number
        }
      })

      gameRound = await gameRound.update({
        desc: gamedesc
      })
      ctx.body = gameRound
    } catch (e) {
      console.log('error!:', e);
    }
  }

  static async getGameRoundInfo(ctx) {
    console.log('=============getGameRoundInfo===========');
    let params = ctx.query
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
    let round_id = body.round_id

    let GameRoundModel = ZTouPiaoGameRound
    let res = await GameRoundModel.destroy({
      where: {
        id: round_id
      }
    })
    ctx.body = res
  }

  static async getWxMpUsers(ctx){
    console.log('==================getWxMpUsers================');
    let body = ctx.query;
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
  static async clearData(ctx){
    console.log('=============clearData==============');
    let code = ctx.request.body.code
    let gameRoundId = ctx.request.body.gameRoundId
    let AlbumModel = getGameAlbumModelByCode(code)
    let PlayerModel = getGamePlayerModelByCode(code)
    let ResultModel = getGameResultModelByCode(code)

    await AlbumModel.destroy({
      where:{
        game_round_id:gameRoundId
      }
    })

    await PlayerModel.destroy({
      where:{
        game_round_id:gameRoundId
      }
    })

    await ResultModel.destroy({
      where:{
        game_round_id:gameRoundId
      }
    })

    await SharedPhotoRelationship.destroy({
      where:{
        viewable_id:gameRoundId,
        viewable_type:'slide'
      }
    })
    ctx.body = {
      res:'clear over!'
    }
  }

}
