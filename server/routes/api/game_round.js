import api from '../../controllers/api/game_round.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/', api.createRound)

export default router
