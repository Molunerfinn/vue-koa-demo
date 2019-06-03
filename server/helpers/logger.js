let  path  = require('path')
let log4js  = require('log4js')

const config = path.join(__dirname, '..', 'config/log4js.json')

log4js.configure( config )

const  logger = log4js.getLogger();
logger.info( "log4js initialized")

module.exports = logger
