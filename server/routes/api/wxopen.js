import setting from '../../controllers/api/backend/setting.js'
import base from '../../controllers/api/backend/base.js'
import wxOpen from '../../controllers/wxopen.js'
import gameRound from '../../controllers/api/games.js'
import Router from 'koa-router'
const router = new Router()

router.post('/ticket', wxOpen.getAuthorize)
router.post('/message', wxOpen.getAuthorize)
// router.post('/weixin_open', weixin.createRound)
// router.post('/gameRound', gameRound.createRound)

export default router
