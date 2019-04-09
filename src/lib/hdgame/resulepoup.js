var heightFlag = true //Math.max($(window).height() / $(window).width(), $(window).width() / $(window).height()) > 22 / 16;

const resulePoup = {
  startStatus: false,
  exposeFlag: false,
  disable: false,
  result_disable: false,
  gift_disable: false,
};

var initArg = {
  drawType: false,
  home: function() {},
  again: function() {},
  giftInit: function(callback) {
    callback && callback()
  }
};

resulePoup.init = function(arg) {

  Object.assign(initArg, arg);
  //$.extend(initArg, _userArg);
  this.giftBox = $("#resule-gift-box");
  this.resuleBox = $(".resuleBox");
  this.statusBox = $("#resule-status-box");
  var that = this;
  // var lotsPotW = $("#resule-status-lots").width();
  // var lotsPotH = $("#resule-status-lots").height();
  // var lotsWaitW = $("#lots-wait-img").width();
  // var lotsWaitH = $("#lots-wait-img").height();
  // $("#lots-wait-img").css({
  //   width: lotsPotW / (6.15 * g_rem) * lotsWaitW,
  //   height: lotsPotH / (12.4 * g_rem) * lotsWaitH,
  // });
  // if (HdGame.currentScore >= g_config.scoreSet && g_config.scoreSet != "") {
  //   HdGame.isplaySucess = true
  // } else {
  //   HdGame.isplaySucess = false
  // }
  $(document).on("touchend", ".resule-status-home , .resule-gift-home, .resule-gift-home2",
  function() {
    event.preventDefault();
    event.stopPropagation();
    if (_manage) {
      return
    }
    HdGame.logDog(1000015);
    HdGame.fadIn(that.resuleBox,
    function() {
      that.giftBox.hide();
      that.statusBox.hide();
      $(".gameBox,.home,.body").removeClass("overflow-y-hidden");
      if (g_config.showSkillSup) {
        HdGame.logDog(1000028, 0);
        $(".bottomSkill").show()
      }
    });
    initArg.home();
    switchPage("home")
  });
  $("#resule-status-lotsHand .waitDrawBtn").off("touchend").on("touchend",
  function() {
    resulePoup.startStatus = false;
    initArg.giftInit(function(arg) {
      that.showGift(arg)
    })
  });
  $(".resule-gift-draw").off("touchend").on("touchend",
  function() {
    if (_manage) {
      return
    }
    function showResuleBox() {
      HdGame.ajaxLoad.hide();
      $("#resule-status-scrollWrap,#resule-gift-box").hide();
      $("#resule-status-lotsBox,#resule-status-box").show();
      clearTimeout(HdGame.lotTimer);
      $("#resule-status-lotsHand .shakeHand,#resule-status-lotsHand .shakeTxt").show();
      $("#resule-status-lotsHand .waitDrawBtn").hide();
      HdGame.lotTimer = setTimeout(function() {
        if (window.drawStatusLuckDraw) {
          $("#resule-status-lotsHand .shakeHand,#resule-status-lotsHand .shakeTxt").hide();
          $("#resule-status-lotsHand .waitDrawBtn").show()
        }
      },
      5000);
      resulePoup.exposeFlag = false
    }
    HdGame.ajaxLoad.show();
    window.addEventListener("devicemotion", hg_deviceMotionHandler, false);
    resulePoup.exposeFlag && HdGame.logDog(1000025, 29);
    resulePoup.exposeFlag && HdGame.logDog(1000026, 29);
    if (g_config.openAccessKeyOnce) {
      HdGame.checkAccessKeyLuckyDrawTotal().then(showResuleBox, HdGame.ajaxLoad.hide);
      return
    }
    if (that.resuleArg.isLimitDrawTotal && that.resuleArg.totalCount <= 1) {
      HdGame.ajaxLoad.hide();
      HdGame.statusMsg(6);
      return
    } else {
      if (that.resuleArg.count <= 1) {
        HdGame.ajaxLoad.hide();
        HdGame.statusMsg(4);
        if (!g_config.showHelpGuide && !$(this).data("awarded")) {
          initArg.home()
        }
        return
      }
    }
    showResuleBox();
    setTimeout(function() {
      resulePoup.startStatus = true;
      that.resuleArg.totalCount > 0 && that.resuleArg.totalCount--;
      that.resuleArg.count > 0 && that.resuleArg.count--
    },
    1000)
  });
  if ((initArg.drawType === 0 || initArg.drawType === 2) && g_config.style != 61 && g_config.style != 27 && g_config.style != 47) {
    $(".resule-gift-home").css({
      width: "10rem",
      height: "2rem",
      "line-height": "2rem"
    });
    $(".resule-gift-home2").css({
      width: "4.75rem",
      height: "2rem",
      "line-height": "2rem"
    });
    this.giftBox.find(".resule-gift-seeRank").remove();
    this.show = this.showGift
  } else {
    if (initArg.drawType === 1 || g_config.style == 61 || g_config.style == 27 || g_config.style == 47) {
      $(".resule-status-seeRank,.resule-gift-seeRank").on("touchstart",
      function() {
        event.preventDefault();
        event.stopPropagation();
        if (_manage) {
          return
        }
        if (g_config.createTime > 1520265601000 && gameType == 1) {
          window.showRule()
        } else {
          window.showRank()
        }
      });
      $(".resule-status-again").on("touchstart",
      function() {
        event.preventDefault();
        event.stopPropagation();
        if (_manage) {
          return
        }
        function again() {
          HdGame.ajaxLoad.hide();
          $(".gameBox,.home,.body").removeClass("overflow-y-hidden");
          if (!g_config.isDoubleGame) {
            HdGame.fadIn(that.resuleBox,
            function() {
              that.giftBox.hide();
              that.statusBox.hide()
            })
          }
          initArg.again()
        }
        HdGame.ajaxLoad.show();
        if (g_config.openAccessKeyOnce) {
          HdGame.checkAccessKeyLuckyDrawTotal().then(again, HdGame.ajaxLoad.hide);
          return
        }
        HdGame.logDog(1000016);
        if (gameType == 3 && g_config.isCheckPlayTimes && PlayInfo.getTotalRemainTimes() <= 0) {
          HdGame.ajaxLoad.hide();
          HdGame.statusMsg(8);
          return
        }
        if (gameType == 3 && g_config.isCheckPlayTimes && PlayInfo.getTodayRemainTimes() <= 0) {
          HdGame.ajaxLoad.hide();
          HdGame.statusMsg(7);
          return
        }
        again()
      });
      hg.sound.load(_resRoot + "/image/yaoyiyao.wav", "yiy");
      window.addEventListener("devicemotion", hg_deviceMotionHandler, false);
      if (m_debug || g_config.test) {
        $("#resule-status-lotsHand").on("touchstart",
        function() {
          resulePoup.startStatus = false;
          initArg.giftInit(function(arg) {
            that.showGift(arg)
          })
        })
      }
      this.giftEvent = function() {
        if (_manage) {
          return
        }
        HdGame.ajaxLoad.show();
        function showResuleBox() {
          HdGame.ajaxLoad.hide();
          $("#resule-status-scrollWrap").hide();
          $("#resule-status-lotsBox").show();
          $("#resule-status-lotsHand .shakeHand,#resule-status-lotsHand .shakeTxt").show();
          $("#resule-status-lotsHand .waitDrawBtn").hide();
          HdGame.resulePoup.statusBox.show();
          HdGame.resulePoup.resuleBox.show();
          resulePoup.startStatus = true;
          HdGame.lotTimer = setTimeout(function() {
            if (window.drawStatusLuckDraw) {
              $("#resule-status-lotsHand .shakeHand,#resule-status-lotsHand .shakeTxt").hide();
              $("#resule-status-lotsHand .waitDrawBtn").show()
            }
          },
          5000);
          resulePoup.exposeFlag = false
        }
        if (g_config.afterLinkModify && HdGame.shouldRegInfo(3, arguments, this)) {
          return
        }
        if (g_config.openAccessKeyOnce) {
          HdGame.checkAccessKeyLuckyDrawTotal().then(showResuleBox, HdGame.ajaxLoad.hide);
          return
        }
        resulePoup.exposeFlag && HdGame.logDog(1000014);
        if (g_config.style == 47) {
          if (!hg.fireWith("beforeStartGiftEvent")) {
            HdGame.ajaxLoad.hide();
            return
          }
        } else {
          if (that.resuleArg.isLimitDrawTotal && that.resuleArg.totalCount === 0) {
            HdGame.ajaxLoad.hide();
            HdGame.statusMsg(6);
            return
          } else {
            if (that.resuleArg.count === 0) {
              HdGame.ajaxLoad.hide();
              HdGame.statusMsg(4);
              return
            }
          }
        }
        showResuleBox()
      };
      $(".resule-status-gift").on("touchstart", this.giftEvent);
      this.regEvent = function() {
        if (_manage) {
          return
        }
        if (HdGame.shouldRegInfo(3, arguments, this)) {
          return
        }
        HdGame.logDog(1000032);
        HdGame.ajaxLoad.show();
        var url = initArg.regUrl;
        if (g_config.isDoubleGame) {
          url += "&openIdB=" + HdGame.otherOpenId
        }
        $.ajax({
          type: "post",
          url: url,
          error: function() {
            HdGame.ajaxLoad.hide()
          },
          success: function(data) {
            HdGame.ajaxLoad.hide();
            var result = $.parseJSON(data);
            if (result.isOutofTestNum) {
              HdGame.statusMsg("活动尚未发布", "最多测试人数为100人！");
              return
            }
            if (!result.isOutofRegNum) {
              g_config.isReg = true;
              var result = $.parseJSON(data);
              if (result.success) {
                $(".resule-foot-one .resule-status-again").html("继续刷记录");
                $(".resule-foot-one .resule-status-reg").hide();
                $(".resule-foot-one .resule-status-again").show();
                $("#resule-status-count").hide();
                $("#resule-sucReg").show()
              }
            } else {
              if (g_config.createTime > 1520265601000) {
                console.log("参与");
                HdGame.statusMsg("本活动参与人数已达到最大限制如需继续参与，请与主办方联系。")
              } else {
                console.log("报名");
                HdGame.statusMsg("本活动报名人数已达到最大限制如需继续参与，请与主办方联系。")
              }
            }
          }
        })
      };
      $(".resule-status-reg").on("touchstart", this.regEvent);
      this.show = this.showResult
    }
  }
};

resulePoup.showResult = function(args) {

  var resuleDef = {
    isSuc: false,
    gameScore: 0,
    minScore: 0,
    bestScore: 10,
    rank: 10,
    count: 3,
    beat: 99,
    notreal: false,
    gameType: 0,
    gameCostTime: 0,
    bestCostTime: 0
  };
  var arg = Object.assign(resuleDef, args);
  HdGame.tlog("resuleDef---", arg.gameScore);

  this.resuleArg = arg;
  HdGame.currentRank = arg.rank;
  HdGame.currentScore = arg.bestScore;

  //HdGame.wxConfig.setWxShareByStatus();
  $("#resule-status-scrollWrap").show();
  $("#resule-status-lotsBox,#resule-gift-box").hide();
  $(".resule-one-button").hide();
  $("#resule-status-playinfo").hide();
  this.statusBox.show();
  HdGame.fadOut(this.resuleBox);
  var resuleArg = $(".resuleArg");
  if (arg && typeof arg.gameType != "undefined") {
    if (arg.gameType == 4 || arg.gameType == 0) {
      $("#drawMenuBtnBox").toggleClass("hide", true)
    } else {
      var isCloseFlag = !_manage ? !g_config.showMenu: (g_config._preview ? !g_config.showMenu: parent.game._setting.ms == 1);
      $("#drawMenuBtnBox").toggleClass("hide", isCloseFlag)
    }
  }

  $("#resule-status-scrollWrap").css("height", $(window).height() - 1.2 * g_rem);

  if (arg.gameType == 1 || arg.gameType == 3) {
    g_config.showMenu && HdGame.logDog(1000036)
  }
  if (!_manage) {
    $(".gameBox,.home,.body").addClass("overflow-y-hidden");
    $(".bottomSkill").is(":visible") && $(".bottomSkill").hide()
  }
  if (g_config.style == 42 || g_config.style == 56 || g_config.style == 85 || g_config.style == 80) {
    if (g_config.createTime > 1542160800000) {
      $(".youraward.costTime").show();
      $("#bestCostTime").show()
    }
  }
  if (arg.gameType == 3) {
    $("#resule-foot-box").css("padding-bottom", "1rem");
    if (arg.gameScore == "fail") {
      $("#resule-status-bird").show();
      $("#resule-status-ribbon").removeClass("resule-status-ribbon").addClass("resule-status-faiRibbon");
      $("#resule-status-bird").removeClass("resule-status-birdfly").addClass("resule-status-birdfly");
      $("#resule-status-box .resule-bgLight").hide();
      $(".resule-status-userImg").css("border-color", "#B5B5B5");
      $("#resule-status-body .beat-Percent").hide();
      if (arg.rank == 0) {} else {
        $("#resule-status-body .result-scoreUnit").show()
      }
      resuleArg.eq(0).text("无");
      if (resuleArg.eq(2).text().length == 0) {
        resuleArg.eq(2).text(arg.bestScore);
        resuleArg.eq(3).text(arg.rank > 0 ? arg.rank: "无")
      } else {
        if (resuleArg.eq(0).text() == "无") {
          $("#resule-status-body .youraward .result-scoreUnit").hide()
        } else {
          $("#resule-status-body .result-scoreUnit").show()
        }
      }
      HdGame.isplaySucess = false
    } else {
      $("#resule-status-bird").hide();
      $(".resule-status-userImg").css("border-color", "#70D572");
      $("#resule-status-ribbon").removeClass("resule-status-faiRegRibbon").removeClass("resule-status-faiRibbon").addClass("resule-status-ribbon");
      $("#resule-status-box .resule-bgLight").show();
      $("#resule-status-body .beat-Percent span").text(arg.beat);
      $("#resule-status-body .beat-Percent").show();
      resuleArg.eq(0).text(arg.gameScore);
      resuleArg.eq(1).text(arg.gameCostTime);
      resuleArg.eq(3).text(arg.bestScore);
      resuleArg.eq(4).text(arg.bestCostTime);
      resuleArg.eq(5).text(arg.rank);
      $("#resule-status-body .result-scoreUnit").show();
      HdGame.isplaySucess = true
    }
    $(".resule-status-minscore").hide();
    $("#resule-status-count").hide();
    $(".resule-foot-one .resule-status-gift").hide();
    $(".resule-foot-one .resule-status-reg").hide();
    $(".resule-foot-one .resule-status-again").show();
    $(".resule-foot-one .resule-status-again").html("再玩一次");
    $(".resule-foot-two .resule-status-again").hide();
    $(".resule-foot-two .resule-status-home").show();
    if (gameType == 3 && g_config.isCheckPlayTimes) {
      $("#resule-status-playinfo").show()
    } else {
      $("#rank_showRule").show()
    }
  } else {
    if (arg.gameScore === "fail") {
      $(".resuleArg-fail").text(arg.minScore);
      $("#resule-status-body").hide();
      $("#resule-status-other").show()
    } else {
      $("#resule-status-body").show();
      $("#resule-status-other").hide()
    }
    if (arg.isSuc) {
      HdGame.isplaySucess = true;
      $("#resule-status-bird").hide();
      if (g_config.style == 18 || g_config.style == 28) {
        $(".youraward").show();
        $(".youraward.costTime").hide();
        $(".youraward.special").hide();
        $("#bestArg").show();
        $("#bestRank").show();
        $(".resule-status-minscore").css("margin", 0)
      }
      $("#resule-status-ribbon").removeClass("resule-status-faiRibbon").removeClass("resule-status-faiRegRibbon").addClass("resule-status-ribbon");
      $(".resule-status-userImg").css("border-color", "#70D572");
      $(".resule-status-minscore").hide();
      $("#resule-status-count").show();
      if (arg.gameType == 0) {
        $(".resule-foot-one .resule-status-gift").show();
        $(".resule-foot-one .resule-status-again").hide();
        $(".resule-foot-two .resule-status-again").show();
        $(".resule-foot-two .resule-status-home").hide();
        HdGame.logDog(1000027)
      } else {
        if (arg.gameType == 4) {
          $(".resule-foot-one .resule-status-send").show();
          $(".resule-foot-two .resule-status-again").hide();
          $(".resule-foot-two .resule-status-home").show();
          $("#resule-status-count").hide()
        } else {
          if (arg.gameType == 1) {
            $("#resule-status-count").hide();
            $("#resule-foot-box").css("margin-top", "0.6rem");
            $(".resule-foot-two .resule-status-again").hide();
            $(".resule-foot-two .resule-status-home").show();
            HdGame.logDog(1000035);
            if (g_config.createTime > 1520265601000) {
              $(".resule-foot-one .resule-status-again").html("刷记录");
              $(".resule-foot-one .resule-status-reg").hide();
              $(".resule-foot-one .resule-status-again").show();
              $("#resule-sucReg").show()
            } else {
              if (!g_config.isReg) {
                $(".resule-foot-one .resule-status-reg").show()
              } else {
                $(".resule-foot-one .resule-status-again").html("继续刷记录");
                $(".resule-foot-one .resule-status-reg").hide();
                $(".resule-foot-one .resule-status-again").show();
                $("#resule-sucReg").show()
              }
            }
          }
        }
      }
      resulePoup.exposeFlag = true;
      $("#resule-status-box .resule-bgLight").show();
      var argArr = [arg.gameScore, arg.gameCostTime, arg.minScore, arg.bestScore, arg.bestCostTime, arg.rank, arg.totalCount, arg.count, arg.count];
      for (var i = 0,
      len = argArr.length; i < len; i++) {
        resuleArg.eq(i).text(argArr[i])
      }
      $("#resule-status-body .dayDrawCount").text(arg.count);
      $("#resule-status-body #totalDrawCount").text(arg.totalCount);
      $("#msxbSucTip").text("恭喜你获得密室小能手称号！");
      $("#resule-status-body .beat-Percent span").text(arg.beat);
      $("#resule-status-body .beat-Percent").show()
    } else {
      $("#resule-status-bird").show();
      if (g_config.style == 18 || g_config.style == 28) {
        $(".youraward").hide();
        $(".youraward.special").show();
        $("#bestArg").hide();
        $("#bestRank").hide();
        $(".resule-status-minscore").css("margin", "10px 0 50px")
      }
      if (arg.gameType != 1 || g_config.createTime < 1520265601000) {
        $("#resule-status-ribbon").removeClass("resule-status-ribbon").addClass("resule-status-faiRibbon")
      } else {
        $("#resule-status-ribbon").removeClass("resule-status-ribbon").addClass("resule-status-faiRegRibbon")
      }
      $(".resule-foot-one .resule-status-again").html("再玩一次");
      $(".resule-status-userImg").css("border-color", "#B5B5B5");
      $(".resule-status-minscore").show();
      $("#resule-status-count").hide();
      $("#resule-status-box .resule-bgLight").hide();
      $(".resule-foot-one .resule-status-gift").hide();
      $(".resule-foot-one .resule-status-reg").hide();
      $(".resule-foot-one .resule-status-again").show();
      $(".resule-foot-two .resule-status-again").hide();
      $(".resule-foot-two .resule-status-home").show();
      $("#resule-status-bird").removeClass("resule-status-birdfly").addClass("resule-status-birdfly");
      var argArr = [arg.gameScore, arg.gameCostTime, arg.minScore, arg.bestScore, arg.bestCostTime, arg.rank, arg.count];
      for (var i = 0,
      len = argArr.length; i < len; i++) {
        resuleArg.eq(i).text(argArr[i])
      }
      $("#resule-status-body .beat-Percent").hide();
      HdGame.isplaySucess = false
    }
  }
  HdGame.optReSize();
  hg.fire("showResult", arg, resuleArg)
};
