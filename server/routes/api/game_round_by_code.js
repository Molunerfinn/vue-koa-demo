import api from '../../controllers/api/game_round.js'
import Router from 'koa-router'
const router = new Router()
router.prefix('/:code')
router.post('createRound','/', api.createRound)

//router.put('updateRound','/:id', api.updateRound)

export default router
