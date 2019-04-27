var path = require('path')
var utils = require('./utils')
var config = require('../config')
const Dotenv = require('dotenv-webpack');

var vueLoaderConfig = require('./vue-loader.conf')
var multipageHelper = require('./multipage-helper')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name]-[hash].js',
    publicPath: process.env.NODE_ENV === 'production' ?
      config.build.assetsPublicPath :
      config.dev.assetsPublicPath
  },
  plugins: [new Dotenv()],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      'swiper': 'swiper/dist/js/swiper.js',
      '$': resolve('src')+'/lib/jquery-3.4.0.slim.min.js'
    }
  },
  module: {
    rules: [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}


module.exports.entry = multipageHelper.getEntries()
