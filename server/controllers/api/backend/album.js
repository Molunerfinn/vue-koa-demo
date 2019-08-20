const {
  getGameAlbumModelByCode,
  getGamePlayerModelByCode
} = require('../../../helpers/model')
const {
  getPagination
} = require('../../../helpers/pagination')
export default class album {
  static async getAlbums(ctx) {
    console.log('===============getAlbum===============');
    console.log('ctx.request.body---:', ctx.request.body);
    let pagination = getPagination(ctx.request.body.listQuery)
    let q = ctx.request.body.listQuery.q
    let o = ctx.request.body.o

    let code = ctx.request.body.code
    let options = Object.assign({
      where: q,
      order: o
    }, pagination, {
      include: [{
        association: 'Photos'
      }]
    })
    console.log('options---:', options);
    let GameAlbumModel = getGameAlbumModelByCode(code)

    let { rows, count} = await GameAlbumModel.findAndCountAll(options)
    let res = Object.assign(pagination, {albums: rows})
    console.log('res*****:', res);
    ctx.body = res
  }
  static async createAlbum(ctx) {
    console.log('===============createAlbum===============');
    console.log('ctx.request.body', ctx.request.body);
    let code = ctx.request.body.code
    let GamePlayerModel = getGamePlayerModelByCode(code)
    let playerParam = ctx.request.body.player
    let playerOptions = {
      fields: ['openid', 'nickname', 'avatar', 'game_round_id']
    }
    let player = await GamePlayerModel.create(playerParam, playerOptions)

    let GameAlbumModel = getGameAlbumModelByCode(code)
    let albumOptions = {
      fields: ['name', 'desc', 'game_player_id','game_round_id', 'type']
    }

    let albumParam = ctx.request.body.album
    albumParam.game_player_id = player.id
    let album = await GameAlbumModel.create(albumParam, albumOptions)
    ctx.body = album
  }

  static async removeAlbum(ctx){
    console.log('===============removeAlbum===============');
    console.log('ctx.request.body', ctx.request.body);
    let album = ctx.request.body.album
    let code = ctx.request.body.code

    let GameAlbumModel = getGameAlbumModelByCode(code)

    let res = await GameAlbumModel.destroy({
      where: {
        id:album.id
      }
    })
    ctx.body = res
  }
}
