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
  SharedPost, SharedTerm
} = require('../../../models')
const {
  getPagination
} = require('../../../helpers/pagination')


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
    let post = null
    try{
      post = await PostModel.findByPk(id,
        {include: [{association: 'Covers'}, {association: 'Terms'}] })

    }catch(e){
      ctx.throw( messageContent.ResponeStatus.UnprocessableEntity, 'Can not find post.')
    }

    if( post == null ){
      ctx.throw( messageContent.ResponeStatus.UnprocessableEntity, 'Can not find post.')
    }


    ctx.body = {
      post: post,
      terms: post.Terms,
      cover: post.Covers[0]
    }
  }

  static async addPost(ctx) {
    let body = ctx.request.body;
    console.log('body---:', body);
    let name = body.name;
    let desc = body.desc;
    let title = body.title;
    let content = body.content
    let user_id = body.user_id
    let termList = body.term

    let postAttributes = {
      creator: user_id,
      name: name,
      desc: desc,
      title: title,
      content: content
    }

    post = await PostModel.create(postAttributes)

    let RelationshipModel = getTermRelationshipModel()

    for (var i = 0; i < termList.length; i++) {
      let relationship = {
        viewable_type: 'post',
        viewable_id: post.id,
        term_id: termList[i]
      }
      await RelationshipModel.create(relationship)
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
    let id = body.id

    let PhotoRelationshipModel=getPhotoRelationshipModel()

    let res = await PhotoRelationshipModel.destroy({
      where: {
        viewable_id: id,
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
      let id = body.id
      let name = body.name;
      let desc = body.desc;
      let title = body.title;
      let content = body.content
      let user_id = body.user_id
      let termList = body.term

      let post = await PostModel.findOne({
        where: {
          id: id
        }
      })

      post = await post.update({
        name: name,
        desc: desc,
        title: title,
        content:content
      })

      let RelationshipModel = getTermRelationshipModel()

      let res = await RelationshipModel.destroy({
        where: {
          viewable_type:'post',
          viewable_id: id
        }
      })

      for (var i = 0; i < termList.length; i++) {
        let relationship = {
          type: 'post',
          post_id: post.id,
          term_id: termList[i]
        }
        await RelationshipModel.create(relationship)
      }

      ctx.body = post
    } catch (e) {
      console.log('error!:', e);
    }
  }
}
