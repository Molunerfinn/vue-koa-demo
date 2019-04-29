/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
 let host =  process.env.GAME_HOST || 'localhost'
 let port =  process.env.GAME_HOST_PORT || '8080'
let baseUrl = ''
let routerMode = 'history'
let baseImgPath = ''
let baseImageUrl = ''
if (process.env.NODE_ENV == 'development') {
  console.log( "host=",host, 'process.env.GAME_HOST', process.env.GAME_HOST, 'process.env.NODE_ENV', process.env.NODE_ENV)
  baseUrl = `http://${host}:${port}`
} else {
  baseUrl = `http://${host}:${port}`
}
console.log( "baseUrl=",baseUrl)

export {
    baseUrl,
    routerMode,
    baseImgPath,
    baseImageUrl,
}
