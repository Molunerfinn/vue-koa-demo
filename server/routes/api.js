const api = require('../controllers/todolist.js');
const router = require('koa-router')();

router.get('/todolist/:id', api.getTodolist),
router.post('/todolist', api.createTodolist),
router.delete('/todolist/:userId/:id', api.removeTodolist),
router.put('/todolist/:userId/:id/:status', api.updateTodolist)

module.exports = router;

