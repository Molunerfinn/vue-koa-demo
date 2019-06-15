import { gameSkinName } from '@/config/env'

const sharedBase = '/static/shared'
const imageBase = '/static/game/jiaozi/image'
const skinResRoot = '/static/game/jiaozi/skin_'+ gameSkinName + '/image'

const GameRes = {
    "loadingStyle": 1,
    "maxIncrement": 1,
    "isOpenAdvertise": false,
    "editPropList": [
    ],
    "editPropListDef": [
      {
        "name": "robot",
        "pos": {
            "left": "2rem",
            "top": "11.25rem"
        },
        "size": {
            "width": "2.25rem",
            "height": "2.4rem"
        },
        "path": [skinResRoot + "/wx/robot.png"]
      },
      {
          "name": "zaw",
          "pos": {
              "left": "3.5rem",
              "top": "4.5rem"
          },
          "size": {
              "width": "2.35rem",
              "height": "2.1rem"
          },
          "path": [ skinResRoot + "/wx/zaw.png"]
      },
      {
        "name": "wp01",
        "pos": {
            "left": "4.6rem",
            "top": "21rem"
        },
        "size": {
            "width": "1.65rem",
            "height": "1.95rem"
        },
        "path": [ skinResRoot + "/wx/wp01.png"]
    },
    {
        "name": "wp02",
        "pos": {
            "left": "10rem",
            "top": "5rem"
        },
        "size": {
            "width": "1.5rem",
            "height": "1.9rem"
        },
        "path": [ skinResRoot + "/wx/wp02.png"]
    },
    {
        "name": "wp03",
        "pos": {
            "left": "10.8rem",
            "top": "16rem"
        },
        "size": {
            "width": "1.45rem",
            "height": "1.95rem"
        },
        "path": [ skinResRoot + "/wx/wp03.png"]
    },
    {
        "name": "wp04",
        "pos": {
            "left": "12.3rem",
            "top": "9rem"
        },
        "size": {
            "width": "1.55rem",
            "height": "2rem"
        },
        "path": [ skinResRoot + "/wx/wp04.png"]
    },
      {
          "name": "platform",
          "css": [{
              "opt": 1,
              "val": "rgb(255,157,11)",
              "defVal": "rgb(28, 182, 226)",
              "tra": 1,
              "defTra": 1
          },
          {
              "opt": 1,
              "val": "rgb(22,22,22)",
              "defVal": "rgb(0, 0, 0)",
              "tra": 1,
              "defTra": 1
          }]
      },
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
      robot: skinResRoot + "/wx/robot.png",
      zaw: skinResRoot + "/wx/zaw.png",
      wp01: skinResRoot + "/wx/wp01.png",
      wp02: skinResRoot + "/wx/wp02.png",
      wp03: skinResRoot + "/wx/wp03.png",
      wp04: skinResRoot + "/wx/wp04.png",
    },
    "gameTimeNumDef": 10,
    "soundList": [
      {
        "path": skinResRoot + "/music/bgmusic01M.mp3",
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
