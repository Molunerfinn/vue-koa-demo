const messageContent = require('./constant')
const {
  getGameRoundModelByCode,
  getGamePlayerModelByCode,
  getGameResultModelByCode,
  getGameAlbumModelByCode,
  getGamePhotoModelByCode,
  getPostModel
} = require('../helpers/model')

const {
  headersForDirectUpload,
  urlForDirectUpload
} = require('../helpers/aliyun_oss')

// route  /gapi/photos

export default class PhotosController {

  /**
   *  阿里云直传时，先创建photo对象，再返回云服务请求参数
   * @param {Object} pohot ['viewable_type', 'file_name', 'file_size', 'content_type', 'checksum']
   * @param {*} code, get from request.body
   * @return {*}
   */
  static async createBeforeDirectUpload(ctx) {
    //try {
    console.log('==================createBeforeDirectUpload===============');
    console.log('ctx.request.body--:', ctx.request.body);
    let code = ctx.params.code
    let number = ctx.request.body.number
    let photoParam = ctx.request.body.photo
    let type = ctx.request.body.type
    let id = ctx.request.body.id


    let Photo = getGamePhotoModelByCode(code)

    let photoOptions = {
      fields: ['album_id', 'file_name', 'file_size', 'content_type', 'checksum', 'okey', 'viewable_id', 'viewable_type']
    }

    // let photoRelationshipOptions = {
    //   fields: ['photo_id', 'viewable_id', 'viewable_type']
    // }

    let photo = await Photo.create(photoParam, photoOptions)

    if (number) {
      let Round = getGameRoundModelByCode(code)
      //try{
      let round = await Round.findOne({
        //attributes: ['id', 'name', 'state', 'start_at', 'end_at'],
        where: {
          number
        }
      })
      let PhotoRelationship = await round.addSlide(photo)
    } else if (id) {
      let PostModel = getPostModel()

      let post = await PostModel.findOne({
        //attributes: ['id', 'name', 'state', 'start_at', 'end_at'],
        where: {
          id: id
        }
      })
      let PhotoRelationship = await post.addCover(photo)
    }



    let url = urlForDirectUpload(photo.okey)
    let headers = headersForDirectUpload(photo.okey, photo.content_type, photo.checksum)


    ctx.body = {
      directUploadData: {
        url,
        headers
      },
      photo
    }
    // } catch (error) {
    //
    //     ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${code}:${number} fail: ` + error, { expose: true })
    // }
  }

  static async getPoster(ctx) {
    console.log('==================getPoster===============');
    console.log('ctx.request.body====:', ctx.request.body);
    let number = ctx.request.body.number
    let code = ctx.request.body.code
    let PhotoModel = getGamePhotoModelByCode(code)
    let gameRoundModel = getGameRoundModelByCode(code)

    let round = await gameRoundModel.findOne({
      where: {
        number
      }
    })

    let posters = await PhotoModel.findAll({
      where: {
        viewable_id: round.id
      }
    })

    ctx.body = posters

  }

  static async modifyPoster(ctx) {
    //try {
    console.log('==================modifyAlbum===============');
    console.log("ctx.request.body= ", ctx.request.body)
    let number = ctx.params.number
    let code = ctx.request.body.code
    let photoParams = ctx.request.body.photos
    let photosToDelete = ctx.request.body.photosToDelete


    let Model = getGameRoundModelByCode(code)
    let round = await Model.findOne({
      //attributes: ['id', 'name', 'state', 'start_at', 'end_at'],
      where: {
        number
      }
    })

    let PhotoModel = getGamePhotoModelByCode(code)


    photosToDelete.map(async (param) => {
      console.log(" param ", param)
      let res = await PhotoModel.destroy({
        where: {
          viewable_id: round.id,
          okey: param.okey
        }
      })
    })

    let photoOptions = {
      fields: ['album_id', 'file_name', 'file_size', 'content_type', 'checksum', 'okey', 'viewable_id', 'viewable_type']
    }

    let promises = photoParams.map((param) => {
      console.log(" param, photoOptions= ", param, photoOptions)
      param.viewable_id = round.id
      param.viewable_type = 'poster'
      return photos = PhotoModel.create(param, photoOptions)
    })
    let photos = await Promise.all(promises)

    let directUploadData = photos.map((photo) => {
      let url = urlForDirectUpload(photo.okey)
      let headers = headersForDirectUpload(photo.okey, photo.content_type, photo.checksum)
      return {
        url,
        headers
      }
    })

    ctx.body = {
      photos,
      directUploadData
    }
    // } catch (error) {
    //
    //     ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, { expose: true })
    // }
  }
}
