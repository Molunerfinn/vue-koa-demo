import { gameSkinName } from '@/config/env'
const imageBase = '/static/dpgame/yiy/image'
const skinResRoot = '/static/dpgame/yiy/skin_'+ gameSkinName + '/image'

const GameRes = {
  "loadingStyle": 1,
  "maxIncrement": 0,
  "isOpenAdvertise": false,
  "editPropList": [],
  "editPropListDef": [],
  "editPropListIsMod": false,
  "advertisingNum": 1,
  "gameImg": "/image/game/s_ptdzz.jpg",
  "openStrongAttention": false,
  "strongAttIMG": "",
  "logoImg_path": imageBase +"/logo.jpg",
  "startImg_path": skinResRoot + "/wx/startbtn.png",
  "gameTimeNumDef": 0,
  "soundList": [{
    "path": skinResRoot + "/wx/music/bgmusic04H.mp3",
    "fileName": "背景音乐.mp3",
    "optFlag": 0
  }],
  "soundListDef": [{
    "path": skinResRoot + "/wx/music/bgmusic04H.mp3",
    "fileName": "背景音乐.mp3",
    "optFlag": 0
  }],
  "openAccessKey": false
}
export default GameRes
