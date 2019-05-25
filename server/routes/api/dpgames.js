import api from '../../controllers/api/dpgames.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.prefix('/:code')
router.post('/', api.createRound)

router.post('/:id' ,api.updateRound)
router.put('/:id' ,api.updateRound)

router.get('/:id' ,api.showRound)

export default router
