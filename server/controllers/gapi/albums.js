const {
  getGameRoundModelByCode,
  getGamePlayerModelByCode,
  getGameResultModelByCode,
  getGameAlbumModelByCode
} = require('../../helpers/model')


// route  /gapi/photos
export default class AlbumsController {

  // 阿里云直传时，先创建photo对象，
  // 再返回云服务请求参数
  static async createBeforeDirectUpload(ctx) {
      try {
          let code = ctx.params.code
          let number = ctx.params.number
          let albumParams = ctx.request.body.album

          console.log("showRoundByNumber= ", ctx.params)
          let Model = getGameRoundModelByCode(code)
          let round = await Model.findOne({
              //attributes: ['id', 'name', 'state', 'start_at', 'end_at'],
              where: {
                  number
              }
          })
          let Album = getGameAlbumModelByCode( code )
          // create! filename: filename, byte_size: byte_size, checksum: checksum, content_type: content_type, metadata: metadata
          var options = {
            fields: ['file_name', 'file_size', 'content_type', 'checksum']
          }
          let album = await Album.create(photoParams, options)

          ctx.body = album
      } catch (error) {
          ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, { expose: true })
      }
  }
}
