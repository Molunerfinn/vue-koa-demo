import ido from '../../../controllers/api/games/ido.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/start', ido.get_start_info)

export default router
