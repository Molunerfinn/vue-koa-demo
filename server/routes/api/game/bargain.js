import game from '../../../controllers/api/game/bargain.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/game-info', game.gameInfoWx)

export default router
