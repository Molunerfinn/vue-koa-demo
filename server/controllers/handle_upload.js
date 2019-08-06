const {
  getGameRoundModelByCode,
  getUsersModel
} = require('../helpers/model')
const {
  componentAPI,
  setOpenOauth,
  getOpenOauth
} = require('../helpers/wxopen')

export default class Upload {
  static async handleUpload(ctx){
    console.log('======handleUpload:',ctx);
    let img = ctx.request.body
    ctx.body = img
  }
}
