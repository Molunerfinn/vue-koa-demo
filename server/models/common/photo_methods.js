const {
  client, pathFor
} = require('../../helpers/aliyun_oss')

const {
  generateUniqueSecureToken
}  = require('./helper')

function bindPhotoMethods( db ){
  let models = Object.values(db)
  models.forEach((model)=>{
    let rex = /([\w]+)Photo$/
    if( rex.test(model.name)){
      addHooks( model )
    }
  })
}



function addHooks( model ){
  model.addHook( 'beforeCreate', 'generatePhotoOkey', (instance, options) => {
      instance.okey =  generateUniqueSecureToken()
  })
  model.addHook( 'beforeDestroy', 'removeOssObject', async (instance, options) => {
    let path = pathFor( instance.okey )

    let result = await client.delete(path);
    console.log( "path,result=", path, result )
    // 图片删除以后，删除Oss上文件，删除所有关系
  })

}
module.exports = {
  bindPhotoMethods
}
