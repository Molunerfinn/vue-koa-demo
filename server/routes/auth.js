const user = require('../controllers/user.js');
const router = require('koa-router')();

user.auth(router);

module.exports = router;

