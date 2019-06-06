// https://github.com/sequelize/cli/blob/master/docs/FAQ.md


'use strict';

let logger = require('../server/helpers/logger')

// npx sequelize db:seed  --seed 20190603062043-loadplayer --config "server/config/seeddb.js"
module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    let avatar = 'http://thirdwx.qlogo.cn/mmopen/vi_32/vibBfZPicTeQwibjFyibXAWMmIl6UFvFhUR7xNibvsHic3sXM85q6PPF6FibxibJmkXHEKHd4UTDSfWic33a4FicnArPjYNw/132'

    let playerAttrs = [{openid: 'oF9hV0SyZ6tI_k2WHtpRXqfedRH4', nickname: 'nickname', avatar: avatar }]
    for( let i=0; i<5000; i++ ){
      playerAttrs.push( { openid: `openid-${i}`, nickname:`nickname-${i}`, game_round_id: 7, avatar } )
    }
    logger.info( "20190603062043-loadplayer",  queryInterface )

    return queryInterface.bulkInsert( "dppintu_game_players", playerAttrs, {} )

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
