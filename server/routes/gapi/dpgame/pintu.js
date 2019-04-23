import controller from '../../../controllers/gapi/dpgame/pintu.js'
import koaRouter from 'koa-router'
const router = koaRouter()


router.get('/:number', controller.gameInfo)

export default router
