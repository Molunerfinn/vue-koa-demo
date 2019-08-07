const {
  getUsersModel,
  getWxMpUsersModel,
  getPostModel,
  getTermModel,
  getTermRelationshipModel,
  getPhotoRelationshipModel,
  getGamePhotoModelByCode
} = require('../../../helpers/model')

const {
  Post
} = require('../../../models')
const {
  getPagination
} = require('../../../helpers/pagination')



export default class Posts {


  /**
   * 根据条件取得文章信息列表
   * @param {*}
   * @return {*}  { posts, total, page, pageSize }
   */
  static async index(ctx) {

    let pagination = getPagination( ctx.query)

    // TODO suport other query 
    let options =Object.assign( {}, pagination )

    let {rows, count} = await Post.findAndCount(options)

    pagination.total = count

    let res = Object.assign(pagination, {  posts: rows } )

    ctx.body = res
  }

  static async getPostInfo(ctx) {
    console.log('=============getTermInfo===========');

    let post = await Post.findAll({})

    ctx.body = post
  }

  static async getPostDetail(ctx) {
    console.log('=============getPostDetail===========');
    let body = ctx.request.body;
    let id = body.id
    let PostModel = getPostModel()

    let post = await PostModel.findOne({
      where:{
        id:id
      },
      include: [{association: 'Covers'}]
    })
    console.log('post-----:',post);

    let RelationshipModel = getTermRelationshipModel()
    let termids = await RelationshipModel.findAll({
      attributes: ['term_id'],
      where:{
        viewable_type:'post',
        viewable_id:post.id
      }
    })

    let terms = new Array()
    for(var i=0;i<termids.length;i++){
      let TermModel = getTermModel()
      let term = await TermModel.findOne({
        where:{
          id:termids[i].term_id
        }
      })
      terms.push(term)
    }

    let termList = new Array()
    for(var i=0;i<terms.length;i++){
      let term ={
        key:terms[i].id,
        value:terms[i].id,
        label:terms[i].name
      }
      termList.push(term)
    }

    // :key="term.id"
    // :label="term.name"
    // :value="term.id"

    let Photo = getGamePhotoModelByCode('ztoupiao')

    let cover = await Photo.findOne({
      where:{
        viewable_id:id,
        viewable_type:'cover'
      }
    })

    ctx.body = {
      post:post,
      term:termList,
      cover:cover
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

    let post = {
      creator: user_id,
      name: name,
      desc: desc,
      title: title,
      content: content
    }

    let PostModel = getPostModel()
    post = await PostModel.create(post)
    console.log('post----:', post);

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

      let PostModel = getPostModel()
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
