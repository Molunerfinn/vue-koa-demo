import setting from '../../controllers/api/backend/setting.js'
import base from '../../controllers/api/backend/base.js'
import Users from '../../controllers/api/backend/users.js'
import session from '../../controllers/api/backend/session.js'
import GameRounds from '../../controllers/api/backend/game_rounds.js'
//import wxOpen from '../../controllers/wxopen.js'
import Router from 'koa-router'
const router = new Router()

router.post('/base/login', base.login)
router.post('/base/check', base.check)

router.post('/session/login', session.login)
router.post('/session/check', session.check)

router.post('/base/getGameRoundInfo', base.getGameRoundInfo)
router.post('/base/addGameRound', base.addGameRound)
router.post('/base/removeGameRound', base.removeGameRound)
router.post('/base/modifyGameRound', base.modifyGameRound)
router.post('/base/getWxMpUsers', base.getWxMpUsers)
router.post('/base/modifyDesc', base.modifyDesc)

router.post('/base/addPost', base.addPost)
router.post('/base/addTerm', base.addTerm)
router.post('/base/getTermInfo', base.getTermInfo)


router.get('/users/show', Users.show)
router.get('/game_rounds', GameRounds.index)

export default router
