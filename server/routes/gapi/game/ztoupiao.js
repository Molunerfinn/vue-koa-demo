import game from '../../../controllers/gapi/game/ztoupiao.js'
import albums from '../../../controllers/gapi/albums.js'

import koaRouter from 'koa-router'
const router = koaRouter()
router.prefix('/:number')

router.post('/setAchieve', game.setAchieve)
router.post('/getInfo', game.getInfo)
router.post('/addPlayer', game.addPlayer)
router.post('/getRanking', game.getRanking)
router.post('/getRoundState', game.getRoundState)

router.post('/getNewAlbumInfo', game.getNewAlbumInfo)
router.post('/getHotAlbumInfo', game.getHotAlbumInfo)

router.post('/getMyWorkInfo', game.getMyWorkInfo)
router.post('/getMyCardInfo', game.getMyCardInfo)
router.post('/thumbUp', game.thumbUp)


//  routes /photos/
//  routes /albums/
const albumsRouter = koaRouter()
albumsRouter.post('/createBeforeDirectUpload', albums.createBeforeDirectUpload)
router.use('/albums', albumsRouter.routes(), albumsRouter.allowedMethods());

export default router
