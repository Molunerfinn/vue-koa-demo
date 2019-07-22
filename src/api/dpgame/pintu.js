import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/gapi/dpgames/dppintu/'

export const getGameInfoForDp = (number, data) => fetch( basePath  +number + '/getInfoDp', data )

export const getGameResult = ( number,data) => fetch(basePath  + number + '/getInfo', data,'POST')

export const postMsg = (number,data) => fetch(basePath  + number + '/addPlayer', data,'POST')

export const setAchieveForSpeed = ( number, data) => fetch(basePath  + number + '/setAchieveForSpeed', data,'POST')

export const getRanking = ( number, data) => fetch(basePath  + number + '/getRanking', data, 'POST')

export const getGameRoundInfo = ( data) => fetch(basePath   + '/getGameRoundInfo', data, 'POST')
