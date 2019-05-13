import game from '../../../controllers/gapi/dpgame/pintu.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:number')

router.post('/setAchieve', game.setAchieve)
router.post('/gameresult', game.getGameResult)
router.post('/postMsg', game.postMsg)
router.get('/login', game.login)
router.get('/get_wx_info', game.get_wx_info)

router.post('/getwxjsconfig', game.getWxJsConfig)
export default router
