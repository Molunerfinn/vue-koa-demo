const {
  getUsersModel,
  getWxMpUsersModel,
  getPostModel,
  getTermModel,
  getTermRelationshipModel,
  getPhotoRelationshipModel,
  getGamePhotoModelByCode
} = require('../../../helpers/model')
const messageContent = require('../../constant')


const {
  Sequelize, SharedPost, SharedTerm, SharedPhoto
} = require('../../../models')
const {
  getPagination
} = require('../../../helpers/pagination')

const Op = Sequelize.Op;
const PostModel = SharedPost

export default class Posts {


  /**
   * 根据条件取得文章信息列表
   * @param {*}
   * @return {*}  { posts, total, page, pageSize }
   */
  static async index(ctx) {

    let pagination = getPagination( ctx.query)

    // TODO suport other query
    let options = Object.assign( {}, pagination )

    let {rows, count} = await PostModel.findAndCountAll(options)

    pagination.total = count

    let res = Object.assign(pagination, {  posts: rows } )

    ctx.body = res
  }

  static async getPostInfo(ctx) {
    console.log('=============getTermInfo===========');

    let post = await PostModel.findAll({})

    ctx.body = post
  }

  static async getPostDetail(ctx) {
    console.log('=============getPostDetail===========');
    let id = ctx.params.id;
    console.log('body---:', ctx.params);
    let post = await PostModel.findByPk(id,
        {include: [{association: 'Covers'}, {association: 'Terms'}] })

    if( post == null ){
      ctx.throw( messageContent.ResponeStatus.UnprocessableEntity, 'Can not find post.')
    }

    ctx.body = {
      post: post,
      terms: post.Terms,
      cover: post.Covers[0]
    }
  }

  /**
   * 添加文章信息
   * @param {Object} post { created_by, name, desc, title, content}
   * @param {Array} terms { term_id }
   * @param {Integer} photo_id
   * @return {*}  { posts, total, page, pageSize }
   */
  static async addPost(ctx) {
    let body = ctx.request.body;
    console.log('body---:', body);
    // { }
    let postAttributes = body.post;
    let photo_id = body.photo_id
    let termList = body.terms

    let post = await PostModel.create(postAttributes)

    if( termList.length>0 ){
      let terms = await SharedTerm.findAll( { where:{ id: { [Op.in]: termList } }})
      post.addTerms(terms)
    }

    if( photo_id > 0 ){
      let photo = await SharedPhoto.findByPk( photo_id )
      post.addCovers(photo)
    }

    ctx.body = post
  }

  static async removePost(ctx) {
    let body = ctx.request.body;
    console.log('body---:', body);
    let id = body.id

    let PostModel = getPostModel()
    let res = await PostModel.destroy({
      where: {
        id: id
      }
    })
    ctx.body = res
  }

  static async removeCover(ctx) {
    let body = ctx.request.body;
    console.log('body---:', body);
    let photo_id = body.photo_id
    let post_id = body.post_id

    let PhotoRelationshipModel=getPhotoRelationshipModel()

    let res = await PhotoRelationshipModel.destroy({
      where: {
        photo_id:photo_id,
        viewable_id: post_id,
        viewable_type: 'cover'
      }
    })
    ctx.body = res
  }

  static async modifyPost(ctx) {
    try {
      console.log('==================modifyPost=================');
      let body = ctx.request.body;
      console.log('body---:', body);
      let postAttributes = body.post;
      let photo_id = body.photo_id
      let termList = body.terms

      let post = await PostModel.findOne({
        where: {
          id: postAttributes.id
        }
      })

      post = await post.update(postAttributes,{
        fields:['title', 'desc', 'author','content']
      })

      if( termList ){
        let terms = await SharedTerm.findAll( { where:{ id: { [Op.in]: termList } }})
        post.addTerms(terms)
      }

      if( photo_id > 0 ){
        let photo = await SharedPhoto.findByPk( photo_id )
        post.addCover(photo)
      }

      ctx.body = post
    } catch (e) {
      console.log('error!:', e);
    }
  }
}
