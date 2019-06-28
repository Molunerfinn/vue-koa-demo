import game from '../../../controllers/gapi/game/ztoupiao.js'
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

export default router
