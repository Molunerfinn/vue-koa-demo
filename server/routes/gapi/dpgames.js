import game from '../../controllers/gapi/dpgames.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:code/:number')

router.get('/getInfoDp', game.getInfoDp)
router.post('/setAchieve', game.setAchieve)
router.post('/getInfo', game.getInfo)
router.post('/addPlayer', game.addPlayer)
router.post('/getRanking', game.getRanking)

export default router
