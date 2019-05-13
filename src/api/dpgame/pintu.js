import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

var basePath = '/gapi/dppintu'
export const getGameInfo = (data) => fetch('/gapi/game/dppintu/info', data )

export const getGameInfoByNumber = (number, data) => fetch('/gapi/game/dppintu/'+number, data )

export const getGameResult = ( number,data) => fetch(basePath + '/' + number + '/gameresult', data,'POST')

export const postMsg = (number,data) => fetch(basePath + '/' + number + '/postmsg', data,'POST')

export const setAchievebycode = ( number, data) => fetch(basePath + '/' + number + '/setAchieve', data,'POST')
