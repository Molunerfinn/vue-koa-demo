
import setting from '../../controllers/api/backend/setting.js'
import base from '../../controllers/api/backend/base.js'
import Users from '../../controllers/api/backend/users.js'
import GameRounds from '../../controllers/api/backend/game_rounds.js'

import Posts from '../../controllers/api/backend/post.js'
import term from '../../controllers/api/backend/term.js'
//import wxOpen from '../../controllers/wxopen.js'

import Photos from '../../controllers/photos.js'
import Album from '../../controllers/api/backend/album.js'

import Router from 'koa-router'
const router = new Router()

router.get('/users/show', Users.show)
router.get('/game_rounds', GameRounds.index)
router.get('/game_rounds/:id', GameRounds.show)
router.put('/game_rounds/:id', GameRounds.update)

router.del('/slides/removeSlide', GameRounds.removeSlide)
router.post('/photos/bindPhotoRelationship', GameRounds.bindPhotoRelationship)
router.post('/photos/:code/create', Photos.createBeforeDirectUpload)
router.post('/photos/search', Photos.search)
router.del('/photos/removePhoto', Photos.removePhoto)

router.get('/posts', Posts.index)
router.get('/posts/:id', Posts.getPostDetail)

router.post('/albums/createAlbum', Album.createAlbum)
router.post('/albums/getAlbums', Album.getAlbums)
router.del('/albums/removeAlbum', Album.removeAlbum)


// router.get('/game_rounds/getGameRoundInfo', base.getGameRoundInfo)
router.post('/game_rounds/addGameRound', base.addGameRound)
router.del('/game_rounds/removeGameRound', base.removeGameRound)
router.put('/game_rounds/modifyGameRound', base.modifyGameRound)
router.get('/users/getWxMpUsers', base.getWxMpUsers)
router.put('/game_rounds/modifyDesc', base.modifyDesc)
router.del('/game_rounds/clearData', base.clearData)

router.post('/posts/addPost', Posts.addPost)
// router.get('/base/getPostInfo', Posts.getPostInfo)
router.del('/posts/removePost', Posts.removePost)
router.del('/covers/removeCover', Posts.removeCover)
// router.get('/base/getPostDetail', Posts.getPostDetail)
router.put('/posts/modifyPost', Posts.modifyPost)


router.post('/terms/addTerm', term.addTerm)
router.get('/terms/getTermInfo', term.getTermInfo)
router.del('/terms/removeTerm', term.removeTerm)
router.get('/terms/getTermDetail', term.getTermDetail)
router.put('/terms/modifyTerm', term.modifyTerm)

// router.post('/weixin_open', weixin.createRound)
// router.post('/gameRound', gameRound.createRound)

export default router
