module.exports = (sequelize, DataTypes) => {
  const model = sequelize.define('SharedTermRelationship', {
    viewable_type:{
      type: DataTypes.STRING(64),
      validate: {
        isIn: {
          // game_round: 游戏分类, post: 文章分类，
          // desc: gameround 描述里用图片
           args: [['game_round', 'post']],
           msg: "Must be game_round, post."
         }
      }
    },
    viewable_id: {
      type: DataTypes.BIGINT(11),
    },
    term_id: {
      type: DataTypes.BIGINT(11),
    }
  }, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'shared_term_relationships'
  })
  return model
}
