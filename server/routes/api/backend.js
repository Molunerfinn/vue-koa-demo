import setting from '../../controllers/api/backend/setting.js'
import base from '../../controllers/api/backend/base.js'
import wxOpen from '../../controllers/wxOpen.js'
import gameRound from '../../controllers/api/games.js'
import Router from 'koa-router'
const router = new Router()

router.post('/base/login', base.login)
router.post('/base/check', base.check)
router.post('/base/modify', base.modify)

router.post('/wxOpen/getAuthorize', wxOpen.getAuthorize)
// router.post('/weixin_open', weixin.createRound)
// router.post('/gameRound', gameRound.createRound)

export default router
