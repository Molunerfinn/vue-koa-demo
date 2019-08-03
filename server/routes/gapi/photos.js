import photos from '../../controllers/photos.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.post('/create', photos.createBeforeDirectUpload)

export default router
