import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

 var basePath = '/gapi/zhaobaba'


export const getGameResult = (code, number,data) => fetch(basePath + '/' + code + '/' + number + '/gameresult', data,'POST')

export const postMsg = (code, number,data) => fetch(basePath + '/' + code + '/' + number + '/postmsg', data,'POST')

export const setAchievebycode = (code, number, data) => fetch(basePath + '/' + code + '/' + number + '/setAchieve', data,'POST')
