const messageContent = require('../constant')
const { getGameRoundModelByCode } = require('../../helpers/model')


// const WechatAPI = require('co-wechat-api');
// var OAuth = require('co-wechat-oauth');
// const config = require(`../../../config/wechat.${process.env.NODE_ENV}.json`);
// const wechat_config = config.wechat;
// const wechatApi = new WechatAPI(wechat_config.appid, wechat_config.secret);
// var wechatOAuth = new OAuth(wechat_config.appid, wechat_config.secret);

// url /:code/:number
export default class GameRoundController{

    // /**
    //  * update round information, such as name, description
    //  * @param {*} ctx
    //  */
    // async updateRound(ctx) {
    //     var gameroundid = parseInt(ctx.params.id)
    //     var game_round = ctx.request.body.game_round
    //     try {
    //         // tmp <Array.<affectedCount, affectedRows>>
    //         var tmp = await dbOperation.MySqlOperation.UpdateRound(gameroundid, game_round)
    //         console.log("dbOperation.MySqlOperation.UpdateRound1=", tmp )
    //         if(tmp.length === 1){
    //           ctx.status = 200
    //         }
    //     } catch (error) {
    //         ctx.throw(messageContent.ResponeStatus.CommonError, `update round ${gameroundid} fail: ` + error, { expose: true })
    //     }
    // },
    /**
     * show game round
     * @param {*} req
     * @param {*} res
     */
    static async showRoundByNumber(ctx) {
        try {
            let code = ctx.params.code
            let number = ctx.params.number
            console.log("showRoundByNumber= ", ctx.params)
            let Model = getGameRoundModelByCode(code)
            let round = await Model.findOne({
                //attributes: ['id', 'name', 'state', 'start_at', 'end_at'],
                where: {
                    number
                }
            })
            ctx.body = round
        } catch (error) {
            ctx.throw(messageContent.ResponeStatus.CommonError, `show round ${ctx.params.id} fail: ` + error, { expose: true })
        }
    }

    // /**
    //  * start round that the player can start playing the game
    //  * @param {*} req
    //  * @param {*} res
    //  */
    // async startRound(ctx) {
    //     try {
    //         var game_round_id = parseInt(ctx.params.id)
    //         dbOperation.MemoryDbOperation.StartRound(game_round_id)
    //         dbOperation.MySqlOperation.StartRound(game_round_id)
    //         ctx.status = 200
    //     } catch (error) {
    //         ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.startRoundFail + ': ' + error, { expose: true })
    //     }
    // },
    // /**
    //  * get all the players score
    //  * @param {*} req
    //  * @param {*} res
    //  */
    // async getRoundAllPlayersScore(ctx) {
    //     try {
    //         var gameroundid = parseInt(ctx.params.id)
    //         var rs = await dbOperation.MySqlOperation.GetRoundAllPlayersScore(gameroundid)
    //         var playerInfo = {}
    //         playerInfo.players = new Array()
    //         rs.forEach((x) => {
    //             var player = {
    //                 player_id: x.id,
    //                 score: x.score,
    //                 openid: x.openid
    //             }
    //             playerInfo.players.push(player)
    //         })
    //         playerInfo.game_round_id = gameroundid
    //         var game_round_players = {}
    //         game_round_players.game_round_score = playerInfo
    //         ctx.body = game_round_players
    //         ctx.status = 200
    //
    //     } catch (error) {
    //         ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.roundAllPlayerInfo + ': ' + error, { expose: true })
    //     }
    // },
    // /**
    //  *
    //  * @param {*} gameroundid
    //  */
    // async updateRoundFinishedTime(gameroundid) {
    //     try {
    //         await dbOperation.MySqlOperation.UpdateRoundFinishedTime(gameroundid)
    //         await dbOperation.MySqlOperation.InsertAllPlayersRoundScoreToDB(gameroundid)
    //     } catch (error) {
    //         LogMessage('error', 'updateRoundFinishedTime: ' + error)
    //     }
    // },
    // /**
    //  * update the round state
    //  * @param {*} ctx
    //  */
    // async updateRoundState(ctx) {
    //     var req = ctx.request
    //     try {
    //         var gameroundid = req.body.game_round.game_round_id
    //         var state = req.body.game_round.state
    //         await dbOperation.MySqlOperation.UpdateRoundState(gameroundid, state)
    //         await dbOperation.MemoryDbOperation.UpdateState(gameroundid, state)
    //         ctx.status = 200
    //     } catch (error) {
    //         ctx.throw(messageContent.ResponeStatus.CommonError, messageContent.FailMessage.updateRoundStateFail + ': ' + error, { expose: true })
    //     }
    // },
    // /**
    //  * get the state of the round
    //  * @param {*} ctx
    //  */
    // async getRoundState(ctx) {
    //     var gameroundid = parseInt(ctx.params.id)
    //     try {
    //         var state = await dbOperation.MemoryDbOperation.GetRoundState(gameroundid)//memoryDB.getRoundState(gameroundid)
    //         if (state < 0) {
    //             state = await dbOperation.MySqlOperation.GetRoundState(gameroundid)
    //         }
    //         ctx.body = { game_round: { 'state': state } }
    //         ctx.status = 200
    //     } catch (error) {
    //         ctx.throw(messageContent.ResponeStatus.CommonError, `fail to get the state of round (${gameroundid}): ` + error, { expose: true })
    //     }
    // },
    //
    // /**
    //  *
    //  * @param {*} ctx
    //  */
    // async setRoundDone(ctx) {
    //     var gameroundid = parseInt(ctx.params.id)
    //     try {
    //         await dbOperation.MySqlOperation.UpdateRoundFinishedTime(gameroundid)
    //         await dbOperation.MySqlOperation.InsertAllPlayersRoundScoreToDB(gameroundid)
    //         await dbOperation.MemoryDbOperation.SetRoundDone(gameroundid)
    //         ctx.status = 200
    //     } catch (error) {
    //         ctx.throw(messageContent.ResponeStatus.CommonError, 'set round done fail' + ': ' + error, { expose: true })
    //     }
    // },
    // /**
    //  *
    //  * @param {*} ctx
    //  */
    // async getRoundAllInformation(ctx){
    //     var gameroundid = parseInt(ctx.params.id)
    //     try{
    //         var round = await dbOperation.MySqlOperation.GetRoundById(gameroundid)
    //         var players = await dbOperation.MySqlOperation.GetRoundAllPlayersScore(gameroundid)
    //         ctx.body = {
    //             game_round: round,
    //             'players': players
    //         }
    //     }catch(error) {
    //         ctx.throw(messageContent.ResponeStatus.CommonError, `get round(${gameroundid}) all information ` + ': ' + error, { expose: true })
    //     }
    // },
    //
    //
    // /**
    //  *
    //  * @param {*} ctx
    //  *            ctx.query.url
    //  *            ctx.query.shareurl
    //  */
    // async getWxJsConfig(ctx) {
    //     try {
    //       let url = ctx.query.url
    //       let shareurl = ctx.query.shareurl
    //       var param = {
    //        debug: false,
    //        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage'],
    //        url: url
    //       };
    //       let ticket = await wechatApi.getLatestTicket()
    //       console.debug( "getLatestTicket=", ticket, "url=", url )
    //
    //       let data  =  await wechatApi.getJsConfig(param);
    //       if( shareurl ){
    //         //var link = wechatOAuth.getAuthorizeURL(wechat_config.authdomain + '/wapi/v1/wechatauth/gameshareurl-done?shareurl='+shareurl, 'state', 'snsapi_userinfo');
    //         var link = wechat_config.authdomain +'/wapi/v1/wechatauth/gameshareurl?shareurl='+encodeURIComponent(shareurl)
    //         data.link = link
    //       }
    //       console.debug( " getWxJsConfig data = ", data )
    //       ctx.body = data
    //       ctx.status = 200
    //     } catch (error) {
    //         ctx.throw(messageContent.ResponeStatus.CommonError, 'can not get wx js config fail' + ': ' + error, { expose: true })
    //     }
    // },
}
