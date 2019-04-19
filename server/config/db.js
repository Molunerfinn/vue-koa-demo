const { sequelize } = require('../models') // db

module.exports = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        console.log('initialize db successfully')
    } catch (error) {
        console.error('db initialize fail: ' + error)
    }
}
