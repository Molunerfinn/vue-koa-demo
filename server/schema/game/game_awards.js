module.exports = (sequelize, DataTypes) => {
    return sequelize.define('game_awards', {
        game_round_id: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },
        name: DataTypes.STRING,   //the award name
        position: { type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' },  //the index who get the award when round is over
        prize_count:{ type: DataTypes.BIGINT(11), allowNull: false, defaultValue: '0' }, // prize count
        prize_name: DataTypes.STRING  //prize name
        /*end_at: DataTypes.DATE,
        desc: DataTypes.TEXT,
        award_desc: DataTypes.TEXT,
        duration: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        gear: { type: DataTypes.BIGINT(11), defaultValue: '0' },
        created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },*/
    })
}