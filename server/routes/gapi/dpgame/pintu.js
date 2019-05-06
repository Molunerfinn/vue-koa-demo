import game from '../../../controllers/gapi/dpgame/pintu.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:code')

router.post('/:number/setAchieve', game.setAchieve)
router.post('/:number/gameresult', game.getGameResult)
router.post('/:number/postMsg', game.postMsg)
router.get('/:number/login', game.login)
router.get('/:number/get_wx_info', game.get_wx_info)
export default router
