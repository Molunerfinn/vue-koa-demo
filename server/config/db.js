import '../../env'
import Sequelize from 'sequelize'

const Todolist = new Sequelize(`mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL || 'localhost'}/todolist`, {
  define: {
    timestamps: false // 取消Sequelzie自动给数据表加入时间戳（createdAt以及updatedAt）
  }
})

export default {
  Todolist // 将Todolist暴露出接口方便Model调用
}
