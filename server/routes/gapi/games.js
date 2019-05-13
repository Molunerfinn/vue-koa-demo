import game from '../../controllers/gapi/games.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:code/:number')

router.post('/setAchieve', game.setAchieve)
router.post('/getInfo', game.getInfo)
router.post('/addPlayer', game.addPlayer)
router.post('/getRanking', game.getRanking)

export default router
