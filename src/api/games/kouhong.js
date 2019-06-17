import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */
const basePath = '/gapi/games/kouhong'

export const getGameInfo = (data) => fetch( basePath+ '/game-info', data )

export const getGamePlayerRank = (data) => fetch('/game-player-rank', data )

export const getGameResultRank = (data) => fetch( basePath+ '/game-result-rank', data )

export const updateGamePlayerContact = (data) => fetch( basePath+ '/update-game-player-contact', data, 'POST' )

export const updateGameDay = (data) => fetch( basePath+ '/update-game-day', data )

export const setAchievebycode = ( number, data) => fetch(basePath + '/' + number + '/setAchieve', data, 'POST')

export const getGameResult = ( number, data) => fetch(basePath + '/' + number + '/getInfo', data, 'POST')

export const postMsg = ( number, data) => fetch(basePath + '/' + number + '/addPlayer', data, 'POST')

export const getRoundState = ( number, data) => fetch(basePath + '/' + number + '/getRoundState', data, 'POST')

export const getRanking = ( number, data) => fetch(basePath + '/' + number + '/getRanking', data, 'POST')
