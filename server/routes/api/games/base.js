import game from '../../../controllers/api/games/base.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/setAchieve', game.setAchieve)

export default router
