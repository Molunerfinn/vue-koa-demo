import { gameSkinName } from '@/config/env'

const sharedBase = '/static/shared'
const imageBase = '/static/game/zxg/image'
const skinResRoot = '/static/game/zxg/skin_'+ gameSkinName + '/image'

const GameRes = {
    "loadingStyle": 1,
    "maxIncrement": 1,
    "isOpenAdvertise": false,
    "editPropList": [
    ],
    "editPropListDef": [
    ],
    "editPropListIsMod": false,
    "advertisingNum": 1,
    "gameImg": "/image/game/s_qmzxt.jpg",
    "openStrongAttention": false,
    "strongAttIMG": "",
    "logoImg_path": imageBase + "/logo.jpg",
    "startImg_path": skinResRoot + "/wx/startbtn.png",
    "gameBgPath": skinResRoot + "/wx/gamebg.jpg",
    "homeBgPath": skinResRoot + "/wx/homebg.jpg",
    "titleImg_path": skinResRoot + "/wx/titleimg.png",
    skinAssets: {
      logoImgPath: skinResRoot + "/wx/logo.png",
      shareImgPath: skinResRoot + "/wx/share.jpg",
      ruleIconPath: skinResRoot + "/wx/ruleicon.png",
      startImgPath: skinResRoot + "/wx/startbtn.png",
      gameBgPath: skinResRoot + "/wx/gamebg.jpg",
      homeBgPath: skinResRoot + "/wx/homebg.jpg",
      titleImgPath: skinResRoot + "/wx/titleimg.png",
      xg1: skinResRoot + "/wx/xg1.png",
      xg2: skinResRoot + "/wx/xg2.png",
      xg3: skinResRoot + "/wx/xg3.png",

    },
    "gameTimeNumDef": 10,
    "soundList": [
      {
        "path": skinResRoot + "/music/bgmusic05S.mp3",
        "fileName": "背景音乐.mp3",
        "optFlag": 0
    },
    {
        "path": sharedBase + "/music/tap.mp3",
        "fileName": "得分音效.mp3",
        "optFlag": 2
    },
    {
        "path": sharedBase + "/music/err.mp3",
        "fileName": "扣分音效.mp3",
        "optFlag": 2
    }],
    "soundListDef": [
      {
        "path": "*_resRoot*/image/qmzxt/bgmusic01M.mp3",
        "fileName": "背景音乐.mp3",
        "optFlag": 0
    },
    {
        "path": "*_resRoot*/image/qmzxt/tap.mp3",
        "fileName": "得分音效.mp3",
        "optFlag": 2
    },
    {
        "path": "*_resRoot*/image/qmzxt/err.mp3",
        "fileName": "扣分音效.mp3",
        "optFlag": 2
    }],
    "openAccessKey": false
}

export default GameRes
