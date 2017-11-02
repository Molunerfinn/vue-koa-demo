import api from '../controllers/todolist.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/todolist/:id', api.getTodolist)
router.post('/todolist', api.createTodolist)
router.delete('/todolist/:userId/:id', api.removeTodolist)
router.put('/todolist/:userId/:id/:status', api.updateTodolist)

export default router
