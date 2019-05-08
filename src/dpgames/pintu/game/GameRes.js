const skinResRoot="/static/dp-pintu/skin"

const GameRes = {
  "loadingStyle": 1,
  "maxIncrement": 0,
  "isOpenAdvertise": false,
  "editPropList": [
    {
      "name": "playInfo",
      "pos": {
        "left": "3.5rem",
        "top": "19rem"
      },
      "css": [{
          "css": [{
              "opt": 0,
              "val": 14,
              "defVal": 14
            },
            {
              "opt": 0,
              "val": "#DAD1EB",
              "defVal": "#DAD1EB",
              "tra": -1,
              "defTra": -1
            },
            {
              "opt": 0,
              "val": "",
              "defVal": "",
              "tra": -1,
              "defTra": -1
            }
          ],
          "opt": 0
        },
        {
          "css": [{
              "opt": 0,
              "val": 14,
              "defVal": 14
            },
            {
              "opt": 0,
              "val": "rgb(254, 194, 0)",
              "defVal": "rgb(254, 194, 0)",
              "tra": -1,
              "defTra": -1
            },
            {
              "opt": 0,
              "val": "",
              "defVal": "",
              "tra": -1,
              "defTra": -1
            }
          ],
          "opt": 0
        }
      ]
    },
    {
      "name": "theGetPricePic",
      "pos": {
        "left": "1.2rem",
        "top": "1.5rem"
      },
      "size": {
        "width": "13.5rem",
        "height": "16.75rem"
      },
      "path": [
        ["/static/dp-pintu/image/faiImg.png"]
      ]
    },
    {
      "name": "lotsPot",
      "pos": {
        "left": "4.9rem",
        "top": "3rem"
      },
      "size": {
        "width": "6.15rem",
        "height": "12.4rem"
      },
      "path": [
        ["/static/dp-pintu/image/lots1.png"]
      ]
    },
    {
      "name": "lotsShakeHand",
      "pos": {
        "left": "4.5rem",
        "top": "17.9rem"
      }
    },
    {
      "name": "advertising",
      "path": ["/static/dp-pintu/image/gg.jpg"]
    }
  ],
  "editPropListDef": [
    {
      "name": "playInfo",
      "pos": {
        "left": "3.5rem",
        "top": "19rem",
        "forParent": "false"
      },
      "css": [{
          "title": "常规文字",
          "opt": 0,
          "from": "#playInfo",
          "css": [{
              "type": "size",
              "name": "font-size",
              "val": 14,
              "defVal": 14,
              "opt": 0
            },
            {
              "type": "color",
              "name": "color",
              "defVal": "#DAD1EB",
              "val": "",
              "tra": -1,
              "defTra": -1,
              "opt": 0
            },
            {
              "type": "color",
              "name": "text-shadow",
              "val": "",
              "defVal": "",
              "tra": -1,
              "defTra": -1,
              "opt": 0
            }
          ]
        },
        {
          "title": "参与机会",
          "opt": 0,
          "from": "#playInfo .specil",
          "css": [{
              "type": "size",
              "name": "font-size",
              "val": 14,
              "defVal": 14,
              "opt": 0
            },
            {
              "type": "color",
              "name": "color",
              "val": "",
              "defVal": "rgb(254, 194, 0)",
              "tra": -1,
              "defTra": -1,
              "opt": 0
            },
            {
              "type": "color",
              "name": "text-shadow",
              "val": "",
              "defVal": "",
              "tra": -1,
              "defTra": -1,
              "opt": 0
            }
          ]
        }
      ],
      "edit": 3,
      "formDefaultStyle": true
    },
    {
      "name": "theGetPricePic",
      "pos": {
        "left": "2.1rem",
        "top": "1.3rem"
      },
      "size": {
        "width": "11.5rem",
        "height": "11.2rem"
      },
      "path": [
        ["*_resRoot*/image/faiImg1-2.png", "图片01", "5000k"]
      ],
      "edit": "theGetPricePic",
      "formDefaultStyle": true
    },
    {
      "name": "theGetPricePicTwo",
      "pos": {
        "left": "2.1rem",
        "top": "1.3rem"
      },
      "size": {
        "width": "11.5rem",
        "height": "11.2rem"
      },
      "path": [
        ["*_resRoot*/image/faiImg2-2.png", "图片01", "5000k"]
      ],
      "edit": "theGetPricePicTwo",
      "formDefaultStyle": true
    },
    {
      "name": "theGetPricePicThree",
      "pos": {
        "left": "2.1rem",
        "top": "1.3rem"
      },
      "size": {
        "width": "11.5rem",
        "height": "11.2rem"
      },
      "path": [
        ["*_resRoot*/image/faiImg3-2.png", "图片01", "5000k"]
      ],
      "edit": "theGetPricePicThree",
      "formDefaultStyle": true
    },
    {
      "name": "lotsPot",
      "pos": {
        "left": "4.925rem",
        "top": "3rem"
      },
      "size": {
        "width": "6.15rem",
        "height": "12.4rem"
      },
      "path": [
        ["*_resRoot*/image/lots1.png", "图片01", "5000k"]
      ],
      "edit": "lotsPot",
      "formDefaultStyle": true
    },
    {
      "name": "lotsShakeHand",
      "pos": {
        "left": "4.5rem",
        "top": "17.9rem",
        "forParent": "false"
      },
      "edit": "_none",
      "formDefaultStyle": true
    },
    {
      "name": "advertising",
      "targetName": "广告页设置",
      "deferPath": true,
      "group": "home",
      "rsize": {
        "width": "16rem",
        "height": "40rem"
      },
      "path": [
        ["*_resRoot*/image/gg.jpg", "背景图片", "5000k"],
        ["*_resRoot*/image/gg.jpg", "背景图片", "5000k"],
        ["*_resRoot*/image/gg.jpg", "背景图片", "5000k"],
        ["*_resRoot*/image/gg.jpg", "背景图片", "5000k"]
      ],
      "edit": "_background",
      "formDefaultStyle": true
    },
    {
      "name": "slogan",
      "pos": {
        "left": "0.17rem",
        "top": "0.17rem",
        "forParent": "false"
      },
      "css": [{
          "type": "size",
          "name": "font-size",
          "val": 12,
          "defVal": 12,
          "opt": 0
        },
        {
          "type": "color",
          "name": "color",
          "val": "#FFFFFF",
          "defVal": "#FFFFFF",
          "tra": 1,
          "defTra": 1,
          "opt": 0
        },
        {
          "type": "color",
          "name": "text-shadow",
          "val": "#FFFFFF",
          "defVal": "#FFFFFF",
          "tra": 0,
          "defTra": 0,
          "opt": 0
        }
      ],
      "edit": 2,
      "formDefaultStyle": true
    },
    {
      "name": "fissionDetailBg",
      "targetName": "编辑背景",
      "group": "fission",
      "rsize": {
        "width": "16rem",
        "height": "40rem"
      },
      "path": ["*_resRoot*/image/fission/myFissionBg.jpg", "背景图片", "5000k"],
      "cssEdit": 1,
      "css": [{
        "title": "背景颜色",
        "targetName": "背景颜色",
        "opt": 0,
        "css": [{
          "type": "color",
          "name": "background-color",
          "val": "#fff",
          "defVal": "#fff",
          "tra": 1,
          "defTra": 1,
          "opt": 0
        }]
      }],
      "edit": "_backgroundAll",
      "formDefaultStyle": true
    },
    {
      "name": "fissionShareBg",
      "targetName": "编辑背景",
      "group": "fission",
      "rsize": {
        "width": "16rem",
        "height": "40rem"
      },
      "path": ["*_resRoot*/image/fission/shareFissionBg.jpg", "背景图片", "5000k"],
      "edit": "_background",
      "formDefaultStyle": true
    },
    {
      "name": "fissionInviteBtn",
      "group": "fission",
      "rsize": {
        "width": "11.5rem",
        "height": "2rem"
      },
      "path": ["*_resRoot*/image/fission/inviteBtn.png", "邀请按钮", "5000k"],
      "edit": "fissionInviteBtn,fissionCheckBtn",
      "formDefaultStyle": true
    },
    {
      "name": "fissionCheckBtn",
      "group": "fission",
      "rsize": {
        "width": "11.5rem",
        "height": "2rem"
      },
      "path": [
        ["*_resRoot*/image/fission/seeAward_share.png", "查看按钮（裂变中）", "5000k"],
        ["*_resRoot*/image/fission/seeAward.png", "查看按钮（裂变完成）", "5000k"]
      ],
      "edit": "fissionInviteBtn,fissionCheckBtn",
      "formDefaultStyle": true
    },
    {
      "name": "fissionShareTxt",
      "pos": {
        "left": "2.3rem",
        "top": "6.65rem",
        "forParent": "false"
      },
      "css": [{
        "title": "常规文字",
        "opt": 0,
        "from": ".shareFissionTxt",
        "css": [{
            "type": "size",
            "name": "font-size",
            "val": 15,
            "defVal": 15,
            "opt": 0
          },
          {
            "type": "color",
            "name": "color",
            "val": "#8d2525",
            "defVal": "#8d2525",
            "tra": -1,
            "defTra": -1,
            "opt": 0
          },
          {
            "type": "color",
            "name": "text-shadow",
            "val": "#fff",
            "defVal": "#fff",
            "tra": 0,
            "defTra": 0,
            "opt": 0
          }
        ]
      }],
      "formDefaultStyle": true
    },
    {
      "name": "fissionShareName",
      "pos": {
        "left": "2.3rem",
        "top": "8.5rem",
        "forParent": "false"
      },
      "css": [{
        "title": "常规文字",
        "opt": 0,
        "from": ".shareFissionName",
        "css": [{
            "type": "size",
            "name": "font-size",
            "val": 24,
            "defVal": 24,
            "opt": 0
          },
          {
            "type": "color",
            "name": "color",
            "val": "#ff4f48",
            "defVal": "#ff4f48",
            "tra": -1,
            "defTra": -1,
            "opt": 0
          },
          {
            "type": "color",
            "name": "text-shadow",
            "val": "#fff",
            "defVal": "#fff",
            "tra": 0,
            "defTra": 0,
            "opt": 0
          }
        ]
      }],
      "formDefaultStyle": true
    },
    {
      "name": "fissionShareBtn",
      "group": "fission",
      "size": {
        "width": "9rem",
        "height": "2.75rem"
      },
      "pos": {
        "left": "3.5rem",
        "top": "10.25rem"
      },
      "path": [
        ["*_resRoot*/image/fission/get.png", "领取按钮", "5000k"],
        ["*_resRoot*/image/fission/backIndex.png", "返回首页", "5000k"]
      ],
      "edit": "fissionShareBtn",
      "formDefaultStyle": true
    }
  ],
  "editPropListIsMod": false,
  "advertisingNum": 1,
  "gameImg": "/image/game/s_ptdzz.jpg",
  "openStrongAttention": false,
  "strongAttIMG": "",
  "logoImg_path": "/static/dp-pintu/image/logo.jpg",
  "startImg_path": "/static/dp-pintu/skin/image/startbtn.png",
  "gameBgPath": "/static/dp-pintu/skin/image/gamebg.jpg",
  "homeBgPath": "/static/dp-pintu/skin/image/gamebg.jpg",
  "titleImg_path": "/static/dp-pintu/skin/image/title.png",
  "gameTimeNumDef": 0,
  "soundList": [{
    "path": "/static/dp-pintu/image/ptdzz/bgmusic04H.mp3",
    "fileName": "背景音乐.mp3",
    "optFlag": 0
  }],
  "soundListDef": [{
    "path": "*_resRoot*/image/ptdzz/bgmusic04H.mp3",
    "fileName": "背景音乐.mp3",
    "optFlag": 0
  }],
  skinAssets: {
    gameStartImg : skinResRoot+'/image/startbtn2.png',
    tipsImg : skinResRoot+'/image/tipsbtn.png',
    gameImg : skinResRoot+'/image/gameimg.jpg',
  },
  "openAccessKey": false
}
export default GameRes
