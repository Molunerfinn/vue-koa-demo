// 使用 API 加载 示例数据
require('../env')
const {
  jwtSecret
} = require('../server/config/secret.js')
const fetch = require('node-fetch')
const path = require('path')
const jwt = require('jsonwebtoken')

const File = require('../server/lib/node-html5-file')

const {
  client, pathFor
} = require('../server/helpers/aliyun_oss')

const {
  ZTouPiaoGameRound, sequelize
} = require('../server/models')

const token = jwt.sign({
  id: 0,
  name: 'sample'
}, jwtSecret) // 签发token

const game_round_id = process.env.SAMPLE_GAME_ROUND_ID

let createPhotoUrl = 'http://127.0.0.1:8080/gapi/photos/ztoupiao/create'
let createAlbumUrl = 'http://127.0.0.1:8080/api/backend/albums/createAlbum'
// 创建 album数据
let image = path.join(__dirname, '/images/album/a.jpg')

let code = 'ztoupiao'
let file = new File(image);
let rand = parseInt(Math.random() * 1000);
console.log(" file = ", file)
//fields: ['openid', 'nickname', 'avatar', 'game_round_id']
// 创建 album
async function init() {

  for(let i=0; i<10; i++){
    // http://iph.href.lu/800x600
    image = path.join(__dirname, `/images/album/${i}.jpg`)
    file = new File(image);

    let album = await createAlbum();
    let photo = await createPhoto(album);

  }

  sequelize.close();
}

try{
  init()
}catch( e ){
  console.log( "exception:", e)
}

async function createAlbum() {

  //fields: ['openid', 'nickname', 'avatar', 'game_round_id']
  // 创建 album
  let player = {
    game_round_id: game_round_id,
    openid: 'admin',
    nickname: 'nickname' + rand,
    avator: "http://thirdwx.qlogo.cn/mmopen/Q3auHgzwzM48XyZokzOI6OnKKg2Kiahg6MfOa1hfQEBPs2zw2Rn1I7c2kYkHL9ZrVTk10w7haoibDbQd7VUWLmnYibccugZ0nFOobfibMucs7do/132"
  }
  let album = {
    name: "album name " + rand,
    desc: "album desc " + rand,
    game_round_id: game_round_id,
    type: "backend"
  }

  let newAlbum = await fetch(createAlbumUrl, {
    method: 'POST',
    body: JSON.stringify({
      player,
      album,
      code
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token

    }
  }).then(res => res.json());
  //let newAlbum = newAlbum.json()
  return newAlbum
}

let upload = 0;

async function createPhoto(album) {
  let round = await ZTouPiaoGameRound.findByPk( game_round_id )
  // 创建 photo
  let params = {
    number: round.number,
    viewable_type: 'photo',
    photo: {
      album_id: album.id,
      file_name: file.name,
      content_type: file.type,
      file_size: file.size
    }
  }

  let jsonRes = await fetch(createPhotoUrl, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())

  let path = `${pathFor(jsonRes.photo.okey )}`
  console.log( "path=", path)
  let result = await client.put(path, image);

  upload+=1
  console.log('upload=', upload, result)
}
