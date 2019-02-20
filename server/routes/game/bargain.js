import game from '../../controllers/game/bargain.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/game-info-wx', game.gameInfoWx)

export default router
