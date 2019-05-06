import game from '../../../controllers/gapi/dpgame/pintu.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:code')

router.post('/:number/setAchieve', game.setAchieve)
router.post('/:number/gameresult', game.getGameResult)
router.post('/:number/postMsg', game.postMsg)
export default router
