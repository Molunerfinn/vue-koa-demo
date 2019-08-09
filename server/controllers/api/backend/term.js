const {
  getUsersModel,
  getGameRoundModelByCode,
  getWxMpUsersModel,
  getPostModel,
  getTermModel,
  getTermRelationshipModel
} = require('../../../helpers/model')
const {
  getPagination
} = require('../../../helpers/pagination')
export default class term {

  static async getTermInfo(ctx) {
    console.log('=============getTermInfo===========');
    let pagination = getPagination( ctx.query)
    // TODO suport other query
    let options =Object.assign( {}, pagination )
    let TermModel = getTermModel()

    let {rows, count} = await TermModel.findAndCount(options)
    pagination.total = count

    let res = Object.assign(pagination, {  terms: rows } )
    let terms = res.terms

    ctx.body = terms
  }

  static async addTerm(ctx) {
    console.log('===========addTerm==========');
    let body = ctx.request.body;
    console.log('body---:', body);
    let name = body.name;
    let slug = body.slug;
    let desc = body.desc;
    let parent = body.parent

    let term = {
      name: name,
      slug: slug,
      desc: desc
    }
    if (parent > 0) {
      term.parent = parent
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

    let RelationshipModel = getTermRelationshipModel()

    await RelationshipModel.destroy({
      where: {
        term_id: id
      }
    })
    ctx.body = res
  }

  static async getPostInfo(ctx) {
    console.log('=============getTermInfo===========');
    let PostModel = getPostModel()

    let post = await PostModel.findAll({})

    ctx.body = post
  }

  static async getTermDetail(ctx) {
    console.log('=============getTermDetail===========');
    console.log('ctx:',ctx.query);
    let body = ctx.query;
    let id = body.id
    let TermModel = getTermModel()

    let term = await TermModel.findOne({
      where: {
        id: id
      }
    })
    console.log('term-----:', term);

    ctx.body = term
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

      if (parent > 0) {
        term = await term.update({
          name: name,
          slug: slug,
          desc: desc,
          parent: parent
        })
      } else {
        term = await term.update({
          name: name,
          slug: slug,
          desc: desc
        })
      }


      ctx.body = term
    } catch (e) {
      console.log('error!:', e);
    }
  }
}
