import api from '../../controllers/api/games.js'
import Router from 'koa-router'
const router = new Router()
router.prefix('/:code')

router.post('createRound','/', api.createRound)

router.post('/:id', api.updateRound)
router.put('/:id', api.updateRound)
router.get('/:id', api.showRound)
//router.put('updateRound','/:id', api.updateRound)

export default router
