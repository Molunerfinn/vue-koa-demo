import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */
const basePath = '/gapi/base'
export const getGameInfo = (data) => fetch( basePath+ '/game-info', data )

export const setAchieve = (data) => fetch( basePath+ '/setAchieve', data )

export const getGamePlayerRank = (data) => fetch('/game-player-rank', data )

export const getGameResultRank = (data) => fetch( basePath+ '/game-result-rank', data )

export const updateGamePlayerContact = (data) => fetch( basePath+ '/update-game-player-contact', data, 'POST' )

export const updateGameDay = (data) => fetch( basePath+ '/update-game-day', data )