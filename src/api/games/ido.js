import fetch from '@/config/fetch'

/**
 * 取得砍价游戏基本信息
 * @param {*} data - game_round_id，game_player_id
 */
export const getGameInfo = (data) => fetch('/gapi/ido/start?'+data, data )
export const getResultInfo = (data) => fetch('/gapi/ido/result?'+data, data )
export const postSignUp = (data) => fetch('/gapi/ido/sign_up', data,'POST' )
export const postThumbUp = (data) => fetch('/gapi/ido/thumb_up', data ,'POST')
export const postMsg = (data) => fetch('/gapi/ido/post_msg', data ,'POST')
export const postGameRound = (data) => fetch('/gapi/ido/gameround', data ,'POST')
