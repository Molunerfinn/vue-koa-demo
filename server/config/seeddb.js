'use strict';
require( "dotenv" ).config()
module.exports = {
    development: {
      database: process.env.DB_NAME || 'wechatmore',
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      dialect: process.env.DB_DIALECT || 'mysql',
      logging: true
    }
};
