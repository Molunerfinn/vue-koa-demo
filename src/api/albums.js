import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/gapi/album'

export const createBeforeDirectUpload = ( number, data) => fetch(basePath + '/' + number + '/getAlbumsInfo', data, 'POST')
export const modifyAlbum = ( number, data) => fetch(basePath + '/' + number + '/modifyAlbum', data, 'POST')
