const messageContent = require('../constant')
const {
  getGameRoundModelByCode,
  getGamePlayerModelByCode,
  getGameResultModelByCode,
  getGameAlbumModelByCode,
  getGamePhotoModelByCode
} = require('../../helpers/model')

const { headers_for_direct_upload } = require('../../helpers/aliyun_oss')

// route  /gapi/photos

export default class AlbumsController {


  /**
   *  阿里云直传时，先创建photo对象，再返回云服务请求参数
   * @param {*} album
   * @param {*} pohots
   * @param {*} code, get from request.body
   * @return {*}
   */
  static async createBeforeDirectUpload(ctx) {
      //try {

          let number = ctx.params.number
          let code = ctx.request.body.code
          let albumParam = ctx.request.body.album
          let photoParams = ctx.request.body.photos

          console.log("showRoundByNumber= ", ctx.request.body)
          let Model = getGameRoundModelByCode(code)
          let round = await Model.findOne({
              //attributes: ['id', 'name', 'state', 'start_at', 'end_at'],
              where: {
                  number
              }
          })
          let Album = getGameAlbumModelByCode( code )
          let Photo = getGamePhotoModelByCode( code )
          // game_player_id, game_round_id, name, desc

          // create! filename: filename, byte_size: byte_size, checksum: checksum, content_type: content_type, metadata: metadata
          let albumOptions = {
            fields: ['name', 'desc']
          }
          let photoOptions = {
            fields: ['album_id', 'file_name', 'file_size', 'content_type', 'checksum', 'okey']
          }
          let album = await Album.create(albumParam, albumOptions)

          let promises = photoParams.map((param)=>{
            console.log( " param, photoOptions= ",  param, photoOptions)
            return album.createPhoto( param, photoOptions )
          })
          let photos = await Promise.all(promises )
          let headers = photos.map((photo)=>{
            return headers_for_direct_upload( photo.okey, photo.content_type, photo.checksum )
          })

          ctx.body = { album, photos, headers }
      // } catch (error) {
      //
      //     ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, { expose: true })
      // }
  }
}
