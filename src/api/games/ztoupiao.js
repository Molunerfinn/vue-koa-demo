import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/gapi/ztoupiao'

export const getGameResult = ( number, data) => fetch(basePath + '/' + number + '/getInfo', data, 'POST')

export const postMsg = ( number, data) => fetch(basePath + '/' + number + '/addPlayer', data, 'POST')

export const setAchievebycode = ( number, data) => fetch(basePath + '/' + number + '/setAchieve', data, 'POST')

export const getRanking = ( number, data) => fetch(basePath + '/' + number + '/getRanking', data, 'POST')

export const getRoundState = ( number, data) => fetch(basePath + '/' + number + '/getRoundState', data, 'POST')

export const getNewAlbumInfo = ( number, data) => fetch(basePath + '/' + number + '/getNewAlbumInfo', data, 'POST')

export const getHotAlbumInfo = ( number, data) => fetch(basePath + '/' + number + '/getNewAlbumInfo', data, 'POST')
