import album from '../../controllers/gapi/albums.js'
import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:number')

router.post('/getAlbumsInfo', album.createBeforeDirectUpload)
router.post('/modifyAlbum', album.modifyAlbum)

router.post('/createPoster', album.createPosterBeforeDirectUpload)
router.post('/getPoster', album.getPoster)
router.post('/modifyPoster', album.modifyPoster)

router.post('/createDesc', album.createDescBeforeDirectUpload)



export default router
