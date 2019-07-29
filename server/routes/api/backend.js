import setting from '../../controllers/api/backend/setting.js'
import base from '../../controllers/api/backend/base.js'
//import wxOpen from '../../controllers/wxopen.js'
import Router from 'koa-router'
const router = new Router()

router.post('/base/login', base.login)
router.post('/base/check', base.check)

router.post('/base/getGameRoundInfo', base.getGameRoundInfo)
router.post('/base/addGameRound', base.addGameRound)
router.post('/base/removeGameRound', base.removeGameRound)
router.post('/base/modifyGameRound', base.modifyGameRound)
router.post('/base/getWxMpUsers', base.getWxMpUsers)
router.post('/base/modifyDesc', base.modifyDesc)

// router.post('/weixin_open', weixin.createRound)
// router.post('/gameRound', gameRound.createRound)

export default router
