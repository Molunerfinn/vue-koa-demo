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
    return doWork(queryInterface)
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


async function  doWork( queryInterface ){

      let trancates = ['dppintu_game_players', 'zhaobaba_game_players', 'zhaobaba_game_rounds', 'dppintu_game_rounds'].map((t) => {
        return `truncate ${t}`
      })

      console.log('trancates---:', trancates);
      let sql = trancates.join(';') + ';'

      await queryInterface.sequelize.query(sql)

  //
  let zhaobaba_gameRound = [{
    number: 'abc123def456',
    code: 'zhaobaba',
    duration: 30,
    name: 'testname',
    state: 'created',
    description: 'this is a description!',
    created_at: '2019-06-10',
    updated_at: '2019-06-10',
    start_at: '2019-06-10',
    end_at: '2219-06-10'
  }]

  let dppintu_gameRound = [{
    number: 'abc123def456',
    code: 'dppintu',
    duration: 30,
    name: 'testname',
    state: 'created',
    description: 'this is a description!',
    created_at: '2019-06-10',
    updated_at: '2019-06-10',
    start_at: '2019-06-10',
    end_at: '2219-06-10'
  }]

  let avatar = 'http://thirdwx.qlogo.cn/mmopen/vi_32/vibBfZPicTeQwibjFyibXAWMmIl6UFvFhUR7xNibvsHic3sXM85q6PPF6FibxibJmkXHEKHd4UTDSfWic33a4FicnArPjYNw/132'

  let playerAttrs = [{
    openid: 'oF9hV0SyZ6tI_k2WHtpRXqfedRH4',
    nickname: 'nickname',
    avatar: avatar,
    game_round_id: 1,
    created_at: '2019-06-10',
    updated_at: '2019-06-10'
  }]
  for (let i = 0; i < 500; i++) {
    playerAttrs.push({
      openid: `openid-${i}`,
      nickname: `nickname-${i}`,
      game_round_id: 1,
      avatar,
      created_at: '2019-06-10',
      updated_at: '2019-06-10'
    })
  }

  await queryInterface.bulkInsert("zhaobaba_game_players", playerAttrs, {})
  await queryInterface.bulkInsert("dppintu_game_players", playerAttrs, {})
  await queryInterface.bulkInsert("dppintu_game_rounds", dppintu_gameRound, {})
  return await queryInterface.bulkInsert("zhaobaba_game_rounds", zhaobaba_gameRound, {})


}
