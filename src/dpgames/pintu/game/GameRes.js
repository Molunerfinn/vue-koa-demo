import { gameSkinName } from '@/config/env'
const imageBase = '/static/dpgame/pintu/image'
const skinResRoot = '/static/dpgame/pintu/skin_'+ gameSkinName + '/image'

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
  "gameBgPath": skinResRoot + "/wx/gamebg.jpg",
  "homeBgPath": skinResRoot + "/wx/gamebg.jpg",
  "titleImg_path": skinResRoot + "/wx/titleimg.png",
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
  skinAssets: {
    gameStartImg : skinResRoot +'/wx/startbtn2.png',
    tipsImg : skinResRoot +'/wx/tipsbtn.png',
    gameImg : skinResRoot + '/wx/gameimg.jpg',
    logoImgPath: skinResRoot + "/wx/logo.png",
    shareImgPath: skinResRoot + "/wx/share.jpg",
    ruleIconPath: skinResRoot +'/wx/ruleicon.png',
    startImgPath: skinResRoot + "/wx/startbtn.png",
    gameBgPath: skinResRoot + "/wx/gamebg.jpg",
    homeBgPath: skinResRoot + "/wx/homebg.jpg",
    titleImgPath: skinResRoot + "/wx/titleimg.png",
  },
  "openAccessKey": false
}
export default GameRes
