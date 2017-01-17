const Sequelize = require('sequelize');

// 使用连接的形式进行连接的话，注意将root: 后面的XXXX改成自己数据库的密码
const Todolist = new Sequelize('mysql://root:XXXX@localhost/todolist',{
  define: {
    timestamps: false // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
  }
}) 

module.exports = {
  Todolist // 将Todolist暴露出接口方便Model调用
}
