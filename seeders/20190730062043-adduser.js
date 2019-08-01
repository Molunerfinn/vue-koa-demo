// https://github.com/sequelize/cli/blob/master/docs/FAQ.md


'use strict';

let bcrypt = require('bcryptjs')
let logger = require('../server/helpers/logger')
let secret = require('../server/config/secret')
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


async function doWork(queryInterface) {

  let trancates = ['users'].map((t) => {
    return `truncate ${t}`
  })

  logger.log('trancates---:', trancates);
  let sql = trancates.join(';') + ';'

  await queryInterface.sequelize.query(sql)


  let userAttrs = [{
    cellphone: '13844445555',
    password: '123456',
    created_at: '2019-06-10',
    updated_at: '2019-06-10'
  }]
  console.log('secret---:', secret);
  logger.log('secret---:', secret);

  userAttrs.forEach((user)=>{
    let saltRounds  = secret.saltRounds
    var hash = bcrypt.hashSync(user.password, saltRounds)
    user.encrypted_password = hash
  })
  logger.log('userAttrs---:', userAttrs);

  return await queryInterface.bulkInsert("users", userAttrs, {})

}
