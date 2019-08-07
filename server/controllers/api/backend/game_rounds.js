const {
  ZTouPiaoGameRound
} = require('../../../models')
const {
  getPagination
} = require('../../../helpers/pagination')



export default class GameRounds {


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

  /**
   * 根据条件取得游戏信息列表
   * @param {*}
   * @return {*}  { gameRounds, total, page, pageSize }
   */
  static async index(ctx) {
    console.log('=============getGameRoundInfo===========');

    let userId = ctx.state.user.id
    let pagination = getPagination( ctx.query)
    let options =Object.assign( {}, pagination, {  where: { user_id: userId }})

    let {rows, count} = await ZTouPiaoGameRound.findAndCount(options)
    pagination.total = count
    let res = Object.assign(pagination, {  gameRounds: rows } )
    ctx.body = res
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

  static async show(ctx) {
    let gid = ctx.params.id;
    console.log('body---:', ctx.params);

    // let GameRoundModel = getGameRoundModelByCode(code)
    let gameRound = await ZTouPiaoGameRound.findByPk(gid, { include: [{association: 'Slides'}]})

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
