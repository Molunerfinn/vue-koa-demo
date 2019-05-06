import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */

 var basePath = '/gapi/dppintu'
 export const getGameInfo = (data) => fetch('/gapi/game/dppintu/info', data )

 export const getGameInfoByNumber = (number, data) => fetch('/gapi/game/dppintu/'+number, data )

export const poll = (data) => fetch('/gapi/bargain/poll', data )

export const getGamePlayerRank = (data) => fetch('/gapi/bargain/game-player-rank', data )

export const getGameResultRank = (data) => fetch('/gapi/bargain/game-result-rank', data )

export const updateGamePlayerContact = (data) => fetch('/gapi/bargain/update-game-player-contact', data, 'POST' )

export const updateGameDay = (data) => fetch('/gapi/bargain/update-game-day', data )

export const getGameResult = (code, number,data) => fetch(basePath + '/' + code + '/' + number + '/gameresult', data,'POST')

export const postMsg = (code, number,data) => fetch(basePath + '/' + code + '/' + number + '/postmsg', data,'POST')

export const setAchievebycode = (code, number, data) => fetch(basePath + '/' + code + '/' + number + '/setAchieve', data,'POST')
