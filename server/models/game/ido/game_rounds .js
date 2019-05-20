var moment = require('moment')
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('IdoGameRound', {
    game_id: DataTypes.BIGINT(11),
    name: DataTypes.STRING,
    creator_id: DataTypes.BIGINT(11),
    start_at: {
      type: DataTypes.DATE,
      validate: {
        compare_with_end_at: function(value) {
          var end_at = this.end_at
          if (end_at != null) {
            if (end_at < value) {
              console.log('open_atmust less-than close_at');
              throw new Error('open_atmust less-than close_at')
            }
          }
        }
      }
    },
    end_at: {
      type: DataTypes.DATE,
      validate: {
        compare_with_start_at: function(value) {
          var start_at = this.start_at
          if (start_at != null) {
            if (start_at > value) {
              console.log('start_at must less-than end_at');
              throw new Error('start_at must less-than end_at')
            }
          }
        }
      }
    },
    campaign_id: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    preferences: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    desc: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    award_desc: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    wx_keyword: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    },
    contact_required: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    awards: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    award_counts: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    display_players: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    duration: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    gear: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    countdown: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    aasm_state: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    play_times: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    close_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        compare_with_open_at: function(value) {
          var open_at = this.open_at
          if (open_at != null) {
            if (open_at > value) {
              console.log('open_at must less-than close_at');
              throw new Error('open_at must less-than close_at')
            }
          }
        }
      }
    },
    open_at: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        compare_with_close_at: function(value) {
          var close_at = this.close_at
          if (close_at != null) {
            if (close_at < value) {
              console.log('open_at must less-than close_at');
              throw new Error('open_at must less-than close_at')
            }
          }
        }
      }
    },
    award_times: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ido'
    },
    screen_style: {
      type: DataTypes.BIGINT(11),
      allowNull: false,
      defaultValue: '0'
    },
    cache_free_at: {
      type: DataTypes.DATE,
      // defaultValue: ''
    },
    appid: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    company_id: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    relative_game_round_id: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    host_name: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    team1_id: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    team2_id: {
      type: DataTypes.BIGINT(11),
      defaultValue: '0'
    },
    match_start_at: {
      type: DataTypes.DATE,
      // defaultValue: ''
    },
    match_end_at: {
      type: DataTypes.DATE,
      // defaultValue: ''
    },
    default_store_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: '0'
    },
  }, {
    tableName: 'ido_game_rounds',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {}
  })
}
