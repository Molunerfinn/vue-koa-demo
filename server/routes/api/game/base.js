import game from '../../../controllers/api/game/base.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/setAchieve', game.setAchieve)

export default router
