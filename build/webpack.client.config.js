const webpack = require('webpack')
const utils = require('./utils')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const HTMLPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const isProd = process.env.NODE_ENV === 'production'

let plugins = isProd ? [
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    comments: false,
    compress: {
      warnings: false,
      drop_console: true,
      collapse_vars: true,
      reduce_vars: true
    }
  }),
  new ExtractTextPlugin({
    filename: utils.assetsPath('css/[name].[hash:8].css')
  })
] : [
  new webpack.HotModuleReplacementPlugin(),
  new HTMLPlugin({
    filename: 'index.html',
    template: 'index.html'
  })
]

const config = merge(base, {
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),

    // 如果是开发模式开启全局的模块热替换(HMR)

    new webpack.NamedModulesPlugin(),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    ...plugins,
    new VueSSRClientPlugin()
  ]
})

module.exports = config
