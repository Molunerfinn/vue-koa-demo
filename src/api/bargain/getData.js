import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */
export const getGameInfo = (data) => fetch('/gapi/bargain/game-info', data )

export const poll = (data) => fetch('/gapi/bargain/poll', data )

export const getGamePlayerRank = (data) => fetch('/gapi/bargain/game-player-rank', data )

export const getGameResultRank = (data) => fetch('/gapi/bargain/game-result-rank', data )

export const updateGamePlayerContact = (data) => fetch('/gapi/bargain/update-game-player-contact', data, 'POST' )

export const updateGameDay = (data) => fetch('/gapi/bargain/update-game-day', data )
