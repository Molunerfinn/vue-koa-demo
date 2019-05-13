import api from '../../controllers/gapi/weixin'
import koaRouter from 'koa-router'
const router = koaRouter()

router.get('/getJsConfig', api.getWxJsConfig)

export default router
