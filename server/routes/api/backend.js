
import setting from '../../controllers/api/backend/setting.js'
import base from '../../controllers/api/backend/base.js'
import Users from '../../controllers/api/backend/users.js'
import GameRounds from '../../controllers/api/backend/game_rounds.js'

import Posts from '../../controllers/api/backend/post.js'
import term from '../../controllers/api/backend/term.js'
//import wxOpen from '../../controllers/wxopen.js'

import Photos from '../../controllers/photos.js'

import Router from 'koa-router'
const router = new Router()

router.get('/users/show', Users.show)
router.get('/game_rounds', GameRounds.index)
router.get('/game_rounds/:id', GameRounds.show)

router.post('/base/removeSlide', GameRounds.removeSlide)
router.post('/photos/:code/create', Photos.createBeforeDirectUpload)
router.post('/photos/search', Photos.search)

router.get('/posts', Posts.index)
router.get('/posts/:id', Posts.getPostDetail)


router.get('/base/getGameRoundInfo', base.getGameRoundInfo)
router.post('/base/addGameRound', base.addGameRound)
router.post('/base/removeGameRound', base.removeGameRound)
router.put('/base/modifyGameRound', base.modifyGameRound)
router.get('/base/getWxMpUsers', base.getWxMpUsers)
router.put('/base/modifyDesc', base.modifyDesc)

router.post('/base/addPost', Posts.addPost)
router.get('/base/getPostInfo', Posts.getPostInfo)
router.post('/base/removePost', Posts.removePost)
router.post('/base/removeCover', Posts.removeCover)
router.get('/base/getPostDetail', Posts.getPostDetail)
router.put('/base/modifyPost', Posts.modifyPost)


router.post('/base/addTerm', term.addTerm)
router.get('/base/getTermInfo', term.getTermInfo)
router.post('/base/removeTerm', term.removeTerm)
router.get('/base/getTermDetail', term.getTermDetail)
router.put('/base/modifyTerm', term.modifyTerm)

// router.post('/weixin_open', weixin.createRound)
// router.post('/gameRound', gameRound.createRound)

export default router
