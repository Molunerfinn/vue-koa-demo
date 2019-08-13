import gameRound from '../controllers/game_round.js'
import Router from 'koa-router'
const router = new Router()

router.get('/:code/:number/entry', gameRound.entry)

// router.post('/weixin_open', weixin.createRound)
// router.post('/gameRound', gameRound.createRound)

export default router
