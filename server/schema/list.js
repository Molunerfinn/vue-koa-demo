/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('list', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    content: {
      type: DataTypes.CHAR(255),
      allowNull: false
    },
    status: {
      type: DataTypes.CHAR(20),
      allowNull: false
    }
  }, {
    tableName: 'list'
  });
};
