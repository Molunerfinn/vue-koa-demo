
import setting from '../../controllers/api/backend/setting.js'
import base from '../../controllers/api/backend/base.js'
import Users from '../../controllers/api/backend/users.js'
import GameRounds from '../../controllers/api/backend/game_rounds.js'

import post from '../../controllers/api/backend/post.js'
import term from '../../controllers/api/backend/term.js'
//import wxOpen from '../../controllers/wxopen.js'
import Router from 'koa-router'
const router = new Router()

router.get('/users/show', Users.show)
router.get('/game_rounds', GameRounds.index)

router.post('/base/getGameRoundInfo', base.getGameRoundInfo)
router.post('/base/addGameRound', base.addGameRound)
router.post('/base/removeGameRound', base.removeGameRound)
router.post('/base/modifyGameRound', base.modifyGameRound)
router.post('/base/getWxMpUsers', base.getWxMpUsers)
router.post('/base/modifyDesc', base.modifyDesc)

router.post('/base/addPost', post.addPost)
router.post('/base/getPostInfo', post.getPostInfo)
router.post('/base/removePost', post.removePost)

router.post('/base/addTerm', term.addTerm)
router.post('/base/getTermInfo', term.getTermInfo)
router.post('/base/removeTerm', term.removeTerm)

// router.post('/weixin_open', weixin.createRound)
// router.post('/gameRound', gameRound.createRound)

export default router
