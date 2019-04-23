import game from '../../../controllers/gapi/games/kouhong.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/set_achieve', game.setAchieve)

export default router
