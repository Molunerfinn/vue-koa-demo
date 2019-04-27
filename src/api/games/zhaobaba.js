import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */
export const getGameRule = (number, data) => fetch('/gapi/zhaobaba/'+number+'/rule', data )
