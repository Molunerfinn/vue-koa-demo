import { gameSkinName } from '@/config/env'

const sharedBase = '/static/shared'
const imageBase = '/static/game/ztoupiao/images'
const skinResRoot = '/static/game/ztoupiao/skin_'+ gameSkinName

const GameRes = {
    "loadingStyle": 1,
    "maxIncrement": 1,
    "isOpenAdvertise": false,
    "editPropList": [
    ],
    "editPropListDef": [{
        "name": "xg1",
        "pos": {
            "left": "1rem",
            "top": "12rem",
            "disable": "disable"
        },
        "size": {
            "width": "2.75rem",
            "height": "4.5rem"
        },
        "path": [[ skinResRoot + "/wx/xg1.png", "游戏角色01", "5000k"], [skinResRoot + "/wx/xg1c.png", "游戏角色02", "5000k"]],
        "edit": "all"
    },
    {
        "name": "xg2",
        "pos": {
            "left": "12.25rem",
            "top": "12rem",
            "disable": "disable"
        },
        "size": {
            "width": "2.75rem",
            "height": "4.5rem"
        },
        "path": [[skinResRoot + "/wx/xg2.png", "游戏角色03", "5000k"], [ skinResRoot + "/wx/xg2c.png", "游戏角色04", "5000k"]],
        "edit": "all"
    },
    {
        "name": "xg3",
        "pos": {
            "left": "3rem",
            "top": "2rem",
            "disable": "disable"
        },
        "size": {
            "width": "8.5rem",
            "height": "13.5rem"
        },
        "path": [[skinResRoot + "/wx/xg3.png", "游戏角色05", "5000k"], [skinResRoot + "/wx/xg3c.png", "游戏角色06", "5000k"]],
        "edit": "all"
    }
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
      reviewImgPath: skinResRoot + "/images/poster1.jpg",
      photographsImgPath: skinResRoot + "/images/poster2.jpg",
      workstop1ImgPath: skinResRoot + "/images/workstop1.jpg",
      reviewDesc1ImgPath: skinResRoot + "/images/trace_1.jpg",
      reviewDesc2ImgPath: skinResRoot + "/images/trace_2.jpg",
      reviewDesc3ImgPath: skinResRoot + "/images/trace_3.jpg",
      reviewDesc4ImgPath: skinResRoot + "/images/trace_4.jpg"
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
