const { buildGameAssociations } = require( './associations')
const { bindGamePlayerMethods } = require( './game_player_methods')
const { bindGameRoundMethods } = require( './game_round_methods')
const { bindPhotoMethods } = require( './photo_methods')

function buildCommon(db){
  console.log( "buildCommon")
  buildGameAssociations( db )
  bindGameRoundMethods( db )
  bindGamePlayerMethods( db )
  bindPhotoMethods( db )
}
module.exports = {
  buildCommon
}
