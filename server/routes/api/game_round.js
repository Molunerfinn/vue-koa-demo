import api from '../../controllers/api/game_round.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/', api.createRound)

router.post('/update/:id' ,api.updateRound)

export default router
