import api from '../../controllers/api/games.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/', api.createRound)

router.post('/:id', api.updateRound)

router.get('/:id', api.showRound)

//router.delete('/:id' ,api.updateRound)

export default router
