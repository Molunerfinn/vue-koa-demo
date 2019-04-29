const { buildGameAssociations } = require( './associations')
const { bindGamePlayerMethods } = require( './game_player_methods')

export function buildCommon(db){

  buildGameAssociations( db )

  bindGamePlayerMethods( db )
}
