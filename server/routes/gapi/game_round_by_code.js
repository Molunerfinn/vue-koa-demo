import api from '../../controllers/gapi/game_round.js'
import Router from 'koa-router'
const router = new Router()
router.prefix('/:code')
router.get('showRoundByNumber','/:number', api.showRoundByNumber)

console.log("showRoundByNumber", router.url('showRoundByNumber', {code:'xxxx', number:'1234567890'}))
export default router
