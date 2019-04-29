import ido from '../../../controllers/gapi/game/ido.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/start', ido.get_start_info)
router.get('/result', ido.get_result_info)
router.get('/login', ido.login)
router.get('/share', ido.share)
router.get('/get_wx_info', ido.get_wx_info)

router.post('/sign_up', ido.post_sign_up)
router.post('/thumb_up', ido.post_thumb_up)
router.post('/post_msg', ido.post_msg)
router.post('/gameround', ido.gameround)

export default router
