const todolist = require('../models/todolist.js');

const getTodolist = async function (ctx){
  const id = ctx.params.id; // 获取url里传过来的参数里的id
  const result = await todolist.getTodolistById(id);  // 通过await “同步”地返回查询结果
  ctx.body = result // 将请求的结果放到response的body里返回
}

const createTodolist = async function (ctx){
  const data = ctx.request.body;
  const result = await todolist.createTodolist(data);

  ctx.body = {
    success: true
  }
}

const removeTodolist = async function (ctx){
  const id = ctx.params.id;
  const user_id = ctx.params.userId;
  const result = await todolist.removeTodolist(id,user_id);

  ctx.body = {
    success: true
  }
}

const updateTodolist = async function (ctx){
  const id = ctx.params.id;
  const user_id = ctx.params.userId;
  let status = ctx.params.status; 
  status == '0' ? status = true : status =  false;// 状态反转（更新）

  const result = await todolist.updateTodolist(id,user_id,status);

  ctx.body = {
    success: true
  }
}

module.exports = (router) => {
  router.get('/todolist/:id', getTodolist),
  router.post('/todolist', createTodolist),
  router.delete('/todolist/:userId/:id', removeTodolist),
  router.put('/todolist/:userId/:id/:status', updateTodolist)
}