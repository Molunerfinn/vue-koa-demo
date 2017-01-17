const todolist = require('../controllers/todolist.js');
const router = require('koa-router')();

todolist(router);

module.exports = router;

