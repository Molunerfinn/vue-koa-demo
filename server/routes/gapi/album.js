import album from '../../controllers/gapi/albums.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:number')

router.post('/getAlbumsInfo', album.createBeforeDirectUpload)

export default router
