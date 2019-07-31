import Sessions from '../../controllers/api/sessions.js'
import Router from 'koa-router'
const router = new Router()

router.post('/', Sessions.create)

export default router
