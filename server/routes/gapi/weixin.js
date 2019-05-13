import api from '../../controllers/gapi/weixin'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/getJsConfig', api.getWxJsConfig)

export default router
