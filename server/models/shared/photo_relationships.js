var moment = require('moment')

module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('SharedPhotoRelationship', {
    photo_id: {
      type: DataTypes.BIGINT(11),
    },
    viewable_id: {
      type: DataTypes.BIGINT(11),
    },
    viewable_type:{
      type: DataTypes.STRING(64),
      validate: {
        isIn: {
          // photo: 参赛作品, cover: post 封面， poster: 海报， slide: gameround 海报，
          // desc: gameround 描述里用图片
           args: [['photo', 'slide', 'poster','cover']],
           msg: "Must be photo, slide, poster."
         }
      }
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'shared_photo_relationships'
  })
  return model
}
