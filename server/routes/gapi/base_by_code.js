import game from '../../../controllers/gapi/base_by_code.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:code')
router.post('/:number/setAchieve', game.setAchieve)

export default router
