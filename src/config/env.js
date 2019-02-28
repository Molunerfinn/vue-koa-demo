/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = ''
let routerMode = 'history'
let baseImgPath = ''
let baseImageUrl = ''
if (process.env.NODE_ENV == 'development') {
    baseUrl = 'http://localhost:8080'
    //baseImgPath = 'http://localhost:3001'

} else {
  baseUrl = 'http://localhost:8080'
}

export {
    baseUrl,
    routerMode,
    baseImgPath,
    baseImageUrl,
}
