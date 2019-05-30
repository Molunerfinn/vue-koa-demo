/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = ''
let baseImageUrl = ''
let gameSkinName = process.env.GAME_SKIN_NAME || 'default'
console.log( 'gameSkinName', gameSkinName )
export  {
    baseUrl,
    baseImageUrl,
    gameSkinName
}
