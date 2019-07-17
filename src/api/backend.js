import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/api/backend'

export const login = (data) => fetch(basePath + '/base/login', data, 'POST')
export const check = (data) => fetch(basePath + '/base/check', data, 'POST')
export const modify = (data) => fetch(basePath + '/base/modify', data, 'POST')

export const getAuthorize = (data) => fetch(basePath + '/wxOpen/getAuthorize', data, 'POST')
