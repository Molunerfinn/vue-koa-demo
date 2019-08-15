// 使用 API 加载 示例数据
require('../env')
const fetch = require('node-fetch')
const path = require('path')
const File = require('../server/lib/node-html5-file')
const {
  client
} = require('../server/helpers/aliyun_oss')
const number = '1b6f5289-b467-11e9-9a15-f0def15e0395'
let url = 'http://127.0.0.1:8080/gapi/photos/ztoupiao/create'
// 创建 album数据
let image = path.join(__dirname, '/images/album/a.jpg')
console.log(" image = ", image)

let file = new File(image);

console.log(" file = ", file)
let params = {
  number,
  viewable_type: 'photo',
  photo: {
    "file_name": file.name,
    "content_type": file.type,
    "file_size": file.size
  }
}
fetch(url, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
  .then(async (json) => {
    console.log(json)
    let photo = json.photo
    let result = await client.put(photo.okey, image);
    console.log('result=', result)

  });
