import { EventBus } from '@/plugins/EventBus'
import _ from 'lodash'
//const g_rem = 20
import UA from './hdgame/ua'
const HdGame = {}
const arrPro = Array.prototype
const isReady = true
const g_config = {
  "HWRatio": 1.608
}
// 游戏开始前需要加载的js，主要是加载图片，音乐等资源
HdGame.initJsHead = function(hg, _data) {
  hg.assets = (function() {
    var groups = [],
    FIRST_NAME = "home",
    DEF_NAME = "other";
    var eventBus = EventBus;
    var assets = {
      startTime: 0,
      complete: false,
      loadComplete: false,
      increment: _data.maxIncrement,
      getGroup: function(name) {
        for (var i = 0,
        n = groups.length; i < n; i++) {
          var group = groups[i];
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
        for (var i = groups.length - 1; i >= 0; i--) {
          var group = groups[i];
          if (conf.priority >= group.priority) {
            groups.splice(i + 1, 0, conf);
            break
          }
        }
        return this
      },
      add: function(name, src) {
        if (this.complete ) {
          return
        }
        if (arguments.length === 1) {
          src = arguments[0];
          name = DEF_NAME
        }
        var group = this.getGroup(name || DEF_NAME);
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
      onReady: function(name, fn) {
        var _this = this;
        if (arguments.length === 1) {
          eventBus.on("ready", arguments[0])
        } else {
          if (arguments.length === 2) {
            if (Array.isArray(name)) {
              var callBack = _.throttle(fn, name.length);
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


        var _this = this;
        _this.startTime = Date.now(); (function loadStart(groupLoaded) {
          var group = groups[groupLoaded];
          loadimg(group.path,
          function() {
            eventBus.fire("ready_" + group.name, group);
            if (++groupLoaded < groups.length) {
              loadStart(groupLoaded)
            } else {
              _this.complete = true;
              eventBus.fire("ready")
            }
            if (group.name === FIRST_NAME) {
              console.log("home is loaded!");
              checkOtherLoaded()
            }
          })
        })(0);
        function loadimg(arr, callBack) {
          var hasLoaded = 0;
          if (arr.length === 0) {
            callBack && callBack();
            return
          }
          for (var i = 0,
          n = arr.length; i < n; i++) {
            var img = new Image();
            img.onload = loadCheckComplete;
            img.onerror = loadCheckComplete;
            setTimeout(_.bind(loadCheckComplete, img), 4000);
            img.src = img.assets_key = arr[i];
            _this[arr[i]] = img
          }
          function loadCheckComplete() {
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
          // var bgHeight = HdGame.getBgHeight();
          // if (!HdGame.nootNeedFixHeight) {
          //   $("#homeBgBox,.gameBgBox").css("height", bgHeight / g_rem + "rem")
          // }
          // var onEnd = function() {
          //   eventBus.fire("load");
          //   if (bgHeight > $(window).height()) {
          //     $("#bottomSkill").css("top", (bgHeight - $(".bottomSkill").outerHeight()) / g_rem + "rem")
          //   }
          // };
          // onEnd();
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
}

HdGame.getBgHeight = function() {
  return Math.max((window).innerWidth * g_config.HWRatio, (window).innerHeight)
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

HdGame.isIPhone = UA.isIPhone;
HdGame.IsPC = UA.isPC;
HdGame.UA = UA


export default HdGame
