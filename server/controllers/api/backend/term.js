const {
  getUsersModel,
  getGameRoundModelByCode,
  getWxMpUsersModel,
  getPostModel,
  getTermModel,
  getRelationshipModel
} = require('../../../helpers/model')
export default class term {

  static async getTermInfo(ctx) {
    console.log('=============getTermInfo===========');
    let TermModel = getTermModel()

    let terms = await TermModel.findAll({})

    ctx.body = terms
  }

  static async getTermDetail(ctx) {
    console.log('=============getTermInfo===========');
    let body = ctx.request.body;
    let id = body.id
    let TermModel = getTermModel()

    let terms = await TermModel.findOne({
      where:{
        id:id
      }
    })

    ctx.body = terms
  }

  static async addTerm(ctx) {
    let body = ctx.request.body;
    console.log('body---:', body);
    let name = body.name;
    let slug = body.slug;
    let desc = body.desc;
    let parent = body.parent

    let term = {
      name: name,
      slug: slug,
      desc: desc,
      parent: parent,
    }
    let TermModel = getTermModel()
    term = await TermModel.create(term)
    console.log('term----:', term);
    ctx.body = term
  }

  static async removeTerm(ctx) {
    let body = ctx.request.body;
    console.log('body---:', body);
    let id = body.id

    let TermModel = getTermModel()
    let res = await TermModel.destroy({
      where: {
        id: id
      }
    })

    let RelationshipModel = getRelationshipModel()

    await RelationshipModel.destroy({
      where: {
        term_id: id
      }
    })
    ctx.body = res
  }


  static async modifyTerm(ctx) {
    try {
      console.log('==================modifyTerm=================');
      let body = ctx.request.body;
      console.log('body---:', body);
      let id = body.id
      let name = body.name;
      let slug = body.slug;
      let desc = body.desc;
      let parent = body.parent

      let TermModel = getTermModel()
      let term = await TermModel.findOne({
        where: {
          id: id
        }
      })

      term = await TermModel.update({
        name: gamename,
        desc: gamedesc,
        title: title,
        content:content
      })

      ctx.body = term
    } catch (e) {
      console.log('error!:', e);
    }
  }
}
