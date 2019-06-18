import { gameSkinName } from '@/config/env'
const skinResRoot = '/static/game/kouhong/skin_'+ gameSkinName + '/image'
const sharedBase = '/static/shared'

const GameRes = {
  "loadingStyle": 1,
  "maxIncrement": 10,
  "isOpenAdvertise": false,
  "editPropList": [],
  "editPropListDef": [  {
    "name": "ySugar",
    "rsize": {
      "width": "6rem",
      "height": "6rem"
    },
    "path": [skinResRoot + "/wx/ySugar.png", "黄色糖", "5000k"],
    "edit": "all"
  }, {
    "name": "club",
    "path": [skinResRoot + "/wx/club.png", "支架", "5000k"],
    "edit": "all",
    "size": {
      "width": "1rem",
      "height": "3.625rem"
    },
    "pos": {
      "left": "0.25rem",
      "top": "3rem"
    }
  } ],
  "editPropListIsMod": false,
  "advertisingNum": 1,
  "gameImg": "/image/game/s_bbtzw.jpg",
  "openStrongAttention": false,
  "strongAttIMG": "",
  "logoImg_path": skinResRoot + "/wx/logo.png",
  "startImg_path":  skinResRoot + "/wx/startbtn.png",
  "gameBgPath": skinResRoot + "/wx/gamebg.jpg",
  "homeBgPath": skinResRoot + "/wx/homebg.jpg",
  "titleImg_path": skinResRoot + "/wx/titleimg.png",
  "gameTimeNumDef": 10,
  "soundList": [{
    "path": sharedBase + "/music/bgmusic01M.mp3",
    "fileName": "背景音乐.mp3",
    "optFlag": 0
  }, {
    "path":  sharedBase + "/music/tap.mp3",
    "fileName": "得分音效.mp3",
    "optFlag": 2
  }, {
    "path":  sharedBase + "/music/err.mp3",
    "fileName": "错误音效.mp3",
    "optFlag": 2
  }],
  "soundListDef": [{
    "path": sharedBase + "/music/bgmusic01M.mp3",
    "fileName": "背景音乐.mp3",
    "optFlag": 0
  }, {
    "path":  sharedBase + "/music/tap.mp3",
    "fileName": "得分音效.mp3",
    "optFlag": 2
  }, {
    "path":  sharedBase + "/music/err.mp3",
    "fileName": "错误音效.mp3",
    "optFlag": 2
  }],
  skinAssets: {
    logoImgPath: skinResRoot + "/wx/logo.png",
    shareImgPath: skinResRoot + "/wx/share.jpg",
    ruleIconPath: skinResRoot + "/wx/ruleicon.png",
    startImgPath: skinResRoot + "/wx/startbtn.png",
    gameBgPath: skinResRoot + "/wx/gamebg.jpg",
    homeBgPath: skinResRoot + "/wx/homebg.jpg",
    titleImgPath: skinResRoot + "/wx/titleimg.png",
    tishiImgPath: skinResRoot + "/wx/tishi.png",
  },
  "openAccessKey": false
}
export default GameRes
