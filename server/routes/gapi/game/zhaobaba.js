import game from '../../../controllers/gapi/game/zhaobaba.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:code/:number')

router.post('/setAchieve', game.setAchieve)
router.post('/gameresult', game.getGameResult)
router.post('/postMsg', game.postMsg)
router.post('/getRanking', game.getRanking)

export default router
