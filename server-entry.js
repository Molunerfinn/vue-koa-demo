require('babel-core/register')({
  'presets': [
    ['env', {
      'targets': {
        'node': true
      }
    }]
  ]
})
require('./app.js')
