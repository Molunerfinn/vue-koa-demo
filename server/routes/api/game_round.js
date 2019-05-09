import api from '../../controllers/api/dpgame/pintu.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/', api.createRound)

export default router
