import upload from '../controllers/handle_upload.js'
import koaRouter from 'koa-router'
const router = koaRouter()

router.post('/', upload.handleUpload)



export default router
