const {
  getUsersModel,
  getWxMpUsersModel,
  getPostModel,
  getTermModel,
  getRelationshipModel
} = require('../../../helpers/model')


export default class post {

  static async getPostInfo(ctx) {
    console.log('=============getTermInfo===========');
    let PostModel = getPostModel()

    let post = await PostModel.findAll({})

    ctx.body = post
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

    let RelationshipModel = getRelationshipModel()

    for (var i = 0; i < termList.length; i++) {
      let relationship = {
        type: 'post',
        post_id: post.id,
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

      post = await PostModel.update({
        name: gamename,
        desc: gamedesc,
        title: title,
        content:content
      })

      let RelationshipModel = getRelationshipModel()

      let res = await RelationshipModel.destroy({
        where: {
          post_id: id
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
