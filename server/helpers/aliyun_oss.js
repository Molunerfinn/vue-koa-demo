
const config = require('../config/aliyun');
const path  = require('path')
const OSS = require('ali-oss');
//const moment = require('moment')
const client = new OSS({
  endpoint: config.ossEndpoint,
  accessKeyId: config.ossId,
  accessKeySecret: config.ossSecret,
  bucket:  config.ossBucket,
});

// Headers for Direct Upload
// https://help.aliyun.com/document_detail/31951.html
// headers["Date"] is required use x-oss-date instead
export function headers_for_direct_upload(key, content_type, checksum)
  let date = new Date().toUTCString()
  return {
    "Content-Type" => content_type,
    "Content-MD5" => checksum,
    "Authorization" => authorization(key, content_type, checksum, date),
    "x-oss-date" => date,
  }
end

function authorization(key, content_type, checksum, date){
  let bucketName =  config.ossBucket
  let filename = `/${bucketName}/${path_for(key)}`
  let addition_headers = "x-oss-date:#{date}"
  let sign = ["PUT", checksum, content_type, date, addition_headers, filename].join("\n")
  let signature = client.signatureUrl(sign)
  return "OSS " + config.ossId + ":" + signature

}

function endpoint(){
  return config.ossPath || "https://oss-cn-hangzhou.aliyuncs.com"
}


function path_for(key){
  let rootPath = config.ossPath
  let fullPath = key
  if( rootPath==null || rootPath == "/"){
    fullPath = key
  } else{
    fullPath = path.join(rootPath, key)
  }
  return fullPath
  // full_path.gsub(/^\//, "").gsub(/[\/]+/, "/")
}
