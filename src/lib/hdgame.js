import {
  LWebAudio2,
  LMedia2,
  LSound2
} from '@/lib/simplify'

//import {  EventBus } from '@/lib/EventBus'
import _ from 'lodash'
import HdUtil from './hdutil'

import wx from 'weixin-js-sdk'
import {
  btoa
} from 'base64'
//const g_rem = 20
import UA from './hdgame/ua'
import Img from './hdgame/img'
import Log from './hdgame/log'
import Grade from './hdgame/grade'
import Time from './hdgame/time'

const HdGame = {}
const arrPro = Array.prototype
const isReady = true
const _resRoot = '/static/kouhong'
const g_config = {
  initTime: 10,
  HWRatio: 1.608,
  drawType: 0,
  headImg: '/static/kouhong/image/manImg.jpg'
}
const g_rem = window.g_rem;

function parseRemToPx(rem) {
  if (rem.indexOf('rem') === -1) {
    return parseFloat(rem);
  }
  return parseFloat(rem) * g_rem;
}

// function parsePxToRem(px) {
//   if (px.indexOf('px') === -1) {
//     return px;
//   }
//   return parseFloat(px) / g_rem + 'rem';
// }

// 添加log功能，tlog, tlogErr 下面会调用
Object.keys(Log).forEach(function(key) {
  let fn = Log[key]

  HdGame[key] = function(logFlag, logStr, isErr) {
    if (HdGame.IsPC()) {
      return
    }
    if (arguments.length <= 1) {
      logStr = logFlag;
      logFlag = "###"
    }
    if (HdGame.getType(logStr) === "object" || HdGame.getType(logStr) === "array") {
      logStr = JSON.stringify(logStr)
    } else {
      logStr = String(logStr)
    }
    fn.call(HdGame, logFlag, logStr, isErr)
  }
});


// 游戏开始前需要加载的js，主要是加载图片，音乐等资源
HdGame.initJsHead = function(hg, _data) {
  hg.assets = (function() {
    var eventBus = new HdUtil.CallBack(function() {
      return true
    });
    let groups = [],
      FIRST_NAME = "home",
      DEF_NAME = "other";
    let assets = {
      startTime: 0,
      complete: false,
      loadComplete: false,
      increment: _data.maxIncrement,
      getGroup: function(name) {
        for (let i = 0,
            n = groups.length; i < n; i++) {
          let group = groups[i];
          if (group.name === name) {
            return group
          }
        }
      },
      addGroup: function(conf) {
        conf = Object.assign({
            name: DEF_NAME,
            path: [],
            priority: 100,
          },
          conf);
        if (conf.priority <= 0 && conf.name !== FIRST_NAME) {
          console.warn("priority err");
          return this
        }
        if (this.getGroup(conf.name)) {
          console.warn("the group has existed");
          return this
        }
        if (groups.length < 2) {
          groups.push(conf);
          return this
        }
        for (let i = groups.length - 1; i >= 0; i--) {
          let group = groups[i];
          if (conf.priority >= group.priority) {
            groups.splice(i + 1, 0, conf);
            break
          }
        }
        return this
      },
      add: function(name, src) {
        if (this.complete) {
          return
        }
        if (arguments.length === 1) {
          src = arguments[0];
          name = DEF_NAME
        }
        let group = this.getGroup(name || DEF_NAME);
        if (!group) {
          console.warn("add name err");
          return this
        }
        if (Array.isArray(src)) {
          arrPro.push.apply(group.path, src)
        } else {
          group.path.push(src)
        }
        return this
      },
      // 支持 ready  reday_assets, ready_*
      onReady: function(name, fn) {
        let _this = this;
        if (arguments.length === 1) {
          eventBus.on("ready", arguments[0])
        } else {
          if (arguments.length === 2) {
            if (Array.isArray(name)) {
              let callBack = _.throttle(fn, name.length);
              name.forEach(
                function(src, i) {
                  eventBus.on("ready_" + src, callBack)
                })
            } else {
              if (typeof(name) === "string") {
                eventBus.on("ready_" + name, fn)
              }
            }
          }
        }
        return _this
      },
      onload: function(fn) {
        eventBus.on("load", fn);
        return this
      },
      loadPage: function() {

        let _this = this;
        _this.startTime = Date.now();
        console.log(" loadStart 0 groups", groups);
        (function loadStart(groupLoaded) {
          let group = groups[groupLoaded];
          loadimg(group.path,
            function() {
              eventBus.fire("ready_" + group.name, group);
              if (++groupLoaded < groups.length) {
                loadStart(groupLoaded)
              } else {
                _this.complete = true;
                console.log("eventBus.fire(ready)")
                eventBus.fire("ready")
              }
              if (group.name === FIRST_NAME) {
                console.log("home is loaded!");
                checkOtherLoaded()
              }
            })
        })(0);

        function loadimg(arr, callBack) {
          let hasLoaded = 0;
          if (arr.length === 0) {
            callBack && callBack();
            return
          }
          for (let i = 0,
              n = arr.length; i < n; i++) {
            let img = new Image();
            img.onload = loadCheckComplete;
            img.onerror = loadCheckComplete;
            setTimeout(_.bind(loadCheckComplete, img), 4000);
            img.src = img.assets_key = arr[i];
            console.log("img.src= ", img.src)
            _this[arr[i]] = img
          }

          function loadCheckComplete() {
            // this 是当前这个图片
            if (this.assets_complete) {
              return
            }
            this.assets_complete = true;
            if (this.assets_key) {
              eventBus.fire("ready_" + this.assets_key, this)
            } else {
              console.log(this, "assets_key is undefined!")
            }
            if (++hasLoaded === arr.length) {
              callBack && callBack()
            }
          }
        }

        function loadEnd() {
          _this.loadComplete = true;
          // let bgHeight = HdGame.getBgHeight();
          // if (!HdGame.nootNeedFixHeight) {
          //   $("#homeBgBox,.gameBgBox").css("height", bgHeight / g_rem + "rem")
          // }
           let onEnd = function() {
             eventBus.fire("load");
          //   if (bgHeight > $(window).height()) {
          //     $("#bottomSkill").css("top", (bgHeight - $(".bottomSkill").outerHeight()) / g_rem + "rem")
          //   }
           };
           typeof window.preloadEnd != undefined ? window.preloadEnd(onEnd) : onEnd()

        }

        function checkOtherLoaded() {
          setTimeout(function() {
              //假设已经DOM加载成功
              if (isReady) {
                console.log("dom is ready!");
                //if (!g_config.test && g_config.isForbidShareactivity  ) {
                //  wx.ready(loadEnd)
                //} else {
                loadEnd()
                //}
                return
              }
              checkOtherLoaded()
            },
            100)
        }
      }
    };
    assets.addGroup({
      name: FIRST_NAME,
      priority: 0,
    }).addGroup({
      name: DEF_NAME
    });
    return assets
  })();

  // 定义资源
  (function() {
    hg.edit = {};
    let origin = _data.editPropList;
    let originDef = _data.editPropListDef;
    let originMod = _data.editModPropList;
    hg.edit.isMod = _data.editPropListIsMod;

    var correctPaths = function(pathDef, path) {
      if (!path || !pathDef || !_.isArray(pathDef[0])) {
        return
      }
      if (!_.isArray(path[0])) {
        path[0] = [path[0]];
        path.length = 1
      }
      if (pathDef.length > path.length) {
        pathDef.forEach(function(defv, i) {
          if (i >= path.length) {
            path.push(defv)
          }
        })
      }
    };

    for (var i = 0; i < originDef.length; i++) {
      var path = origin[i].path;
      var pathDef = originDef[i].path;
      var pathMod = originMod ? originMod[i].path : null;
      var notDeferPath = !originDef[i].deferPath;
      var isAdvertising = origin[i].name == "advertising";
      correctPaths(pathDef, pathMod);
      correctPaths(pathDef, path);
      pathDef = pathMod || pathDef;
      if (pathDef) {
        if (!path) {
          origin[i].path = path = pathDef
        }
        if (_.isArray(path[0])) {
          for (var j = 0; j < pathDef.length; j++) {
            if (!path[j]) {
              path[j] = pathDef[j]
            }
            if (!path[j][0]) {
              path[j][0] = pathDef[j][0]
            }
            notDeferPath && hg.assets.add(originDef[i].group, path[j][0].replace("*_resRoot*", _resRoot))
          }
        } else {
          if (!path[0]) {
            path[0] = pathDef[0]
          }
          if (!isAdvertising && notDeferPath || (isAdvertising && _data.isOpenAdvertise)) {
            hg.assets.add(originDef[i].group, path[0].replace(/\*_resRoot\*/g, _resRoot))
          }
        }
      }

    }


    hg.edit = {
      origin: origin,
      originDef: originDef,
      originMod: originMod,
      isMod: _data.editPropListIsMod
    }
  })();

  // 加载资源
  (function() {
    let assetsImage = [_data.logoImg_path, _resRoot + "/image/ruleImg.png", _resRoot + "/image/success.png", _resRoot + "/image/light.png", _resRoot + "/image/musicOff.png", _resRoot + "/image/musicOn.png", g_config.headImg];
    //if (g_config.drawType != 0) {
    //  assetsImage.push(_data.startImg_path, _data.gameBgPath, _resRoot + "/image/lots1.png", _resRoot + "/image/lots2.png")
    //}
    hg.assets.add(assetsImage);
    hg.assets.add("home", [_data.homeBgPath, _data.titleImg_path]);
    hg.assets.add(_resRoot + "/image/bbtzw/tishi.png");

    hg.assets.loadPage();
    assetsImage = null
  })();

  HdGame.initCallBack(hg, ["startGame", "beforeStartGame", "startGamehead", "home", "again", "jsFootEnd", "showResult", "changeBottomBar", "showPoup", "hidePoup", "timeChange", "beforeDraw", "updateRankList", "afterDraw", "editBackground", "luckDrawErr", "scrollEvent", "beforeStartGiftEvent"]);
  //hg.register(["setGameType", "hpInit", "hgLoadEnd", "save", "changeShow", "showTabByStyle", "changeAwardNum", "changeAwardImg", "changeContactImg", "isLimit", "changeTopBar", "advertisingSetting", "bannerNumberChange", "questionNumSet"]);

  HdGame.initEdit(hg.edit)

  hg.sound = HdGame.initSound(_data.soundList, _data.soundListDef, _data.soundListMod);

}

HdGame.initEdit = function(Edit) {
  console.log(" doing init edit =", Edit);
  let origin = Edit.origin
  let originDef = Edit.originDef
  // originMod = Edit.originMod,
  // elemRegx = /\b(editTarget|editRelate)(-\w+?)(-\d+?)?\b/,
  // templateRegx = /{{(.*?)}}/g,
  let cache = {};

  function getImgInfo(name, isRem) {
    console.log("getImgInfo=", name)
    let key = "getImgInfo-" + name;
    if (isRem) {
      key = "getImgInfo-rem-" + name
    }
    let obj = cache[key];
    if (obj) {
      return obj
    }
    let tem = getInfoByName(name)[0];
    if (!tem) {
      return
    }
    obj = {
      name: name,
      css: tem.css
    };
    if (tem.path) {
      if (HdGame.getType(tem.path[0]) === "array") {
        obj.path = [];
        for (let q = 0; q < tem.path.length; q++) {
          obj.path[q] = HdGame.getSrc(tem.path[q][0])
        }
      } else {
        obj.path = HdGame.getSrc(tem.path[0])
      }
    }
    let parseUnit = isRem ? parseFloat : parseRemToPx;
    let handles = {
      size: ["width", "height"],
      pos: ["left", "top"]
    };
    for (let key in handles) {
      let key2 = handles[key];
      let val = tem[key];
      if (!val) {
        continue
      }
      if (HdGame.getType(val) === "array") {
        obj[key2[0]] = [],
          obj[key2[1]] = [];
        val.forEach(function(item, index) {
          obj[key2[0]].push(parseUnit(item[key2[0]]));
          obj[key2[1]].push(parseUnit(item[key2[1]]))
        })
      } else {
        obj[key2[0]] = parseUnit(val[key2[0]]);
        obj[key2[1]] = parseUnit(val[key2[1]])
      }
    }
    cache[key] = obj;
    return obj
  }

  function getInfoByName(name) {
    for (let i = 0; i < origin.length; i++) {
      let tem = origin[i];
      if (tem.name === name) {
        return [tem, originDef[i]]
      }
    }
    return [false, false]
  }
  // function setCssVal(from, item, isDef) {
  //   let val = isDef ? item.defVal: item.val;
  //   let tra = isDef ? item.defTra: item.tra;
  //   if (!val) {
  //     return
  //   }
  //   if (item.from) {
  //     from = $(item.from)
  //   }
  //   if (item.type !== "color") {
  //     if (item.name === "font-size" && !isNaN(Number(val))) {
  //       from.css(item.name, (val / 20) + "rem")
  //     } else {
  //       from.css(item.name, val)
  //     }
  //   } else {
  //     val = HextoRgb(val);
  //     if (item.name === "text-shadow") {
  //       from.css(item.name, getTextShadow(getRgba(val, tra)))
  //     } else {
  //       from.css(item.name, getRgba(val, tra))
  //     }
  //   }
  // }
  // function HextoRgb(hex) {
  //   hex = $.trim(hex);
  //   if (/^#[0-9a-fA-f]{3}$/.test(hex)) {
  //     let hexNew = "#";
  //     for (let i = 1; i < 4; i += 1) {
  //       let c = hex.slice(i, i + 1);
  //       hexNew += c + c
  //     }
  //     hex = hexNew
  //   }
  //   if (!/^#[0-9a-fA-f]{6}$/.test(hex)) {
  //     return hex
  //   }
  //   hex = parseInt(hex.substring(1), 16);
  //   let rgb = ["rgb(", hex >> 16, ",", (hex & 65280) >> 8, ",", (hex & 255), ")"];
  //   return rgb.join("")
  // }
  // function getTextShadow(color) {
  //   return color + " -1px -1px 0px, " + color + " 0px -1px 0px, " + color + " 1px -1px 0px, " + color + " 1px 0px 0px, " + color + " 1px 1px 0px, " + color + " 0px 1px 0px, " + color + " -1px 1px 0px, " + color + " -1px 0px 0px"
  // }
  // function getRgba(rgb, a) {
  //   if (typeof a === "undefined" || a == -1) {
  //     return rgb
  //   }
  //   return "rgba" + rgb.substring(rgb.indexOf("("), rgb.indexOf(")")) + "," + (a ? a: 0) + ")"
  // }
  // function getEditInfo(from, list, info, index) {
  //   let arg = {};
  //   arg.from = from;
  //   arg.title = list[1];
  //   arg.limit = list[2];
  //   arg.defSrc = HdGame.getSrc(list[0]);
  //   let showPath = info.showPath[index];
  //   if (typeof showPath == "number" && showPath >= 0) {
  //     arg.showPath = info.showPath;
  //     arg.showPathIndex = index
  //   }
  //   if (list[3]) {
  //     arg.defSize = list[3]
  //   }
  //   return arg
  // }
  // function getVal(list, index, listDef) {
  //   let val = list;
  //   if ($.isArray(list)) {
  //     if (typeof index == "undefined") {
  //       index = 0
  //     }
  //     let val = list[index];
  //     if (val === undefined) {
  //       val = listDef === undefined ? list[0] : getVal(listDef, index)
  //     }
  //   } else {
  //     if (val === undefined && listDef !== undefined) {
  //       val = listDef
  //     }
  //   }
  //   return val
  // }
  // function getVariablePath(tem, temDef, index) {
  //   if (!temDef.letiablePath) {
  //     return
  //   }
  //   temDef.letiablePath.val;
  //   if (path.length > index) {
  //     path[index]
  //   }
  //   let location = {
  //     index: index,
  //     index2: Fai.pad(index, 2)
  //   };
  //   $.each(path,
  //   function(i, val) {
  //     path[i] = val.replace(templateRegx,
  //     function($, $1) {
  //       return (new Function("s", $1))(location)
  //     })
  //   });
  //   return path
  // }
  // function setEditByName(info, editTarget, elemIndex) {
  //   let tem = info[0],
  //   temDef = info[1],
  //   isOne = elemIndex !== undefined;
  //   if (!editTarget) {
  //     editTarget = $(".editTarget-" + tem.name)
  //   }
  //   initModuleLayer(tem, temDef, editTarget.not(function() {
  //     return $(this).data("hasBindEdit")
  //   }));
  //   let isSyncResize = (HdGame.getType(temDef.pos) === "array" && HdGame.getType(temDef.size) !== "array");
  //   let bindSizePos = function(index, elem) {
  //     let $elem = $(elem);
  //     if ($elem.data("hasBindEdit")) {
  //       return
  //     }
  //     let EsizeDef = getVal(temDef.size, index),
  //     EposDef = getVal(temDef.pos, index),
  //     Esize = getVal(tem.size, index, temDef.size),
  //     Epos = getVal(tem.pos, index, temDef.pos);
  //     if (Esize && EsizeDef) {
  //       $elem.addClass("slaveImg");
  //       if (!$elem.parents().hasClass("imgContainer")) {
  //         $elem.wrap('<div class="imgContainer absCenter"></div>')
  //       }
  //       $elem.parent(".imgContainer").css("height", 0);
  //       if (!EsizeDef.disable) {
  //         if (isSyncResize) {
  //           let $target = null;
  //           $elem.addResizableFn("start",
  //           function(event, ui) {
  //             $target = $(".editTarget-" + tem.name).not(this);
  //             if (/n|w/.test(ui.axis) && !EsizeDef.noSyncOffset) {
  //               $target.each(function(i, el) {
  //                 let self = $(this),
  //                 parent = self.parents(".ui-wrapper");
  //                 self.data("originalPosition-relative", {
  //                   left: parseFloat(parent.css("left")) - ui.originalPosition.left,
  //                   top: parseFloat(parent.css("top")) - ui.originalPosition.top,
  //                 })
  //               })
  //             }
  //           });
  //           $elem.addResizableFn("resize",
  //           function(event, ui) {
  //             $target.add($target.parents(".ui-wrapper")).css({
  //               width: $(ui.element).width(),
  //               height: $(ui.element).height()
  //             });
  //             if (/n|w/.test(ui.axis) && !EsizeDef.noSyncOffset) {
  //               $target.each(function(i, el) {
  //                 let self = $(this);
  //                 let relative = self.data("originalPosition-relative");
  //                 self.add(self.parents(".ui-wrapper")).css({
  //                   left: ui.position.left + relative.left,
  //                   top: ui.position.top + relative.top
  //                 })
  //               })
  //             }
  //           });
  //           $elem.addResizableFn("stop",
  //           function(event, ui) {
  //             if (!EsizeDef.noSyncOffset) {
  //               $target.each(function(i, el) {
  //                 $(this).removeData("originalPosition-relative").attr("resize", "1")
  //               })
  //             }
  //             $target = null
  //           })
  //         }
  //         let defData = {
  //           width: EsizeDef.width,
  //           height: EsizeDef.height
  //         };
  //         if (EposDef && EposDef.disable) {
  //           defData.left = EposDef.left;
  //           defData.top = EposDef.top
  //         }
  //         HdGame.moduleSlaveImgResize($elem, defData);
  //         if (isSyncResize) {
  //           $elem.addResizableFn("recover",
  //           function() {
  //             let wrapper = $(this).parents(".ui-wrapper");
  //             $(".editTarget-" + tem.name).each(function(i, el) {
  //               if (el === $elem[0]) {
  //                 return
  //               }
  //               let rTarget = $(el).add($(el).parents(".ui-wrapper"));
  //               rTarget.width(wrapper.width()).height(wrapper.height());
  //               let otherPosDef = getVal(temDef.pos, i);
  //               if (otherPosDef && otherPosDef.disable) {
  //                 rTarget.css({
  //                   left: otherPosDef.left,
  //                   top: otherPosDef.top
  //                 })
  //               }
  //               rTarget.attr("resize", 0)
  //             })
  //           })
  //         }
  //       }
  //     }
  //     if (Epos && EposDef && !EposDef.disable) {
  //       let forParent = EposDef.forParent != "false" ? true: false;
  //       let containment = EposDef.containment;
  //       if (forParent && !$elem.parents().hasClass("imgContainer")) {
  //         $elem.wrap('<div class="imgContainer absCenter"></div>')
  //       }
  //       HdGame.moduleDraggale($elem, forParent, containment)
  //     }
  //   };
  //   isOne ? bindSizePos(elemIndex, editTarget) : editTarget.each(bindSizePos);
  //   editTarget.data("hasBindEdit", true)
  // }
  // function isBackground(editStr) {
  //   return /^_background/.test(editStr)
  // }
  // function initModuleLayer(tem, temDef, editTarget) {
  //   let tabFalg = -2,
  //   editInfoList = null,
  //   cssFlag = false,
  //   cssArg = null,
  //   editTargetName = temDef.targetName || true,
  //   box = "editTarget-" + tem.name;
  //   if (!temDef._initModuleLayerArgs) {
  //     if (temDef.css || temDef.cssAll) {
  //       if (temDef.cssAll) {
  //         cssArg = [];
  //         $.each(temDef.cssAll,
  //         function(index, item) {
  //           if (getInfoByName(item)[1].css) {
  //             cssArg = cssArg.concat(getInfoByName(item)[1].crrCssArg)
  //           }
  //         })
  //       } else {
  //         cssArg = temDef.crrCssArg
  //       }
  //       cssFlag = !cssArg[0].targetName ? true: cssArg[0].targetName;
  //       if (temDef.cssEdit == 1 && temDef.edit !== "_backgroundAll") {
  //         let theArg = cssArg;
  //         $$(function() {
  //           parent.Edit.addEditBtn(cssArg[0].targetName || "编辑背景", "." + box,
  //           function() {
  //             parent.Edit.Css.showCssByGame.call($("." + box), "." + box, theArg, theArg[0].targetName);
  //             parent.operateFlagList[21] = true;
  //             HdGame.logPhoneDog(5);
  //             return false
  //           })
  //         });
  //         cssFlag = false,
  //         cssArg = null
  //       }
  //     }
  //     if (temDef.edit !== undefined) {
  //       if (typeof temDef.edit === "number") {
  //         tabFalg = temDef.edit
  //       } else {
  //         if (isBackground(temDef.edit)) { ! Edit.bgList && (Edit.bgList = []);
  //           let bgObject = null;
  //           let isMultiPath = $.isArray(temDef.path[0]);
  //           let isAdvertising = temDef.name === "advertising";
  //           let editName = temDef.name;
  //           let form = temDef.from || ".editTarget-" + editName + ",.editRelate-" + editName;
  //           if (isMultiPath) {
  //             bgObject = {};
  //             bgObject.paths = [];
  //             for (let index = 0; index < 4; index++) {
  //               let path = temDef.path[index] || temDef.path[0];
  //               if (index > 0) {
  //                 form = ".editTarget-" + editName + "-" + index + ",.editRelate-" + editName + "-" + index
  //               }
  //               bgObject.paths.push(getEditInfo(form, path, tem, index))
  //             }
  //           } else {
  //             bgObject = getEditInfo(form, temDef.path, tem, 0)
  //           }
  //           bgObject._flag = -1;
  //           if (temDef.edit === "_backgroundAll" && cssArg) {
  //             bgObject._cssArg = cssArg;
  //             bgObject._flag = -5;
  //             cssFlag = false,
  //             cssArg = null
  //           }
  //           if (isAdvertising) {
  //             bgObject._flag = -7
  //           }
  //           if (editTarget.closest(".home,.gameBgBox,.gameBgBox2").length > 0 && $.inArray(g_config.style, [49, 67, 69, 71, 75, 77, 87]) == -1) {
  //             Edit.bgList.push(bgObject)
  //           } else {
  //             let defaultProp = {
  //               title: "背景图片",
  //               size: "640px*1600px",
  //               limit: "5000k",
  //               defSize: "640px*1600px",
  //             };
  //             let imgArgs = [$.extend({},
  //             bgObject, defaultProp)];
  //             if (isMultiPath) {
  //               imgArgs = bgObject.paths.map(function(bg) {
  //                 return $.extend({},
  //                 bg, bgObject, defaultProp)
  //               })
  //             }
  //             $$(function() {
  //               let editBtnSelector = ".editTarget-" + tem.name;
  //               if (isAdvertising) {
  //                 editBtnSelector = ".advertisingBox"
  //               }
  //               HdGame.saveModuleLayerImg(imgArgs);
  //               parent.Edit.addEditBtn(temDef.targetName || "编辑背景", editBtnSelector,
  //               function() {
  //                 hg.fire("editBackground", bgObject, true);
  //                 parent.Edit.showEditByGame(bgObject._flag, "", imgArgs);
  //                 return false
  //               })
  //             })
  //           }
  //           editTarget.data("hasBindEdit", true);
  //           return
  //         } else {
  //           if (temDef.edit !== "_none") {
  //             editInfoList = [];
  //             if (cache["edit-" + temDef.edit]) {
  //               editInfoList = cache["edit-" + temDef.edit]
  //             } else {
  //               let editOrigin = [];
  //               if (temDef.edit === "all") {
  //                 $.each(Edit.originDef,
  //                 function(index, val) {
  //                   if (!val.formDefaultStyle && !isBackground(val.edit)) {
  //                     editOrigin.push([Edit.origin[index], val])
  //                   }
  //                 })
  //               } else {
  //                 $.each(temDef.edit.split(","),
  //                 function(index, val) {
  //                   editOrigin.push(getInfoByName(val))
  //                 })
  //               }
  //               $.each(editOrigin,
  //               function(i, val) {
  //                 let pathDefs = val[1].path;
  //                 let editName = val[1].name;
  //                 let form = ".editTarget-" + editName + ",.editRelate-" + editName;
  //                 if (typeof pathDefs != "undefined") {
  //                   if (HdGame.getType(pathDefs[0]) === "array") {
  //                     $.each(pathDefs,
  //                     function(k, pathDef) {
  //                       k > 0 && (form = ".editTarget-" + editName + "-" + k + ",.editRelate-" + editName + "-" + k);
  //                       editInfoList.push(getEditInfo(form, pathDef, val[0], k))
  //                     })
  //                   } else {
  //                     editInfoList.push(getEditInfo(form, pathDefs, val[0], 0))
  //                   }
  //                 }
  //               }); ! cache["edit-" + temDef.edit] && (cache["edit-" + temDef.edit] = editInfoList)
  //             }
  //             tabFalg = -1
  //           } else {
  //             editTargetName = false
  //           }
  //         }
  //       }
  //     } else {
  //       editTargetName = false
  //     }
  //     if (temDef.text) {
  //       editTargetName = !temDef.text[0].targetName ? true: temDef.text[0].targetName;
  //       tem.text = $.extend(true, [], temDef.text, tem.text);
  //       if (temDef.text[0].type == 1) {
  //         editTargetName = false
  //       }
  //       if (tem.text.filter(function(item) {
  //         return item.type == 2
  //       }).length > 0) {
  //         tabFalg = 0;
  //         box = function() {
  //           EditWrite.call(this, tem.text, temDef.text, tem.name)
  //         }
  //       }
  //     }
  //     if (temDef.textarea) {
  //       tabFalg = "showEditTextareaPoup"
  //     }
  //     if (temDef.textContent) {
  //       tabFalg = "showEditTextContentPoup"
  //     }
  //     if (temDef.swiperConfig) {
  //       if (g_config.useSwiperBanner) {
  //         tabFalg = -8
  //       }
  //     }
  //     if ((temDef.name === "banner" || temDef.name === "banner1" || temDef.name === "banner2" || temDef.name === "homeBanner" || temDef.name === "detailBanner") && !g_config.useSwiperBanner) {
  //       editInfoList = editInfoList.slice(0, 1);
  //       editInfoList[0].title = editInfoList[0].title.replace(/01/, "")
  //     }
  //     temDef._initModuleLayerArgs = [tabFalg, box, editInfoList, cssFlag, cssArg, editTargetName]
  //   }
  //   if (temDef.edit !== undefined || temDef._initModuleLayerArgs[4]) {
  //     editTarget.hdTrigger("hd-editUpload-initModuleLayer", [temDef]);
  //     HdGame.initModuleLayer.apply(HdGame, [editTarget].concat(temDef._initModuleLayerArgs))
  //   }
  // }
  // function EditWrite(textArg, textArgDef, name) {
  //   let _this = this;
  //   parent.Edit.editPoup.show({
  //     className: "editText",
  //     title: textArgDef[0].allTitel || "编辑内容",
  //     info: function(infoBox, poup, win) {
  //       $.each(textArg,
  //       function(index, editW) {
  //         if (editW.type != 2) {
  //           return
  //         }
  //         let editWDef = textArgDef[index];
  //         let title = (editWDef.title || "文字内容") + "：";
  //         let content = editW.val;
  //         let remark = editWDef.remark || "";
  //         let uploadLine = '<div class="editLine">';
  //         if (editW.shouInput) {
  //           uploadLine += addAnswerLineInput(title, content)
  //         } else {
  //           uploadLine += addAnswerLine(title, content, index, editW.txtopt)
  //         }
  //         uploadLine += "</div>";
  //         uploadLine = poup.$(uploadLine);
  //         infoBox.append(uploadLine);
  //         let limit = editWDef.numLimit;
  //         if (HdGame.getType(limit) != "array") {
  //           editWDef.numLimit = limit = [0, limit]
  //         }
  //         if (!editWDef.from) {
  //           editWDef.from = ".editTarget-" + name + ",.editRelate-" + name
  //         }
  //         let from = $(editWDef.from);
  //         let inputName = uploadLine.find(".newTextArea .activeInput");
  //         inputName.on("blur.text",
  //         function() {
  //           let val = $(this).val();
  //           if ($.trim(val).length < (limit[0] + 1)) {
  //             $(this).addClass("inputErr");
  //             $(this).parent().find(".editErr").show().text("输入的文字不可少于" + (limit[0] + 1) + "个！");
  //             from.text(editW.val)
  //           }
  //         }).on("focus.text",
  //         function() {
  //           $(this).removeClass("inputErr").siblings(".editErr,.editErr2").hide()
  //         }).on("keyup.text",
  //         function() {
  //           let obj = {};
  //           obj.str = $(this).val();
  //           obj.str = obj.str.substr(0, limit[1]);
  //           obj.len = $.trim($(this).val()).length;
  //           if (obj.len > limit[1]) {
  //             $(this).val(obj.str)
  //           }
  //           $(this).trigger("text-beforeSave", [obj, editW, editWDef]);
  //           if (obj.len > limit[0] && (limit[1] === undefined || obj.len <= limit[1])) {
  //             editW.val = obj.str;
  //             from.text(editW.val)
  //           }
  //         }).on("input.text",
  //         function() {
  //           parent.changeIsSave()
  //         });
  //         if (editW.txtopt) {
  //           inputName.show().val(editW.val)
  //         } else {
  //           inputName.hide()
  //         }
  //         if (!editW.shouInput) {
  //           uploadLine.find("#editWriteDef_" + index + "").on("click",
  //           function() {
  //             if (editW.txtopt == 1) {
  //               parent.changeIsSave()
  //             }
  //             editW.txtopt = 0;
  //             from.text(editWDef.val);
  //             inputName.hide().removeClass("inputErr").val(editWDef.val);
  //             inputName.siblings(".editErr,.editErr2").hide()
  //           });
  //           uploadLine.find("#editWriteSelf_" + index + "").on("click",
  //           function() {
  //             if (editW.txtopt == 0) {
  //               parent.changeIsSave()
  //             }
  //             editW.txtopt = 1;
  //             inputName.show().val(editW.val);
  //             from.text(editW.val)
  //           })
  //         }
  //       });
  //       $(_this).hdTrigger("hd-editUpload-textEdit", [poup, textArg, textArgDef]);
  //       function addAnswerLineInput(title, answer) {
  //         return '<div class="answerLine clearfix"><div class="floatLeft newTextT" style="width: 70px; margin-top: 7px" >' + title + '</div><div style="width: 320px;" class="floatLeft"><div class="newTextArea"><input type="text" class="input scrollBox activeInput" style="width: 300px;height: 32px; padding-left: 5px;" value="' + HdGame.encodeHtml(answer) + '" ' + (isPublish ? "disabled": "") + '><div style="color:#888; padding-top: 5px;">确认发布后无法修改，请认真输入！</div><div class="editErr hide" style="color: red;margin-top: 10px;">输入文字不能为空</div><div class="editErr2 hide" style="color: red; margin-top: 10px; display: none;">输入仅限中文字母跟数字</div></div></div></div>'
  //       }
  //       function addAnswerLine(title, answer, index, flag) {
  //         let val = HdGame.encodeHtml(answer);
  //         let two = flag ? "checked": "";
  //         let one = flag ? "": "checked";
  //         return '<div class="answerLine clearfix"><div class="floatLeft newTextT" style="width: 100px;">' + title + '</div><div class="floatLeft" style="width: 320px;"><div><input id="editWriteDef_' + index + '" type="radio" name="theRealOnly_' + index + '"' + one + '><label for="editWriteDef_' + index + '" style="height: 16px;line-height: 16px;">默认</label><input id="editWriteSelf_' + index + '" type="radio" name="theRealOnly_' + index + '"' + two + '><label for="editWriteSelf_' + index + '" style="height: 16px;line-height: 16px;">自定义</label></div><div class="newTextArea" style="margin-top: 12px;"><textarea class="input scrollBox activeInput" style="width:300px;height:100px;padding:5px;margin-top:7px;">' + val + '</textarea><div class="editErr hide" style="color: red;margin-top: 10px;">输入文字不可少于10个！</div><div class="editErr2 hide" style="color: red; margin-top: 10px; display: none;">输入仅限中文</div></div></div></div>'
  //       }
  //     },
  //   });
  //   return false
  // }
  // function setEdit(editTarget, index) {
  //   parseEditTarget(editTarget,
  //   function(infos) {
  //     index === undefined && (index = 0);
  //     initItem(infos[0], infos[1], editTarget, index);
  //   })
  // }
  // function parseEditTarget(editTarget, callback) {
  //   if (editTarget.length == 0) {
  //     return
  //   }
  //   let matchs = editTarget.attr("class").match(elemRegx),
  //   infos;
  //   if (matchs) {
  //     infos = getInfoByName(matchs[2].slice(1));
  //     if (infos[0] && infos[1]) {
  //       callback && callback(infos)
  //     }
  //   }
  // }
  function initEdit() {
    origin.forEach(function(tem, index) {
      console.log("initItem: ", tem)
      //initItem(tem, originDef[index], $(".editTarget-" + tem.name))
    })
  }
  // function initByElem(editTarget, index) {
  //   parseEditTarget(editTarget,
  //   function(infos) {
  //     index === undefined && (index = 0);
  //     initItem(infos[0], infos[1], editTarget, index)
  //   })
  // }
  // function initItem(tem, temDef, editTarget, index) {
  //   let isOne = index !== undefined,
  //   allEditSelecter = ".editTarget-" + tem.name + ",.editRelate-" + tem.name,
  //   matchs, relateClass, onePathIndex, getOldSrc, setOff, setPath, setCss;
  //   if (isOne && editTarget.length == 0) {
  //     return false
  //   }
  //   if (isBackground(temDef.edit)) {
  //     temDef.from ? $(temDef.from).addClass("hd-Special-bgImgInfo") : editTarget.addClass("hd-Special-bgImgInfo")
  //   }
  //   setOff = function(el) {
  //     let set = function(i, elem) {
  //       let Epos = getVal(tem.pos, i, temDef.pos),
  //       Esize = getVal(tem.size, i, temDef.size);
  //       if (temDef.pos && Epos && Epos.top && Epos.left) {
  //         $(elem).css({
  //           top: Epos.top,
  //           left: Epos.left
  //         }).addClass("abs")
  //       }
  //       if (temDef.size && Esize && Esize.width && Esize.height) {
  //         $(elem).css({
  //           width: Esize.width,
  //           height: Esize.height
  //         })
  //       }
  //     };
  //     isOne ? set(index, el) : el.each(set)
  //   };
  //   setOff(editTarget);
  //   if (tem.path) {
  //     getOldSrc = function(oldEditTarget, defSrc) {
  //       let src;
  //       oldEditTarget = oldEditTarget.not(editTarget);
  //       if (oldEditTarget.length > 0 && !oldEditTarget.is(editTarget)) {
  //         src = HdGame.getJqSrc(oldEditTarget)
  //       }
  //       return src || defSrc || ""
  //     };
  //     relateClass = ".editRelate-" + tem.name;
  //     setPath = function(targetElem, src, i) {
  //       if (targetElem.length == 0) {
  //         return
  //       }
  //       if ((tem.showPath[i] === 0)) {
  //         targetElem.attr("edit_store_src", src);
  //         return
  //       }
  //       if (temDef.deferPath && !_manage) {
  //         targetElem.attr("edit_defer_src", src)
  //       } else {
  //         setJqSrc(targetElem, src)
  //       }
  //     };
  //     temDef.from && (editTarget = $(temDef.from));
  //     if (HdGame.getType(tem.path[0]) === "array") {
  //       if (isOne) {
  //         matchs = editTarget.attr("class").match(elemRegx);
  //         if (matchs && matchs[2] == "-" + tem.name) {
  //           matchs[3] && (onePathIndex = parseInt(matchs[3].slice(1)));
  //           let src = getOldSrc($(".editTarget-" + tem.name + (isNaN(onePathIndex) ? "": "-" + onePathIndex)));
  //           isNaN(onePathIndex) && (onePathIndex = 0); ! src && (src = HdGame.getSrc(tem.path[onePathIndex][0]));
  //           setPath(editTarget, src, onePathIndex)
  //         }
  //       } else {
  //         $.each(tem.path,
  //         function(i, val) {
  //           let src = HdGame.getSrc(val[0]);
  //           let editClass = "editTarget-" + tem.name;
  //           let targetElem = editTarget;
  //           if (i !== 0) {
  //             editClass = "editTarget-" + tem.name + "-" + i;
  //             relateClass = ".editRelate-" + tem.name + "-" + i;
  //             targetElem = $("." + editClass)
  //           }
  //           if (targetElem.length == 0) {
  //             if (_manage && getAutoGenState(temDef)) {
  //               $("body").append('<input class="' + editClass + '" type="hidden" value="' + src + '">')
  //             }
  //           } else {
  //             i !== 0 && setOff(targetElem)
  //           }
  //           setPath(targetElem.add(relateClass), src, i)
  //         })
  //       }
  //     } else {
  //       if (isOne) {
  //         setPath(editTarget, getOldSrc($(".editTarget-" + tem.name), HdGame.getSrc(tem.path[0])), 0)
  //       } else {
  //         setPath(editTarget.add(relateClass), HdGame.getSrc(tem.path[0]), 0)
  //       }
  //     }
  //   }
  //   if (tem.css) {
  //     setCss = function(selecter, item, isDef) {
  //       let cssTarget;
  //       if (isOne) {
  //         if (!editTarget.is(selecter)) {
  //           return
  //         }
  //         cssTarget = editTarget
  //       } else {
  //         cssTarget = $(selecter)
  //       }
  //       setCssVal(cssTarget, item, isDef)
  //     };
  //     $.extend(true, temDef.css, tem.css);
  //     $.each(temDef.css,
  //     function(i, item) {
  //       if (!item.from) {
  //         item.from = allEditSelecter
  //       }
  //       if (item.css) {
  //         $.each(item.css,
  //         function(i, css) {
  //           if (!css.from) {
  //             css.from = item.from
  //           }
  //           setCss(css.from, css, css.opt === 0)
  //         })
  //       } else {
  //         setCss(item.from, item, item.opt === 0)
  //       }
  //     })
  //   }
  //   if (tem.text) {
  //     $.each(tem.text,
  //     function(i, item) {
  //       if (temDef.text) {}
  //       let defText = temDef.text;
  //       if (!defText) {
  //         return
  //       }
  //       let itemDef = defText[i],
  //       textTarget;
  //       if (!itemDef) {
  //         return
  //       } ! itemDef.from && (itemDef.from = allEditSelecter);
  //       if (isOne) {
  //         if (!editTarget.is(itemDef.from)) {
  //           return
  //         }
  //         textTarget = editTarget
  //       } else {
  //         textTarget = $(itemDef.from)
  //       }
  //       if (itemDef.type == 2) {
  //         let theRealVal = Fai.encodeHtml(item.txtopt ? item.val: itemDef.val);
  //         textTarget.html(theRealVal)
  //       } else {
  //         textTarget.val(item.value)
  //       }
  //     })
  //   }
  //   if (tem.textarea) {
  //     initTextareaItem(tem, temDef)
  //   }
  //   if (tem.textContent) {
  //     initTextContentItem(tem, temDef)
  //   }
  //   return true
  // }
  // function getAutoGenState(template) {
  //   return ! template.notAutoGeneration
  // }
  // function initTextareaItem(template, templateDefault) {
  //   let textareaConfigs = $.extend(true, [], templateDefault.textarea, template.textarea);
  //   let autoGen = getAutoGenState(templateDefault);
  //   let findTarget = function(name) {
  //     let selector = ".editTarget-{{name}},.editRelate-{{name}}".replace(/{{name}}/g, name);
  //     let target = $(selector);
  //     if (!target.length && _manage && autoGen) {
  //       target = $('<div style="display: none;" class="hideImpl editTarget-' + name + '"></div>');
  //       $("body").append(target)
  //     }
  //     return target
  //   };
  //   let findTextarea = function(target) {
  //     let textarea = target.find(".editTextarea");
  //     if (!textarea.length) {
  //       textarea = $('<textarea class="editTextarea" readonly="readonly"></textarea>');
  //       target.append(textarea)
  //     }
  //     return textarea
  //   };
  //   let findTextareaMask = function(target) {
  //     if (target.css("position") === "static") {
  //       target.css("position", "relative")
  //     }
  //     let mask = target.find(".editTextareaMask");
  //     if (!mask.length) {
  //       mask = $('<div class="editTextareaMask"></div>');
  //       target.append(mask)
  //     }
  //     return mask
  //   };
  //   textareaConfigs.forEach(function(textareaConfig, index) {
  //     let name = (index > 0) ? (templateDefault.name + "-" + index) : templateDefault.name;
  //     let target = findTarget(name);
  //     let textarea = findTextarea(target);
  //     findTextareaMask(target);
  //     let value = textareaConfig.value;
  //     target.data(templateDefault.name, textareaConfigs);
  //     textarea.val(value).trigger("contentChange", value)
  //   })
  // }
  // function initTextContentItem(template, templateDefault) {
  //   let textContentConfigs = $.extend(true, [], templateDefault.textContent, template.textContent);
  //   let autoGen = getAutoGenState(templateDefault);
  //   let findTarget = function(name) {
  //     let selector = ".editTarget-{{name}},.editRelate-{{name}}".replace(/{{name}}/g, name);
  //     let target = $(selector);
  //     if (!target.length && _manage && autoGen) {
  //       target = $('<div style="display: none;" class="hideImpl editTarget-' + name + '"></div>');
  //       $("body").append(target)
  //     }
  //     return target
  //   };
  //   textContentConfigs.forEach(function(textareaConfig, index) {
  //     let name = (index > 0) ? (templateDefault.name + "-" + index) : templateDefault.name;
  //     let target = findTarget(name);
  //     target.css({
  //       "white-space": "pre-wrap"
  //     });
  //     let value = textareaConfig.value;
  //     target.data(templateDefault.name, textContentConfigs);
  //     target.text(value).trigger("contentChange", value)
  //   })
  // }

  Edit.hasInitEle = true;
  initEdit()

  //  Edit.setEdit = setEdit;
  Edit.getImgInfo = getImgInfo;
  //  Edit.getInfoByName = getInfoByName;
  //  Edit.getRgba = getRgba;
  Edit.initEdit = initEdit;
  //  Edit.initByElem = initByElem;
  Edit.cache = cache;
  // Edit.setJqSrc = setJqSrc;
  delete Edit.originMod;
  return Edit
};

HdGame.initCallBack = function(target, arg) {
  var callBackObj = new HdUtil.CallBack();
  target = target || {};
  console.log("callBackObj=", callBackObj)
  callBackObj.getApiKeys().forEach(
    function(key, i) {
      target[key] = function() {
        var rt = callBackObj[key].apply(callBackObj, arguments);
        return rt === callBackObj ? this : rt
      }
    });
  if (HdGame.getType(arg) == "array") {
    callBackObj.register(arg)
  }
  return target
};


HdGame.getBgHeight = function() {
  return Math.max((window).innerWidth * g_config.HWRatio, (window).innerHeight)
};

HdGame.getType = function(obj) {
  return Object.prototype.toString.call(obj).match(/\[object\s(\w+)]/)[1].toLowerCase()
};

HdGame.getSrc = function(src) {
  return src.replace("*_resRoot*", _resRoot)
};

HdGame.getPosAndSize = function(theObj, def, type) {
  !type && (type = HdGame.Img.MODE_SCALE_DEFLATE_FILL);
  console.log(` type=${type}, theObj=${theObj.width}:${theObj.width}, def=${def.width}:${def.height},`)
  var sizeInfo = HdGame.Img.calcSize(theObj.width, theObj.height, def.width, def.height, type, true);
  var defLeft = def.left || 0;
  var defTop = def.top || 0;
  return Object.assign(sizeInfo, {
    left: (def.width - sizeInfo.width) / 2 + defLeft,
    top: (def.height - sizeInfo.height) / 2 + defTop,
  })
};
// HdGame.showLoadToast = function(text) {
//   $("#loadingToast .weui-toast__content").text(text);
//   $("#loadingToast").removeClass("hide");
//   return++uid
// };
//
// HdGame.hideLoadToast = function(id) {
//   if (id !== undefined && id !== uid) {
//     return
//   }
//   $("#loadingToast").addClass("hide")
// }
HdGame.initSound = function(soundList, soundListDef, soundListMod) {

  if (soundList && soundListDef) {
    soundList.forEach(
      function(s, index) {
        var soundDef = soundListDef[index];
        if (index !== 0 && s.optFlag === 1) {
          s.optFlag = 2
        }
        s.path = HdGame.getSrc(s.path);
        soundDef.path = HdGame.getSrc(soundDef.path)
      })
  }
  var cache = {};
  var supportWebAudio = LSound2.webAudioEnabled;
  var sound = {
    list: soundList,
    listDef: soundListDef,
    allowPlay: true,
    setPlayPower: function(key, power) {
      if (typeof key == "boolean") {
        this.allowPlay = key
      }
      this.get(key,
        function(lsound) {
          lsound._allowPlay = power
        });
      return this
    },
    play: function(key, c, l) {
      if (!this.allowPlay) {
        return this
      }
      HdGame.tlog('play', "play0 key "+key)

      if (soundList && HdGame.getType(key) === "number") {
        var flag = key === 0 ? 1 : 3;
        if (soundList[key].optFlag === flag) {
          return this
        }
      }
      HdGame.tlog('play', "play1 key "+key)

      if (key !== 0 && soundList && soundList[0].optFlag !== 1 && !supportWebAudio) {
        return this
      }
      this.get(key,
        function(lsound) {
          if (!lsound._allowPlay) {
            return
          }
          if (lsound.isWebAudio && lsound.isOnec && lsound.playing) {
            return
          }
          var isChange = !lsound.playing;
          lsound.play(c, l);
          if (lsound.isWebAudio) {
            isChange && lsound.fire("play", lsound)
          } else {
            if (!lsound.playing && wx.checkJsApi) {
              wx.checkJsApi({
                jsApiList: ["checkJsApi"],
                success: function() {
                  lsound.play(c, l)
                }
              })
            }
          }
        });
      return this
    },
    readyPlay: function(key, c, l) {

      this.get(key,
        function(lsound) {
          var self = this;
          if (!lsound.isWebAudio) {
            self.play(key, c, l)
          }
          self.onReady(key,
            function() {
              if (lsound.isWebAudio || !lsound.playing) {
                self.play(key, c, l);
                HdGame.tlog("sound_play2:" + key + "|" + lsound.playing)
              }
            })
        });
      return this
    },
    pause: function(key) {

      this.get(key,
        function(lsound) {
          var isChange = lsound.playing;
          lsound.stop();
          if (isChange && lsound.isWebAudio) {
            lsound.fire("pause", lsound)
          }
        });
      return this
    },
    pauseAll: function() {

      var key;
      for (key in cache) {
        this.pause(key)
      }
      return this
    },
    load: function(path, key, webAudioEnabled, isOnec) {
      if (cache[key]) {
        HdGame.tlog("Sound_load_err", "这个key:" + key + " 已经存在!");
        return this
      }
      var lsound = null,
        useWebAudio = supportWebAudio;
      typeof webAudioEnabled === "boolean" && (useWebAudio = webAudioEnabled);
      if (/.wav$/.test(path) && HdGame.isIPhone()) {
        useWebAudio = false
      }
      //HdGame.tlog("useWebAudio=" + useWebAudio + ",key=" + key);
      if (useWebAudio) {
        lsound = new LWebAudio2();
        lsound.isWebAudio = true
      } else {
        lsound = new LMedia2();
        try {
          lsound.data = new Audio()
        } catch (e) {
          console.warn("ReferenceError: Can't find variable: Audio");
          lsound.data = {}
        }
        lsound.data.loop = false;
        lsound.data.autoplay = false
      }
      HdGame.tlog("lsound1", "useWebAudio"+useWebAudio+path);
      lsound.register([["ready", true], "play", "pause"]);

      if (!useWebAudio) {
        lsound.data.addEventListener("play",
          function() {
            lsound.playing = true;
            lsound.fire("play", lsound)
          },
          false);
        lsound.data.addEventListener("pause",
          function() {
            lsound.playing = false;
            lsound.fire("pause", lsound)
          },
          false)
      }
      lsound.isOnec = !!isOnec;
      lsound._type = "audio";
      if (path) {
        HdGame.tlog("load", key + path);
        lsound.load(path)
      }
      lsound.on("complete",
        function(event) {
          lsound.complete = true;
          lsound.fire("ready", lsound);
          HdGame.tlog("sound", key + " ready" + path)
        });
      lsound._allowPlay = true;
      lsound.name = key;
      cache[key] = lsound;
      return this
    },
    onReady: function(key, callBack) {

      this.get(key,
        function(lsound) {
          if (lsound.complete) {
            callBack(lsound)
          } else {
            lsound.on("ready", callBack)
          }
        });
      return this
    },
    setVolume: function(key, volume) {

      this.get(key,
        function(lsound) {
          if (lsound.isWebAudio) {
            lsound.volume = volume
          } else {
            lsound.data.volume = volume
          }
        });
      return this
    },
    get: function(key, callBack) {
      var lsound = cache[key];
      if (!lsound) {
        HdGame.tlog("sound_get_err", "这个key:" + key + " 不存在!")
      } else {
        callBack && callBack.call(this, lsound)
      }
      return lsound
    },
    cache: cache,
  };
  sound.load(_resRoot + "/image/button.mp3", "startButton");
  if (soundList) {
    soundList.forEach(
      function(s, index) {
        var path = s.path;
        if (index === 0) {
          var useWebAudio = false;
          var UA = HdGame.UA;
          if (UA.isWX() && !UA.isIOS() && UA.getWxVerNum() >= UA.getWxVerNum("6.6.6")) {
            useWebAudio = true
          }
          sound.load(path, index, useWebAudio, true);
          //initBackgroundMusic()
          // 游戏背景音乐加载,
          if( index == 0 ){
            if (Audio && sound.data instanceof Audio) {
              document.getElementById("pageMusic").appendChild(sound.data)
            }
            //eventBus.fire(GameBackgroundMusicLoadEvent.name, new GameBackgroundMusicLoadEvent())
          }

        } else {
          sound.load(path, index)
        }
      })
  }
  //sound.readyPlay(0, 0, "loop");
  //wx.ready(function() {
  //  sound.readyPlay(0, 0, "loop")
  //})

  return sound;

};

HdGame.Time = Time

HdGame.Grade = Grade

HdGame.isIPhone = UA.isIPhone;
HdGame.IsPC = UA.isPC;
HdGame.UA = UA
HdGame.Img = Img

HdGame.encodeBase64 = btoa


export default HdGame
