const { getObjectUrl, getImageUrlForStyle } = require('../../helpers/aliyun_oss')


module.exports = (sequelize, DataTypes) => {
  const Op = sequelize.Op
  //filename: filename, byte_size: byte_size, checksum: checksum, content_type: content_type, metadata: metadata

  const model = sequelize.define('SharedPhoto', {
    album_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    okey: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
      defaultValue: ''
    },
    viewable_id:{
      type: DataTypes.INTEGER(11),
    },
    viewable_type:{
      type: DataTypes.STRING(64),
      validate: {
        isIn: {
          // photo: 参赛作品, cover: post 封面， poster: 海报， slide: gameround 海报，
          // desc: gameround 描述里用图片
           args: [['photo', 'slide', 'poster','cover','desc']],
           msg: "Must be photo, slide, poster,cover,desc."
         }
      }
    },
    checksum: {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: ''
    },
    file_name: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: ''
    },
    content_type: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: ''
    },
    file_size: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: 0
    },
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // 并且希望 deletedA t被称为 destroyTime(请记住启用paranoid以使其工作)
    deletedAt: 'deleted_at',
    paranoid: true,
    tableName: 'shared_photos',
    getterMethods:{
      originalUrl(){
        return getObjectUrl( this.okey)
      },
      previewUrl(){ // w600
        return getImageUrlForStyle( this.okey)
      },
      thumbUrl(){ // wh80 固定宽高，居中裁剪
        return getImageUrlForStyle( this.okey, 'wh80' )
      }
    }
  })

  // bindMethods(model)
  return model

}

// function bindMethods(model) {
//   model.prototype.getInfo = getInfo
// }
//
// // 返回到游戏端的信息, 用于显示游戏成绩信息
// async function getInfo() {
//
//   let isSuc = this.score < this.max_score
//   let score = this.score
//   let bestScore = this.max_score //bestScore
//   let rank = await this.currentPositionDesc()
//   let beat = await this.beat()
//
//   return {
//     id: this.id,
//     token: this.token,
//     openid: this.openid,
//     avatar: this.avatar,
//     nickname: this.nickname,
//     isSuc,
//     score,
//     bestScore,
//     rank,
//     beat
//   }
// }
