import api from '../controllers/todolist.js';
import koa_router from "koa-router";
const router = koa_router();

router.get('/todolist/:id', api.getTodolist),
router.post('/todolist', api.createTodolist),
router.delete('/todolist/:userId/:id', api.removeTodolist),
router.put('/todolist/:userId/:id/:status', api.updateTodolist)

export default router;

