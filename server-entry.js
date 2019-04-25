require('babel-core/register')({
  'presets': [
    ['env', {
      'targets': {
        'node': true
      }
    }]
  ]
})
require('./env')
require('./server/app.js')
