/**
 * 多页面支持
 * @File:
 * @Description: 多页面支持
 * @author qingyi xuelongqy@foxmail.com
 * @date 2017/6/15 10:16
 * @version V1.0
 */

var glob = require('glob');
var path = require('path')
var fs = require("fs")
var HtmlWebpackPlugin = require('html-webpack-plugin')

var moduleList=null          //缓存多页面模块列表
var moduleRootPath = './src/games' //模块根目录(这个可以根据自己的需求命名)

/**
 * 获取js入口数组
 */
exports.getEntries = function getEntries(){
  //缓存js入口数组
  var entries = {}
  //初始化模块列表
  this.getModuleList()
  //变量模块列表
  moduleList.forEach(function (module) {
    entries[module.moduleID] = module.moduleJS
  })
  console.log("*********************************** entries ***********************************")
  console.log(entries)
  return entries
}

/**
 * 获取多页面模块列表
 * @returns {模块的信息集合}
 */
exports.getModuleList = function getModuleList() {
  //判断是否为空，不为空则直接返回
  if (moduleList){
    return moduleList
  }else {//为空则读取列表
    moduleList = new Array();
    readDirSync(moduleRootPath )
    console.log("*********************************** moduleList ***********************************")
    console.log(moduleList)
    return moduleList
  }
}

/**
 * 获取dev的Html模板集合
 * @returns {dev的Html模板集合}
 */
exports.getDevHtmlWebpackPluginList = function getDevHtmlWebpackPluginList(){
  console.log("*********************************** devHtmlWebpackPluginList ***********************************")
  //缓存dev的Html模板集合
  var devHtmlWebpackPluginList = []
  //获取多页面模块集合
  var moduleList = this.getModuleList()
  //遍历生成模块的HTML模板
  moduleList.forEach(function (mod) {
    //生成配置
    var conf = {
      filename: mod.moduleID+".html",
      template: mod.moduleHTML,
      chunks: [mod.moduleID],
      inject: true
    }
    console.log(conf)
    //添加HtmlWebpackPlugin对象
    devHtmlWebpackPluginList.push(new HtmlWebpackPlugin(conf))
  })
  return devHtmlWebpackPluginList
}

/**
 * 获取prod的Html模板集合
 * @returns {prod的Html模板集合}
 */
exports.getProdHtmlWebpackPluginList = function getProdHtmlWebpackPluginList(){
  console.log("*********************************** prodHtmlWebpackPluginList ***********************************")
  //缓存dev的Html模板集合
  var prodHtmlWebpackPluginList = []
  //获取多页面模块集合
  var moduleList = this.getModuleList()
  //遍历生成模块的HTML模板
  moduleList.forEach(function (mod) {
    //生成配置
    var conf = {
      filename: mod.moduleID+".html",
      template: mod.moduleHTML,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      chunks: ['manifest','vendor',mod.moduleID]
    }
    console.log(conf)
    //添加HtmlWebpackPlugin对象
    prodHtmlWebpackPluginList.push(new HtmlWebpackPlugin(conf))
  })
  return prodHtmlWebpackPluginList
}

/**
 * 深度遍历目录，并整理多页面模块
 * @param path 需要变量的路径
 * @param moduleName 模块名称
 */
function readDirSync(path){

  glob.sync('./src/games/**/main.js').forEach(function(name){
      // src/games/yiy/main.js
      // src/games/yiy/index.html
      let ns = name.split('/')
      var id = ns[ns.length-2]
      ns[ns.length -1] = 'index.html'
      moduleList.push( { moduleID: id, moduleJS: name, moduleHTML:  ns.join('/') } )
  })

}
