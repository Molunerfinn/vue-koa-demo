import todolist from '../models/todolist.js'

const getTodolist = async function (ctx) {
  const id = ctx.params.id // 获取url里传过来的参数里的id
  const result = await todolist.getTodolistById(id) // 通过await “同步”地返回查询结果
  ctx.body = {
    success: true,
    result // 将请求的结果放到response的body里返回
  }
}

const createTodolist = async function (ctx) {
  const data = ctx.request.body
  const success = await todolist.createTodolist(data)
  ctx.body = {
    success
  }
}

const removeTodolist = async function (ctx) {
  const id = ctx.params.id
  const userId = ctx.params.userId
  const success = await todolist.removeTodolist(id, userId)

  ctx.body = {
    success
  }
}

const updateTodolist = async function (ctx) {
  const id = ctx.params.id
  const userId = ctx.params.userId
  let status = ctx.params.status
  status === '0' ? status = true : status = false// 状态反转（更新）

  const success = await todolist.updateTodolist(id, userId, status)

  ctx.body = {
    success
  }
}

export default {
  getTodolist,
  createTodolist,
  removeTodolist,
  updateTodolist
}
