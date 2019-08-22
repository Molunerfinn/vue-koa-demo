const {
  ZTouPiaoGameRound, SharedPhotoRelationship
} = require('../../../models')
const {
  getPagination
} = require('../../../helpers/pagination')
const {
  getPhotoRelationshipModel,
  getPhotoModel,
  getVoteStyleModelByCode
} = require('../../../helpers/model')

const GameRoundModel = ZTouPiaoGameRound

export default class GameRounds {


  static async update(ctx) {
    try {
      console.log('++++++++++++++++++++++modifyGameRound=================');
      let body = ctx.request.body;
      console.log('body---:', body);
      let id = ctx.params.id
      let gameRoundAttributes = body.gameRound

      let gameRound = await GameRoundModel.findOne({
        where: {
          id
        }
      })

      gameRound = await gameRound.update(gameRoundAttributes,{
        fields:['name', 'desc', 'color','state','start_at','end_at']
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
    let round_id = body.round_id

    let GameRoundModel = ZTouPiaoGameRound
    let res = await GameRoundModel.destroy({
      where: {
        id: round_id
      }
    })
    ctx.body = res
  }

  static async removeSlide(ctx){
    let body = ctx.request.body;
    console.log('body---:', body);
    let photo_id = body.photo_id
    let round_id = body.round_id

    let PhotoRelationshipModel=getPhotoRelationshipModel()

    let res = await PhotoRelationshipModel.destroy({
      where: {
        photo_id:photo_id,
        viewable_id: round_id,
        viewable_type: 'slide'
      }
    })
    ctx.body = res
  }

  static async bindPhotoRelationship(ctx){
    console.log('==========bindPhotoRelationship=========');
    console.log(require('../../../models'));
    console.log('ctx.request.body',ctx.request.body);
    let body = ctx.request.body;
    let newImg = body.newImg;
    let round_id = body.round_id;

    let gameRound = await ZTouPiaoGameRound.findByPk(round_id)
    console.log('gameRound:',gameRound);
    let SharedPhoto = getPhotoModel()
    let Photo = await SharedPhoto.findOne({
      where:{
        id:newImg.id
      }
    })
    console.log('Photo:',Photo);
    let res = await gameRound.addSlides(Photo)
    console.log('res',res);
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

  static async getVoteStyle(ctx){
    let game_round_id = ctx.params.id;
    let voteStyleModel = getVoteStyleModelByCode('ztoupiao')
    let voteStyle = await voteStyleModel.findOne({
      where:{
        game_round_id:game_round_id
      }
    })

    if(voteStyle){
      ctx.body = voteStyle
    }else{
      ctx.body = {
        style:'sum',
        sum: 1,
        day: 1,
        times: 1
      }
    }
  }

  static async setVoteStyle(ctx){
    console.log('==========setVoteStyle=========');
    let param = ctx.request.body
    let code = param.code
    let game_round_id = param.game_round_id
    let voteStyleData = param.voteStyleData
    console.log('voteStyleData---:',voteStyleData);

    let voteStyleModel = getVoteStyleModelByCode(code)

    let voteStyle = await voteStyleModel.findOne({
      where:{
        game_round_id:game_round_id
      }
    })

    if(voteStyle){
      voteStyle = await voteStyle.update(voteStyleData,{
        fields:['game_round_id', 'style', 'sum','day','times','start_at','end_at']
      })
    }else{
      voteStyle = await voteStyleModel.create(voteStyleData,
        {
          fields:['game_round_id', 'style', 'sum','day','times','start_at','end_at']
        })
    }

    ctx.body = voteStyle
  }
}
