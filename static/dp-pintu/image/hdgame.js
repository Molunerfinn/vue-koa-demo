if (typeof HdGame == "undefined") {
    HdGame = {}
} (function(HdGame) {
    var arrPro = Array.prototype;
    function isFunction(value) {
        return HdGame.getType(value) == "function"
    }
    function isObject(value) {
        return HdGame.getType(value) == "object"
    }
    function checkFlag(flag, flagDef) {
        return (flag & flagDef) == flagDef
    }
    HdGame.isUrl = function(str_url, supAbsuRoot) {
        if (typeof supAbsuRoot == "undefined") {
            supAbsuRoot = true
        }
        if (supAbsuRoot && str_url.length >= 1 && str_url.charAt(0) == "/") {
            return true
        }
        if (supAbsuRoot && str_url.length >= 1 && str_url.charAt(0) == "#") {
            return true
        }
        var re = /^(\w+:).+/;
        var result = re.test(str_url);
        return result
    };
    HdGame.fixUrl = function(url, supAbsuRoot) {
        if (HdGame.isUrl(url, supAbsuRoot)) {
            return url
        }
        return "http://" + url
    };
    HdGame.encodeHtml = function(html) {
        return html && html.replace ? (html.replace(/&/g, "&amp;").replace(/ /g, "&nbsp;").replace(/\b&nbsp;+/g, " ").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\/g, "&#92;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\n/g, "<br/>").replace(/\r/g, "")) : html
    };
    HdGame.encodeHtmlAttr = function(html) {
        return html && html.replace ? (html.replace(/\"/g, "&#x22;").replace(/\'/g, "&#x27;").replace(/</g, "&#x3c;").replace(/>/g, "&#x3e;").replace(/&/g, "&#x26;")).replace(/\\/g, "&#5c;") : html
    };
    HdGame.encodeUrl = function(url) {
        return typeof url === "undefined" ? "": encodeURIComponent(url)
    };
    HdGame.decodeHtml = function(html) {
        return html && html.replace ? (html.replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/g, ">").replace(/&#92;/gi, "\\").replace(/&#39;/gi, "'").replace(/&quot;/gi, '"').replace(/\<br\/\>/gi, "\n").replace(/&amp;/gi, "&")) : html
    };
    HdGame.decodeUrl = function(url) {
        return typeof url === "undefined" ? "": decodeURIComponent(url)
    };
    HdGame.checkCharacterLen = function(byteLength, obj) {
        var val = $.type(obj) == "string" ? obj: obj.val();
        var str = val.replace(/[^\x00-\xff]/g, "**");
        var length = str.trim().length;
        var size = 0;
        for (var i = 0; i < length; i++) {
            size++
        }
        return size > byteLength
    };
    HdGame.checkTextLength = function(byteLength, obj, isReturnValue) {
        var txt;
        if (isReturnValue) {
            txt = obj
        } else {
            txt = obj.val()
        }
        var str = txt.replace(/[^\x00-\xff]/g, "**");
        var length = str.length;
        if (length < byteLength) {
            return {
                isOverflow: false
            }
        }
        var limitDate = str.substr(0, byteLength);
        var count = 0;
        var limitvalue = "";
        for (var i = 0; i < limitDate.length; i++) {
            var flat = limitDate.substr(i, 1);
            if (flat == "*") {
                count++
            }
        }
        var size = 0;
        if (count % 2 == 0) {
            size = count / 2 + (byteLength * 1 - count);
            limitvalue = txt.substr(0, size)
        } else {
            size = (count - 1) / 2 + (byteLength * 1 - count);
            limitvalue = txt.substr(0, size)
        }
        if (isReturnValue) {
            return {
                isOverflow: true,
                returnValue: limitvalue
            }
        } else {
            obj.val(limitvalue)
        }
    };
    HdGame.fadOut = function(e, callback) {
        if (e.is(":visible")) {
            callback && callback();
            return
        }
        e.css("opacity", 0);
        e.show();
        e.addClass("poupFadIn");
        setTimeout(function() {
            e.removeClass("poupFadIn");
            e.css("opacity", 1);
            callback && callback()
        },
        200)
    };
    HdGame.fadIn = function(e, callback) {
        if (e.is(":hidden")) {
            callback && callback();
            return
        }
        e.css("opacity", 1);
        e.addClass("poupFadOut");
        setTimeout(function() {
            e.hide();
            e.removeClass("poupFadOut");
            e.css("opacity", 1);
            callback && callback()
        },
        200)
    };
    $.fn.extend({
        newAwardSlide: function(options) {
            if (typeof options === "object") {
                var defaults = {
                    margin_bottom: "0",
                    padding_right: "0",
                    speed: 2
                };
                var options = $.extend(defaults, options);
                this.each(function() {
                    $(this).show();
                    if ($(this).data("run") == "on") {
                        return $(this)
                    } else {
                        $(this).data("run", "on")
                    }
                    var $marquee = $(this),
                    scrollUl = $marquee.children("ul");
                    var winWidth = $(window).width();
                    var firstLiWidth = 0;
                    var speed = winWidth * options.speed / 6000;
                    var rt = 0;
                    setCacheBox($marquee);
                    $(".awardInfoList .uerItem").css({
                        "padding-left": options.padding_left,
                        "padding-right": options.padding_right
                    });
                    $(".awardBox_cache .awardInfoList .uerItem").each(function() {
                        var itemWidth = $(this).outerWidth(true);
                        firstLiWidth += itemWidth
                    });
                    scrollUl.css({
                        width: firstLiWidth * 2 + 10
                    });
                    scrollUl.append(scrollUl.find("li").clone().css("z-index", 100));
                    var scrollLi = scrollUl.find("li");
                    scrollLi.css({
                        width: "50%",
                        left: winWidth + 20
                    });
                    var itemLen = 10;
                    while (scrollUl.find("li").eq(0).outerHeight(true) > 1.75 * g_rem + 5 && itemLen > 0) {
                        itemLen--;
                        scrollUl.css({
                            width: scrollUl.outerWidth(true) + 0.8 * g_rem
                        })
                    }
                    var limit = firstLiWidth * 2 + 10,
                    step1 = 0,
                    step2 = 0,
                    oldTime1 = (new Date).getTime(),
                    oldTime2 = (new Date).getTime(),
                    pos1 = 0,
                    pos2 = 0,
                    run1 = true,
                    run2 = false;
                    var requestAnimateBottom = function() {
                        if (run1) {
                            var newTime1 = (new Date).getTime();
                            var timeGap1 = newTime1 - oldTime1;
                            timeGap1 = timeGap1 > 500 ? 0 : timeGap1;
                            step1 = speed * timeGap1;
                            oldTime1 = newTime1;
                            if (rt < 30) {
                                rt++
                            }
                            pos1 = pos1 + step1;
                            pos1 = pos1 > limit ? 0 : pos1;
                            scrollLi.eq(0).css({
                                transform: "translate3d(-" + pos1 + "px,0,0)"
                            });
                            if (pos1 > limit / 2 && !run2) {
                                run2 = true;
                                oldTime2 = (new Date).getTime()
                            }
                        }
                        if (run2) {
                            var newTime2 = (new Date).getTime();
                            var timeGap2 = newTime2 - oldTime2;
                            timeGap2 = timeGap2 > 500 ? 0 : timeGap2;
                            step2 = speed * timeGap2;
                            oldTime2 = newTime2;
                            pos2 = pos2 + step2;
                            pos2 = pos2 > limit ? 0 : pos2;
                            scrollLi.eq(1).css({
                                transform: "translate3d(-" + pos2 + "px,0,0)"
                            })
                        }
                        if (run1 || run2) {
                            requestAnimationFrame(requestAnimateBottom)
                        }
                    };
                    requestAnimateBottom()
                });
                removeCacheBox()
            } else {
                if (options === "stop") {
                    $(this).hide()
                } else {
                    if (options === "wakeup") {
                        $(this).show()
                    }
                }
            }
            function setCacheBox(ele) {
                if ($("body .awardBox_cache").length > 0) {
                    return $("body .awardBox_cache")
                }
                var cloneEle = ele.clone();
                ele.addClass("awardBox_show");
                cloneEle.addClass("awardBox_cache").removeClass("showAwardBox").removeClass("esseHide").css({
                    height: "0",
                    display: "block",
                    "z-index": "-1"
                });
                $("body").append(cloneEle);
                return $("body .awardBox_cache")
            }
            function removeCacheBox() {
                $("body .awardBox_cache").remove()
            }
            return $(this)
        }
    });
    HdGame.statusMsg = function(status, hideTime, width, optBtnTxt, callback) {
        var msg = "",
        sTimeMsg;
        if (typeof status === "string") {
            msg = status
        } else {
            if (status === 1) {
                msg = "活动尚未开始";
                sTimeMsg = "开始时间为" + g_config.startTime
            } else {
                if (status === 3) {
                    msg = "活动已结束";
                    sTimeMsg = "请关注期待下次活动";
                    if (!_manage && g_config.showSkillSup) {
                        HdGame.logDog(1000202)
                    }
                } else {
                    if ((status === 4 || (status == 6 && g_config.style != 50)) && g_config.showHelpGuide) {
                        if (helpType == 2) {
                            msg = "<span style='padding-bottom: 1em;display: inline-block;'>你今天已经没有抽奖机会了</span><br/><span style='display: inline-block;'>把活动传递给好友将获得<span>" + addDrawTime + "</span>次抽奖机会<br/></span>(仅限每天第一次传递)"
                        } else {
                            if (helpType == 3) {
                                msg = "<span style='padding-bottom: 1em;display: inline-block;'>你今天已经没有抽奖机会了</span><br/><span style='display: inline-block;'>每成功邀请一位好友参与，且该好友成功参与活动后，当天将额外获得1次抽奖机会<br/><span>（今天还能获得" + remainHelpNum + "次抽奖机会）</span>"
                            }
                        }
                    } else {
                        if (status === 4) {
                            msg = "您今天已经没有抽奖机会了";
                            sTimeMsg = "明天可继续抽奖哦";
                            HdGame.logDog(1000202, 1)
                        } else {
                            if (status === 6) {
                                if (helpType == 1) {
                                    msg = "您的抽奖机会已经用完";
                                    HdGame.logDog(1000202, 3)
                                }
                                if (helpType == 2) {
                                    msg = "你今天通过活动传递获得的抽奖机会已用完，明天可通过该方式继续获得抽奖机会哦"
                                }
                            } else {
                                if (status === 5) {
                                    msg = "未授权用户无法进行游戏。"
                                } else {
                                    if ((status == 7 || status == 8) && g_config.showHelpGuide) {
                                        if (helpType == 2) {
                                            msg = "<span style='padding-bottom: 1em;display: inline-block;'>你今天已经没有参与机会了</span><br/><span style='display: inline-block;'>把活动传递给好友将获得<span>" + addDrawTime + "</span>次参与机会<br/></span>(仅限每天第一次传递)"
                                        } else {
                                            if (helpType == 3) {
                                                msg = "<span style='padding-bottom: 1em;display: inline-block;'>你今天已经没有参与机会了</span><br/><span style='display: inline-block;'>每成功邀请一位好友参与，且该好友成功参与活动后，当天将额外获得1次参与机会<br/><span>（今天还能获得" + remainHelpNum + "次参与机会）</span>"
                                            }
                                        }
                                    } else {
                                        if (status === 7) {
                                            msg = "您今天已经没有参与机会了";
                                            sTimeMsg = "明天可继续参与哦";
                                            HdGame.logDog(1000202, 2)
                                        } else {
                                            if (status === 8) {
                                                msg = "您的参与机会已经用完";
                                                HdGame.logDog(1000202, 4)
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (sTimeMsg && typeof hideTime !== "string") {
            hideTime = sTimeMsg
        }
        HdGame.showMsg(msg, hideTime, optBtnTxt, callback)
    };
    HdGame.showMsg = (function() {
        var str = '<div class="weui-mask" style="z-index:5000"></div><div class="weui-dialog"><div class="weui-dialog__bd"><span id="statusTip-msg"></span><br/><span id="sTime"></span></div><div class="weui-dialog__ft"><a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">知道了</a></div></div>';
        var msgBox = $(str);
        var msgText = msgBox.find("#statusTip-msg");
        var btn = msgBox.find(".weui-dialog__btn");
        var sTimeMsg = msgBox.find("#sTime");
        var hasInBody = false;
        return function(msg, hideTime, optBtnTxt, callback) {
            msgText.html(msg);
            btn.text(optBtnTxt || "知道了");
            if (typeof hideTime === "string") {
                sTimeMsg.text(hideTime)
            } else {
                if (hideTime) {
                    sTimeMsg.hide()
                } else {
                    sTimeMsg.show()
                }
            }
            if (!hasInBody) {
                $("body").append(msgBox);
                hasInBody = true
            } else {
                msgBox.show()
            }
            btn.one("touchstart",
            function() {
                callback && callback();
                HdGame.fadIn(msgBox,
                function() {
                    msgBox.hide()
                });
                return false
            })
        }
    })();
    HdGame.showMsgToast = function(text, callBack) {
        return HdGame.showMsgToast2({
            bodyMsg: text,
            primaryBtnFn: callBack
        })
    };
    HdGame.showMsgToast2 = function(options) {
        var opts = $.extend({
            style: "",
            headMsg: "",
            bodyMsg: "",
            hasHead: false,
            isTwoFootBtn: false,
            primaryBtnText: "知道了",
            defaultBtnText: "取消",
            primaryBtnFn: null,
            defaultBtnFn: null
        },
        options);
        var str = '<div class="toast" style="z-index: 2000; position: relative; display: none; ' + opts.style + '"><div class="weui-mask" style="z-index: 2000;"></div><div class="weui-dialog" style="z-index: 2000;">';
        opts.hasHead ? str += '<div class="weui-dialog__hd" style="padding: 1.3em 1.6em 1.5em;"><strong class="weui-dialog__title" style="font-size: 1em">' + opts.headMsg + "</strong></div>": "";
        str += '<div class="weui-dialog__bd">' + opts.bodyMsg + '</div><div class="weui-dialog__ft">';
        opts.isTwoFootBtn ? str += '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default">' + opts.defaultBtnText + "</a>": "";
        str += '<a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary">' + opts.primaryBtnText + "</a></div></div></div>";
        var toast = $(str);
        $("body").append(toast);
        toast.fadeIn(200);
        var rt;
        toast.find(".weui-dialog__btn_primary").off(".primaryBtn").on("touchstart.primaryBtn",
        function() {
            rt = opts.primaryBtnFn && opts.primaryBtnFn();
            if (rt != "stop") {
                toast.fadeOut(200,
                function() {
                    toast.remove()
                })
            }
        });
        toast.find(".weui-dialog__btn_default").off(".defaultBtn").on("touchstart.defaultBtn",
        function() {
            var time = 0;
            rt = opts.defaultBtnFn && opts.defaultBtnFn();
            if (rt == "delay") {
                time = 600
            }
            setTimeout(function() {
                toast.fadeOut(200,
                function() {
                    toast.remove()
                })
            },
            time)
        });
        return toast
    };
    HdGame.showMsgToast3 = function(options) {
        var opts = $.extend({
            msg: "操作成功",
            duration: 2000,
            hideCallback: null
        },
        options);
        var hideToastTimer = null;
        if (hideToastTimer) {
            clearTimeout(hideToastTimer);
            hideToastTimer = null
        }
        if (HdGame.checkCharacterLen(40, opts.msg)) {
            console.error("字符总数不建议超过40个")
        }
        var toastStr = '<div class="msgBox"><span class="msgText">' + opts.msg + "</span></div>";
        var $toast = $(toastStr);
        $("body").append($toast);
        $toast.fadeIn(200);
        hideToastTimer = setTimeout(function() {
            $toast.fadeOut(200,
            function() {
                $toast.remove();
                opts.hideCallback && opts.hideCallback()
            })
        },
        opts.duration)
    };
    HdGame.showSuccessToast = function(text, sTime) {
        sTime = sTime || 2000;
        $("#toast").remove();
        var str = '<div id="toast" style="z-index: 5000; position: relative; display: none;"><div class="weui-mask_transparent"></div><div class="weui-toast"><i class="weui-icon-success-no-circle weui-icon_toast"></i><p class="weui-toast__content">' + text + "</p></div></div>";
        var toast = $(str);
        $("body").append(toast);
        toast.fadeIn(150);
        setTimeout(function() {
            toast.fadeOut(150,
            function() {
                toast.remove()
            })
        },
        sTime)
    };
    HdGame.unPublishMsg = function() {
        var unPunDiv = '<div class="unPublish">活动尚未发布，当前仅供预览</div>';
        if (!_preview) {
            $("body").prepend(unPunDiv)
        }
    };
    HdGame.share = function() {
        if ($("#sharePanel").length > 0) {
            $("#sharePanel").show();
            return
        }
        $("body").append("<div id='sharePanel'></div>");
        $("#sharePanel").on("touchend touchstart",
        function() {
            $(this).hide()
        })
    };
    HdGame.favorite = function(isShowPanel) {
        if (!isShowPanel && !g_config.isOem && g_config.showSkillSup && g_config.createTime > 1521648000000) {
            if ($("#cardBagEnter").length > 0) {
                $("#cardBagEnter").show()
            } else {
                var pageCont = "<div id='cardBagEnter'><img id='appCodeImg' src='" + _resRoot + "/image/qbAppCode.png?v=201804040948'/><div class='text'><div class='line1'>长按识别图中二维码</div><div class='line2'>关注“凡科互动券宝”避免丢失卡券</div></div></div>";
                var pageObj = $(pageCont); ! isPublish && (pageObj.append('<div class="topTips">活动未发布，奖品不会收入我的卡包</div>'));
                pageObj.appendTo("body");
                pageObj.on("touchstart",
                function(e) {
                    if (e.target.id != "appCodeImg") {
                        $("#cardBagEnter").hide()
                    }
                })
            }
            return
        }
        if ($("#favoritePanel").length > 0) {
            $("#favoritePanel").show();
            return
        }
        $("body").append("<div id='favoritePanel'></div>");
        $("#favoritePanel").on("touchend touchstart",
        function(e) {
            setTimeout(function() {
                $("#favoritePanel").hide()
            },
            500)
        })
    };
    HdGame.getLevelName = function(level) {
        var flag = $.inArray(g_config.style, [67, 77, 84, 87]) > -1;
        switch (parseInt(level)) {
        case 1:
            return flag ? "商品一": "一等奖";
        case 2:
            return flag ? "商品二": "二等奖";
        case 3:
            return flag ? "商品三": "三等奖";
        case 4:
            return flag ? "商品四": "四等奖";
        case 5:
            return flag ? "商品五": "五等奖";
        case 6:
            return flag ? "商品六": "六等奖";
        case 7:
            return flag ? "商品七": "七等奖";
        case 8:
            return flag ? "商品八": "八等奖";
        case 900:
            return "安慰奖"
        }
    };
    HdGame.getStatusName = function(status) {
        switch (status) {
        case 0:
            return "未领取";
        case 1:
            return "已核销";
        case 2:
            return "未核销";
        case 3:
            return "已过期";
        case 4:
            return "已作废";
        case 5:
            return "已失效"
        }
    }; (function() {
        var _lastGuide = null;
        _lastWrap = null,
        _stop = function(el) {
            if (el) {
                if (el.data("_guide")) {
                    el.data("_guide").remove();
                    el.removeData("_guide")
                }
            } else {
                if (_lastGuide) {
                    _lastGuide.remove();
                    _lastGuide = null;
                    _lastWrap && _lastWrap.removeData("_guide")
                }
            }
        };
        var _play = function(el, or, scale) {
            var $wrap = $('<div class="ball-scale-multiple"><div></div><div></div><div></div></div>');
            if (el.css("position") === "static") {
                el.css("position", "relative")
            }
            if (typeof or === "object" && typeof or.x !== "undefined" && typeof or.y !== "undefined" && typeof or.w !== "undefined" && typeof or.h !== "undefined") {
                var r = Math.min(or.w, or.h) * (scale || 1);
                $wrap.children().css({
                    width: r,
                    height: r
                });
                $wrap.css({
                    left: or.x + (or.w - r) / 2,
                    top: or.y + (or.h - r) / 2
                })
            } else {
                scale = scale || 0.8;
                var elHeight = el.outerHeight();
                var elWidth = el.outerWidth();
                var elr = (or === "w" ? elWidth / 2 : (or === "h" ? elHeight / 2 : (or === "min" ? Math.min(elHeight, elWidth) / 2 : Math.max(elHeight, elWidth) / 2))) * scale;
                $wrap.css({
                    left: elWidth / 2 - elr,
                    top: elHeight / 2 - elr
                });
                $wrap.children().css({
                    width: 2 * elr,
                    height: 2 * elr
                })
            }
            el.append($wrap);
            _lastGuide = $wrap;
            el.data("_guide", $wrap);
            _lastWrap = el
        };
        var Guide = {
            play: _play,
            stop: _stop
        };
        HdGame.Guide = Guide
    })();
    HdGame.homePoup = function(flag) {
        if (flag == 1) {
            $("#rankBox").show();
            if (!_manage && g_config.showSkillSup) {
                HdGame.logDog(1000200, 4);
                g_config.localPoupPage = 4
            }
        } else {
            if (flag == 3) {
                $("#awardBox").show();
                if (!_manage && g_config.showSkillSup) {
                    HdGame.logDog(1000200, 2);
                    g_config.localPoupPage = 2
                }
            } else {
                if (flag == 4) {
                    $("#regAwardBox").show();
                    if (!_manage && g_config.showSkillSup) {
                        HdGame.logDog(1000200, 3);
                        g_config.localPoupPage = 3
                    }
                }
            }
        }
        if (g_config.createTime < 1494376826000) {
            $("#poupInfoBox").show();
            if (!_manage && g_config.showSkillSup) {
                HdGame.logDog(1000200, 1);
                g_config.localPoupPage = 1
            }
        }
    };
    HdGame.poupAjaxComplete = function() {
        var ajaxLoadBar = $(".ajaxLoadBar");
        ajaxLoadBar.addClass("ajaxComplete");
        $(".ajaxLoadBg").hide();
        setTimeout(function() {
            ajaxLoadBar.removeClass("ajaxLoad");
            ajaxLoadBar.removeClass("ajaxComplete")
        },
        500)
    };
    HdGame.refreshGiftListAndAwardDetail = function(gameId, openId, code, award) {
        $.ajax({
            type: "post",
            url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getGiftList",
            data: {
                gameId: gameId,
                openId: openId,
                code: code
            },
            success: function(data) {
                var result = $.parseJSON(data);
                if (result.success) {
                    HdGame.changeCodeInfo(award, result.list[0]);
                    HdGame.openAwardDetail(result.list[0])
                }
            }
        })
    }; (function() {
        var arg = {
            rankUrl: "",
            awardUrl: "",
            getRegAwardUrl: "",
            getStoreUrl: "",
            mhaveScore: 0,
            openId: "",
            gameId: 0,
        };
        var poupTopMune = {
            menuLen: "",
            slideBarWidth: "",
            slideBarMaxWidth: "",
            marginLeft: false,
            hasInitEvent: false,
        };
        typeof g_config !== "undefined" && (g_config.firstTouchRank = g_config.firstTouchAward = g_config.firstTouchWinList = true);
        var rankAjax = {
            isLoad: false,
            isRankAll: false,
            hasLoadAll: false,
            start: 0,
            num: 0,
            limit: 99,
            delay: 500,
            close: function() {
                this.isClose = true;
                this.isRankAll = false;
                this.hasLoadAll = false;
                this.num = this.start = 0
            },
            getRankData: function(opts) {
                if (rankAjax.isLoad || rankAjax.isClose || rankAjax.isRankAll || rankAjax.hasLoadAll) {
                    return
                }
                opts = $.extend({
                    init: null,
                    success: null,
                    error: null,
                },
                opts);
                opts.init && opts.init();
                rankAjax.isLoad = true;
                $.ajax({
                    type: "post",
                    url: arg.rankUrl + "&start=" + rankAjax.start + "&limit=" + rankAjax.limit + "&playerId=" + g_config.playerId,
                    error: function() {
                        opts.error && opts.error();
                        if (rankAjax.num == 0) {
                            HdGame.poupAjaxComplete()
                        }
                        rankAjax.isLoad = false
                    },
                    success: function(data) {
                        HdGame.tlog("creatRankList", data);
                        var info = $.parseJSON(data);
                        opts.success && opts.success(info);
                        if (info.isRankAll) {
                            rankAjax.hasLoadAll = true
                        }
                        if (rankAjax.num == 0) {
                            HdGame.poupAjaxComplete()
                        }
                        var layout = function() {
                            HdGame.logDog(1000010);
                            rankAjax.creatRankList(info);
                            rankAjax.isLoad = false;
                            rankAjax.num++;
                            rankAjax.start = rankAjax.num * (rankAjax.limit + 1);
                            hg.fire("updateRankList", info)
                        };
                        rankAjax.delay ? setTimeout(layout, rankAjax.delay) : layout();
                        if (rankAjax.num == 0) {
                            g_config.firstTouchRank = false
                        }
                        HdGame.hideLoadToast()
                    }
                })
            },
            creatRankList: function(info) {
                var rankList = info.rankList;
                var rank = info.rank;
                var rankInfoBox = $("#rankInfoBox");
                if (rank == 0) {
                    $("#rank").text("无")
                } else {
                    $("#rank").text(rank + "位")
                }
                if (rankList.length == 0) {
                    $("#noRank").show()
                } else {
                    $("#rankMain").show();
                    for (var i = 0; i < rankList.length; i++) {
                        if (rankAjax.start + i + 1 >= rankShowNum) {
                            rankAjax.isRankAll = true
                        }
                        var imgUrl = rankList[i].info.length > 0 ? $.parseJSON(rankList[i].info).headImg: null;
                        var srcStr = imgUrl == null ? "": "src='" + HdGame.encodeHtmlAttr(imgUrl) + "'";
                        var otherImg = "";
                        if (g_config.isDoubleGame) {
                            var otherImgUrl = rankList[i].info.length > 0 ? $.parseJSON(rankList[i].info).headImgB: null;
                            var otherSrcStr = otherImgUrl == null ? "": "src='" + HdGame.encodeHtmlAttr(otherImgUrl) + "'";
                            otherImg = '<img class="userImg" ' + otherSrcStr + " />"
                        }
                        if (g_config.createTime > 1536112800000 && HdGame._showTowPointNum) {
                            if (rankList[i].achievement.indexOf(".") < 0) {
                                rankList[i].achievement = rankList[i].achievement + ".00"
                            } else {
                                var pointNum = rankList[i].achievement.indexOf(".") + 1;
                                var iLen = rankList[i].achievement.length - pointNum;
                                if (iLen == 1) {
                                    rankList[i].achievement = rankList[i].achievement + "0"
                                }
                            }
                        }
                        var tr = '<tr class="rankInfo"><td>No.' + (rankAjax.start + i + 1) + '</td><td><div><img class="userImg" ' + srcStr + " />" + otherImg + '</div></td><td class="userName">' + HdGame.encodeHtml(rankList[i].name) + "</td><td >" + HdGame.encodeHtml(rankList[i].achievement) + '<span class="scoreUnit">' + g_config.scoreUnit + "</span></td></tr>";
                        rankInfoBox.append(tr)
                    }
                    if ((rankAjax.isRankAll || rankAjax.hasLoadAll) && rank > rankShowNum) {
                        if (!HdGame.currentScore) {
                            return
                        }
                        var srcStr = g_config.headImg ? "src='" + HdGame.encodeHtmlAttr(g_config.headImg) + "'": "";
                        var str = '<tr class="rankInfo" style="line-height:0.85rem"><td colspan="4" style="padding-bottom:0.35rem">......</td></tr><tr class="rankInfo"><td>No.' + rank + '</td><td><div><img class="userImg" ' + srcStr + ' /></div></td><td class="userName">' + HdGame.encodeHtml(g_config.userName) + "</td><td >" + (HdGame.currentScore ? ((g_config.scoreType ? HdGame.encodeHtml(HdGame.currentScore) : parseInt(HdGame.currentScore)) + '<span class="scoreUnit">' + g_config.scoreUnit + "</span>") : "无") + "</td></tr>";
                        rankInfoBox.append(str)
                    }
                }
            }
        };
        HdGame.rankAjax = rankAjax;
        HdGame.initChangePoup = function(args) {
            args && $.extend(arg, args);
            if (_manage) {
                $("#Award_Round_Dot").show()
            }
            poupTopMune.menuLen = 0;
            $(".poupTitleBox .poupTitleMune").each(function() {
                if (g_config.style == 71 && $(this).attr("_flag") == 4) {
                    $(this).css("display", "block")
                }
                if ($(this).css("display") == "block") {
                    $(this).removeClass("hide");
                    poupTopMune.menuLen++
                } else {
                    $(this).addClass("hide")
                }
            });
            $(".popTabBox").css("width", 16 * g_rem * poupTopMune.menuLen);
            var showTab = null;
            $(".poupTitleBox .poupTitleMune").not(".hide").each(function(index, el) {
                var flag = $(this).attr("_flag");
                for (var i = 0; i < $("#poupInfoBox .poupMain").length; i++) {
                    var poupMain = $("#poupInfoBox .poupMain").eq(i);
                    if (poupMain.attr("_flag") == flag) {
                        poupMain.show();
                        if (showTab) {
                            showTab = showTab.add(poupMain)
                        } else {
                            showTab = poupMain
                        }
                        return
                    }
                }
            });
            var theWidth = _manage ? $(window).width() : (100 / poupTopMune.menuLen + "%");
            $("#poupInfoBox .poupMain").css("width", theWidth);
            $("#poupInfoBox .poupMain").not(showTab).hide();
            $(".poupTitleBox .poupTitleMune,.poupTitleBox .slideBarTip").css("width", 13.25 / poupTopMune.menuLen + "rem");
            poupTopMune.slideBarWidth = parseInt($(".poupTitleBox .poupTitleMune").css("width"));
            poupTopMune.slideBarMaxWidth = parseInt($(".poupTitleBox .slideBarTip").css("max-width"));
            if (poupTopMune.slideBarWidth > poupTopMune.slideBarMaxWidth) {
                poupTopMune.marginLeft = true
            }
            $("#poupInfoBox .poupMain").height($("#poupInfoBox").height() - $(".poupHead").outerHeight() - g_rem * 0);
            if (!poupTopMune.hasInitEvent) {
                initEven();
                poupTopMune.hasInitEvent = true
            }
        };
        function initEven() {
            var touchEventType = _manage ? "click": "touchstart";
            var menuItem = $(".poupTitleBox .poupTitleMune");
            menuItem.on(touchEventType,
            function() {
                if (menuItem.length == menuItem.not(".hide").length) {
                    var index = $(this).index()
                } else {
                    var index = menuItem.filter(":visible").index(this);
                    index = index < 0 ? 0 : index
                }
                var flag = parseInt($(this).attr("_flag"));
                HdGame.changePoup(flag, index);
                _manage && HdGame.removeAllEditLayer()
            });
            var rankBoxScrollBox = $("#rankBox .poupMainInfo");
            rankBoxScrollBox.scroll(function(event) {
                if (_manage) {
                    return
                }
                if ($("#rankHeight").height() * 2 / 3 <= rankBoxScrollBox.height() + rankBoxScrollBox.scrollTop()) {
                    rankAjax.getRankData({
                        init: function() {
                            HdGame.showLoadToast("数据加载中")
                        },
                    })
                }
            })
        }
        HdGame.hdSkillLog = function(isFoot, logId) {
            if (g_config.realVer == HdVerDef.FREE) {
                HdGame.logDog(logId, isFoot ? 0 : 1)
            } else {
                if (g_config.realVer == HdVerDef.BJ) {
                    HdGame.logDog(logId, isFoot ? 2 : 3)
                } else {
                    if (g_config.realVer == HdVerDef.BY) {
                        HdGame.logDog(logId, isFoot ? 4 : 5)
                    } else {
                        if (g_config.realVer == HdVerDef.ZS) {
                            HdGame.logDog(logId, isFoot ? 6 : 7)
                        } else {
                            if (g_config.realVer == HdVerDef.MD) {
                                HdGame.logDog(logId, isFoot ? 8 : 9)
                            }
                        }
                    }
                }
            }
        };
        HdGame.changePoup = function(flag, index, isAnimation) {
            if (!_manage && g_config.showSkillSup) {
                switch (flag) {
                case 1:
                    HdGame.logDog(1000200, 4);
                    g_config.localPoupPage = 4;
                    break;
                case 3:
                    HdGame.logDog(1000200, 2);
                    g_config.localPoupPage = 2;
                    break;
                case 4:
                    HdGame.logDog(1000200, 3);
                    g_config.localPoupPage = 3;
                    break;
                case 2:
                    HdGame.logDog(1000200, 1);
                    g_config.localPoupPage = 1;
                    break
                }
            }
            if (index == 0) {
                if (g_config.isAOpenId == 0) {
                    HdGame.logDog(1000115, 5)
                } else {
                    HdGame.logDog(1000115, 6)
                }
            }
            rankAjax.isClose = false;
            var silkBag = $("#ruleImg");
            var popupX = silkBag.offset().left + silkBag.width() / 2 + "px ";
            var popupY = silkBag.offset().top + silkBag.height() / 2 + "px";
            $("#poupInfoBox").css({
                "transform-origin": popupX + popupY,
                "-webkit-transform-origin": popupX + popupY
            });
            $("#poupInfoBox").show();
            $(".poupTitleMune").removeClass("checked");
            if (flag == 5 && arg.hasReport == true) {
                $("#informResultBox h2").text("你已经投诉过了！");
                $("#informResultBox").show()
            } else {
                if (typeof index === "number") {
                    var nowItem = $(".poupTitleMune").filter(":visible").eq(index);
                    nowItem.addClass("checked");
                    flag = parseInt(nowItem.attr("_flag"))
                } else {
                    $(".poupTitleBox .poupTitleMune").filter(":visible").each(function(i, value) {
                        if ($.trim($(this).attr("_flag")) == flag) {
                            index = i;
                            $(this).addClass("checked")
                        }
                    })
                }
            }
            if (_manage) {
                var tabName = $.trim($(".poupTitleMune").eq(index).find(".item").text());
                var editTabMune = parent.$("#editActive .topBar .column");
                if (tabName == "活动说明") {
                    tabName = "活动奖品"
                }
                var deviation = g_config.isAngular ? -28 : 2;
                editTabMune.each(function() {
                    var editTabName = $.trim($(this).find(".name").text());
                    if (editTabName == tabName) {
                        parent.$(".topBar .transitionPanel").css("left", ($(this).offset().left + deviation) + "px");
                        editTabMune.removeClass("checked");
                        $(this).addClass("checked")
                    }
                });
                if (g_config.style == 48) {
                    $(".body").scrollTop(0).css("overflow-y", "hidden")
                }
            }
            if (poupTopMune.marginLeft) {
                $(".poupSlideBar .slideBarTip").css("left", ((13.25 / poupTopMune.menuLen) * index + (poupTopMune.slideBarWidth - poupTopMune.slideBarMaxWidth) / 40) + "rem")
            } else {
                $(".poupSlideBar .slideBarTip").css("left", (13.25 / poupTopMune.menuLen) * index + "rem")
            }
            setSlideBar(flag, isAnimation);
            $(".popTabBox").css("left", -$(window).width() * index)
        };
        function setSlideBar(flag, isAnimation) {
            var className = $("#poupInfoBox").attr("class");
            if (!_manage) {
                var anFlag = isAnimation;
                if (!anFlag) {
                    var className = $("#poupInfoBox").attr("class");
                    if (!$("#poupInfoBox").hasClass("enlarge")) {
                        $("#poupInfoBox").addClass("enlarge")
                    }
                } else {
                    $("#poupInfoBox").addClass("retrans")
                }
                $(".gameBox,.home,.body").addClass("overflow-y-hidden");
                if (g_config.style != 55) {
                    g_config.showSkillSup && $(".bottomSkill").hide()
                }
            } else {
                $("#poupInfoBox").addClass("retrans")
            }
            $(".poupClose").off("click");
            setTimeout(function() {
                $(".poupClose").on("click",
                function(event) {
                    if (_manage) {
                        return
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    g_config.firstTouchRank = true;
                    g_config.firstTouchAward = true;
                    g_config.firstTouchWinList = true;
                    rankAjax.close();
                    $("#rankInfoBox").html("");
                    $(".poupTitleMune").removeClass("checked");
                    $(".poupTitleMune").eq(0).addClass("checked");
                    var poupInfoBox = $("#poupInfoBox");
                    poupInfoBox.removeClass("enlarge").removeClass("retrans");
                    if (className == "retrans") {
                        poupInfoBox.hide()
                    }
                    if (isAnimation) {
                        poupInfoBox.hide()
                    }
                    if ([67, 71, 77, 84, 87].indexOf(g_config.style) != -1) {
                        setTimeout(function() {
                            poupInfoBox.hide()
                        },
                        500)
                    }
                    $(".gameBox,.home,.body").removeClass("overflow-y-hidden");
                    g_config.showSkillSup && $(".bottomSkill").show();
                    if (g_config.style == 60 || g_config.style == 45) {
                        if ($(".notFullLuckOne").is(":visible")) {
                            g_config.showSkillSup && $(".gameBgBox .bottomSkill").hide()
                        }
                    }
                    setTimeout(function() {
                        $(".popTabBox").css("left", 0);
                        $(".poupSlideBar .slideBarTip").css("left", (poupTopMune.slideBarWidth - poupTopMune.slideBarMaxWidth) / 40 + "rem")
                    },
                    100);
                    hg.fire("hidePoup", flag)
                })
            },
            300);
            if (flag === 1) {
                poupRank(flag)
            } else {
                if (flag === 2) {
                    poupRule(flag)
                } else {
                    if (flag === 3) {
                        poupAward(flag)
                    } else {
                        if (flag === 4) {
                            poupRegAward(flag)
                        } else {
                            if (flag === 5) {
                                poupInform(flag)
                            }
                        }
                    }
                }
            }
            hg.fire("showPoup", flag)
        }
        function poupRank(flag) {
            if (g_config.isDoubleGame) {
                $("#rankBox").addClass("isDoubleGame")
            }
            $("#rankBox .poupMainInfo").css("height", $("#rankBox").height() - $("#rankBox .attentionBox").height() - 18);
            if (_manage) {
                var rankScore = 999;
                if (g_config.createTime > 1536112800000 && HdGame._showTowPointNum) {
                    rankScore = 999.99
                }
                var rankList = [{
                    name: "magazine",
                    achievement: rankScore
                },
                {
                    name: "hubert",
                    achievement: rankScore
                },
                {
                    name: "lvox",
                    achievement: rankScore
                },
                {
                    name: "hth",
                    achievement: rankScore
                },
                {
                    name: "monica",
                    achievement: rankScore
                },
                {
                    name: "lzz",
                    achievement: rankScore
                },
                {
                    name: "william",
                    achievement: rankScore
                },
                {
                    name: "sinki",
                    achievement: rankScore
                },
                {
                    name: "weiqizhou",
                    achievement: rankScore
                },
                {
                    name: "candyq",
                    achievement: rankScore
                },
                {
                    name: "jarvis",
                    achievement: rankScore
                },
                {
                    name: "johnvi",
                    achievement: rankScore
                },
                {
                    name: "tomato",
                    achievement: rankScore
                },
                {
                    name: "tina",
                    achievement: rankScore
                }];
                $("#rankMain").show();
                HdGame.homePoup(flag);
                var rankInfoBox = $("#rankInfoBox");
                rankInfoBox.find(".rankInfo").remove();
                var imgStr = "";
                var r_scoreUnit = typeof(r_scoreUnit) == "undefined" || r_scoreUnit.trim() == "" ? g_config.scoreUnit: r_scoreUnit;
                if (g_config.isDoubleGame) {
                    imgStr = '<div class="userImg manImg"></div><div class="userImg girlImg"></div>'
                } else {
                    imgStr = '<div class="userImg manImg"></div>'
                }
                var p_scoreUnit = top.$("#setGameUnit").val();
                r_scoreUnit = !p_scoreUnit ? g_config.scoreUnit: Fai.encodeHtml(p_scoreUnit);
                for (var i = 0; i < rankList.length; i++) {
                    var tr = '<tr class="rankInfo"><td>No.' + (i + 1) + "</td><td>" + imgStr + '</td><td class="userName">' + HdGame.encodeHtml(rankList[i].name) + "</td><td >" + rankList[i].achievement + '<span class="scoreUnit">' + r_scoreUnit + "</span></td></tr>";
                    rankInfoBox.append(tr)
                }
                var hideIndex = parseInt($("#showRankNum").text()) - 1;
                $("#rankInfoBox tr.rankInfo:gt(" + hideIndex + ")").hide()
            } else {
                HdGame.logDog(1000010, 0);
                if (g_config.firstTouchRank) {
                    $(".ajaxLoadBg").show();
                    $(".ajaxLoadBar").addClass("ajaxLoad");
                    $("#noRank").hide();
                    $("#rankMain").hide();
                    rankAjax.getRankData()
                }
            }
        }
        function poupRule(flag) {
            if (!_manage) {
                if (g_config.showSkillSup) {
                    HdGame.logDog(1000200, 1)
                }
                g_config.localPoupPage = 1;
                HdGame.logDog(1000009);
                if (skillSupportType == 2 || skillSupportType == 3) {
                    HdGame.hdSkillLog(false, 1000069);
                    HdGame.logDog(1000028, 2)
                }
            }
            if (isLimitDraw && (drawTimesLimitShow == drawTotalLimitShow)) {
                $("#explaiDrawInfoBox").find(".dayFont").hide();
                $("#explaiDrawInfoBox").find(".drawTotalFont").hide();
                $("#explaiDrawInfoBox").find(".chanceFont").show();
                $("#explaiDrawInfoBox").find(".everyOneFont").show()
            } else {
                $("#directDrawInfoBox").find(".drawTotalFont").show()
            }
            if (!isLimitDraw) {
                $("#explaiDrawInfoBox").find(".drawTotalFont").hide();
                $("#explaiDrawInfoBox").find(".chanceFont").show();
                $("#explaiDrawInfoBox").find(".everyOneFont").show()
            }
            if (isLimitDraw && gameType == 4) {
                $(".drawTotalFont").hide()
            }
            $("#ruleBox .poupMainInfo").css("height", $("#ruleBox").height() - $("#ruleBox .attentionBox").height() - 18);
            $("#ruleBox").show();
            $("#poupInfoBox").show();
            if ((!arg.mhaveScore && g_config.style != 61 && g_config.style != 62) || g_config.style == 39 || g_config.style == 9 || g_config.style == 58 || g_config.style == 50) {
                $("#haveScore").hide()
            }
            if (parent.game && parent.game._flagC.f2048 && parent.game._setting.accessrule === 2) {
                if (gameType == 3) {
                    $("#explainPlayInfoBox").hide()
                }
            } else {
                if (gameType == 3 && g_config.isCheckPlayTimes && g_config.style != 63) {
                    if (PlayInfo.isLimitPlay.show && (playTimesLimit == playTotalLimit)) {
                        $("#explainPlayInfoBox").find(".dayFont").hide();
                        $("#explainPlayInfoBox").find(".playTotalFont").hide();
                        $("#explainPlayInfoBox").find(".chanceFont").show();
                        $("#explainPlayInfoBox").find(".everyOneFont").show()
                    }
                    if (!PlayInfo.isLimitPlay.show) {
                        $("#explainPlayInfoBox").find(".playTotalFont").hide();
                        $("#explainPlayInfoBox").find(".chanceFont").show();
                        $("#explainPlayInfoBox").find(".everyOneFont").show()
                    }
                    $("#explainPlayInfoBox").show()
                } else {
                    if (gameType == 3 && g_config.style == 51) {
                        $("#directDrawInfoBox").hide();
                        $("#explainPlayInfoBox").hide()
                    } else {
                        $("#explainPlayInfoBox").hide()
                    }
                }
            }
            if (gameType != 0 && gameType != 5) {
                $("#directDrawInfoBox").hide()
            }
        }
        function compareTime(s1, s2) {
            var str1 = s1.repalce(/-/g, "/");
            str1 = new Date(str1).getTime();
            return str1 > s2
        }
        var poupAward = function(flag) {
            if (!_manage && g_config.showSkillSup) {
                HdGame.logDog(1000011, 0);
                HdGame.logDog(1000200, 2);
                g_config.localPoupPage = 2
            }
            var params = new Array();
            if (g_config.style == 75) {
                var awardBox = $("#myAwardInfo")
            } else {
                var awardBox = $("#awardInfo")
            }
            $("#awardInfoBox").css("height", $("#awardBox").height() - $("#awardBox .attentionBox").height() - 18);
            if (g_config.style == 75) {
                $("#awardInfoBox").css("height", "auto")
            }
            $("#poupInfoBox,#awardBox").show();
            if (!_manage && g_config.showSkillSup) {
                HdGame.hdSkillLog(true, 1000069);
                HdGame.logDog(1000028, 1);
                typeof g_config.isAOpenId == "number" && HdGame.logDog(1000115, 1 + g_config.isAOpenId)
            }
            g_config.showMenu && HdGame.logDog(1000036);
            if (_manage) {
                HdGame.showAwardDetail([parent.awardList[0]])
            } else {
                params.push("gameId=", arg.gameId);
                params.push("&openId=", arg.openId);
                if (g_config.isDoubleGame) {
                    params.push("&openIdB=", HdGame.otherOpenId)
                }
                if (g_config.firstTouchAward) {
                    HdGame.ajaxLoad.show();
                    $.ajax({
                        type: "post",
                        url: arg.awardUrl,
                        data: params.join(""),
                        error: function() {
                            HdGame.ajaxLoad.hide()
                        },
                        success: function(data) {
                            HdGame.ajaxLoad.hide();
                            HdGame.tlog("poupAward", data);
                            var result = $.parseJSON(data);
                            HdGame.awardList = result.list;
                            $("#Award_Round_Dot").hide();
                            HdGame.logDog(1000011);
                            if (result.success) {
                                HdGame.showAwardDetail(result.list)
                            } else {
                                $("#awardInfo").html('<div style="line-height: 2.6rem; padding-left: 0.05rem;">暂无中奖纪录</div>')
                            }
                            g_config.userInfo = result.userInfo;
                            if (result.userInfo) {
                                var hasContact = false;
                                if (result.userInfo.ausername || result.userInfo.aphone || result.userInfo.aadress) {
                                    hasContact = true
                                } else {
                                    for (var p in result.userInfo) {
                                        if (/^aprop.*/.test(p) && result.userInfo[p] != null && result.userInfo[p] !== "") {
                                            hasContact = true;
                                            break
                                        }
                                    }
                                }
                                if (hasContact && !g_config.isYKY) {
                                    $("#awardContactInfo").show();
                                    HdGame.updateContactView(result.userInfo)
                                }
                            }
                            g_config.firstTouchAward = false
                        }
                    })
                }
            }
        };
        HdGame.updateContactView = function(userInfo) {
            var isShowContactInfo = false;
            var cusContactList = $.parseJSON(g_config.contactNoDraw);
            if (cusContactList && typeof cusContactList[0] === "object") {
                $contactGroup = $("#awardContactInfo .contactGroup");
                $contactGroup.empty();
                for (var i = 0; i < cusContactList.length; i++) {
                    var cusItem = cusContactList[i];
                    if (cusItem.isOpen) {
                        var propName = HdGame.encodeHtml(cusItem.name);
                        var propValue = userInfo[cusItem.key];
                        if (propValue != null && propValue != "") {
                            propValue = HdGame.encodeHtml(propValue);
                            var propHtml = '<div class="contactItem contact-' + cusItem.key + ' hide" style="display: block;">' + propName + "： <span>" + propValue + "</span></div>";
                            $contactGroup.append(propHtml);
                            isShowContactInfo = true
                        }
                    }
                }
            } else {
                if (userInfo.ausername) {
                    $("#awardContactInfo .contactName").show();
                    $("#awardContactInfo .contactName span").text(userInfo.ausername);
                    isShowContactInfo = true
                }
                if (userInfo.aphone) {
                    $("#awardContactInfo .contactPhone").show();
                    $("#awardContactInfo .contactPhone span").text(userInfo.aphone);
                    isShowContactInfo = true
                }
                var theAddress = userInfo.aadress && userInfo.aadress.replace(/,/g, "");
                if (theAddress) {
                    $("#awardContactInfo .contactAddress span").text(theAddress);
                    $("#awardContactInfo .contactAddress").show();
                    isShowContactInfo = true
                }
            }
            $("#awardContactInfo").toggle(isShowContactInfo)
        };
        var parseAward = function(itemInfo) {
            if (itemInfo._award || !itemInfo.awardInfo) {
                return
            }
            var awardTypeInfo = g_config.$$awardTypeInfo;
            var award = itemInfo._award = $.parseJSON(itemInfo.awardInfo);
            award.$type = $.extend(true, {},
            awardTypeInfo.def, awardTypeInfo[award.awardtype]);
            if (award.awardtype == 1) {
                if (typeof award.jumptype == "undefined") {
                    award.jumptype = 0
                }
                $.extend(award.$type, award.$type[award.jumptype])
            } else {
                if (award.awardtype == 2 && arg.afterWxCard) {
                    $.extend(award.$type, award.$type[award.cashtype]);
                    if (award.cashtype == 1) {
                        $.extend(award.$type, award.$type[award.onlinect])
                    }
                } else {
                    if ($.inArray(award.awardtype, [5, 6, 7, 8, 11, 12, 13]) != -1) {
                        if (typeof award.payment == "undefined") {
                            award.payment = 0
                        }
                        $.extend(award.$type, award.$type[award.payment])
                    } else {
                        if (award.awardtype == 10) {
                            $.extend(award.$type, award.$type[award.cashtype])
                        }
                    }
                }
            }
            award["$cashsite_" + award.$type.sitetype] = award.cashsite;
            award.$opqrc = award.opqrc;
            if (arg.afterWxCard && award.$type.qrcode != "auto") {
                award.$opqrc = award.$type.qrcode
            }
            if (typeof award.attention == "undefined") {
                award.attention = award.oct ? 2 : 1
            }
            if (award.genewxcard) {
                var isAddCard = !itemInfo.depositTime || itemInfo.depositTime >= new Date().getTime()
            }
            if (!itemInfo.awardCode) {
                itemInfo.awardCode = (itemInfo.custom && itemInfo.custom.length > 0) ? itemInfo.custom: (itemInfo.code ? itemInfo.code: itemInfo.code1);
                if (itemInfo.anwei) {
                    itemInfo.awardCode = (itemInfo.cusCode && itemInfo.cusCode.length > 0) ? itemInfo.cusCode: itemInfo.code1
                }
            }
            if (itemInfo.isTrash) {
                itemInfo.codeStatus = 4
            }
        };
        HdGame.changeCodeInfo = function(codeInfo, newCodeInfo) {
            $.each(HdGame.awardList,
            function(index, award) {
                if (award.code == codeInfo.code) {
                    HdGame.awardList[index] = newCodeInfo
                }
            });
            HdGame.showAwardDetail(HdGame.awardList)
        };
        HdGame.showAwardDetail = function(list) {
            if (_manage && HdGame.showAwardDetail.hasRun) {
                return
            }
            if (g_config.style == 75) {
                var awardBox = $("#myAwardInfo")
            } else {
                var awardBox = $("#awardInfo")
            }
            var myAward = "";
            var openCode = $("#resule-gift-sucImg").data("openCode");
            var openInfo = null;
            for (var i = 0; i < list.length; i++) {
                var itemInfo = list[i];
                if (_manage) {
                    var awardType = itemInfo.awardtype
                } else {
                    var awardInfo = $.parseJSON(itemInfo.awardInfo);
                    var awardType = awardInfo.awardtype
                }
                var isShowCardTips = "";
                if (_manage) {
                    var item_awardLevel = 1;
                    var codeStatusName = "未核销"
                } else {
                    parseAward(itemInfo);
                    var item_awardLevel = itemInfo.anwei ? itemInfo.awardLevel: itemInfo.level;
                    var codeStatusName = HdGame.getStatusName(itemInfo.codeStatus);
                    if (itemInfo._award.genewxcard) {
                        $("#awardCollectionBtn").attr("isWxCard", true);
                        if (itemInfo._award.t_type == "DATE_TYPE_FIX_TERM" && !itemInfo.depositTime) {
                            isShowCardTips = "领取后" + (itemInfo._award.cfbt == 0 ? "当": itemInfo._award.cfbt) + "天生效，有效天数" + itemInfo._award.cft + "天"
                        }
                    }
                }
                myAward += '<div id="codeInfo' + i + '" class="codeInfoBox' + (awardType == 9 ? " isJZCoupon": "") + (g_config.isYKY ? " isYKY": "") + '" _level="' + item_awardLevel + '"><div class="goDetailIcon"></div><div class="djqImgBox"></div><div class="isEmptyAward ellipsis" style="width: 11rem;margin-left:0.6rem;font-size:0.7rem;"><span class="awardStyle"></span>：<span class="awardName"></span></div><div class="noPartnersBox"><div class="codeperiod" style="margin: 0.25rem 0.6rem;line-height:1.4rem;"><span class="awardTypeName"></span>：' + (isShowCardTips != "" ? isShowCardTips: '<span class="awardBgTime"></span> 至 <span class="awardEndTime"></span>') + '</div><div class="codeStatusName" style="color: #ecb208;margin-left:0.6rem;">' + codeStatusName + "</div></div></div>";
                if (!_manage && openCode !== undefined && (openCode == itemInfo.awardCode || openCode == itemInfo._awardCode)) {
                    openInfo = itemInfo
                }
            }
            awardBox.html(myAward);
            $.each(list,
            function(i, item) {
                var award = _manage ? item: item._award;
                var codeInfo = awardBox.find("#codeInfo" + i);
                HdGame.watch("awardList[0].style", item.awardStyle,
                function(val) {
                    codeInfo.find(".awardStyle").text(val)
                });
                HdGame.watch("awardList[0].name", item[item.anwei ? "award": "awardName"],
                function(val) {
                    codeInfo.find(".awardName").text(val)
                });
                var needlessconsume = item.codeStatus == 6 && !item.isTrash;
                HdGame.watch('awardList[0].needlessconsume && awardList[0].$type.sitetype == "url"', needlessconsume,
                function(val) {
                    codeInfo.find(".codeStatusName").toggle(!val)
                });
                HdGame.watch("awardList[0].awardtype == 9", award.awardtype == 9,
                function(val) {
                    codeInfo.toggleClass("isJZCoupon", val).find(".noPartnersBox").toggle(!val)
                });
                if (!g_config.isYKY) {
                    HdGame.watch("awardList[0].$type.deadline", award.$type.deadline,
                    function(val) {
                        codeInfo.find(".awardTypeName").text(val)
                    });
                    HdGame.watch("awardList[0].cbt", award.cbt,
                    function(val) {
                        codeInfo.find(".awardBgTime").text(val.substring(0, 10).replace("-", ".").replace("-", "."))
                    });
                    HdGame.watch("awardList[0].cet", award.cet,
                    function(val) {
                        codeInfo.find(".awardEndTime").text(val.substring(0, 10).replace("-", ".").replace("-", "."))
                    })
                }
                codeInfo.data("data", item)
            });
            if (openInfo) {
                HdGame.openAwardDetail(openInfo);
                $("#resule-gift-sucImg").removeData("openCode")
            }
            if (_manage) {
                HdGame.showAwardDetail.hasRun = true
            }
        };
        HdGame.openStoreLocation = function(node) {
            var storeInfo = $(node).parent().data("store");
            var point = $.parseJSON(storeInfo.point);
            wx.openLocation({
                latitude: point.lat,
                longitude: point.lng,
                name: storeInfo.name,
                address: storeInfo.address,
                scale: 22,
                infoUrl: ""
            })
        }; (function() {
            function checkContact(awardInfo, itemInfo) {
                if (g_config.afterLinkModify) {
                    if (HdGame.shouldRegInfo([2, 3, 4])) {
                        return true
                    }
                } else {
                    if (typeof awardInfo.continfo !== "undefined") {
                        if (itemInfo && (gameType == 0 || gameType == 4 || gameType == 5) && g_config.wxAward.oplink) {
                            var continfo = awardInfo.continfo;
                            var showNameInput = continfo & 1;
                            var showPhoneInput = continfo & 2;
                            var showAddressInput = continfo & 4;
                            var regName = showNameInput && !g_config.awardUsername;
                            var regPhone = showPhoneInput && !g_config.awardPhone;
                            var regAddress = showAddressInput && !g_config.awardAddress;
                            if (regName || regPhone || regAddress) {
                                return true
                            }
                        }
                    } else {
                        if (!g_config.awardUsername && !g_config.awardPhone && !g_config.awardAddress && g_config.award && ((gameType == 0 || gameType == 4) && g_config.wxAward.oplink)) {
                            return true
                        }
                    }
                }
                return false
            }
            function initYKYDetail(itemInfo) {
                if (!isPublish) {
                    HdGame.showMsgToast("活动尚未发布<br>无法查看奖品详情");
                    return
                }
                var ykyLoadKey = "_loadYKY_" + itemInfo.awardCode;
                if (HdGame.openAwardDetail[ykyLoadKey]) {
                    return
                }
                var prop = $.parseJSON(itemInfo.prop);
                var jumpToYKY = function(ykyurl) {
                    HdGame.replaceUrlByTime();
                    window.open(ykyurl)
                };
                if (prop && prop.ykyurl) {
                    HdGame.tlog("getYKYAwardUrl", prop);
                    jumpToYKY(prop.ykyurl);
                    return
                }
                if (!g_config.ykyRelationId) {
                    return true
                }
                HdGame.openAwardDetail[ykyLoadKey] = $.ajax({
                    type: "post",
                    url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getYKYAwardUrl&gameId=" + arg.gameId + "&openId=" + arg.openId + "&code=" + itemInfo.awardCode + "&ykyRelationId=" + g_config.ykyRelationId,
                    error: function() {
                        HdGame.showMsgToast("服务繁忙，请稍候重试")
                    },
                    success: function(data) {
                        HdGame.tlog("getYKYAwardUrl", data);
                        var result = $.parseJSON(data);
                        HdGame.tlog("result", result);
                        if (result.success) {
                            if (result.status !== 0) {
                                itemInfo.prop = $.toJSON({
                                    ykyurl: result.data.url
                                });
                                jumpToYKY(result.data.url)
                            }
                        } else {
                            HdGame.showMsgToast(result.data.failMessages)
                        }
                    },
                    complete: function() {
                        HdGame.hideLoadToast();
                        delete HdGame.openAwardDetail[ykyLoadKey]
                    },
                })
            }
            function cusBtnCancel(awardInfo, itemInfo) {
                var timeLimit = $.parseJSON(awardInfo.tlmt);
                var nowDay = new Date().getDay();
                var isInTime = false;
                var isUsable = g_config.verInfo.authVer >= 2;
                var beforeTime = false;
                if (g_config.status != 0) {
                    isUsable = isUsable || g_config.verInfo.createAuthVer >= 2
                }
                if (timeLimit.length == 1 && timeLimit[0] == 8) {
                    isInTime = true
                } else {
                    isInTime = timeLimit.some(function(day) {
                        if (day == 7) {
                            day = 0
                        }
                        return day == nowDay
                    })
                }
                if (awardInfo.iscancelver && isUsable) {
                    if (itemInfo.codeStatus == 1) {
                        HdGame.statusMsg("该兑奖码已被核销！", "");
                        return
                    }
                    if (itemInfo.codeStatus == 3) {
                        HdGame.statusMsg("该兑奖码已过期！", "");
                        return
                    }
                    if (itemInfo.codeStatus == 4) {
                        HdGame.statusMsg("该兑奖码已作废！", "");
                        return
                    }
                    if (beforeTime) {
                        HdGame.statusMsg("该兑奖码未到兑奖期限！", "");
                        return
                    }
                    if (!isInTime) {
                        HdGame.showMsg("该奖项未到可用时段！");
                        return
                    }
                    var options = {
                        hasHead: true,
                        headMsg: "请联系核销员确认核销",
                        bodyMsg: '<div class="weui-cell" style="border: 1px solid #D5D5D6"><div class="weui-cell__bd"><input class="weui-input" type="text" placeholder="请输入核销码" style="color: #000" onblur="window.scroll(0, 0);"></div></div>',
                        isTwoFootBtn: true,
                        primaryBtnText: "确认核销",
                        defaultBtnText: "取消",
                        primaryBtnFn: function() {
                            var vcode = toast.find(".weui-input").val().trim().toLowerCase();
                            if (vcode == "") {
                                setTimeout(function() {
                                    HdGame.statusMsg("请先输入核销码", "")
                                },
                                200);
                                return "stop"
                            }
                            if (!awardInfo.vercodeFlow) {
                                awardInfo.vercodeFlow = true;
                                $.ajax({
                                    url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=checkVerificationCode",
                                    type: "post",
                                    data: {
                                        storeId: g_config.storeId,
                                        areaId: g_config.areaId,
                                        vcode: vcode,
                                        id: g_config.playerId,
                                        gameId: g_config.gameId,
                                        openId: g_config.openId,
                                        code: itemInfo.code
                                    },
                                    success: function(result) {
                                        result = JSON.parse(result);
                                        HdGame.tlog("cancelVer", result);
                                        $("#verifictionCodeLayer").hide();
                                        toast.find(".weui-input").val("");
                                        var oldCodeStatus = itemInfo.codeStatus;
                                        if (result.success) {
                                            HdGame.statusMsg(result.msg, "");
                                            itemInfo.codeStatus = 1
                                        } else {
                                            if (result.rt == -6) {
                                                itemInfo.codeStatus = 1
                                            } else {
                                                if (result.rt == -15) {
                                                    itemInfo.codeStatus = 3
                                                } else {
                                                    if (result.rt == -12) {
                                                        itemInfo.codeStatus = 4
                                                    } else {
                                                        if (result.rt == 71) {
                                                            itemInfo.codeStatus = 6
                                                        }
                                                    }
                                                }
                                            }
                                            HdGame.statusMsg(result.msg, 0, 0, "",
                                            function() {
                                                if (result.rt == -1) {
                                                    $("#bottomCusBtnInfo").click();
                                                    return
                                                }
                                            })
                                        }
                                        if (oldCodeStatus == itemInfo.codeStatus) {
                                            return
                                        }
                                        $.ajax({
                                            type: "post",
                                            url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getGiftList",
                                            data: {
                                                gameId: g_config.gameId,
                                                openId: g_config.openId,
                                                code: itemInfo.code
                                            },
                                            success: function(data) {
                                                var result = $.parseJSON(data);
                                                if (result.success) {
                                                    HdGame.changeCodeInfo(itemInfo, result.list[0]);
                                                    HdGame.openAwardDetail(result.list[0])
                                                }
                                            }
                                        })
                                    },
                                    error: function() {
                                        HdGame.statusMsg("服务器繁忙，请稍后再试", "")
                                    },
                                    complete: function() {
                                        awardInfo.vercodeFlow = false
                                    }
                                })
                            }
                        },
                        defaultBtnFn: function() {
                            toast.find(".weui-input").val("");
                            return "delay"
                        }
                    };
                    var toast = HdGame.showMsgToast2(options);
                    toast.on("focus", ".weui-input",
                    function() {
                        $("#spxdPage").addClass("spxdPageHide")
                    });
                    toast.find(".weui-input").focus()
                } else {
                    $("#awardCodeLayer").show()
                }
            }
            function showStoreList(storeList, lat, lng) {
                var awardDetailBox = $("#awardDetailBox");
                if (!storeList || storeList.length == 0) {
                    awardDetailBox.find("#useStoreBox").mustHide("listNotNull");
                    return
                }
                if (lat != undefined && lng != undefined) {
                    for (var i = 0; i < storeList.length; i++) {
                        var store = storeList[i];
                        var point = $.parseJSON(store.point);
                        var distance = HdGame.computeDistance(lat, lng, point.lat, point.lng);
                        store.distance = parseInt(distance);
                        HdGame.tlog("distance", store.distance)
                    }
                    storeList.sort(function(a, b) {
                        return a.distance - b.distance
                    })
                } else {
                    storeList.sort(function(a, b) {
                        return b.id - a.id
                    })
                }
                var storeInfo = storeList[0];
                var $useStoreBox = $("#useStoreBox");
                $useStoreBox.find(".storeInfoBox").data("store", storeInfo);
                renderStoreInfoView(storeInfo, $useStoreBox.find(".storeInfoBox"));
                awardDetailBox.find("#useStoreBox").removeClass("initHide");
                awardDetailBox.find("#useStoreBox").canShow("listNotNull");
                if (storeList.length > 1) {
                    $useStoreBox.find(".storeNumText").show();
                    $useStoreBox.find("#storeNum").text(storeList.length);
                    $useStoreBox.find(".moreBtn").show()
                } else {
                    $useStoreBox.find(".storeNumText").hide();
                    $useStoreBox.find(".moreBtn").hide()
                }
                if (!_manage && storeList.length > 1) {
                    var $storeList = $("#storeListBox .list");
                    $storeList.empty();
                    for (var i = 0; i < storeList.length; i++) {
                        var store = storeList[i];
                        var storeHtml = '<div class="storeInfoBox"><div class="locationBtn" onclick="HdGame.openStoreLocation(this)"></div><div class="info"><div class="storeNameBox"><span id="storeName"></span><span id="distance"></span></div><div class="storeAdress"></div></div></div>';
                        var $storeNode = $(storeHtml);
                        $storeNode.data("store", store);
                        renderStoreInfoView(store, $storeNode);
                        $storeList.append($storeNode)
                    }
                }
            }
            function renderStoreInfoView(data, $view) {
                var name = "";
                var address = "";
                var distanceStr = "";
                if (data) {
                    name = data.name;
                    address = getStoreAddress(data);
                    var distance = data.distance;
                    if (distance && distance > 0) {
                        if (distance > 1000) {
                            distanceStr = parseInt(distance / 1000) + "千米"
                        } else {
                            distanceStr = distance + "米"
                        }
                    }
                }
                $view.find("#storeName").text(name);
                $view.find(".storeAdress").text(address);
                $view.find("#distance").text(distanceStr)
            }
            function getStoreAddress(store) {
                if (store.province == "北京" || store.province == "天津" || store.province == "上海" || store.province == "重庆") {
                    return store.city + store.county + store.address
                }
                return store.province + store.city + store.county + store.address
            }
            function initCodeStatus(awardInfo, itemInfo) {
                var codeDetailInfoBox = $("#codeDetailInfoBox").hide();
                var codeStatusBox = $("#codeStatusBox").show();
                var codeStatusInfo = codeStatusBox.find("#codeStatusInfo").show();
                var codeStatusBtn = codeStatusBox.find("#codeStatusBtn");
                var codeStatusTips = codeStatusBox.find("#codeStatusTips").hide();
                var awardType = $.parseJSON(itemInfo.awardInfo).awardtype;
                codeStatusTips.css("fontSize", "");
                $("#awardCollectionBtn").show();
                codeStatusBtn.show();
                if (itemInfo.codeStatus == 4) {
                    codeStatusBtn.html("已作废");
                    if (itemInfo.status == 5) {
                        codeStatusInfo.html("微信检测到您有刷红包嫌疑，为保证公平公正<br>已取消您的领取资格")
                    } else {
                        codeStatusInfo.html("商家已将该兑奖码设置为作废<br>详情请联系商家")
                    }
                } else {
                    if (itemInfo.codeStatus == 1) {
                        codeStatusBtn.html("已核销");
                        codeStatusInfo.hide()
                    } else {
                        if (itemInfo.codeStatus == 5) {
                            codeStatusBtn.html("已失效");
                            var msg = awardType == 5 ? "红包已失效，详细请联系商家": "已失效，详细请联系商家";
                            codeStatusInfo.html(msg)
                        } else {
                            if (itemInfo.codeStatus == 3) {
                                codeStatusBtn.html("已过期");
                                codeStatusInfo.hide()
                            } else {
                                if (itemInfo.theGiftDate < 0) {
                                    codeStatusBtn.html("未到兑奖时间").css("width", "5.5rem");
                                    codeStatusInfo.hide();
                                    codeStatusTips.show().find(".giftNameA").text(awardInfo.$type.collect);
                                    codeStatusTips.find(".targetDateMin").text(Math.ceil((itemInfo.theGiftDate * -1) / (1000 * 60 * 60 * 24)));
                                    if (awardInfo.genewxcard) {
                                        if (!awardInfo.depositTime) {
                                            awardInfo.depositTime = itemInfo.depositTime
                                        }
                                        if (!awardInfo.depositTime) {
                                            codeStatusTips.show().find(".giftNameA").text("领取到微信卡包");
                                            codeStatusBtn.hide();
                                            codeStatusTips.css("fontSize", "0.75rem")
                                        } else {
                                            codeStatusTips.show().find(".giftNameA").text("打开微信卡券");
                                            codeStatusTips.css("fontSize", "")
                                        }
                                    }
                                } else {
                                    var depositTime = awardInfo.depositTime || itemInfo.depositTime;
                                    if (awardInfo && awardInfo.genewxcard && (!depositTime)) {
                                        codeStatusBtn.hide();
                                        codeStatusInfo.text("请先领取到微信卡包，以获取优惠码")
                                    } else {
                                        codeDetailInfoBox.show();
                                        codeStatusBox.hide()
                                    }
                                }
                            }
                        }
                    }
                }
                var redPacketTip = codeDetailInfoBox.find(".redPacketTip").hide();
                var codeOptInfo = codeDetailInfoBox.find(".codeOptInfo").canShow("redPacket");
                if (Fai.checkBit(itemInfo.flag, 1)) {
                    if (itemInfo.status == 0) {
                        codeDetailInfoBox.show();
                        redPacketTip.show().html("您的红包正在发送中，请耐心等待");
                        codeOptInfo.mustHide("redPacket")
                    } else {
                        if (itemInfo.status == 1) {
                            codeStatusInfo.show().html("红包已发送，请留意服务通知！")
                        } else {
                            if (itemInfo.status == 2) {
                                codeDetailInfoBox.show();
                                redPacketTip.show();
                                codeOptInfo.mustHide("redPacket");
                                if (itemInfo.result_code == "SENDNUM_LIMIT") {
                                    redPacketTip.html("您今天领取的红包已达到微信规定的上限，请明天再来领取吧！")
                                } else {
                                    if (itemInfo.result_code == "FREQ_LIMIT") {
                                        redPacketTip.html("目前领取人数过多，请稍后点击下方“立即领取”重试！")
                                    } else {
                                        redPacketTip.html("红包发送失败，点击下方“立即领取”重试，如多次失败请联系管理员！")
                                    }
                                }
                            }
                        }
                    }
                }
            }
            function getDateTipByFixTerm(cfbt, cft) {
                return "领取后" + (cfbt == 0 ? "当": cfbt) + "天生效，有效天数" + cft + "天"
            }
            function showTaopw(awardInfo, itemInfo) {
                var taopwPoup = $("#taopwPoup");
                if (taopwPoup.length == 0) {
                    taopwPoup = $('<div id="taopwPoup" class="homePoupMask"><div class="attentionPoup"><div class="close"></div><div class="tips tips1">点击“一键复制”按钮复制淘口令</div><div class="tips taopwtext"></div><div class="tips copyBtn">一键复制</div><div class="tips tips2">在手机中打开淘宝APP即可进入对应商品链接</div><div class="needconsume"><div class="tips tips3">联系客服并发送优惠码即可兑奖<br><span class="note">注：淘口令优惠券可直接领取</span></div><div class="tips tips4">您的优惠码</div><div class="tips codetext"></div></div></div></div>').appendTo("body");
                    taopwPoup.find(".close").on("click",
                    function(event) {
                        taopwPoup.hide()
                    });
                    HdGame.showLoadToast("数据加载中");
                    HdGame.Res.load("js_clipboard").then(function() {
                        HdGame.hideLoadToast();
                        new ClipboardJS(taopwPoup.find(".copyBtn"), {
                            text: function() {
                                return taopwPoup.find(".taopwtext").text()
                            }
                        }).on("success",
                        function(data) {
                            HdGame.showSuccessToast("复制成功")
                        });
                        initTaopwPoup()
                    })
                } else {
                    initTaopwPoup()
                }
                function initTaopwPoup() {
                    var codeStatusBtn = $("#codeStatusBtn");
                    var codeStatusText = codeStatusBtn.text();
                    taopwPoup.show();
                    taopwPoup.find(".taopwtext").text(awardInfo.cashsite);
                    if (codeStatusBtn.is(":visible") && codeStatusText) {
                        taopwPoup.find(".codetext").text(codeStatusText)
                    } else {
                        taopwPoup.find(".codetext").text(itemInfo.awardCode)
                    }
                    var needlessconsume = Fai.checkBit(itemInfo.flag, 32) ? Fai.checkBit(itemInfo.flag, 16) : itemInfo.codeStatus == 6;
                    taopwPoup.toggleClass("needlessconsume", needlessconsume);
                    var attentionPoup = taopwPoup.find(".attentionPoup");
                    attentionPoup.css("margin-top", Math.max($(window).height() - attentionPoup.outerHeight(), 0) / 2)
                }
            }
            HdGame.openAwardDetail = function(itemInfo) {
                var awardDetailBox = $("#awardDetailBox");
                var ticketDetailBox = $("#ticketDetailBox");
                var bottomCusBtnBox = awardDetailBox.find("#bottomCusBtnBox");
                var awardInfo = {};
                if (_manage) {
                    $$(function() {
                        awardInfo = itemInfo = parent.game.$cAward
                    })
                } else {
                    if (!itemInfo || !itemInfo.awardInfo) {
                        itemInfo = $(this).data("data")
                    }
                    $(".codeInfoBox.checked").removeClass("checked");
                    $(this).addClass("checked");
                    parseAward(itemInfo);
                    awardInfo = itemInfo._award;
                    g_config.award = itemInfo;
                    g_config.wxAward = awardInfo;
                    var isFsnShareCoupon = Fai.checkBit(itemInfo.flag, 64);
                    if (isFsnShareCoupon) {
                        if (HdGame.fission.isNeedFisLinkInfo([2, 3, 4])) {
                            return HdGame.aUserInfo.show(arguments, this, true)
                        }
                    } else {
                        if (checkContact(awardInfo, itemInfo)) {
                            return HdGame.aUserInfo.show(arguments, this)
                        }
                    }
                    if (g_config.isYKY) {
                        initYKYDetail(itemInfo) && HdGame.aUserInfo.show(arguments, this);
                        return
                    }
                    initCodeStatus(awardInfo, itemInfo);
                    var gameId = itemInfo.gameid || itemInfo.gameId;
                    $("#awardCodeLayer,#awardDetailBox").find(".codeImg").attr("src", "http://" + HdGame.gameDomain + "/manage/qrCode.jsp?cmd=qrurl&siteUrl=" + HdGame.encodeUrl(itemInfo.awardLevel == 900 ? ("id=" + itemInfo.id + "&code=" + itemInfo.code1 + "&gameId=" + gameId) : ("code=" + itemInfo.awardCode + "&gameId=" + gameId)));
                    awardDetailBox.find(".code,.copyCode").text(itemInfo.awardCode);
                    $("#awardCodeLayer").find(".code").text(itemInfo.awardCode);
                    awardDetailBox.find(".code").attr("code", itemInfo.code);
                    var bottomCusBtnInfo = awardDetailBox.find("#bottomCusBtnInfo");
                    HdGame.log(bottomCusBtnInfo);
                    var award = itemInfo._award;
                    bottomCusBtnInfo.removeAttr("href").off(".cusBtn");
                    $("#awardDetailBox #ticketDetailBox .addressLine .guideMap").data("pointData", award.addressData);
                    if (arg.afterWxCard) {
                        if (awardInfo.$type.sitetype == "wxUrl") {
                            var addParam = (/\?/).test(g_config.sendGiftUrl);
                            var wxJumpUrl = function(jumpUrl) {
                                var typeB = g_config.award._award.giftTypeItem.val;
                                bottomCusBtnInfo.attr("href", jumpUrl + (addParam ? "&": "?") + "typeB=" + typeB + "&awardCode=" + itemInfo.awardCode + "&gameId=" + g_config.gameId)
                            };
                            if ($.inArray(awardInfo.awardtype, [6, 7]) != -1) {
                                wxJumpUrl(g_config.sendGiftUrl)
                            } else {
                                if ($.inArray(awardInfo.awardtype, [8, 11, 12, 13]) != -1) {
                                    wxJumpUrl(g_config.sendVideoVipUrl)
                                } else {
                                    bottomCusBtnInfo.attr("href", g_config.redPacketUrl + "&redCode=" + itemInfo.awardCode)
                                }
                            }
                        } else {
                            if (awardInfo.$type.sitetype == "url") {
                                var protocol = awardInfo.cashsite.indexOf("https:") > -1 ? "https:": "http:";
                                var cashsiteUrl = HdGame.fixUrl(protocol + "//" + awardInfo.cashsite.replace(/^(http(s)?:\/\/)+/g, ""));
                                if (/[?&]hd_code=djm\b/.test(cashsiteUrl)) {
                                    cashsiteUrl = HdGame.setUrlArg(cashsiteUrl, ["hd_code", itemInfo.awardCode])
                                }
                                bottomCusBtnInfo.attr("href", cashsiteUrl)
                            } else {
                                if (awardInfo.$type.sitetype == "taopw") {
                                    bottomCusBtnInfo.off(".cusBtn").on("click.cusBtn",
                                    function() {
                                        showTaopw(awardInfo, itemInfo)
                                    })
                                } else {
                                    if (awardInfo.$type.sitetype == "img") {
                                        if (awardInfo.awardtype == 2 && awardInfo.cashtype == 1 && awardInfo.onlinect == 1) {
                                            HdGame.createQrImg($("#plAttentionPoup"), awardInfo.onlinewxnum);
                                            HdGame.createQrImg($("#newAttentionPoup"), awardInfo.onlinewxnum)
                                        } else {
                                            if ((awardInfo.awardtype == 2 && awardInfo.cashtype == 3) || $.inArray(awardInfo.awardtype, [5, 6, 7, 8, 11, 12, 13]) != -1) {
                                                HdGame.createQrImg($("#plAttentionPoup"), g_config.qrCodeUrl);
                                                HdGame.createQrImg($("#newAttentionPoup"), awardInfo.attentionimg)
                                            }
                                        }
                                        bottomCusBtnInfo.off(".cusBtn").on("click.cusBtn",
                                        function() {
                                            $("#plAttentionMask").show()
                                        })
                                    } else {
                                        if (awardInfo.$type.sitetype == "text") {
                                            bottomCusBtnInfo.off(".cusBtn").on("click.cusBtn",
                                            function() {
                                                cusBtnCancel(awardInfo, itemInfo)
                                            })
                                        }
                                    }
                                }
                            }
                        }
                        if (itemInfo) {
                            if (itemInfo.codeStatus == 6) {
                                if (itemInfo.aid && itemInfo.aid == 17396608) {} else {
                                    $(".codeImgBox .codeLine").hide()
                                }
                            } else {
                                $(".codeImgBox .codeLine").show()
                            }
                        }
                    } else {
                        $(".awardCusText").toggle(awardInfo.optx);
                        awardDetailBox.find("#awardCusTextInfo").text(awardInfo.txc)
                    }
                    if (awardInfo.genewxcard) {
                        bottomCusBtnBox.hdToggle("codeStatus", itemInfo.theGiftDate < 0 || itemInfo.codeStatus != 1)
                    } else {
                        bottomCusBtnBox.find("#bottomCusBtnInfo").hdToggle("codeStatus", !(itemInfo.theGiftDate < 0 || (awardInfo.$type.sitetype == "text" && $.inArray(itemInfo.codeStatus, [4, 1, 5, 3]) != -1)))
                    }
                    HdGame.logDog(1000085);
                    if (awardInfo.attention == 3) {
                        HdGame.createQrImg($("#newAttentionPoup"), awardInfo.attentionimg);
                        $("#awardCusBtnInfo").off(".cusBtn").on("touchend.cusBtn",
                        function() {
                            HdGame.logDog(1000086);
                            $("#newAttentionMask").show()
                        })
                    } else {
                        if (awardInfo.attention == 2) {
                            $("#awardCusBtnInfo").off(".cusBtn").attr("href", HdGame.fixUrl(awardInfo.btl))
                        }
                    }
                    var hostInfoDetail = $("#hostInfoDetail").off("click.hostDetail");
                    if (awardInfo.isOpenHostInfo) {
                        hostInfoDetail.on("click.hostDetail",
                        function() {
                            HdGame.jumpToHostUrl(true)
                        })
                    }
                    $("#awardCusBtnInfo").hdToggle("attention", awardInfo.attention != 1);
                    HdGame.wxConfig.setWxShareUrlArg(["fromFav", itemInfo.awardCode]);
                    HdGame.logDog(1000056);
                    HdGame.logDog(1000045, 1);
                    $("#awardDeailBg").show();
                    setTimeout(function() {
                        $("#awardDeailBg").hide()
                    },
                    800)
                }
                var watch = HdGame.watch.bind(["award", "game.$cAward", awardInfo], ["type", "game.$cAward.$type", awardInfo.$type]);
                watch("{award}.cbt",
                function(val) {
                    var codeBgTime = awardDetailBox.find(".awardCodeTime .codeBgTime");
                    if (!codeBgTime[0]) {
                        awardDetailBox.find(".awardCodeTime").append(" : <span class='codeBgTime'></span> - ")
                    }
                    typeof val != "string" && (val = val.toString());
                    awardDetailBox.find(".awardCodeTime .codeBgTime").text(val.substring(0, 10).replace("-", ".").replace("-", "."));
                    if (arg.afterWxCard) {
                        var itemListBeginTime = awardDetailBox.find(".itemList .beginTime");
                        if (!itemListBeginTime[0]) {
                            awardDetailBox.find(".itemList.dateLine.codeTimeFixedRange .box").html("").append("<span class='beginTime'></span>至")
                        }
                        ticketDetailBox.find(".itemList .beginTime").html(val.substring(0, 10))
                    }
                });
                watch("{award}.cet",
                function(val) {
                    var codeBgTime = awardDetailBox.find(".awardCodeTime .codeEndTime");
                    if (!codeBgTime[0]) {
                        awardDetailBox.find(".awardCodeTime").append("<span class='codeEndTime'></span>")
                    }
                    typeof val != "string" && (val = val.toString());
                    awardDetailBox.find(".awardCodeTime .codeEndTime").text(val.substring(0, 10).replace("-", ".").replace("-", "."));
                    if (arg.afterWxCard) {
                        var itemListBeginTime = awardDetailBox.find(".itemList .endTime");
                        if (!itemListBeginTime[0]) {
                            awardDetailBox.find(".itemList.dateLine.codeTimeFixedRange .box").append("<span class='endTime'></span>")
                        }
                        ticketDetailBox.find(".itemList .endTime").html(val.substring(0, 10))
                    }
                });
                HdGame.watch("game.$cAward.name", itemInfo.awardName,
                function(val) {
                    awardDetailBox.find(".awardName").text(val)
                });
                watch("{award}.stl",
                function(val) {
                    awardDetailBox.find(".awardSubTitle").text(val)
                });
                watch("{type}.showsitebox?{award}.opti:{type}.opti",
                function(val) {
                    awardDetailBox.add("#awardCodeLayer").find(".codeOptInfo").text(val)
                });
                watch("{type}.deadline",
                function(val) {
                    if (awardInfo && awardInfo.genewxcard && awardInfo.t_type == "DATE_TYPE_FIX_TERM" && !awardInfo.depositTime && !awardInfo.depositTime) {
                        if (!_manage) {
                            var dateTips = getDateTipByFixTerm(awardInfo.cfbt, awardInfo.cft);
                            awardDetailBox.find(".awardCodeTime").html("<em>" + dateTips + " </em>");
                            awardDetailBox.find(".itemList.dateLine.codeTimeFixedRange .box").text(dateTips);
                            return
                        }
                    }
                    awardDetailBox.find(".awardCodeTime em").text(val)
                });
                watch("{type}.collect",
                function(val) {
                    $("#awardCollectionBtn").text(val)
                });
                watch("{type}.codename",
                function(val) {
                    $("#codeName").text(val)
                });
                watch("{award}.btn",
                function(val) {
                    awardDetailBox.find(".awardCusBtn .text").text(val)
                });
                watch("{award}.awardtype",
                function(val) {
                    if (val == 6 || val == 7 || val == 8) {
                        $("#codeDetailInfoBox").find(".codeOptInfo_Gift").canShow();
                        $("#codeDetailInfoBox").find(".codeOptInfo").mustHide();
                        ticketDetailBox.find(".addressLine").mustHide()
                    } else {
                        $("#codeDetailInfoBox").find(".codeOptInfo_Gift").mustHide();
                        $("#codeDetailInfoBox").find(".codeOptInfo").canShow();
                        ticketDetailBox.find(".addressLine").canShow()
                    }
                });
                watch("{type}.btn",
                function(val) {
                    awardDetailBox.find("#bottomCusBtnInfo .text").text(val)
                });
                watch("{award}.genewxcard",
                function(val) {
                    if (val) {
                        if (!itemInfo.depositTime) {
                            itemInfo.depositTime = awardInfo.depositTime
                        }
                        if (awardInfo.depositTime) {
                            awardDetailBox.find("#bottomCusBtnInfo .text").text("打开微信卡券")
                        }
                    }
                });
                watch("{type}.sitetype == 'url' && !{award}.$cashsite_url",
                function(val) {
                    awardDetailBox.find("#bottomCusBtnBox #bottomCusBtnInfo,.codeOptInfo").hdToggle("emptyUrl", !val)
                });
                watch("{award}.$opqrc",
                function(val) {
                    if (typeof val === "undefined" || val) {
                        $("#awardDetailBox .codeImg ").show()
                    } else {
                        $("#awardDetailBox .codeImg,#awardDetailBox .codeDetailImgBox").hide()
                    }
                });
                watch("{award}.addressType == 0",
                function(val) {
                    $("#awardDetailBox #ticketDetailBox .addressLine").toggleClass("addGuideMap", val)
                });
                if (arg.afterWxCard) {
                    watch("{type}.details",
                    function(val) {
                        ticketDetailBox.find(".awardCusText .text,.ticketitle .text").html(val)
                    });
                    watch("{type}.sitetype == 'text'",
                    function(val) {
                        awardDetailBox.find("#useStoreBox").hdToggle("address", val);
                        ticketDetailBox.find(".addressLine").toggleClass("addressHide", !val)
                    });
                    watch("{type}.site",
                    function(val) {
                        ticketDetailBox.find(".itemList .titleAdress").text(val)
                    });
                    watch("{type}.term",
                    function(val) {
                        ticketDetailBox.find(".itemList .timelimit").parents(".itemList").toggle(val)
                    });
                    watch("{type}.showcopy",
                    function(val) {
                        $("#codeDetailInfoBox .copy").toggle(val)
                    });
                    watch("{type}.showsitebox?{award}.opti:{type}.opti",
                    function(val) {
                        awardDetailBox.find(".codeOptInfo").text(val);
                        awardDetailBox.find(".codeOptInfo_Gift").text(val)
                    });
                    watch("{award}.$cashsite_text",
                    function(val) {
                        ticketDetailBox.find(".itemList .address").text(val)
                    });
                    watch("{type}.notice",
                    function(val) {
                        ticketDetailBox.find(".itemList .titleNotice").text(val)
                    });
                    watch("{award}.servicepho",
                    function(val) {
                        if (_manage) {
                            awardDetailBox.find(".servicePhone .text").html("客服电话" + (!val ? "（未开启）": ""))
                        } else {
                            awardDetailBox.find(".servicePhone").toggle( !! val);
                            awardDetailBox.find(".servicePhone").parent("a").attr("href", "tel:" + val)
                        }
                        awardDetailBox.find(".servicePhone .phoneText").text(val)
                    });
                    watch("{award}.isOpenHostInfo",
                    function(val) {
                        if (_manage) {
                            awardDetailBox.find(".jumptoHostInfo .text").html("主办方介绍" + (!val ? "（未开启）": ""))
                        } else {
                            awardDetailBox.find(".jumptoHostInfo").toggle( !! val)
                        }
                    });
                    watch("{award}.tlmt",
                    function(val) {
                        ticketDetailBox.find(".itemList .timelimit").text(HdGame.changeTimeLimit(val))
                    });
                    watch("{award}.cashinfo",
                    function(val) {
                        if (val == null || val == "") {
                            if (_manage) {
                                val = "<span style='color: #999;'>不填写则不显示</span>"
                            } else {
                                ticketDetailBox.find(".noticeLine").hide()
                            }
                        } else {
                            val = HdGame.encodeHtml(val);
                            ticketDetailBox.find(".noticeLine").show()
                        }
                        ticketDetailBox.find(".itemList .notice>pre").html(val)
                    });
                    watch("{award}.storeType",
                    function(val) {
                        if (val && val != 1) {
                            awardDetailBox.find("#useStoreBox").canShow("storeType");
                            ticketDetailBox.find(".addressLine").addClass("hide")
                        } else {
                            awardDetailBox.find("#useStoreBox").mustHide("storeType");
                            ticketDetailBox.find(".addressLine").removeClass("hide")
                        }
                    });
                    watch("{award}.$$useStoreList",
                    function(val) {
                        if (!_manage && (!val || val.length <= 0)) {
                            return
                        }
                        if (_manage || g_config.test) {
                            showStoreList(val)
                        } else {
                            wx.ready(function() {
                                wx.getLocation({
                                    type: "gcj02",
                                    success: function(res) {
                                        var latitude = res.latitude;
                                        var longitude = res.longitude;
                                        showStoreList(val, latitude, longitude)
                                    },
                                    fail: function(res) {
                                        HdGame.statusMsg("当前微信版本不支持定位或没开启定位服务，请联系活动主办单位", "");
                                        showStoreList(val)
                                    },
                                    cancel: function() {
                                        HdGame.statusMsg("用户拒绝了授权地理位置信息", "");
                                        showStoreList(val)
                                    }
                                })
                            })
                        }
                    })
                } else {
                    watch("{award}.txn",
                    function(val) {
                        awardDetailBox.find(".awardCusText .text").text(val)
                    })
                }
                var seeFsnDetailBtn = $("#seeFsnDetail").hide();
                $("#awardCusBtnInfo").next().height("3.15rem");
                seeFsnDetailBtn.off(".fsnBtn").on("click.fsnBtn",
                function() {
                    HdGame.fission.showFissionDetail(itemInfo)
                });
                var isFsnCoupon = Fai.checkBit(itemInfo.flag, 128);
                if (awardInfo.awardtype == 9) {
                    if (!_manage) {
                        awardDetailBox.hide();
                        $.ajax({
                            type: "post",
                            url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getJzCouponAwardUrl",
                            data: {
                                gameId: g_config.gameId,
                                openId: g_config.openId,
                                code: awardDetailBox.find(".code").attr("code")
                            },
                            success: function(data) {
                                var result = $.parseJSON(data);
                                if (result.success) {
                                    var jzUrl = result.url ? result.url: result.data.url;
                                    window.location.href = jzUrl
                                } else {
                                    var options = {
                                        bodyMsg: result.msg == "游戏未发布" ? "活动尚未发布<br>无法查看奖品详情": result.msg,
                                        primaryBtnFn: function() {
                                            hg.fire("scrollEvent", true)
                                        }
                                    };
                                    HdGame.showMsgToast2(options)
                                }
                            }
                        })
                    }
                } else {
                    if (!_manage && isFsnCoupon && !itemInfo.fissileOriginCode) {
                        var curFsnData = $.parseJSON(itemInfo.prop);
                        if ($(this).hasClass("seeCurAwaFsn") || [1, 3, 4, 5].indexOf(itemInfo.codeStatus) != -1 || curFsnData.fissileFinish || g_config.isFromFav) {
                            g_config.isFromFav = false;
                            awardDetailBox.show();
                            seeFsnDetailBtn.toggle([1, 3, 4, 5].indexOf(itemInfo.codeStatus) == -1);
                            $("#awardCusBtnInfo").next().height("5.4rem")
                        } else {
                            HdGame.fission.showFissionDetail(itemInfo)
                        }
                    } else {
                        awardDetailBox.show()
                    }
                }
                if (_manage) {
                    var theScrollHigh = $("#awardDetailScrollBox").prop("scrollHeight");
                    var theClientHigh = $("#awardDetailScrollBox").prop("clientHeight");
                    $("#awardDetailScrollBox").scrollTop(theScrollHigh - theClientHigh)
                }
            };
            HdGame.showWxCodePage = function(wxAwardCode, myBagUrl) {
                if (wxAwardCode) {
                    var params = new Array();
                    params.push("gameId=", arg.gameId);
                    params.push("&openId=", arg.openId);
                    if (g_config.isDoubleGame) {
                        params.push("&openIdB=", HdGame.otherOpenId)
                    }
                    HdGame.ajaxLoad.show();
                    $.ajax({
                        type: "post",
                        url: arg.awardUrl,
                        data: params.join(""),
                        error: function() {
                            HdGame.ajaxLoad.hide()
                        },
                        success: function(data) {
                            HdGame.ajaxLoad.hide();
                            var result = $.parseJSON(data);
                            if (result.success) {
                                var awardList = result.list;
                                var awardLen = awardList.length;
                                for (var i = 0; i < awardLen; i++) {
                                    if (awardList[i].code == wxAwardCode) {
                                        HdGame.openAwardDetail(awardList[i]);
                                        break
                                    }
                                }
                            }
                        }
                    })
                }
            };
            HdGame.getScrollWidth = function() {
                var outerDiv = $('<div class="outerDiv"></div>').prependTo($("body"));
                var innerDiv = $('<div class="innerDiv"></div>').appendTo(outerDiv);
                var scrollWidth = outerDiv.width() - innerDiv.width();
                outerDiv.remove();
                return scrollWidth
            }
        })();
        HdGame.shouldRegInfo = function(type, _argument, _this) {
            var args = arrPro.slice.call(arguments);
            if ($.isArray(type)) {
                for (var i = 0; i < type.length; i++) {
                    args[0] = type[i];
                    if (HdGame.shouldRegInfo.apply(HdGame, args)) {
                        return true
                    }
                }
                return false
            }
            var shouldReg = false;
            if (g_config.afterLinkModify) {
                if (g_config.linkInfoType != 1 && g_config.linkInfoType == type) {
                    shouldReg = true
                }
                if (HdGame._isZhuliPlayer && (g_config.linkInfoType == 2 || g_config.linkInfoType == 3)) {
                    shouldReg = false
                }
                if (type == 4 && !g_config.linkInfoAll) {
                    if (g_config.award) {
                        var item_awardLevel = g_config.award.level;
                        var itemInfo_awardName = g_config.award.awardName;
                        if (item_awardLevel == 900) {
                            item_awardLevel = g_config.award.awardLevel;
                            shouldReg = g_config.comfort.comOplink
                        } else {
                            shouldReg = g_config.awardList[item_awardLevel - 1].oplink
                        }
                    }
                }
            } else {
                if ((gameType == 3 || gameType == 1) && g_config.openAwardLinkNoDraw) {
                    shouldReg = true
                }
            }
            if (shouldReg && !isRegLinkInfo()) {
                args.length > 1 && HdGame.aUserInfo.show(_argument, _this);
                return true
            }
            return false;
            function isRegLinkInfo() {
                if (g_config.awardUsername || g_config.awardPhone || g_config.awardAddress) {
                    return true
                }
                var userInfo = g_config.userInfo;
                if (userInfo) {
                    for (var p in userInfo) {
                        if (/^aprop.*/.test(p) && userInfo[p] != null && userInfo[p] !== "") {
                            return true
                        }
                    }
                }
                return false
            }
        };
        function poupRegAward(flag) {
            $("#regAwardBox .poupMainInfo").css("height", $("#regAwardBox").height() - $("#regAwardBox .attentionBox").height() - 18);
            $("#regAwardBox").show();
            if (_manage) {
                HdGame.homePoup(flag);
                var regAwardList = [];
                var name = ["lvox、hubert", '<span style="color:#fff000">magazine</span>、tina', "monica、hth"];
                var boxList = $(".regAwardList");
                boxList.find(".playerName").html("");
                boxList.each(function(i) {
                    $(this).find(".playerName").html(name[i])
                })
            } else {
                HdGame.logDog(1000034);
                var getRegAwardUrl = arg.getRegAwardUrl;
                if (g_config.isDoubleGame) {
                    var getRegAwardUrl = getRegAwardUrl + "&openIdB=" + HdGame.otherOpenId
                }
                if (g_config.firstTouchWinList) {
                    HdGame.ajaxLoad.show();
                    $.ajax({
                        type: "post",
                        url: getRegAwardUrl,
                        error: function() {
                            HdGame.ajaxLoad.hide()
                        },
                        success: function(data) {
                            HdGame.ajaxLoad.hide();
                            HdGame.tlog("poupRegAward", data);
                            var info = $.parseJSON(data);
                            $("#Mingdan_Round_Dot").hide();
                            var resultFlag = createGetRegList(info);
                            setTimeout(function() {
                                if (resultFlag) {
                                    $("#noRegAward").hide();
                                    $("#regAwardMain").show()
                                } else {
                                    $("#noRegAward").show();
                                    $("#regAwardMain").hide()
                                }
                            },
                            500);
                            g_config.firstTouchWinList = false
                        }
                    })
                }
            }
        }
        function createGetRegList(info) {
            var flag = false;
            $("#regAwardMain").empty();
            if (!info) {
                return flag
            }
            var regAwardList = info.regAwardList;
            for (var i = 0; i < regAwardList.length; ++i) {
                var awardInfo = regAwardList[i];
                if (awardInfo) {
                    var level = awardInfo.level;
                    $("#regAwardMain").append(getAwardNameForRewardList(level));
                    var list = awardInfo.list;
                    var boxList = $(".regAwardList");
                    var resultNames = [];
                    for (var j = 0; j < list.length; ++j) {
                        var name = list[j].name;
                        var isSelf = list[j].isSelf;
                        if (isSelf) {
                            resultNames.push('<span style="color:#fff000;">' + name + "</span>");
                            continue
                        }
                        resultNames.push(name)
                    }
                    boxList.eq(i).find(".playerName").append(resultNames.join("、"));
                    flag = true
                }
            }
            return flag
        }
        function getAwardNameForRewardList(i) {
            var style = i == 9 ? g_config.comfort.cas: g_config.awardList[i - 1].style;
            return "<div class='regAwardList'><div class='mainTitle'>" + style + "</div><div class='playerName' style='margin-bottom:12px;'></div></div>"
        }
        function poupInform(flag) {
            $("#informBox").show();
            $(".unPublish").hide();
            $("#inform-reason-page").show();
            $("#inform-desc-page").hide();
            $("#next-inform-btn").hide();
            $("#inform-reason-box .reasonItem").removeClass("checked");
            $("#informResultBox .confirm-btn").off("touchend").on("touchend",
            function() {
                event.preventDefault();
                if (!_manage) {
                    $(".gameBox,.home,.body").removeClass("overflow-y-hidden");
                    g_config.showSkillSup && $(".bottomSkill").show()
                }
                $("#informBox").hide();
                $("#informResultBox").hide();
                $(".unPublish").show();
                $("#inform-reason-box .reasonItem").removeClass("checked");
                $("#inform-reason-box .reasonItem em").hide();
                $("#poupInfoBox").hide();
                hg.fire("hidePoup", flag)
            });
            $("#cancel-inform-btn").off("touchend").on("touchend",
            function() {
                event.preventDefault();
                var poupInfoBox = $("#poupInfoBox");
                poupInfoBox.removeClass("retrans");
                if (!_manage) {
                    $(".gameBox,.home,.body").removeClass("overflow-y-hidden");
                    g_config.showSkillSup && $(".bottomSkill").show()
                }
                poupInfoBox.hide();
                $(".unPublish").show();
                $("#informBox").hide();
                hg.fire("hidePoup", flag)
            })
        }
        $("#inform-reason-box .reasonItem").on("touchend",
        function() {
            var toucItem = $(this).attr("_index");
            HdGame.logDog(1000068, toucItem);
            $("#inform-reason-box .reasonItem").removeClass("checked");
            $(this).addClass("checked");
            $("#next-inform-btn").show()
        });
        $("#next-inform-btn").on("touchend",
        function() {
            $("#inform-reason-page").hide();
            $("#inform-desc-page").show();
            $("#spxdPage").addClass("imp-hide")
        });
        $("#inform-desc-box #informDesc").on("load input",
        function() {
            var desc = $("#inform-desc-box #informDesc").val();
            desc = $.trim(desc);
            $("#inform-desc-box #informDesc-counter span").text(desc.length)
        });
        $("#submit-inform-btn").on("touchend",
        function() {
            if (!arg.hasReport) {
                var desc = $("#inform-desc-box #informDesc").val();
                desc = $.trim(desc);
                if (desc == null || desc == "") {
                    HdGame.showMsgToast("描述不能为空");
                    return
                } else {
                    if (desc.length > 50) {
                        HdGame.showMsgToast("填写超出限制");
                        return
                    } else {
                        $.ajax({
                            type: "post",
                            url: arg.informUrl,
                            error: function(a) {
                                HdGame.tlog("submit-inform-btn-err", a)
                            },
                            success: function(data) {
                                HdGame.tlog("submit-inform-btn", data);
                                arg.hasReport = true;
                                $("#informResultBox h3").text("投诉成功");
                                $("#informResultBox").show()
                            }
                        })
                    }
                }
            } else {
                $("#informResultBox h3").text("你已经投诉过了！");
                $("#informResultBox").show()
            }
            var poupInfoBox = $("#poupInfoBox");
            poupInfoBox.removeClass("poupFadIn").addClass("poupFadOut");
            setTimeout(function() {
                $("#spxdPage").removeClass("imp-hide")
            },
            400)
        });
        $("#awardContactInfo .updateBtn").on("click",
        function() {
            if (_manage) {
                return
            }
            HdGame.aUserInfo.show()
        });
        window.requestAnimFrame = (function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60)
            }
        })()
    })(); (function() {
        HdGame.sortRuleBox = {
            init: initRuleBox
        };
        function initRuleBox(sortStr) {
            HdGame.tlog("initRule");
            var rule = $("#ruleBox > .poupMainInfo");
            var poupLine = rule.find(".poupLine");
            if (poupLine.length > sortStr.length) {
                var aCode = "a".charCodeAt();
                for (var i = sortStr.length; i < poupLine.length; i++) {
                    sortStr += String.fromCharCode(aCode + i)
                }
            }
            var sortEle = poupLine.sort(function(a, b) {
                var aIndex = sortStr.indexOf($(a).data("sortkey"));
                var bIndex = sortStr.indexOf($(b).data("sortkey"));
                if (aIndex == -1 || bIndex == -1) {
                    return 0
                }
                return aIndex > bIndex ? 1 : -1
            });
            rule.append(sortEle);
            if (g_config.style == 75) {
                $("#ruleBox").append('<div id="informLine" class="noMove"><div id="newInformBtn" ontouchend="HdGame.changePoup(5,\'\',true);hg.fire(\'scrollEvent\',false);" class="noMove">投诉</div></div>')
            } else {
                if (g_config.style == 69) {
                    rule.append('<div id="informLine" class="noMove"><div id="newInformBtn" ontouchend="HdGame.changePoup(5,\'\',true);$(\'.body\').scrollTop(0);" class="noMove">投诉</div></div>')
                } else {
                    rule.append('<div id="informLine" class="noMove"><div id="newInformBtn" ontouchend="HdGame.changePoup(5,\'\',true);" class="noMove">投诉</div></div>')
                }
            }
        }
    })(); (function() {
        var aUserInfo = {};
        aUserInfo.show = function(arg, s, isSetFissileInfo) {
            if (!HdGame.lastDisplayStatus) {
                HdGame.lastDisplayStatus = {
                    gameBox: $(".gameBox").is(":visible"),
                    home: $(".home").is(":visible")
                }
            }
            HdGame.tlog(HdGame.lastDisplayStatus);
            var url = g_config.ajaxUrl.replace("/ajax/", "");
            $("#awardUserInfoBg").data({
                _aUserInfoArg: arg,
                _aUserInfoThis: s
            }).show();
            HdGame.ajaxLoad.hide();
            if ($("#contactInputIframe").length == 0) {
                setTimeout(function() {
                    HdGame.ajaxLoad.show();
                    var $iframe = $('<iframe id="contactInputIframe" frameborder="0" scrolling="yes" src="' + url + "/contactInfo.jsp?afterLinkModify=" + g_config.afterLinkModify + "&fromCanal=" + fromCanal + "&awardLinkMsg=" + HdGame.encodeUrl(HdGame._awardLinkMsg) + "&isSetFissileInfo=" + isSetFissileInfo + '" style="height: 100%; width: 100%;"></iframe>');
                    $("#awardUserInfoBg").append($iframe);
                    $iframe.load(function() {
                        $(".gameBgBox,.home").hide();
                        HdGame.ajaxLoad.hide()
                    })
                },
                50)
            }
            $("#spxdPage").addClass("spxdPageHide");
            $("#nameInput").val(g_config.awardUsername);
            $("#phoneInput").val(g_config.awardPhone);
            $("#addressInput").text(g_config.awardAddress);
            if (!arg) {
                $("#awardUserInfoBg").removeData("_aUserInfoArg")
            }
        };
        aUserInfo.hide = function() {
            HdGame.tlog(HdGame.lastDisplayStatus);
            if (HdGame.lastDisplayStatus) {
                if (HdGame.lastDisplayStatus.gameBox) {
                    $(".gameBgBox").show()
                }
                if (HdGame.lastDisplayStatus.home) {
                    $(".home").show()
                }
                HdGame.lastDisplayStatus = null
            }
            var awardUserInfoBg = $("#awardUserInfoBg");
            awardUserInfoBg.hide();
            $("#spxdPage").removeClass("spxdPageHide");
            var gArg = awardUserInfoBg.data("_aUserInfoArg");
            if (!gArg) {
                return
            }
            if (isCallee(gArg)) {
                var option = gArg[2];
                if (option && option.info) {
                    option.info = $.parseJSON(option.info);
                    option.info.ausername = g_config.awardUsername;
                    option.info.aphone = g_config.awardPhone;
                    option.info.aadress = g_config.awardAddress;
                    option.info = $.toJSON(option.info)
                }
            }
            aUserInfo.afterUserInfoHide = true;
            var _aUserInfoThis = awardUserInfoBg.data("_aUserInfoThis");
            gArg.callee.apply(_aUserInfoThis, gArg);
            setTimeout(function() {
                aUserInfo.afterUserInfoHide = false
            },
            0);
            setTimeout(function() {
                $("#contactInputIframe").remove()
            },
            510);
            function isCallee(gArg) {
                if (typeof gameOver != "undefined" && gArg.callee === gameOver) {
                    return true
                }
                if (typeof startBtnAjax != "undefined" && gArg.callee === startBtnAjax) {
                    return true
                }
                if (typeof luckDraw != "undefined" && gArg.callee === luckDraw) {
                    return true
                }
                return false
            }
        };
        HdGame.aUserInfo = aUserInfo
    })();
    HdGame.showLotsWait = function(waitTime, callBack) {
        var hintNum = $("#lots-wait-Box #lots-wait-hint-num");
        hintNum.text(waitTime);
        $("#lots-wait-Box").show();
        var timer = setInterval(function() {
            waitTime--;
            hintNum.text(waitTime);
            if (waitTime <= 0) {
                clearInterval(timer);
                $("#lots-wait-Box").hide();
                callBack()
            }
        },
        1000)
    }; (function() {
        var heightFlag = Math.max($(window).height() / $(window).width(), $(window).width() / $(window).height()) > 22 / 16;
        var resulePoup = {
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
        var hg_deviceMotionHandler = (function() {
            var SHAKE_THRESHOLD = 1.5;
            var last_update = 0;
            var x, y, z;
            var _lastX, _lastY, _lastZ;
            return function(eventData) {
                if (!resulePoup.startStatus) {
                    return
                }
                var curTime = new Date().getTime();
                if ((curTime - last_update) > 100) {
                    $("input").blur();
                    var acceleration = eventData.accelerationIncludingGravity;
                    last_update = curTime;
                    x = acceleration.x;
                    y = acceleration.y;
                    z = acceleration.z;
                    var speed = Math.sqrt(x * x + y * y + z * z) / Math.sqrt(_lastX * _lastX + _lastY * _lastY + _lastZ * _lastZ);
                    if (speed > SHAKE_THRESHOLD) {
                        resulePoup.startStatus = false;
                        initArg.giftInit(function(arg) {
                            hg.sound.play("yiy");
                            setTimeout(function() {
                                resulePoup.showGift(arg)
                            },
                            1500)
                        })
                    }
                    _lastX = x;
                    _lastY = y;
                    _lastZ = z
                }
            }
        })();
        var _userArg = {};
        resulePoup.initArg = function(arg) {
            if (this.disable) {
                return
            }
            $.extend(_userArg, arg)
        };
        resulePoup.init = function(arg) {
            if (this.disable) {
                return
            }
            $.extend(initArg, arg);
            $.extend(initArg, _userArg);
            this.giftBox = $("#resule-gift-box");
            this.resuleBox = $(".resuleBox");
            this.statusBox = $("#resule-status-box");
            var that = this;
            var lotsPotW = $("#resule-status-lots").width();
            var lotsPotH = $("#resule-status-lots").height();
            var lotsWaitW = $("#lots-wait-img").width();
            var lotsWaitH = $("#lots-wait-img").height();
            $("#lots-wait-img").css({
                width: lotsPotW / (6.15 * g_rem) * lotsWaitW,
                height: lotsPotH / (12.4 * g_rem) * lotsWaitH,
            });
            if (HdGame.currentScore >= g_config.scoreSet && g_config.scoreSet != "") {
                HdGame.isplaySucess = true
            } else {
                HdGame.isplaySucess = false
            }
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
                    hg.sound.load(_resRoot + "/image/yaoyiyao.mp3", "yiy");
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
            if (this.disable || this.result_disable) {
                return
            }
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
            var arg = $.extend(resuleDef, args);
            HdGame.tlog("resuleDef---", arg.gameScore);
            if (!_manage && g_config.showSkillSup) {
                if (arg.isSuc) {
                    HdGame.logDog(1000200, 5);
                    g_config.localPoupPage = 5
                } else {
                    HdGame.logDog(1000200, 6);
                    g_config.localPoupPage = 6
                }
            }
            this.resuleArg = arg; ! arg.notreal && (HdGame.currentRank = arg.rank); ! arg.notreal && (HdGame.currentScore = arg.bestScore);
            HdGame.wxConfig.setWxShareByStatus();
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
            if (!arg.notreal && g_config.sortType == (arg.gameScore >= g_config.drawLimitDef)) {
                if (typeof HdGame.oss_aof === "undefined") {
                    HdGame.oss_aof = 0
                }
                HdGame.oss_aof++;
                if (HdGame.oss_aof >= 2) {
                    HdGame.logDog(1000033, g_config.failSrcId);
                    HdGame.oss_aof = 0
                }
            }
            $("#resule-status-scrollWrap").css("height", $(window).height() - 1.2 * g_rem);
            if (!_manage && g_config.showSkillSup) {
                HdGame.hdSkillLog(true, 1000069);
                HdGame.logDog(1000028, 1);
                typeof g_config.isAOpenId == "number" && HdGame.logDog(1000115, 1 + g_config.isAOpenId)
            }
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
        resulePoup.showGift = function(args) {
            if (this.disable || this.gift_disable) {
                return
            }
            var giftDef = {
                isSuc: false,
                giftName: "",
                giftStyle: "",
                giftCode: 0,
                giftImage: "",
                awardImageW: "6rem",
                awardImageH: "6rem",
                awardTypeNum: 0,
                awardIndex: 1,
                genewxcard: false
            };
            var arg = $.extend({},
            giftDef, args);
            var showNoAwardTips = gameType == 0 && g_config.isShowNoAwardTips && arg.isOutAwardNum;
            if (!_manage && g_config.showSkillSup) {
                if (arg.isSuc) {
                    HdGame.logDog(1000200, 7);
                    g_config.localPoupPage = 7
                } else {
                    HdGame.logDog(1000200, 8);
                    g_config.localPoupPage = 8
                }
            }
            if (this.statusBox && !showNoAwardTips) {
                HdGame.fadIn(this.statusBox)
            }
            if (showNoAwardTips) {
                HdGame.showMsg("来得太晚啦<br>奖品已经派完，下次请早点哦", 0, "返回首页",
                function() {
                    if (g_config.style == 51 || g_config.style == 62) {
                        window.location.reload()
                    } else {
                        home("luckDraw")
                    }
                },
                true)
            } else {
                $("#resule-gift-sucImg").data("openCode", arg.giftCode);
                HdGame.fadOut(this.resuleBox);
                HdGame.fadOut(this.giftBox);
                if ((gameType == 0 || gameType == 4 || gameType == 5) && !_manage) {
                    var showHeight = $(".cannotGetThePriceBox").height();
                    var limitHeight = $(".resuleBox").height() - $("#resule-gift-box").find(".attentionBox").height() - 2.5 * g_rem;
                    limitHeight = g_config.style == 75 ? limitHeight + 2.5 * g_rem: limitHeight;
                    if (showHeight > limitHeight) {
                        $(".cannotGetThePriceBox").height(limitHeight);
                        var imglimitWidth = 16 * g_rem - parseFloat($("#faiImgBox img").css("left"));
                        var imgLimitHeight = limitHeight - parseFloat($("#faiImgBox img").css("top"));
                        var thePies = $("#faiImgBox img").width() / $("#faiImgBox img").height();
                        var originHeight = $("#faiImgBox img").height();
                        if (originHeight > imgLimitHeight) {
                            if ((imgLimitHeight * thePies) > imglimitWidth) {
                                $("#faiImgBox img").height(imglimitWidth / thePies).width(imglimitWidth)
                            } else {
                                $("#faiImgBox img").height(imgLimitHeight).width(imgLimitHeight * thePies)
                            }
                        }
                    }
                }
                $(".TellToOther").toggle(arg.isSuc);
                $(".backToListen,.tellToTA").css({
                    bottom: "-2.5rem",
                    "line-height": "1.9rem"
                });
                if ($(".menuAgain").length > 0) {
                    $("#resule-gift-scrollWrap").css("height", $(window).height() - $(".menuAgain").outerHeight(true) - 6.7 * g_rem)
                } else {
                    $("#resule-gift-scrollWrap").css("height", $(window).height() - $(".menuBtnBox").outerHeight(true) - 6.7 * g_rem)
                }
                var gifArg = $(".gifArg");
                var seeAwardDetail = $(".seeAwardDetail");
                if (!_manage && g_config.showSkillSup) {
                    HdGame.hdSkillLog(true, 1000069);
                    HdGame.logDog(1000028, 1);
                    typeof g_config.isAOpenId == "number" && HdGame.logDog(1000115, 1 + g_config.isAOpenId)
                }
                g_config.showMenu && HdGame.logDog(1000036);
                var attentionBox = $("#resule-gift-box .attentionBox");
                var skillHeight = attentionBox.find(".hdskillInfo").outerHeight(true) + attentionBox.find(".holdBox").outerHeight(true) + 0.5 * g_rem;
                if (isOldAwardPage) {
                    $("#resule-gift-scrollWrap").css("height", $(window).height() - attentionBox.height() * 1.2 - 6.8 * g_rem)
                } else {
                    if (g_config.style == 75) {
                        $("#resule-gift-scrollWrap").css("height", $(window).height() - attentionBox.height() * 1.2 - 1.2 * g_rem)
                    } else {
                        $("#resule-gift-scrollWrap").css("height", $(window).height() - skillHeight - 8.2 * g_rem)
                    }
                }
                if (arg.isSuc) {
                    $("#resule-gift-box").css("height", "auto");
                    $("#faiImgBox").hide(); ! isOldAwardPage && $(".attentionBox .tellToOthers,#resule-gift-box .attentionBox .menuBtnBox").css({
                        visibility: "hidden"
                    });
                    $("#Award_Round_Dot").css("display", "inline-block");
                    $("#resule-gift-scrollWrap").show();
                    if (checkFlag(g_config.flagB, 8388608)) {
                        $(".attentionBox").show().html("返回首页").addClass("attentionBox_mobi2")
                    }
                    var setAwardPageCSS = function(isManage) {
                        var imgHgt = $("#resule-gift-sucImg").height();
                        if (isManage) {
                            imgHgt = $("#luckContainer .imgContainer").height()
                        }
                        var menuBtnBtmHeight = skillHeight + 0.5 * g_rem;
                        var tmpHeight = $(window).height() - 18.45 * g_rem - menuBtnBtmHeight;
                        var luckBtm = 7.6;
                        if (g_config.style != 25 && g_config.style != 27) {
                            luckBtm -= 2.5;
                            tmpHeight += 3.1 * g_rem
                        }
                        if (g_config.style == 25) {
                            menuBtnBtmHeight += 2.5 * g_rem
                        }
                        if (g_config.style != 75) {
                            if (imgHgt > tmpHeight) {
                                $("#resule-gift-buttonMenu").hide();
                                $("#resule-gift-buttonMenu-bottom").show().css({
                                    bottom: menuBtnBtmHeight,
                                    height: "4.5rem"
                                });
                                if (g_config.style == 75) {
                                    $("#resule-gift-scrollWrap").css("height", $(window).height() - attentionBox.height() * 1.2 - 7.6 * g_rem)
                                } else {
                                    $("#resule-gift-scrollWrap").css("height", $(window).height() - skillHeight - 8.2 * g_rem)
                                }
                            } else {
                                $("#resule-gift-buttonMenu").show();
                                $("#resule-gift-buttonMenu-bottom").hide();
                                if (g_config.style == 75) {
                                    $("#resule-gift-scrollWrap").css("height", $(window).height() - attentionBox.height() * 1.2 - 1.6 * g_rem)
                                } else {
                                    $("#resule-gift-scrollWrap").css("height", $(window).height() - skillHeight - 2.2 * g_rem)
                                }
                            }
                        }
                    };
                    if (!isOldAwardPage) {
                        if (_manage) {
                            $("#resule-gift-sucImg").off("hd-resizable-resize.setAwardPageCSS").on("hd-resizable-resize.setAwardPageCSS", setAwardPageCSS)
                        } else {
                            setTimeout(setAwardPageCSS, 0)
                        }
                    }
                    $("#resule-gift-sucImg").trigger("hd-resizable-resize"); ! HdGame.currentAwardLevel && (HdGame.currentAwardLevel = []);
                    HdGame.wxConfig.setCurrentAward(HdGame.currentAwardLevel.join("") + arg.awardIndex);
                    if (g_config.style != 58 && g_config.style != 59 && g_config.style != 60 && g_config.style != 61 && g_config.style != 62 && g_config.style != 63 && g_config.style != 70 && g_config.style != 79) {
                        HdGame.wxConfig.setWxShareByStatus()
                    }
                    this.hasGift = true;
                    gifArg.eq(0).text(arg.giftStyle);
                    gifArg.eq(1).text(arg.giftName);
                    if (arg.awardTypeNum == 9) {
                        seeAwardDetail.addClass("jzCouponBtn").attr("code", arg.giftCode).text("点击领取")
                    } else {
                        seeAwardDetail.removeClass("jzCouponBtn").text("查看奖品详情")
                    }
                    $("#resule-gift-sucImg").css({
                        width: arg.awardImageW,
                        height: arg.awardImageH
                    });
                    var theTop = $("#resule-gift-sucImg").parent().height() / 2 - parseRemToPx(g_config.clickTips.pointH) / 2;
                    $("#lightPoint").css("top", theTop);
                    theTop += 0.4 * g_rem;
                    $("#click-view").css("top", theTop);
                    if (arg.awardIndex == 900) {
                        $("#resule-gift-sucImg").attr("src", _manage ? arg.giftImage: g_config.comfort.comimg)
                    } else {
                        if (!g_config.award) {
                            g_config.award = g_config.awardList[arg.awardIndex - 1];
                            g_config.wxAward = g_config.awardList[arg.awardIndex - 1]
                        }
                        $("#resule-gift-sucImg").attr("src", _manage ? arg.giftImage: g_config.awardList[arg.awardIndex - 1].aimg)
                    }
                    HdGame.logDog(1000003, 0);
                    HdGame.logObjDog(1000092, 3, g_config.gameId);
                    if (!_manage) {
                        $(".gameBox,.home,.body").addClass("overflow-y-hidden");
                        $(".bottomSkill").is(":visible") && $(".bottomSkill").hide()
                    }
                } else {
                    $("#resule-gift-box").css("height", $(window).height() - $("#resule-gift-box .attentionBox").height());
                    $("#resule-gift-scrollWrap,#resule-status-lotsBox").hide();
                    if (!isOldAwardPage) {
                        $(".attentionBox .tellToOthers,#resule-gift-box .attentionBox .menuBtnBox").css({
                            visibility: "visible"
                        });
                        $("#resule-gift-buttonMenu-bottom").hide()
                    }
                    if (!_manage && isLimitDraw && drawTotalLimit - totalCount == 0) {
                        $("#resule-gift-box .resule-gift-home.menuAgain").text("返回首页")
                    }
                    $("#faiImgBox").show();
                    if (checkFlag(g_config.flagB, 8388608)) {
                        $("#xydzpAgainImg").attr("src", _resRoot + "/image/xydzp/backToHomeImg.png");
                        $("#xydzpCloseImg").attr("src", _resRoot + "/image/xydzp/backToHomeImg.png");
                        $(".attentionBox").hide()
                    }
                }
                $(".menuAgain,.menuBack,.backListen,.repeatDraw,.TellToOther").css({
                    bottom: $("#resule-gift-box").find(".attentionBox").height(),
                    "line-height": "1.9rem"
                });
                if (g_config.haveAward) {
                    $("#myAwardBtn").show()
                }
            }
        };
        HdGame.resulePoup = resulePoup
    })(); (function() {
        HdGame.Img = {
            MODE_SCALE_FILL: 1,
            MODE_SCALE_WIDTH: 2,
            MODE_SCALE_HEIGHT: 3,
            MODE_SCALE_DEFLATE_WIDTH: 4,
            MODE_SCALE_DEFLATE_HEIGHT: 5,
            MODE_SCALE_DEFLATE_FILL: 6,
            MODE_SCALE_DEFLATE_MAX: 7
        };
        HdGame.Img.isNull = function(obj) {
            return (typeof obj == "undefined") || (obj == null)
        };
        HdGame.Img.optimize = function(img, option, noRound) {
            var imgTmp = new Image();
            imgTmp.src = img.src;
            var imgWidth = imgTmp.width;
            var imgHeight = imgTmp.height;
            if (HdGame.Img.isNull(imgWidth) || imgWidth == 0 || HdGame.Img.isNull(imgHeight) || imgHeight == 0) {
                imgWidth = img.width;
                imgHeight = img.height
            }
            var size = HdGame.Img.calcSize(imgWidth, imgHeight, option.width, option.height, option.mode, noRound);
            img.width = size.width;
            img.height = size.height;
            if (option.display == 1) {
                img.style.display = "inline"
            } else {
                if (option.display == 2) {
                    img.style.display = "none"
                } else {
                    img.style.display = "block"
                }
            }
            return {
                width: img.width,
                height: img.height
            }
        };
        HdGame.Img.calcSize = function(width, height, maxWidth, maxHeight, mode, noRound) {
            if (isNaN(maxWidth)) {
                maxWidth = parseFloat(maxWidth) * g_rem
            }
            if (isNaN(maxHeight)) {
                maxHeight = parseFloat(maxHeight) * g_rem
            }
            var size = {
                width: width,
                height: height
            };
            if (mode == HdGame.Img.MODE_SCALE_FILL) {
                var rateWidth = width / maxWidth;
                var rateHeight = height / maxHeight;
                if (rateWidth > rateHeight) {
                    size.width = maxWidth;
                    size.height = height / rateWidth
                } else {
                    size.width = width / rateHeight;
                    size.height = maxHeight
                }
            } else {
                if (mode == HdGame.Img.MODE_SCALE_WIDTH) {
                    var rateWidth = width / maxWidth;
                    size.width = maxWidth;
                    size.height = height / rateWidth
                } else {
                    if (mode == HdGame.Img.MODE_SCALE_HEIGHT) {
                        var rateHeight = height / maxHeight;
                        size.width = width / rateHeight;
                        size.height = maxHeight
                    } else {
                        if (mode == HdGame.Img.MODE_SCALE_DEFLATE_WIDTH) {
                            var rateWidth = width / maxWidth;
                            if (rateWidth > 1) {
                                size.width = maxWidth;
                                size.height = height / rateWidth
                            }
                        } else {
                            if (mode == HdGame.Img.MODE_SCALE_DEFLATE_HEIGHT) {
                                var rateHeight = height / maxHeight;
                                if (rateHeight > 1) {
                                    size.width = width / rateHeight;
                                    size.height = maxHeight
                                }
                            } else {
                                if (mode == HdGame.Img.MODE_SCALE_DEFLATE_FILL) {
                                    var rateWidth = width / maxWidth;
                                    var rateHeight = height / maxHeight;
                                    if (rateWidth > rateHeight) {
                                        if (rateWidth > 1) {
                                            size.width = maxWidth;
                                            size.height = height / rateWidth
                                        }
                                    } else {
                                        if (rateHeight > 1) {
                                            size.width = width / rateHeight;
                                            size.height = maxHeight
                                        }
                                    }
                                } else {
                                    if (mode == HdGame.Img.MODE_SCALE_DEFLATE_MAX) {
                                        if (width > maxWidth && height > maxHeight) {
                                            var rateWidth = width / maxWidth;
                                            var rateHeight = height / maxHeight;
                                            if (rateWidth < rateHeight) {
                                                size.width = maxWidth;
                                                size.height = height / rateWidth
                                            } else {
                                                size.width = width / rateHeight;
                                                size.height = maxHeight
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!noRound) {
                size.width = Math.floor(size.width);
                size.height = Math.floor(size.height)
            }
            if (size.width == 0) {
                size.width = 1
            }
            if (size.height == 0) {
                size.height = 1
            }
            return size
        }
    })(); (function() {
        var index = 0,
        $logBox, $logText, $logWrap, $logMax;
        $.each({
            tlog: function(logFlag, logStr) {
                if (/log/.test(g_config.testCMD)) {
                    HdGame.logStd(logFlag, logStr)
                }
                this.log(logFlag, logStr)
            },
            tlogErr: function(logFlag, logStr) {
                this.log(logFlag, logStr, true)
            },
            log: function(logFlag, logStr, isErr) {
                if (!m_debug) {
                    return
                }
                $(function() {
                    try {
                        if (!$logBox) {
                            init()
                        }
                        if (index === 0) {
                            $logBox.show()
                        }
                        index++;
                        $logText.append('<div class="log_line log_line_ellipsis' + (isErr ? " log_line_err": "") + '"><span class="log_flag">' + HdGame.decodeHtml(logFlag) + '</span><span class="log_text">' + HdGame.decodeHtml(logStr) + "</span></div>");
                        $logWrap[0].scrollTop = $logWrap[0].scrollHeight;
                        if (isErr && $logMax.is(":visible")) {
                            $logMax.addClass("hasNewErr")
                        }
                    } catch(e) {
                        console.log(e)
                    }
                })
            }
        },
        function(key, fn) {
            HdGame[key] = function(logFlag, logStr, isErr) {
                if (HdGame.IsPC()) {
                    return
                }
                if (arguments.length <= 1) {
                    logStr = logFlag;
                    logFlag = "###"
                }
                if (HdGame.getType(logStr) === "object" || HdGame.getType(logStr) === "array") {
                    logStr = $.toJSON(logStr)
                } else {
                    logStr = String(logStr)
                }
                fn.call(HdGame, logFlag, logStr, isErr)
            }
        });
        function init() {
            $logBox = $('<div id="logBox"><div id="log_head"><div id="log_close" class="log_icon">╳</div><div id="log_min" class="log_icon">━</div>' + (typeof g_config !== "undefined" && g_config.test ? '<div id="log_share" class="log_icon">share</div>': "") + '</div><div id="log_text_wrap"><div id="log_text"></div></div></div>');
            $logText = $logBox.find("#log_text");
            $logWrap = $logBox.find("#log_text_wrap");
            $logMax = $('<div id="log_max" class="hide"><div id="log_max_inner"><div id="log_max_innerText">＋</div></div></div>');
            var $logHead = $logBox.find("#log_head");
            var lastOffset = {};
            var body = $("body");
            if (body.length < 0) {
                return
            }
            body.append($logBox);
            body.append($logMax);
            $logHead.on("touchstart",
            function(event) {
                event.preventDefault();
                event.stopPropagation();
                var touch = event.originalEvent.targetTouches[0];
                lastOffset.x = touch.pageX;
                lastOffset.y = touch.pageY
            }).on("touchmove",
            function(event) {
                event.preventDefault();
                event.stopPropagation();
                var touch = event.originalEvent.targetTouches[0];
                var left = $logBox.offset().left + touch.pageX - lastOffset.x;
                var top = $logBox.offset().top + touch.pageY - lastOffset.y;
                lastOffset.x = touch.pageX;
                lastOffset.y = touch.pageY;
                if (left > -0.2 * $logBox.width() && left + 0.5 * $logBox.width() < $(window).width()) {
                    $logBox[0].style.left = left + "px"
                }
                if (top > 0 && top + 0.5 * $logBox.height() < $(window).height()) {
                    $logBox[0].style.top = top + "px"
                }
            });
            $logBox.find("#log_close").on("touchstart",
            function() {
                $logMax.hide();
                $logBox.hide();
                $logText.empty();
                index = 0
            });
            $logBox.find("#log_min").on("touchstart",
            function() {
                $logMax.show();
                $logBox.hide()
            });
            $logBox.find("#log_share").on("touchstart",
            function() {
                var shareUrl = HdGame.wxConfigArg.url;
                HdGame.log("shareUrl", shareUrl);
                if (g_config.test) {
                    shareUrl = escape(shareUrl).replace(/\+/g, "%2B").replace(/\"/g, "%22").replace(/\'/g, "%27").replace(/\//g, "%2F");
                    var toHdTestUrl = "http://" + HdGame.gameDomain + "/hdtest.jsp?cmd=setUrl&url=" + shareUrl;
                    window.open(toHdTestUrl)
                }
            });
            $logMax.on("touchstart",
            function() {
                $logMax.hide();
                $logBox.show();
                $logMax.removeClass("hasNewErr")
            });
            $logText.on("touchstart", ".log_flag",
            function() {
                var $logLine = $(this).parent();
                if ($logLine.hasClass("log_line_ellipsis")) {
                    $logLine.removeClass("log_line_ellipsis")
                } else {
                    $logLine.addClass("log_line_ellipsis")
                }
            })
        }
    })();
    HdGame.initEdit = function(Edit) {
        var origin = Edit.origin,
        originDef = Edit.originDef,
        originMod = Edit.originMod,
        elemRegx = /\b(editTarget|editRelate)(-\w+?)(-\d+?)?\b/,
        templateRegx = /{{(.*?)}}/g,
        cache = {};
        function getImgInfo(name, isRem) {
            var key = "getImgInfo-" + name;
            if (isRem) {
                key = "getImgInfo-rem-" + name
            }
            var obj = cache[key];
            if (obj) {
                return obj
            }
            var tem = getInfoByName(name)[0];
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
                    for (var q = 0; q < tem.path.length; q++) {
                        obj.path[q] = HdGame.getSrc(tem.path[q][0])
                    }
                } else {
                    obj.path = HdGame.getSrc(tem.path[0])
                }
            }
            var parseUnit = isRem ? parseFloat: parseRemToPx;
            var handles = {
                size: ["width", "height"],
                pos: ["left", "top"]
            };
            for (var key in handles) {
                var key2 = handles[key];
                var val = tem[key];
                if (!val) {
                    continue
                }
                if (HdGame.getType(val) === "array") {
                    obj[key2[0]] = [],
                    obj[key2[1]] = [];
                    $.each(val,
                    function(index, item) {
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
        function setCssVal(from, item, isDef) {
            var val = isDef ? item.defVal: item.val;
            var tra = isDef ? item.defTra: item.tra;
            if (!val) {
                return
            }
            if (item.from) {
                from = $(item.from)
            }
            if (item.type !== "color") {
                if (item.name === "font-size" && !isNaN(Number(val))) {
                    from.css(item.name, (val / 20) + "rem")
                } else {
                    from.css(item.name, val)
                }
            } else {
                val = HextoRgb(val);
                if (item.name === "text-shadow") {
                    from.css(item.name, getTextShadow(getRgba(val, tra)))
                } else {
                    from.css(item.name, getRgba(val, tra))
                }
            }
        }
        function HextoRgb(hex) {
            hex = $.trim(hex);
            if (/^#[0-9a-fA-f]{3}$/.test(hex)) {
                var hexNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    var c = hex.slice(i, i + 1);
                    hexNew += c + c
                }
                hex = hexNew
            }
            if (!/^#[0-9a-fA-f]{6}$/.test(hex)) {
                return hex
            }
            hex = parseInt(hex.substring(1), 16);
            var rgb = ["rgb(", hex >> 16, ",", (hex & 65280) >> 8, ",", (hex & 255), ")"];
            return rgb.join("")
        }
        function getTextShadow(color) {
            return color + " -1px -1px 0px, " + color + " 0px -1px 0px, " + color + " 1px -1px 0px, " + color + " 1px 0px 0px, " + color + " 1px 1px 0px, " + color + " 0px 1px 0px, " + color + " -1px 1px 0px, " + color + " -1px 0px 0px"
        }
        function getRgba(rgb, a) {
            if (typeof a === "undefined" || a == -1) {
                return rgb
            }
            return "rgba" + rgb.substring(rgb.indexOf("("), rgb.indexOf(")")) + "," + (a ? a: 0) + ")"
        }
        function getInfoByName(name) {
            for (var i = 0; i < origin.length; i++) {
                var tem = origin[i];
                if (tem.name === name) {
                    return [tem, originDef[i]]
                }
            }
            return [false, false]
        }
        function getEditInfo(from, list, info, index) {
            var arg = {};
            arg.from = from;
            arg.title = list[1];
            arg.limit = list[2];
            arg.defSrc = HdGame.getSrc(list[0]);
            var showPath = info.showPath[index];
            if (typeof showPath == "number" && showPath >= 0) {
                arg.showPath = info.showPath;
                arg.showPathIndex = index
            }
            if (list[3]) {
                arg.defSize = list[3]
            }
            return arg
        }
        function setJqSrc(el, src) {
            if (arguments.length == 1) {
                if (! (src = el.attr("edit_defer_src"))) {
                    return
                }
                el.removeAttr("edit_defer_src")
            }
            if (!src) {
                HdGame.log("setJqSrc src null")
            }
            el.each(function() {
                if (/img/i.test($(this)[0].nodeName)) {
                    $(this).attr("src", src)
                } else {
                    $(this).css({
                        "background-image": 'url("' + src + '")',
                        "background-position": "center center",
                        "background-repeat": "no-repeat",
                    }).addClass("hd-game-theBg-fillAuto"); (function(theObj, theUrl) {
                        HdGame.imgReady(theUrl,
                        function() {
                            if (!$(theObj).hasClass("hd-img-fillDiv")) {
                                var originSize = {
                                    width: $(theObj).outerWidth(),
                                    height: $(theObj).outerHeight()
                                };
                                var nowSize = HdGame.Img.calcSize(this.width, this.height, originSize.width, originSize.height, HdGame.Img.MODE_SCALE_DEFLATE_FILL, true);
                                var pL = 100 * nowSize.width / originSize.width;
                                var pt = 100 * nowSize.height / originSize.height;
                                $(theObj).css("background-size", pL + "% " + pt + "%")
                            }
                        })
                    })(this, src)
                }
            });
            return el
        }
        function getVal(list, index, listDef) {
            var val = list;
            if ($.isArray(list)) {
                if (typeof index == "undefined") {
                    index = 0
                }
                var val = list[index];
                if (val === undefined) {
                    val = listDef === undefined ? list[0] : getVal(listDef, index)
                }
            } else {
                if (val === undefined && listDef !== undefined) {
                    val = listDef
                }
            }
            return val
        }
        function getVariablePath(tem, temDef, index) {
            if (!temDef.variablePath) {
                return
            }
            temDef.variablePath.val;
            if (path.length > index) {
                path[index]
            }
            var location = {
                index: index,
                index2: Fai.pad(index, 2)
            };
            $.each(path,
            function(i, val) {
                path[i] = val.replace(templateRegx,
                function($, $1) {
                    return (new Function("s", $1))(location)
                })
            });
            return path
        }
        function setEditByName(info, editTarget, elemIndex) {
            var tem = info[0],
            temDef = info[1],
            isOne = elemIndex !== undefined;
            if (!editTarget) {
                editTarget = $(".editTarget-" + tem.name)
            }
            initModuleLayer(tem, temDef, editTarget.not(function() {
                return $(this).data("hasBindEdit")
            }));
            var isSyncResize = (HdGame.getType(temDef.pos) === "array" && HdGame.getType(temDef.size) !== "array");
            var bindSizePos = function(index, elem) {
                var $elem = $(elem);
                if ($elem.data("hasBindEdit")) {
                    return
                }
                var EsizeDef = getVal(temDef.size, index),
                EposDef = getVal(temDef.pos, index),
                Esize = getVal(tem.size, index, temDef.size),
                Epos = getVal(tem.pos, index, temDef.pos);
                if (Esize && EsizeDef) {
                    $elem.addClass("slaveImg");
                    if (!$elem.parents().hasClass("imgContainer")) {
                        $elem.wrap('<div class="imgContainer absCenter"></div>')
                    }
                    $elem.parent(".imgContainer").css("height", 0);
                    if (!EsizeDef.disable) {
                        if (isSyncResize) {
                            var $target = null;
                            $elem.addResizableFn("start",
                            function(event, ui) {
                                $target = $(".editTarget-" + tem.name).not(this);
                                if (/n|w/.test(ui.axis) && !EsizeDef.noSyncOffset) {
                                    $target.each(function(i, el) {
                                        var self = $(this),
                                        parent = self.parents(".ui-wrapper");
                                        self.data("originalPosition-relative", {
                                            left: parseFloat(parent.css("left")) - ui.originalPosition.left,
                                            top: parseFloat(parent.css("top")) - ui.originalPosition.top,
                                        })
                                    })
                                }
                            });
                            $elem.addResizableFn("resize",
                            function(event, ui) {
                                $target.add($target.parents(".ui-wrapper")).css({
                                    width: $(ui.element).width(),
                                    height: $(ui.element).height()
                                });
                                if (/n|w/.test(ui.axis) && !EsizeDef.noSyncOffset) {
                                    $target.each(function(i, el) {
                                        var self = $(this);
                                        var relative = self.data("originalPosition-relative");
                                        self.add(self.parents(".ui-wrapper")).css({
                                            left: ui.position.left + relative.left,
                                            top: ui.position.top + relative.top
                                        })
                                    })
                                }
                            });
                            $elem.addResizableFn("stop",
                            function(event, ui) {
                                if (!EsizeDef.noSyncOffset) {
                                    $target.each(function(i, el) {
                                        $(this).removeData("originalPosition-relative").attr("resize", "1")
                                    })
                                }
                                $target = null
                            })
                        }
                        var defData = {
                            width: EsizeDef.width,
                            height: EsizeDef.height
                        };
                        if (EposDef && EposDef.disable) {
                            defData.left = EposDef.left;
                            defData.top = EposDef.top
                        }
                        HdGame.moduleSlaveImgResize($elem, defData);
                        if (isSyncResize) {
                            $elem.addResizableFn("recover",
                            function() {
                                var wrapper = $(this).parents(".ui-wrapper");
                                $(".editTarget-" + tem.name).each(function(i, el) {
                                    if (el === $elem[0]) {
                                        return
                                    }
                                    var rTarget = $(el).add($(el).parents(".ui-wrapper"));
                                    rTarget.width(wrapper.width()).height(wrapper.height());
                                    var otherPosDef = getVal(temDef.pos, i);
                                    if (otherPosDef && otherPosDef.disable) {
                                        rTarget.css({
                                            left: otherPosDef.left,
                                            top: otherPosDef.top
                                        })
                                    }
                                    rTarget.attr("resize", 0)
                                })
                            })
                        }
                    }
                }
                if (Epos && EposDef && !EposDef.disable) {
                    var forParent = EposDef.forParent != "false" ? true: false;
                    var containment = EposDef.containment;
                    if (forParent && !$elem.parents().hasClass("imgContainer")) {
                        $elem.wrap('<div class="imgContainer absCenter"></div>')
                    }
                    HdGame.moduleDraggale($elem, forParent, containment)
                }
            };
            isOne ? bindSizePos(elemIndex, editTarget) : editTarget.each(bindSizePos);
            editTarget.data("hasBindEdit", true)
        }
        function isBackground(editStr) {
            return /^_background/.test(editStr)
        }
        function initModuleLayer(tem, temDef, editTarget) {
            var tabFalg = -2,
            editInfoList = null,
            cssFlag = false,
            cssArg = null,
            editTargetName = temDef.targetName || true,
            box = "editTarget-" + tem.name;
            if (!temDef._initModuleLayerArgs) {
                if (temDef.css || temDef.cssAll) {
                    if (temDef.cssAll) {
                        cssArg = [];
                        $.each(temDef.cssAll,
                        function(index, item) {
                            if (getInfoByName(item)[1].css) {
                                cssArg = cssArg.concat(getInfoByName(item)[1].crrCssArg)
                            }
                        })
                    } else {
                        cssArg = temDef.crrCssArg
                    }
                    cssFlag = !cssArg[0].targetName ? true: cssArg[0].targetName;
                    if (temDef.cssEdit == 1 && temDef.edit !== "_backgroundAll") {
                        var theArg = cssArg;
                        $$(function() {
                            parent.Edit.addEditBtn(cssArg[0].targetName || "编辑背景", "." + box,
                            function() {
                                parent.Edit.Css.showCssByGame.call($("." + box), "." + box, theArg, theArg[0].targetName);
                                parent.operateFlagList[21] = true;
                                HdGame.logPhoneDog(5);
                                return false
                            })
                        });
                        cssFlag = false,
                        cssArg = null
                    }
                }
                if (temDef.edit !== undefined) {
                    if (typeof temDef.edit === "number") {
                        tabFalg = temDef.edit
                    } else {
                        if (isBackground(temDef.edit)) { ! Edit.bgList && (Edit.bgList = []);
                            var bgObject = null;
                            var isMultiPath = $.isArray(temDef.path[0]);
                            var isAdvertising = temDef.name === "advertising";
                            var editName = temDef.name;
                            var form = temDef.from || ".editTarget-" + editName + ",.editRelate-" + editName;
                            if (isMultiPath) {
                                bgObject = {};
                                bgObject.paths = [];
                                for (var index = 0; index < 4; index++) {
                                    var path = temDef.path[index] || temDef.path[0];
                                    if (index > 0) {
                                        form = ".editTarget-" + editName + "-" + index + ",.editRelate-" + editName + "-" + index
                                    }
                                    bgObject.paths.push(getEditInfo(form, path, tem, index))
                                }
                            } else {
                                bgObject = getEditInfo(form, temDef.path, tem, 0)
                            }
                            bgObject._flag = -1;
                            if (temDef.edit === "_backgroundAll" && cssArg) {
                                bgObject._cssArg = cssArg;
                                bgObject._flag = -5;
                                cssFlag = false,
                                cssArg = null
                            }
                            if (isAdvertising) {
                                bgObject._flag = -7
                            }
                            if (editTarget.closest(".home,.gameBgBox,.gameBgBox2").length > 0 && $.inArray(g_config.style, [49, 67, 69, 71, 75, 77, 87]) == -1) {
                                Edit.bgList.push(bgObject)
                            } else {
                                var defaultProp = {
                                    title: "背景图片",
                                    size: "640px*1600px",
                                    limit: "5000k",
                                    defSize: "640px*1600px",
                                };
                                var imgArgs = [$.extend({},
                                bgObject, defaultProp)];
                                if (isMultiPath) {
                                    imgArgs = bgObject.paths.map(function(bg) {
                                        return $.extend({},
                                        bg, bgObject, defaultProp)
                                    })
                                }
                                $$(function() {
                                    var editBtnSelector = ".editTarget-" + tem.name;
                                    if (isAdvertising) {
                                        editBtnSelector = ".advertisingBox"
                                    }
                                    HdGame.saveModuleLayerImg(imgArgs);
                                    parent.Edit.addEditBtn(temDef.targetName || "编辑背景", editBtnSelector,
                                    function() {
                                        hg.fire("editBackground", bgObject, true);
                                        parent.Edit.showEditByGame(bgObject._flag, "", imgArgs);
                                        return false
                                    })
                                })
                            }
                            editTarget.data("hasBindEdit", true);
                            return
                        } else {
                            if (temDef.edit !== "_none") {
                                editInfoList = [];
                                if (cache["edit-" + temDef.edit]) {
                                    editInfoList = cache["edit-" + temDef.edit]
                                } else {
                                    var editOrigin = [];
                                    if (temDef.edit === "all") {
                                        $.each(Edit.originDef,
                                        function(index, val) {
                                            if (!val.formDefaultStyle && !isBackground(val.edit)) {
                                                editOrigin.push([Edit.origin[index], val])
                                            }
                                        })
                                    } else {
                                        $.each(temDef.edit.split(","),
                                        function(index, val) {
                                            editOrigin.push(getInfoByName(val))
                                        })
                                    }
                                    $.each(editOrigin,
                                    function(i, val) {
                                        var pathDefs = val[1].path;
                                        var editName = val[1].name;
                                        var form = ".editTarget-" + editName + ",.editRelate-" + editName;
                                        if (typeof pathDefs != "undefined") {
                                            if (HdGame.getType(pathDefs[0]) === "array") {
                                                $.each(pathDefs,
                                                function(k, pathDef) {
                                                    k > 0 && (form = ".editTarget-" + editName + "-" + k + ",.editRelate-" + editName + "-" + k);
                                                    editInfoList.push(getEditInfo(form, pathDef, val[0], k))
                                                })
                                            } else {
                                                editInfoList.push(getEditInfo(form, pathDefs, val[0], 0))
                                            }
                                        }
                                    }); ! cache["edit-" + temDef.edit] && (cache["edit-" + temDef.edit] = editInfoList)
                                }
                                tabFalg = -1
                            } else {
                                editTargetName = false
                            }
                        }
                    }
                } else {
                    editTargetName = false
                }
                if (temDef.text) {
                    editTargetName = !temDef.text[0].targetName ? true: temDef.text[0].targetName;
                    tem.text = $.extend(true, [], temDef.text, tem.text);
                    if (temDef.text[0].type == 1) {
                        editTargetName = false
                    }
                    if (tem.text.filter(function(item) {
                        return item.type == 2
                    }).length > 0) {
                        tabFalg = 0;
                        box = function() {
                            EditWrite.call(this, tem.text, temDef.text, tem.name)
                        }
                    }
                }
                if (temDef.textarea) {
                    tabFalg = "showEditTextareaPoup"
                }
                if (temDef.textContent) {
                    tabFalg = "showEditTextContentPoup"
                }
                if (temDef.swiperConfig) {
                    if (g_config.useSwiperBanner) {
                        tabFalg = -8
                    }
                }
                if ((temDef.name === "banner" || temDef.name === "banner1" || temDef.name === "banner2" || temDef.name === "homeBanner" || temDef.name === "detailBanner") && !g_config.useSwiperBanner) {
                    editInfoList = editInfoList.slice(0, 1);
                    editInfoList[0].title = editInfoList[0].title.replace(/01/, "")
                }
                temDef._initModuleLayerArgs = [tabFalg, box, editInfoList, cssFlag, cssArg, editTargetName]
            }
            if (temDef.edit !== undefined || temDef._initModuleLayerArgs[4]) {
                editTarget.hdTrigger("hd-editUpload-initModuleLayer", [temDef]);
                HdGame.initModuleLayer.apply(HdGame, [editTarget].concat(temDef._initModuleLayerArgs))
            }
        }
        function EditWrite(textArg, textArgDef, name) {
            var _this = this;
            parent.Edit.editPoup.show({
                className: "editText",
                title: textArgDef[0].allTitel || "编辑内容",
                info: function(infoBox, poup, win) {
                    $.each(textArg,
                    function(index, editW) {
                        if (editW.type != 2) {
                            return
                        }
                        var editWDef = textArgDef[index];
                        var title = (editWDef.title || "文字内容") + "：";
                        var content = editW.val;
                        var remark = editWDef.remark || "";
                        var uploadLine = '<div class="editLine">';
                        if (editW.shouInput) {
                            uploadLine += addAnswerLineInput(title, content)
                        } else {
                            uploadLine += addAnswerLine(title, content, index, editW.txtopt)
                        }
                        uploadLine += "</div>";
                        uploadLine = poup.$(uploadLine);
                        infoBox.append(uploadLine);
                        var limit = editWDef.numLimit;
                        if (HdGame.getType(limit) != "array") {
                            editWDef.numLimit = limit = [0, limit]
                        }
                        if (!editWDef.from) {
                            editWDef.from = ".editTarget-" + name + ",.editRelate-" + name
                        }
                        var from = $(editWDef.from);
                        var inputName = uploadLine.find(".newTextArea .activeInput");
                        inputName.on("blur.text",
                        function() {
                            var val = $(this).val();
                            if ($.trim(val).length < (limit[0] + 1)) {
                                $(this).addClass("inputErr");
                                $(this).parent().find(".editErr").show().text("输入的文字不可少于" + (limit[0] + 1) + "个！");
                                from.text(editW.val)
                            }
                        }).on("focus.text",
                        function() {
                            $(this).removeClass("inputErr").siblings(".editErr,.editErr2").hide()
                        }).on("keyup.text",
                        function() {
                            var obj = {};
                            obj.str = $(this).val();
                            obj.str = obj.str.substr(0, limit[1]);
                            obj.len = $.trim($(this).val()).length;
                            if (obj.len > limit[1]) {
                                $(this).val(obj.str)
                            }
                            $(this).trigger("text-beforeSave", [obj, editW, editWDef]);
                            if (obj.len > limit[0] && (limit[1] === undefined || obj.len <= limit[1])) {
                                editW.val = obj.str;
                                from.text(editW.val)
                            }
                        }).on("input.text",
                        function() {
                            parent.changeIsSave()
                        });
                        if (editW.txtopt) {
                            inputName.show().val(editW.val)
                        } else {
                            inputName.hide()
                        }
                        if (!editW.shouInput) {
                            uploadLine.find("#editWriteDef_" + index + "").on("click",
                            function() {
                                if (editW.txtopt == 1) {
                                    parent.changeIsSave()
                                }
                                editW.txtopt = 0;
                                from.text(editWDef.val);
                                inputName.hide().removeClass("inputErr").val(editWDef.val);
                                inputName.siblings(".editErr,.editErr2").hide()
                            });
                            uploadLine.find("#editWriteSelf_" + index + "").on("click",
                            function() {
                                if (editW.txtopt == 0) {
                                    parent.changeIsSave()
                                }
                                editW.txtopt = 1;
                                inputName.show().val(editW.val);
                                from.text(editW.val)
                            })
                        }
                    });
                    $(_this).hdTrigger("hd-editUpload-textEdit", [poup, textArg, textArgDef]);
                    function addAnswerLineInput(title, answer) {
                        return '<div class="answerLine clearfix"><div class="floatLeft newTextT" style="width: 70px; margin-top: 7px" >' + title + '</div><div style="width: 320px;" class="floatLeft"><div class="newTextArea"><input type="text" class="input scrollBox activeInput" style="width: 300px;height: 32px; padding-left: 5px;" value="' + HdGame.encodeHtml(answer) + '" ' + (isPublish ? "disabled": "") + '><div style="color:#888; padding-top: 5px;">确认发布后无法修改，请认真输入！</div><div class="editErr hide" style="color: red;margin-top: 10px;">输入文字不能为空</div><div class="editErr2 hide" style="color: red; margin-top: 10px; display: none;">输入仅限中文字母跟数字</div></div></div></div>'
                    }
                    function addAnswerLine(title, answer, index, flag) {
                        var val = HdGame.encodeHtml(answer);
                        var two = flag ? "checked": "";
                        var one = flag ? "": "checked";
                        return '<div class="answerLine clearfix"><div class="floatLeft newTextT" style="width: 100px;">' + title + '</div><div class="floatLeft" style="width: 320px;"><div><input id="editWriteDef_' + index + '" type="radio" name="theRealOnly_' + index + '"' + one + '><label for="editWriteDef_' + index + '" style="height: 16px;line-height: 16px;">默认</label><input id="editWriteSelf_' + index + '" type="radio" name="theRealOnly_' + index + '"' + two + '><label for="editWriteSelf_' + index + '" style="height: 16px;line-height: 16px;">自定义</label></div><div class="newTextArea" style="margin-top: 12px;"><textarea class="input scrollBox activeInput" style="width:300px;height:100px;padding:5px;margin-top:7px;">' + val + '</textarea><div class="editErr hide" style="color: red;margin-top: 10px;">输入文字不可少于10个！</div><div class="editErr2 hide" style="color: red; margin-top: 10px; display: none;">输入仅限中文</div></div></div></div>'
                    }
                },
            });
            return false
        }
        function setEdit(editTarget, index) {
            parseEditTarget(editTarget,
            function(infos) {
                index === undefined && (index = 0);
                initItem(infos[0], infos[1], editTarget, index);
                if (_manage) {
                    if (infos[1].css && !infos[1].crrCssArg) {
                        infos[1].crrCssArg = $.extend(true, [], infos[1].css, origin[i].css)
                    }
                    setEditByName(infos, editTarget, index)
                }
            })
        }
        function parseEditTarget(editTarget, callback) {
            if (editTarget.length == 0) {
                return
            }
            var matchs = editTarget.attr("class").match(elemRegx),
            infos;
            if (matchs) {
                infos = getInfoByName(matchs[2].slice(1));
                if (infos[0] && infos[1]) {
                    callback && callback(infos)
                }
            }
        }
        function initEdit() {
            $.each(origin,
            function(index, tem) {
                initItem(tem, originDef[index], $(".editTarget-" + tem.name))
            })
        }
        function initByElem(editTarget, index) {
            parseEditTarget(editTarget,
            function(infos) {
                index === undefined && (index = 0);
                initItem(infos[0], infos[1], editTarget, index)
            })
        }
        function initItem(tem, temDef, editTarget, index) {
            var isOne = index !== undefined,
            allEditSelecter = ".editTarget-" + tem.name + ",.editRelate-" + tem.name,
            matchs, relateClass, onePathIndex, getOldSrc, setOff, setPath, setCss;
            if (isOne && editTarget.length == 0) {
                return false
            }
            if (isBackground(temDef.edit)) {
                temDef.from ? $(temDef.from).addClass("hd-Special-bgImgInfo") : editTarget.addClass("hd-Special-bgImgInfo")
            }
            setOff = function(el) {
                var set = function(i, elem) {
                    var Epos = getVal(tem.pos, i, temDef.pos),
                    Esize = getVal(tem.size, i, temDef.size);
                    if (temDef.pos && Epos && Epos.top && Epos.left) {
                        $(elem).css({
                            top: Epos.top,
                            left: Epos.left
                        }).addClass("abs")
                    }
                    if (temDef.size && Esize && Esize.width && Esize.height) {
                        $(elem).css({
                            width: Esize.width,
                            height: Esize.height
                        })
                    }
                };
                isOne ? set(index, el) : el.each(set)
            };
            setOff(editTarget);
            if (tem.swiperConfig) {
                if (_manage) {
                    HdGame.renderSwiperByManage({
                        name: temDef.name
                    },
                    editTarget)
                } else {
                    HdGame.renderSwiper({
                        name: temDef.name,
                        config: $.extend({},
                        temDef.swiperConfig, tem.swiperConfig)
                    },
                    editTarget)
                }
            }
            if (tem.path) {
                getOldSrc = function(oldEditTarget, defSrc) {
                    var src;
                    oldEditTarget = oldEditTarget.not(editTarget);
                    if (oldEditTarget.length > 0 && !oldEditTarget.is(editTarget)) {
                        src = HdGame.getJqSrc(oldEditTarget)
                    }
                    return src || defSrc || ""
                };
                relateClass = ".editRelate-" + tem.name;
                setPath = function(targetElem, src, i) {
                    if (targetElem.length == 0) {
                        return
                    }
                    if ((tem.showPath[i] === 0)) {
                        targetElem.attr("edit_store_src", src);
                        return
                    }
                    if (temDef.deferPath && !_manage) {
                        targetElem.attr("edit_defer_src", src)
                    } else {
                        setJqSrc(targetElem, src)
                    }
                };
                temDef.from && (editTarget = $(temDef.from));
                if (HdGame.getType(tem.path[0]) === "array") {
                    if (isOne) {
                        matchs = editTarget.attr("class").match(elemRegx);
                        if (matchs && matchs[2] == "-" + tem.name) {
                            matchs[3] && (onePathIndex = parseInt(matchs[3].slice(1)));
                            var src = getOldSrc($(".editTarget-" + tem.name + (isNaN(onePathIndex) ? "": "-" + onePathIndex)));
                            isNaN(onePathIndex) && (onePathIndex = 0); ! src && (src = HdGame.getSrc(tem.path[onePathIndex][0]));
                            setPath(editTarget, src, onePathIndex)
                        }
                    } else {
                        $.each(tem.path,
                        function(i, val) {
                            var src = HdGame.getSrc(val[0]);
                            var editClass = "editTarget-" + tem.name;
                            var targetElem = editTarget;
                            if (i !== 0) {
                                editClass = "editTarget-" + tem.name + "-" + i;
                                relateClass = ".editRelate-" + tem.name + "-" + i;
                                targetElem = $("." + editClass)
                            }
                            if (targetElem.length == 0) {
                                if (_manage && getAutoGenState(temDef)) {
                                    $("body").append('<input class="' + editClass + '" type="hidden" value="' + src + '">')
                                }
                            } else {
                                i !== 0 && setOff(targetElem)
                            }
                            setPath(targetElem.add(relateClass), src, i)
                        })
                    }
                } else {
                    if (isOne) {
                        setPath(editTarget, getOldSrc($(".editTarget-" + tem.name), HdGame.getSrc(tem.path[0])), 0)
                    } else {
                        setPath(editTarget.add(relateClass), HdGame.getSrc(tem.path[0]), 0)
                    }
                }
            }
            if (tem.css) {
                setCss = function(selecter, item, isDef) {
                    var cssTarget;
                    if (isOne) {
                        if (!editTarget.is(selecter)) {
                            return
                        }
                        cssTarget = editTarget
                    } else {
                        cssTarget = $(selecter)
                    }
                    setCssVal(cssTarget, item, isDef)
                };
                $.extend(true, temDef.css, tem.css);
                $.each(temDef.css,
                function(i, item) {
                    if (!item.from) {
                        item.from = allEditSelecter
                    }
                    if (item.css) {
                        $.each(item.css,
                        function(i, css) {
                            if (!css.from) {
                                css.from = item.from
                            }
                            setCss(css.from, css, css.opt === 0)
                        })
                    } else {
                        setCss(item.from, item, item.opt === 0)
                    }
                })
            }
            if (tem.text) {
                $.each(tem.text,
                function(i, item) {
                    if (temDef.text) {}
                    var defText = temDef.text;
                    if (!defText) {
                        return
                    }
                    var itemDef = defText[i],
                    textTarget;
                    if (!itemDef) {
                        return
                    } ! itemDef.from && (itemDef.from = allEditSelecter);
                    if (isOne) {
                        if (!editTarget.is(itemDef.from)) {
                            return
                        }
                        textTarget = editTarget
                    } else {
                        textTarget = $(itemDef.from)
                    }
                    if (itemDef.type == 2) {
                        var theRealVal = Fai.encodeHtml(item.txtopt ? item.val: itemDef.val);
                        textTarget.html(theRealVal)
                    } else {
                        textTarget.val(item.value)
                    }
                })
            }
            if (tem.textarea) {
                initTextareaItem(tem, temDef)
            }
            if (tem.textContent) {
                initTextContentItem(tem, temDef)
            }
            return true
        }
        function getAutoGenState(template) {
            return ! template.notAutoGeneration
        }
        function initTextareaItem(template, templateDefault) {
            var textareaConfigs = $.extend(true, [], templateDefault.textarea, template.textarea);
            var autoGen = getAutoGenState(templateDefault);
            var findTarget = function(name) {
                var selector = ".editTarget-{{name}},.editRelate-{{name}}".replace(/{{name}}/g, name);
                var target = $(selector);
                if (!target.length && _manage && autoGen) {
                    target = $('<div style="display: none;" class="hideImpl editTarget-' + name + '"></div>');
                    $("body").append(target)
                }
                return target
            };
            var findTextarea = function(target) {
                var textarea = target.find(".editTextarea");
                if (!textarea.length) {
                    textarea = $('<textarea class="editTextarea" readonly="readonly"></textarea>');
                    target.append(textarea)
                }
                return textarea
            };
            var findTextareaMask = function(target) {
                if (target.css("position") === "static") {
                    target.css("position", "relative")
                }
                var mask = target.find(".editTextareaMask");
                if (!mask.length) {
                    mask = $('<div class="editTextareaMask"></div>');
                    target.append(mask)
                }
                return mask
            };
            textareaConfigs.forEach(function(textareaConfig, index) {
                var name = (index > 0) ? (templateDefault.name + "-" + index) : templateDefault.name;
                var target = findTarget(name);
                var textarea = findTextarea(target);
                findTextareaMask(target);
                var value = textareaConfig.value;
                target.data(templateDefault.name, textareaConfigs);
                textarea.val(value).trigger("contentChange", value)
            })
        }
        function initTextContentItem(template, templateDefault) {
            var textContentConfigs = $.extend(true, [], templateDefault.textContent, template.textContent);
            var autoGen = getAutoGenState(templateDefault);
            var findTarget = function(name) {
                var selector = ".editTarget-{{name}},.editRelate-{{name}}".replace(/{{name}}/g, name);
                var target = $(selector);
                if (!target.length && _manage && autoGen) {
                    target = $('<div style="display: none;" class="hideImpl editTarget-' + name + '"></div>');
                    $("body").append(target)
                }
                return target
            };
            textContentConfigs.forEach(function(textareaConfig, index) {
                var name = (index > 0) ? (templateDefault.name + "-" + index) : templateDefault.name;
                var target = findTarget(name);
                target.css({
                    "white-space": "pre-wrap"
                });
                var value = textareaConfig.value;
                target.data(templateDefault.name, textContentConfigs);
                target.text(value).trigger("contentChange", value)
            })
        } (function() {
            if (!originMod) {
                return
            }
            $.each(originMod,
            function(i, infoMod) {
                if (originDef.indexOf(infoMod) != -1) {
                    return
                }
                var info = origin[i];
                var infoDef = originDef[i];
                var initFaiImg = function(theInfo) {
                    theInfo.pos = $.extend({},
                    infoDef.pos);
                    theInfo.size = $.extend({},
                    infoDef.size);
                    theInfo.path[0][0] = infoDef.path[0][0]
                };
                if (!g_config.isOldFaiImgGame && infoMod.name.indexOf("theGetPricePic") != -1) {
                    initFaiImg(infoMod);
                    if (g_config.isNewGame || Edit.isMod) {
                        initFaiImg(info)
                    }
                }
                if (infoMod.css) {
                    var setCssInit = function(cssItem) {
                        if (typeof cssItem.opt !== "undefined") {
                            cssItem.opt = 0
                        }
                        if (cssItem.tra !== "undefined") {
                            cssItem.defTra = cssItem.tra
                        }
                        cssItem.defVal = cssItem.val
                    };
                    $.each(infoMod.css,
                    function(i, itemMod) {
                        if (itemMod.css) {
                            $.each(itemMod.css,
                            function(i, item) {
                                setCssInit(item)
                            })
                        } else {
                            setCssInit(itemMod)
                        }
                    });
                    if (g_config.isNewGame || Edit.isMod) {
                        $.extend(true, info.css, infoMod.css)
                    }
                }
                if (infoMod.text) {
                    $.each(infoMod.text,
                    function(index, itemMod) {
                        if (g_config.isNewGame || Edit.isMod) {
                            $.extend(true, info.text, infoMod.text)
                        }
                        if (itemMod.type == 2) {
                            itemMod.txtopt = 0;
                            delete itemMod.numLimit
                        }
                    })
                }
            });
            $.extend(true, originDef, originMod)
        })();
        $.each(origin,
        function(index, info) {
            var infoDef = originDef[index];
            if (!info.showPath) {
                info.showPath = [];
                if (originDef[index].showPath) {
                    for (var i = 0,
                    n = originDef[index].showPath.length; i < n; i++) {
                        info.showPath.push(1)
                    }
                }
            }
            if (infoDef.swiperConfig && !info.swiperConfig) {
                info.swiperConfig = $.extend(true, {},
                infoDef.swiperConfig)
            }
        });
        if (_manage) {
            Edit.setAllEdit = function() {
                initEdit();
                Edit.hasInitEle = true;
                $.each(originDef,
                function(i, info) {
                    if (info.css && !info.crrCssArg) {
                        info.crrCssArg = $.extend(true, [], info.css, origin[i].css)
                    }
                });
                $.each(origin,
                function(index, tem) {
                    setEditByName([tem, originDef[index]])
                })
            }
        } else {
            Edit.hasInitEle = true;
            initEdit()
        }
        Edit.setEdit = setEdit;
        Edit.getImgInfo = getImgInfo;
        Edit.getInfoByName = getInfoByName;
        Edit.getRgba = getRgba;
        Edit.initEdit = initEdit;
        Edit.initByElem = initByElem;
        Edit.cache = cache;
        Edit.setJqSrc = setJqSrc;
        delete Edit.originMod;
        return Edit
    };
    HdGame.initSound = function(soundList, soundListDef, soundListMod) {
        if (soundListMod && soundListDef) {
            $.each(soundListMod,
            function(index, s) {
                soundListDef[index].path = s.path;
                soundListDef[index].fileName = s.fileName;
                if (g_config.isModel) {
                    soundList[index].optFlag = soundListDef[index].optFlag
                }
            })
        }
        if (soundList && soundListDef) {
            $.each(soundList,
            function(index, s) {
                var soundDef = soundListDef[index];
                if (index !== 0 && s.optFlag === 1) {
                    s.optFlag = 2
                }
                s.path = HdGame.getSrc(s.path);
                soundDef.path = HdGame.getSrc(soundDef.path)
            })
        }
        var cache = {};
        var supportWebAudio = LF.sound.webAudioEnabled;
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
                if (_manage || tryPlay) {
                    return this
                }
                if (!this.allowPlay && g_config.style != 9 && g_config.style != 58) {
                    return this
                }
                if (soundList && HdGame.getType(key) === "number") {
                    var flag = key === 0 ? 1 : 3;
                    if (soundList[key].optFlag === flag) {
                        return this
                    }
                }
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
                if (_manage) {
                    return this
                }
                if (checkFlag(g_config.flagB, 8388608)) {
                    return this
                }
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
                if (_manage) {
                    return this
                }
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
                if (_manage) {
                    return this
                }
                var key;
                for (key in cache) {
                    this.pause(key)
                }
                return this
            },
            load: function(path, key, webAudioEnabled, isOnec) {
                if (_manage) {
                    return this
                }
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
                HdGame.tlog("useWebAudio=" + useWebAudio + ",key=" + key);
                if (useWebAudio) {
                    lsound = new LF.webAudio();
                    lsound.isWebAudio = true
                } else {
                    lsound = new LF.media();
                    try {
                        lsound.data = new Audio()
                    } catch(e) {
                        console.warn("ReferenceError: Can't find variable: Audio");
                        lsound.data = {}
                    }
                    lsound.data.loop = false;
                    lsound.data.autoplay = false
                }
                HdGame.tlog("lsound", lsound);
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
                    HdGame.tlog("load", key + "_wuhao");
                    lsound.load(path)
                }
                lsound.on("complete",
                function(event) {
                    lsound.complete = true;
                    lsound.fire("ready", lsound);
                    HdGame.tlog("sound", key + " ready")
                });
                lsound._allowPlay = true;
                lsound.name = key;
                cache[key] = lsound;
                return this
            },
            onReady: function(key, callBack) {
                if (_manage) {
                    return this
                }
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
                if (_manage) {
                    return this
                }
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
            $.each(soundList,
            function(index, s) {
                var path = s.path;
                if (index === 0) {
                    var useWebAudio = false;
                    var UA = HdGame.UA;
                    if (UA.isWX() && !UA.isIOS() && UA.getWxVerNum() >= UA.getWxVerNum("6.6.6")) {
                        useWebAudio = true
                    }
                    sound.load(path, index, useWebAudio, true);
                    initBackgroundMusic()
                } else {
                    sound.load(path, index)
                }
            })
        }
        var noInitList = [40, 45, 60, 46, 59, 48, 9, 58, 55, 27, 62, 63, 61, 64, 70, 67, 77, 78];
        if (g_config.drawType != 1 && !~noInitList.indexOf(g_config.style)) {
            sound.readyPlay(0, 0, "loop");
            wx.ready(function() {
                sound.readyPlay(0, 0, "loop")
            })
        }
        return sound;
        function initBackgroundMusic() {
            if (_manage || !sound.cache["0"]) {
                return
            }
            sound.get("0",
            function(lsound) {
                lsound.on("play",
                function() {
                    $(function() {
                        if ($(".soundIcon").length <= 0) {
                            HdGame.appendMusicIcon()
                        }
                        $(".soundIcon").removeClass("soundIconOff")
                    })
                }).on("pause",
                function() {
                    $(function() {
                        $(".soundIcon").addClass("soundIconOff")
                    })
                });
                if (Audio && lsound.data instanceof Audio) {
                    document.getElementById("pageMusic").appendChild(lsound.data)
                }
            })
        }
    };
    HdGame.initCallBack = function(target, arg) {
        var callBackObj = new Fai.CallBack();
        target = target || {};
        $.each(callBackObj.getApiKeys(),
        function(i, key) {
            target[key] = function() {
                var rt = callBackObj[key].apply(callBackObj, arguments);
                return rt === callBackObj ? this: rt
            }
        });
        if ($.type(arg) == "array") {
            callBackObj.register(arg)
        }
        return target
    };
    HdGame.initTime = function(initTime) {
        var _timer = null,
        _timeFlag, _timeLock = 0;
        function changeTwoDecimal_f(x) {
            var f_x = Math.round(x * 100) / 100;
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf(".");
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                s_x += "."
            }
            while (s_x.length <= pos_decimal + 2) {
                s_x += "0"
            }
            return s_x
        }
        var range = [70, 280];
        if (g_config.countsTimeType) {
            if (g_config.sortType) {
                range[1] = -1
            }
        } else {
            if (g_config.scoreType) {
                if (!g_config.sortType) {
                    range[1] = -1
                }
            } else {
                range[1] = -1
            }
        }
        var Time = {
            val: 0,
            pastTime: 0,
            interval: 140,
            range: range,
            target: null,
            isDesc: !g_config.countsTimeType,
            acceList: null,
            initTime: initTime,
            status: "ended",
            updateFlag: true,
            targetFlag: true,
            gameCostTime: 0,
            frameInc: 0,
            setAcceList: function(list) {
                if (typeof list === "number") {
                    var n = list;
                    list = [];
                    for (var i = 0; i < n; i++) {
                        list.push((n - i) * (this.initTime / (n + 1)))
                    }
                }
                this.acceList = list;
                return this
            },
            setTarget: function() {
                var val = changeTwoDecimal_f(this.val);
                this.targetFlag && this.target.text(val);
                this.fireWith("setTime", this, [val])
            },
            init: function() {
                if (this.initTime === 99999) {
                    return
                } ! this.target && (this.target = $(".time"));
                this.val = this.initTime;
                this.pastTime = 0;
                this.setTarget();
                return this
            },
            start: function() {
                if (this.initTime === 99999) {
                    return
                }
                _timeFlag = new Date().getTime() / 1000;
                if (this.updateFlag && this.status === "ended") {
                    this.status = "runing";
                    this.play()
                } else {
                    this.status = "runing"
                }
                return this
            },
            isRunning: function() {
                return this.status === "runing"
            },
            pause: function() {
                this.status = "pause"
            },
            end: function() {
                if (this.status === "ended") {
                    return
                }
                clearTimeout(_timer);
                _timeLock = 0;
                this.update();
                this.status = "ended";
                return this
            },
            setTime: function() {
                var now = (new Date).getTime() / 1000;
                var delta = now - _timeFlag;
                var r = this.isDesc ? -1 : 1;
                if (this.range[0] > 0 && delta < this.range[0] / 1000) {
                    delta = this.range[0] / 1000
                } else {
                    if (this.range[1] > 0 && delta > this.range[1] / 1000) {
                        delta = this.range[1] / 1000
                    }
                }
                this.val += r * delta;
                this.pastTime = r * (this.val - this.initTime);
                _timeFlag = now;
                if (this.isDesc) {
                    if (this.acceList) {
                        for (var i = 0; i < this.acceList.length; i++) {
                            if (this.val <= this.acceList[i] && _timeLock == i) {
                                _timeLock++;
                                this.fireWith("acce", this, [_timeLock]);
                                break
                            }
                        }
                    }
                    if (this.val <= 0) {
                        this.val = 0;
                        this.pastTime = this.initTime;
                        this.setTarget();
                        clearTimeout(_timer);
                        _timeLock = 0;
                        this.status = "ended";
                        this.fireWith("end", this);
                        return
                    }
                }
                this.setTarget()
            },
            update: function() {
                if (this.initTime === 99999) {
                    return
                }
                if (this.status !== "pause") {
                    this.setTime()
                }
                this.fireWith("timer", this, [this.status !== "pause"])
            },
            play: function() {
                this.update();
                if (this.status !== "ended") {
                    _timer = setTimeout(arguments.callee.bind(this), this.interval)
                }
            },
            updateInFrame: function(delta) {
                if (this.initTime === 99999) {
                    return
                }
                if (this.status === "ended") {
                    return
                }
                if (delta < 0) {
                    delta = 0
                }
                this.frameInc += delta;
                if (this.frameInc >= this.interval) {
                    this.update();
                    this.frameInc = 0
                }
            }
        };
        HdGame.initCallBack(Time, ["end", "timer", "acce", "setTime"]);
        Time.init();
        Time.changeTwoDecimal_f = changeTwoDecimal_f;
        return Time
    };
    HdGame.initGrade = function() {
        var grade = function(dv) {
            grade.set(grade.val + dv)
        };
        $.extend(grade, {
            val: 0,
            set: function(val) {
                grade.val = val;
                grade.val < 0 && (grade.val = 0);
                grade.fireWith("setGrade", grade, [grade.val]);
                grade.target && grade.target.text(grade.val)
            }
        });
        $(function() {
            grade.target = $("#grade")
        });
        HdGame.initCallBack(grade, ["setGrade"]);
        return grade
    };
    HdGame.initAreaLimit = function(isOpenAreaLimit) {
        if (!_manage && isOpenAreaLimit) {
            var countLimit = 5;
            var counter = 0;
            var timer = setInterval(function() {
                if (counter >= countLimit) {
                    clearInterval(timer);
                    return
                }
                counter++;
                if (!g_config.ipInfo || !g_config.ipInfo.provice) {
                    $.ajax({
                        type: "post",
                        url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getIPInfo",
                        success: function(data) {
                            var result = $.parseJSON(data);
                            if (result.success) {
                                g_config.ipInfo = result.ipInfo
                            }
                        }
                    })
                } else {
                    clearInterval(timer);
                    return
                }
            },
            1500)
        }
    };
    HdGame.checkAreaLimitByWx = (function() {
        var isSea = false;
        function getAreaByWx(ipInfo) {
            var start = Date.now();
            HdGame.tlog("gps:getAreaByWx5", ipInfo);
            function getAddressByLatLng(lat, lng) {
                return $.Deferred(function(defer) {
                    var geocoder = new qq.maps.Geocoder();
                    var latLng = new qq.maps.LatLng(lat, lng);
                    var timer, wxTimer;
                    geocoder.getAddress(latLng);
                    geocoder.setComplete(function(result) {
                        AreaLimitLogDog("address", start);
                        HdGame.tlog("gps:getAddressByLatLng:setComplete", result);
                        clearTimeout(timer);
                        if (!result) {
                            return defer.reject()
                        }
                        var city = result.detail.addressComponents.city;
                        var province = result.detail.addressComponents.province;
                        var country = result.detail.addressComponents.country;
                        defer.resolve({
                            contry: country,
                            provice: province,
                            city: city,
                            locationTime: Date.now()
                        })
                    });
                    geocoder.setError(function(result) {
                        AreaLimitLogDog("address", start);
                        HdGame.tlog("gps:getAddressByLatLng:setError", result);
                        clearTimeout(timer);
                        defer.reject(result)
                    });
                    timer = setTimeout(function() {
                        isSea = true;
                        HdGame.tlog("gps:getAddressByLatLng:timeout");
                        defer.resolve({
                            contry: "海外",
                            provice: "海外",
                            city: "海外",
                            locationTime: Date.now()
                        })
                    },
                    6000)
                })
            }
            return $.Deferred(function(defer) {
                if (g_config.test) {
                    ipInfo.provice = "广东";
                    ipInfo.city = "广州";
                    return defer.resolve()
                }
                var getLocationTimer;
                HdGame.tlog("locationTime", ipInfo.locationTime == undefined);
                if (ipInfo.locationTime == undefined || Date.now() - ipInfo.locationTime > 300000) {
                    try {
                        wx.ready(function() {
                            HdGame.tlog("getAreaByWx: ", "wxReady callback");
                            wx.getLocation({
                                type: "wgs84",
                                success: function(res) {
                                    AreaLimitLogDog("location", start);
                                    clearTimeout(getLocationTimer);
                                    start = Date.now();
                                    var latitude = res.latitude;
                                    var longitude = res.longitude;
                                    HdGame.tlog("gps:getLocation", latitude + "," + longitude);
                                    getAddressByLatLng(latitude, longitude).then(function(result) {
                                        HdGame.tlog("gps:getAddressByLatLng", result);
                                        ipInfo.contry = result.contry;
                                        ipInfo.provice = result.provice;
                                        ipInfo.city = result.city;
                                        ipInfo.locationTime = result.locationTime;
                                        defer.resolve()
                                    }).fail(defer.reject)
                                },
                                fail: function(res) {
                                    AreaLimitLogDog("location", start);
                                    HdGame.tlog("getAreaByWx: ", "fail");
                                    HdGame.tlog("fail:", res);
                                    if (typeof Fdp !== "undefined") {
                                        Fdp.bssMonitor(142)
                                    }
                                    HdGame.logStd("wxlocationLog----fai", res);
                                    HdGame.statusMsg("当前微信版本不支持定位或没开启定位服务，请联系活动主办单位", "");
                                    clearTimeout(getLocationTimer);
                                    defer.reject()
                                },
                                cancel: function() {
                                    AreaLimitLogDog("location", start);
                                    HdGame.tlog("getAreaByWx: ", "cancel");
                                    HdGame.statusMsg("用户拒绝了授权地理位置信息", "");
                                    clearTimeout(getLocationTimer);
                                    defer.reject()
                                }
                            })
                        });
                        getLocationTimer = setTimeout(function() {
                            HdGame.tlog("gps:getAddressTimeout", "timeout: more than 5s.");
                            HdGame.statusMsg("无法开启活动,请在您的移动设备中开启定位服务后尝试", "");
                            defer.reject()
                        },
                        5000)
                    } catch(e) {
                        defer.reject()
                    }
                    return
                }
                return defer.resolve()
            })
        }
        function checkAreaLimit(ipInfo, areaLimitList, notTipsErrMsg) {
            var now_province = ipInfo.provice;
            var now_city = ipInfo.city;
            if (areaLimitList.length > 0) {
                if (now_province && now_city) {
                    var isLimit = true;
                    for (var i = 0; i < areaLimitList.length; i++) {
                        var info = site_cityUtil.getInfo(areaLimitList[i]);
                        if (info.parentId == 1) {
                            if (info.name.indexOf(now_province) > -1 || now_province.indexOf(info.name) > -1) {
                                isLimit = false;
                                break
                            }
                        } else {
                            var isInCountry = site_cityUtil.getCounty(info.id).some(function(country) {
                                return country.name.indexOf(now_city) > -1 || now_city.indexOf(country.name) > -1
                            });
                            if (info.name.indexOf(now_city) > -1 || now_city.indexOf(info.name) > -1 || isInCountry) {
                                isLimit = false;
                                break
                            }
                        }
                    }
                    if (isLimit) {
                        if (!notTipsErrMsg) {
                            HdGame.statusMsg("您当前所在的地区（" + now_city + "）不在可参与区域范围", "")
                        }
                        return "limit"
                    }
                } else {
                    HdGame.logErr("ipInfo null", $.toJSON(ipInfo));
                    if (!notTipsErrMsg) {
                        HdGame.statusMsg("微信获取地理位置接口正在维护中，无法获取您的地理位置。请稍后重试", "")
                    }
                    return "busyness"
                }
            }
            return "ok"
        }
        function checkIsSea(isStartAction) {
            return $.Deferred(function(defer) {
                if (isStartAction && isSea) {
                    HdGame.hideLoadToast();
                    HdGame.otherAjaxComplete();
                    HdGame.showMsgToast2({
                        bodyMsg: "无法获取您当前的位置,您当前所在的位置是否为海外地区",
                        isTwoFootBtn: true,
                        primaryBtnText: "是的,我在海外",
                        defaultBtnText: "不,不在海外",
                        primaryBtnFn: function() {
                            defer.resolve()
                        },
                        defaultBtnFn: function() {
                            HdGame.statusMsg("当前无法获取您的位置,无法开始活动", "");
                            defer.reject("noLocation")
                        }
                    })
                } else {
                    defer.resolve()
                }
            })
        }
        function AreaLimitLogDog(key, start) {
            var time = (Date.now() - start) / 1000;
            var src = time > 9 ? (key == "location" ? 10 : 20) : (key == "location" ? 0 : 10) + Math.ceil(time);
            HdGame.logDog(1000295, src)
        }
        return function(ipInfo, areaLimitList, notTipsErrMsg, isStartAction) {
            HdGame.showLoadToast("数据加载中");
            return $.Deferred(function(defer) {
                getAreaByWx(ipInfo).then(function() {
                    return HdGame.Res.load("js_city")
                }).then(function() {
                    return checkIsSea(isStartAction).fail(function(rt) {
                        if (rt == "noLocation") {
                            defer.reject({
                                cmd: rt
                            });
                            return
                        }
                    })
                }).then(function() {
                    var result = checkAreaLimit(ipInfo, areaLimitList, notTipsErrMsg);
                    HdGame.tlog("checkAreaLimit result: ", result);
                    if (result !== "ok") {
                        defer.reject({
                            cmd: result
                        });
                        return
                    }
                    defer.resolve()
                }).always(function() {
                    HdGame.hideLoadToast();
                    HdGame.otherAjaxComplete()
                }).fail(function() {
                    defer.reject()
                })
            })
        }
    })();
    HdGame.getIsHasAttention = function(callback, notShowAjaxLoad) {
        HdGame.tlog("g_config.acctOpenId=", g_config.acctOpenId);
        if (!notShowAjaxLoad) {
            HdGame.showLoadToast("数据加载中")
        }
        var url = HdGame.jointUrlArg(g_config.ajaxUrl + "hdgame_h.jsp", HdGame.jointParams({
            cmd: "getMyAttention",
            gameId: g_config.gameId,
            openId: g_config.acctOpenId
        }));
        return $.Deferred(function(defer) {
            $.ajax({
                type: "POST",
                url: url,
                dataType: "json",
                error: function() {
                    var msg = "系统繁忙，请稍后重试！";
                    if (m_debug) {
                        alert(msg)
                    }
                    if (callback) {
                        callback(msg)
                    }
                    defer.reject(msg)
                },
                success: function(result) {
                    HdGame.tlog("查询结果", result);
                    var msg = result.msg || "系统繁忙，请稍后重试！";
                    if (result.rt) {
                        defer.reject(msg);
                        if (callback) {
                            callback(msg)
                        }
                        return
                    }
                    if (result.data.isAttention) {
                        console.log(result.data.isAttention);
                        g_config.ishasAttentiosThisAPP = false
                    }
                    if (callback) {
                        callback()
                    }
                    defer.resolve(result)
                },
                complete: function() {
                    if (!notShowAjaxLoad) {
                        HdGame.hideLoadToast()
                    }
                }
            })
        })
    };
    HdGame.initWxConfig = function(arg) {
        var sTkPartnerId = HdGame.parseURL(document.URL).params.sTkPartnerId;
        HdGame.wxConfigArg = {
            url: arg.fullUrl
        };
        setWxShareArg({
            haveAward: g_config.haveAward,
            plInfo: arg.plInfo,
            bestRankInfo: g_config.bestRankInfo,
            comfortAwardStyle: g_config.comfort.cas
        });
        HdGame.tlog("HdGame.initWxConfig");
        wx.config({
            debug: false,
            appId: arg.jsSdkAppid,
            timestamp: arg.timestamp,
            nonceStr: arg.nonce_str,
            signature: arg.signature,
            jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "hideMenuItems", "showMenuItems", "hideAllNonBaseMenuItem", "showAllNonBaseMenuItem", "startRecord", "stopRecord", "onRecordEnd", "playVoice", "pauseVoice", "stopVoice", "uploadVoice", "downloadVoice", "translateVoice", "chooseImage", "previewImage", "uploadImage", "downloadImage", "getNetworkType", "openLocation", "getLocation", "hideOptionMenu", "showOptionMenu", "closeWindow", "scanQRCode", "chooseWXPay", "openProductSpecificView", "addCard", "chooseCard", "openCard"]
        });
        wx.ready(function() {
            $("#bottomCusBtnInfo").on("touchstart",
            function() {
                var isAddCard = true;
                var award = g_config.wxAward;
                var generateWxcard = award.genewxcard;
                var isFixTerm = award.t_type == "DATE_TYPE_FIX_TERM" ? true: false;
                var cfbt = award.cfbt;
                var cft = award.cft;
                var openId = g_config.acctOpenId || g_config.openId;
                if (generateWxcard) {
                    if (g_config.status == 0) {
                        HdGame.statusMsg("活动尚未发布", "无法加入到微信卡券");
                        return
                    }
                    var cardId = award.wxcardid;
                    var code = $("#awardDetailBox .codeLine .code").text();
                    var sysCode = $("#awardDetailBox .codeLine .code").attr("code");
                    var depositTime = g_config.award.depositTime;
                    HdGame.log(cardId);
                    HdGame.log(code);
                    $.ajax({
                        type: "post",
                        url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getCardSign&cardTick=" + arg.cardTicket + "&cardId=" + cardId + "&code=" + code + "&openId=" + openId + "&gameId=" + g_config.gameId,
                        error: function() {
                            if (m_debug) {
                                alert("服务繁忙，请稍候重试")
                            }
                        },
                        success: function(data) {
                            HdGame.tlog("getCardSign", data);
                            var info = $.parseJSON(data);
                            var result = info.data;
                            var codeStatus = result.codeStatus;
                            if (codeStatus == 1) {
                                HdGame.statusMsg("该兑奖码已被核销，无法放入微信卡包");
                                return
                            }
                            var cardExt = '{"timestamp":"' + result.timestamp + '","openid":"' + openId + '","nonce_str":"' + result.nonce_str + '","code":"' + code + '","signature":"' + result.sign + '"}';
                            if ((depositTime && depositTime < Date.parse(new Date())) || $("#bottomCusBtnInfo .text").text() == "打开微信卡券") {
                                isAddCard = false
                            }
                            HdGame.log("depositTime=" + depositTime);
                            HdGame.log("isAddCard=" + isAddCard);
                            if (isAddCard) {
                                wx.addCard({
                                    cardList: [{
                                        cardId: cardId,
                                        cardExt: cardExt
                                    }],
                                    success: function(res) {
                                        HdGame.tlog("addCard", res);
                                        HdGame.logDog(1000108, 1);
                                        var resItem = res.cardList[0];
                                        isAddCard = false;
                                        if (resItem.isSuccess) {
                                            $.ajax({
                                                type: "get",
                                                url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=setCode&code=" + sysCode + "&gameId=" + g_config.gameId,
                                                error: function() {
                                                    if (m_debug) {
                                                        alert("服务繁忙，请稍候重试")
                                                    }
                                                },
                                                success: function(data) {
                                                    HdGame.tlog("setCode", data);
                                                    var result = $.parseJSON(data);
                                                    g_config.award.depositTime = Date.parse(new Date());
                                                    award.code = sysCode;
                                                    $("#codeDetailInfoBox").show();
                                                    $("#codeStatusBox").hide();
                                                    $("#bottomCusBtnInfo .text").text("打开微信卡券");
                                                    HdGame.refreshGiftListAndAwardDetail(g_config.gameId, g_config.openId, sysCode, g_config.award);
                                                    var sTime = new Date().getTime();
                                                    if (isFixTerm) {
                                                        var depositTime = result.depositTime;
                                                        var oneday = 1000 * 60 * 60 * 24;
                                                        sTime = depositTime + oneday * cfbt;
                                                        var eTime = depositTime + oneday * cft;
                                                        var sTimeFmt = $.format.date(new Date(sTime), "yyyy-MM-dd");
                                                        var eTimeFmt = $.format.date(new Date(eTime), "yyyy-MM-dd");
                                                        $(".awardDetail .awardCodeTime em").html("使用期限：" + sTimeFmt + " - " + eTimeFmt);
                                                        $("#ticketDetailBox .codeTimeFixedRange .box").html(sTimeFmt + " 至 " + eTimeFmt);
                                                        if (new Date().getTime() < sTime) {
                                                            $("#codeStatusBox #codeStatusBtn").show();
                                                            $("#codeStatusBox").show();
                                                            $("#codeStatusTips").css("fontSize", "0.55rem");
                                                            $("#codeStatusTips").find(".giftNameA").text("打开微信卡券");
                                                            $("#codeDetailInfoBox").hide()
                                                        }
                                                    } else {
                                                        HdGame.tlog("award.cbt", award.cbt);
                                                        if (award.cbt) {
                                                            sTime = new Date(award.cbt).getTime()
                                                        }
                                                    }
                                                    HdGame.tlog("sTime", sTime);
                                                    if (new Date().getTime() < sTime) {
                                                        $("#codeStatusBox #codeStatusBtn").show();
                                                        $("#codeStatusBox").show();
                                                        $("#codeStatusTips").css("fontSize", "0.55rem");
                                                        $("#codeStatusTips").find(".giftNameA").text("打开微信卡券");
                                                        $("#codeDetailInfoBox").hide()
                                                    }
                                                }
                                            })
                                        }
                                    },
                                    fail: function(res) {
                                        HdGame.tlog("addCardErr=", res)
                                    }
                                })
                            } else {
                                wx.openCard({
                                    cardList: [{
                                        cardId: cardId,
                                        code: code
                                    }]
                                })
                            }
                        }
                    })
                }
            })
        });
        wx.ready(function() {
            wx.hideMenuItems({
                menuList: ["menuItem:copyUrl"]
            });
            HdGame.tlog("isForbidShareactivity=" + g_config.isForbidShareactivity);
            wx[g_config.isForbidShareactivity ? "hideMenuItems": "showMenuItems"]({
                menuList: ["menuItem:copyUrl", "menuItem:share:appMessage", "menuItem:share:timeline", "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:share:facebook", "menuItem:share:QZone", "menuItem:originPage", "menuItem:openWithQQBrowser", "menuItem:openWithSafari"]
            });
            try {
                if (arg.isHideShareBtn) {
                    wx.hideMenuItems({
                        menuList: ["menuItem:share:timeline", "menuItem:share:qq", ]
                    })
                }
                wx.error(function(res) {
                    if (m_debug) {
                        alert($.toJSON(res))
                    }
                })
            } catch(e) {
                alert(e.message)
            }
            if (typeof arg.checkControlLevel !== "undefined") {
                var isFree = g_config.authVer == 0;
                switch (arg.checkControlLevel) {
                case 1:
                    if (isFree) {
                        wx.hideMenuItems({
                            menuList:
                            ["menuItem:share:timeline"]
                        })
                    }
                    break;
                case 2:
                    if (isFree) {
                        wx.hideMenuItems({
                            menuList:
                            ["menuItem:share:timeline", "menuItem:share:appMessage"]
                        })
                    }
                    break;
                case 3:
                    wx.hideMenuItems({
                        menuList:
                        ["menuItem:share:timeline"]
                    });
                    break;
                case 4:
                    wx.hideMenuItems({
                        menuList:
                        ["menuItem:share:timeline", "menuItem:share:appMessage"]
                    });
                    break;
                default:
                    break
                }
            }
            if (/VIVO Y66I/i.test(navigator.userAgent)) {
                wx.showMenuItems({
                    menuList:
                    ["menuItem:favorite"]
                })
            }
        });
        wx.ready(function() {
            var isApple = window.navigator.userAgent.indexOf("iPhone") > -1 || window.navigator.userAgent.indexOf("iPad") > -1 || window.navigator.userAgent.indexOf("iPod") > -1;
            var isAndroid = window.navigator.userAgent.indexOf("Android") > -1;
            var sysType = "unknown";
            if (isApple) {
                sysType = "apple"
            } else {
                if (isAndroid) {
                    sysType = "android"
                }
            }
            if (!g_config.isFromZhuliShare && isPublish) {
                wx.getNetworkType({
                    success: function(res) {
                        var networkType = res.networkType;
                        var netType = "other";
                        if (networkType === "wifi") {
                            netType = "wifi"
                        } else {
                            netType = "other"
                        }
                        $.ajax({
                            url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=setBehavior&gameId=" + g_config.gameId + "&openId=" + g_config.openId,
                            type: "post",
                            data: {
                                netType: netType,
                                sysType: sysType
                            },
                            success: function(result) {}
                        })
                    }
                })
            }
        });
        function setWxShare(desc, url, callBack) {
            if (!_manage) {
                g_config.$$sensitWordAndAdvance.forEach(function(item) {
                    desc = desc.replace(new RegExp(item.sensword, "g"), item.adVance)
                })
            }
            desc = HdGame.decodeHtml(desc);
            url = HdGame.removeUrlArg(url, "code", "state");
            if (g_config.isYKY) {
                url = HdGame.removeUrlArg(url, "identity", "relationId")
            }
            var pyqUrl = url;
            if (!arg.dynamicShareUrlRootEmpty) {
                var urlParameterSet = url.split("?")[1].split("&");
                var urlParameter = "";
                for (var i = 0; i < urlParameterSet.length; i++) {
                    var itemPar = urlParameterSet[i];
                    if (itemPar.split("=")[0] === "aid" || itemPar.split("=")[0] === "id" || itemPar.split("=")[0] === "style") {
                        continue
                    }
                    if (urlParameter.length > 0) {
                        urlParameter += "&"
                    }
                    urlParameter += itemPar
                }
                if (m_debug) {
                    pyqUrl = arg.dynamicShareUrlRoot + "share.jsp?fsl=" + arg.fsl + "&aid=" + g_config.aid + "&id=" + g_config.urlToken + "&" + urlParameter
                } else {
                    pyqUrl = arg.dynamicShareUrlRoot + g_config.aid + "/" + g_config.urlToken + "/share.html?fsl=" + arg.fsl + "&" + urlParameter
                }
            }
            url = HdGame.setUrlArg(url, ["otherplayer", g_config.openId]);
            pyqUrl = HdGame.setUrlArg(pyqUrl, ["otherplayer", g_config.openId]);
            url = HdGame.setUrlArg(url, ["shareDeep", arg.shareDeep + 1]);
            pyqUrl = HdGame.setUrlArg(url, ["canal", fromCanal]);
            url = HdGame.setUrlArg(url, ["canal", fromCanal]);
            pyqUrl = HdGame.setUrlArg(pyqUrl, ["shareDeep", arg.shareDeep + 1]);
            HdGame.log(arg.openStrongAttention);
            url = HdGame.setUrlArg(url, ["isOfficialLianjie", "false"]);
            pyqUrl = HdGame.setUrlArg(pyqUrl, ["isOfficialLianjie", "false"]);
            if (sTkPartnerId && url.indexOf("sTkPartnerId") == -1) {
                url = HdGame.setUrlArg(url, ["sTkPartnerId", sTkPartnerId]);
                pyqUrl = HdGame.setUrlArg(pyqUrl, ["sTkPartnerId", sTkPartnerId])
            }
            if (url === HdGame.wxConfigArg.url && HdGame.wxConfigArg.desc === desc && HdGame.wxConfigArg.callBack === callBack && HdGame.wxConfigArg.pyqUrl === pyqUrl) {
                return
            }
            wx.ready(function() {
                var wxConfigShareImg = arg.shareImg;
                if (!/^http:/.test(wxConfigShareImg) && /^\/\//.test(wxConfigShareImg)) {
                    wxConfigShareImg = "http:" + wxConfigShareImg
                }
                try {
                    wx.onMenuShareAppMessage({
                        title: HdGame.decodeHtml(arg.activeName),
                        desc: desc,
                        link: url,
                        imgUrl: wxConfigShareImg,
                        type: "link",
                        success: function() {
                            $.ajax({
                                type: "post",
                                url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=setShareNum&aid=" + g_config.aid + "&gameId=" + g_config.gameId + "&openId=" + g_config.openId + "&type=friend&shareDeep=" + g_config.shareDeep,
                                error: function() {
                                    if (m_debug) {
                                        alert("服务繁忙，请稍候重试")
                                    }
                                },
                                success: function(data) {
                                    if (!m_debug) {
                                        HdGame.logDog(1000004, g_config.srcId);
                                        if (g_config.realVer >= HdVerDef.ZS) {
                                            HdGame.logDog(1000181, g_config.realVer + 1)
                                        } else {
                                            HdGame.logDog(1000181, g_config.authVer + 1)
                                        }
                                        HdGame.logObjDog(1000092, 2, g_config.gameId);
                                        HdGame.logDog(1000055, 0);
                                        HdGame.LogFaiOpenId(1000232, 0);
                                        if (g_config.fromGuideShare) {
                                            HdGame.logDog(1000239, 4)
                                        }
                                        if (g_config.freeFirstPublish) {
                                            HdGame.logDog(1000240, (g_config.aid % 2) + 5)
                                        }
                                    }
                                    handleShareAward(data);
                                    callBack && callBack(data)
                                }
                            })
                        },
                        cancel: function() {},
                        fail: function(res) {
                            alert("分享失败请退出微信重新登录！");
                            HdGame.logStd("wxShareFailErr", JSON.stringify(res), 2)
                        }
                    });
                    wx.onMenuShareTimeline({
                        title: desc,
                        link: pyqUrl,
                        imgUrl: wxConfigShareImg + "xxxxx",
                        success: function(res) {
                            var setShareNum = function() {
                                $.ajax({
                                    type: "post",
                                    url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=setShareNum&aid=" + g_config.aid + "&gameId=" + g_config.gameId + "&openId=" + g_config.openId + "&type=pyq&shareDeep=" + g_config.shareDeep,
                                    error: function(data) {
                                        if (m_debug) {
                                            alert("服务繁忙，请稍候重试")
                                        }
                                    },
                                    success: function(data) {
                                        if (!m_debug) {
                                            HdGame.logDog(1000004, g_config.srcId);
                                            if (g_config.realVer >= HdVerDef.ZS) {
                                                HdGame.logDog(1000181, g_config.realVer + 1)
                                            } else {
                                                HdGame.logDog(1000181, g_config.authVer + 1)
                                            }
                                            HdGame.logObjDog(1000092, 2, g_config.gameId);
                                            HdGame.logDog(1000055, 1);
                                            HdGame.LogFaiOpenId(1000232, 0);
                                            if (g_config.fromGuideShare) {
                                                HdGame.logDog(1000239, 4)
                                            }
                                            if (g_config.freeFirstPublish) {
                                                HdGame.logDog(1000240, (g_config.aid % 2) + 5)
                                            }
                                        }
                                        handleShareAward(data);
                                        callBack && callBack(data)
                                    }
                                })
                            };
                            if (HdGame.isIPhone()) {
                                setTimeout(setShareNum, 100)
                            } else {
                                setShareNum()
                            }
                        },
                        cancel: function(res) {},
                        fail: function(res) {
                            if (m_debug) {
                                alert(JSON.stringify(res))
                            }
                        }
                    });
                    HdGame.tlog("当前分享朋友链接：", url);
                    HdGame.tlog("当前分享朋友圈链接：", pyqUrl)
                } catch(e) {
                    alert(e.message)
                }
            });
            HdGame.wxConfigArg.desc = desc;
            HdGame.wxConfigArg.url = url;
            HdGame.wxConfigArg.callBack = callBack;
            HdGame.wxConfigArg.pyqUrl = pyqUrl;
            g_config._minapp_findAct && (wx.miniProgram.postMessage({
                data: HdGame.getminData()
            }))
        }
        function setWxShareUrlArg() {
            var argsArray = arrPro.slice.call(arguments);
            argsArray.unshift(HdGame.wxConfigArg.url);
            setWxShare(HdGame.wxConfigArg.desc, HdGame.setUrlArg.apply(HdGame, argsArray), HdGame.wxConfigArg.callBack)
        }
        function removeWxShareUrlArg() {
            var argsArray = arrPro.slice.call(arguments);
            argsArray.unshift(HdGame.wxConfigArg.url);
            setWxShare(HdGame.wxConfigArg.desc, HdGame.removeUrlArg.apply(HdGame, argsArray), HdGame.wxConfigArg.callBack)
        }
        function setShareText(text) {
            text = text.replace(/\u200b/g, "").replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            return text.replace(/<span class=["']tag["'] contenteditable=["']?false["']?>(.+?)<\/span>/g,
            function(match, $1) {
                switch ($1) {
                case "玩家名称":
                    if (g_config.style == 48) {
                        return HdGame.hykjUserName
                    } else {
                        if (HdGame.captainUserName) {
                            return HdGame.captainUserName
                        } else {
                            return g_config.userName
                        }
                    }
                case "游戏成绩":
                case "当前成绩":
                    if (g_config.style == 49) {
                        return parseInt(HdGame.currentScore) + g_config.scoreUnit
                    } else {
                        console.log(HdGame.currentScore);
                        var theTargetScore = isNaN(parseInt(HdGame.currentScore)) ? 0 : parseInt(HdGame.currentScore);
                        return g_config.scoreType ? HdGame.currentScore + g_config.scoreUnit: theTargetScore + g_config.scoreUnit
                    }
                case "游戏排名":
                    return HdGame.currentRank;
                case "奖品名称":
                    return HdGame.currentAward;
                case "奖项等级":
                    return HdGame.currentAwardStyle;
                case "收集的字":
                    return '"' + HdGame.ccndrmTitle + '"'
                }
            })
        }
        function setWxShareByStatus(url, callBack) {
            if (_manage) {
                return
            }
            typeof url === "undefined" && (url = HdGame.wxConfigArg.url);
            typeof callBack === "undefined" && (callBack = HdGame.wxConfigArg.callBack);
            if (g_config.drawType != 3) {
                if (g_config.style == 49 || g_config.style == 69) {
                    setWxShare(setShareText(arg.wxShareText_def), url, callBack);
                    return
                }
                if (HdGame.currentAward) {
                    setWxShare(setShareText(arg.wxShareText_award), url, callBack)
                } else {
                    if (HdGame.currentRank) {
                        setWxShare(setShareText(arg.wxShareText_rank), url, callBack)
                    } else {
                        setWxShare(setShareText(arg.wxShareText_def), url, callBack)
                    }
                }
            }
        }
        function handleShareAward(data) {
            var result = $.parseJSON(data);
            HdGame.tlog("shareaward", result.shareaward);
            if (result && result.shareaward) {
                drawTimesLimit += arg.addDrawTime;
                if (g_config.style != 50) {
                    drawTotalLimit += arg.addDrawTime
                }
                if ((g_config.drawType != 0 || g_config.style == 27) && HdGame.resulePoup.resuleArg) {
                    HdGame.resulePoup.resuleArg.count += arg.addDrawTime;
                    HdGame.resulePoup.resuleArg.totalCount += arg.addDrawTime
                }
                $(".dayDrawCount").text(drawTimesLimit - count < 0 ? 0 : (drawTimesLimit - count));
                $(".totalDrawCount,#totalDrawCount").text(drawTotalLimit - totalCount < 0 ? 0 : (drawTotalLimit - totalCount));
                g_config.showHelpGuide = false;
                PlayInfo.addPlayTimesLimit(arg.addDrawTime);
                if (g_config.style == 50) {
                    var scoreUnit = $(".gameScoreUnit").eq(0).text();
                    qdydjAddText($("#grade .specil"), arg.addDrawTime);
                    HdGame.statusMsg("分享成功，获得" + arg.addDrawTime + scoreUnit)
                }
                var dayNum = drawTimesLimit - count < 0 ? 0 : (drawTimesLimit - count);
                var allNum = drawTotalLimit - totalCount < 0 ? 0 : (drawTotalLimit - totalCount);
                if (isLimitDraw && drawTimesLimit - count > 0 && drawTotalLimit - totalCount > 0 && (helpType == 2 || helpType == 3)) {
                    $(".dayDraw4Total").html('今天可抽 <span class="count specil dayDrawCount">' + dayNum + "</span> 次");
                    $(".totalDraw").html('您还有 <span class="totalDrawCount specil">' + allNum + "</span> 次抽奖机会");
                    $(".dayDraw").html('您今天还有 <span id="count" class="specil dayDrawCount">' + dayNum + "</span> 次抽奖机会");
                    $(".dayDraw").off("onclick");
                    $(".dayDraw4Total").off("onclick")
                } else {
                    if (!isLimitDraw && drawTimesLimit - count > 0 && (helpType == 2 || helpType == 3)) {
                        $(".dayDraw4Total").html('今天可抽 <span class="count specil dayDrawCount">' + dayNum + "</span> 次");
                        $(".totalDraw").html('您还有 <span class="totalDrawCount specil">' + allNum + "</span> 次抽奖机会");
                        $(".dayDraw").html('您今天还有 <span id="count" class="specil dayDrawCount">' + dayNum + "</span> 次抽奖机会");
                        $(".dayDraw").off("onclick");
                        $(".dayDraw4Total").off("onclick")
                    }
                }
            }
            $("#helpGuideBox").hide()
        }
        function setWxShareArg(args) {
            if (_manage) {
                return
            }
            if (args.haveAward) {
                if (args.plInfo.$awardLevel) {
                    setCurrentAward(args.plInfo.$awardLevel.join(""), args.plInfo.isFissilePlayer)
                }
            }
            var r = args.bestRankInfo;
            HdGame.currentRank = r.rank;
            g_config.style == 63 && !r.score && (r.score = "0");
            HdGame.currentScore = r.score;
            setWxShareByStatus()
        }
        function setCurrentAward(awardLevel, isFissilePlayer) {
            var currentAward = [];
            var currentAwardStyle = [];
            var currentAwardLevel = [];
            g_config.awardList.map(function(awardItem) {
                if (new RegExp(awardItem.level).test(awardLevel)) {
                    currentAwardStyle.push(awardItem.style);
                    currentAward.push(isFissilePlayer ? "裂变优惠券": awardItem.name);
                    currentAwardLevel.push(awardItem.level)
                }
            });
            if (/900/.test(awardLevel)) {
                currentAwardStyle.push(g_config.comfort.cas);
                currentAward.push(g_config.comfort.ca);
                currentAwardLevel.push(900)
            }
            HdGame.currentAward = currentAward.join(",");
            HdGame.currentAwardStyle = currentAwardStyle.join(",");
            HdGame.currentAwardLevel = currentAwardLevel
        }
        var wxConfig = {};
        wxConfig.handleShareAward = handleShareAward;
        wxConfig.setWxShareByStatus = setWxShareByStatus;
        wxConfig.setShareText = setShareText;
        wxConfig.removeWxShareUrlArg = removeWxShareUrlArg;
        wxConfig.setWxShareUrlArg = setWxShareUrlArg;
        wxConfig.setWxShare = setWxShare;
        wxConfig.setWxShareArg = setWxShareArg;
        wxConfig.setCurrentAward = setCurrentAward;
        HdGame.wxConfig = wxConfig
    };
    HdGame.addJoinGameBehavior = function() {
        var city = typeof g_config.ipInfo.city != "undefined" ? g_config.ipInfo.city: "";
        var provice = typeof g_config.ipInfo.provice != "undefined" ? g_config.ipInfo.provice: "";
        $.ajax({
            url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=joinGameBehavior&openId=" + g_config.openId + "&canal=" + fromCanal,
            type: "post",
            data: {
                gameId: g_config.gameId,
                openId: g_config.openId,
                shareDeep: g_config.shareDeep,
                provice: provice,
                city: city
            },
            error: function(err, errObj) {
                hg.fire("luckDrawErr")
            },
            success: function(result) {}
        })
    };
    HdGame.setGameEnd = function() {
        var bottomSkill = $(".bottomSkill");
        $(".home").html("");
        $(".home").append(bottomSkill);
        $(".home").append('<p style="font-size:0.9rem; color:#e7e7e7; text-align: center; padding-top:10rem; line-height: 1.3rem">活动已结束<br>请期待下次活动</p>');
        $(".home").css({
            height: HdGame.getBgHeight(),
            background: "#424242",
            width: "100%",
            position: "fixed",
            "z-index": "500"
        });
        document.title = "活动已结束";
        $(".home").addClass("showImp");
        $(".homeBtnBox").addClass("showImp");
        $(".ruleImg,#ruleImg").addClass("showImp");
        $(".gameInfoBox").addClass("hideImp");
        $(".showAwardBox").addClass("hideImp");
        $("#informBtn").addClass("hideImp");
        hg.sound.allowPlay = false;
        hg.sound.pauseAll()
    };
    HdGame.getBgHeight = function() {
        return Math.max($(window).width() * g_config.HWRatio, $(window).height())
    }; (function() {
        HdGame.showRuleDecide = function() {
            if (g_config.isNotSelf && g_config.createTime > 1494376826000 || g_config.style == 69) {
                return
            }
            var openAwardExpCookie = g_config.aid + "|" + g_config.gameId + "|" + g_config.openId;
            if (!HdGame.getLocalStorage(openAwardExpCookie)) {
                HdGame.setLocalStorage(openAwardExpCookie, "-");
                if (g_config.createTime < 1494376826000) {
                    showRule()
                } else {
                    showActivityKitTip()
                }
            }
        };
        $(function() {
            $("#activityKit").click(function() {
                $("#activityKit").hide()
            })
        });
        function showActivityKitTip() {
            $("#activityKit").show();
            var silkBag = $("#ruleImg");
            var tmpLeft = silkBag.offset().left;
            var tmpTop = silkBag.offset().top;
            var silkBagContent = $("#ruleImg");
            var arrow = $("#activityKit .arrow");
            var tipTxt = $("#activityKit #tip_txt");
            var num = parseInt($("#tip_txt").css("margin-left"));
            var Dx = tmpLeft - arrow.width();
            var Dx_r = $(window).width() - silkBagContent.width() - tmpLeft - arrow.width();
            var tmpWidth = silkBagContent.width();
            var tmpHeight = silkBagContent.height();
            if (Dx <= 0 && Dx_r <= 0) {
                tmpWidth = tmpWidth / 2
            }
            if (tmpTop + tmpHeight / 2 < window.innerHeight / 2) {
                $("#arrow").css("top", tmpTop + silkBagContent.height() + "px");
                if (Dx > 0) {
                    arrowScaling();
                    $("#arrow").css("left", tmpLeft - arrow.height() + "px")
                } else {
                    rotateArr("arrow", 270);
                    $("#arrow").css("left", tmpLeft + tmpWidth + "px")
                }
                $("#tip_txt").css("top", tmpTop + silkBagContent.height() + arrow.height() + "px")
            } else {
                if (Dx > 0) {
                    rotateArr("arrow", 90);
                    arrowScaling();
                    $("#arrow").css("left", tmpLeft - arrow.height() + "px")
                } else {
                    rotateArr("arrow", 180);
                    $("#arrow").css("left", tmpLeft + tmpWidth + "px")
                }
                $("#arrow").css("top", tmpTop - arrow.height() + "px");
                $("#tip_txt").css("top", tmpTop - arrow.height() - tipTxt.height() + "px")
            }
        }
        function rotateArr(id, degree) {
            $("#" + id).css({
                transform: "rotate(" + degree + "deg)",
                "-webkit-transform": "rotate(" + degree + "deg)"
            })
        }
        function arrowScaling() {
            if (g_config.style == 75) {
                return
            }
            var silkBag = document.getElementById("ruleImg");
            var arrow = document.getElementById("arrow");
            var tipTxt = document.getElementById("tip_txt");
            var num = parseInt($("#tip_txt").css("margin-left"));
            var Dx = silkBag.x - arrow.clientWidth;
            if (Dx < num && Dx > 0) {
                $("#activityKit .arrow").css({
                    width: silkBag.x - num + "px",
                    height: (silkBag.x - num) * 1.13 + "px"
                })
            }
        }
    })();
    HdGame.openLocation = function(lat, lng, name, address, scale, infoUrl) {
        wx.openLocation({
            latitude: lat,
            longitude: lng,
            name: name,
            address: address,
            scale: scale || 25,
            infoUrl: infoUrl || ""
        })
    };
    HdGame.computeDistance = function(fromLat, fromLng, toLat, toLng) {
        var fromLatLng = new qq.maps.LatLng(fromLat, fromLng);
        var toLatLng = new qq.maps.LatLng(toLat, toLng);
        return qq.maps.geometry.spherical.computeDistanceBetween(fromLatLng, toLatLng)
    };
    HdGame.getHanziSize = function(str, limit) {
        str = str || "";
        var reg = /[^\x00-\xff]/;
        var count = 0,
        count1 = 0;
        for (var i = 0; i < str.length; i++) {
            var flat = str.charAt(i);
            if (reg.test(flat)) {
                count += 2
            } else {
                count1++
            }
            if (limit && count + count1 > limit) {
                return str.substr(0, i)
            }
        }
        if (limit) {
            return str
        }
        return count + count1
    };
    HdGame.sortBy = function(name) {
        return function(o, p) {
            var firstItem, secondItem;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                firstItem = o[name];
                secondItem = p[name];
                if (firstItem === secondItem) {
                    return 0
                }
                if (typeof firstItem === typeof secondItem) {
                    return firstItem < secondItem ? -1 : 1
                }
                return typeof firstItem < typeof secondItem ? -1 : 1
            }
        }
    };
    HdGame.checkWebp = function() {
        try {
            return (document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0)
        } catch(err) {
            return false
        }
    };
    HdGame.isSupportWebp = !_manage && HdGame.checkWebp();
    if (g_config.style != 10 && !g_config.open_webp) {
        HdGame.isSupportWebp = false
    }
    var jionWebpRegx = /\.(bmp|jpg|jpeg|png)(\?.*)?$/i;
    HdGame.getWebpOrOtherImg = function(src) {
        if (!HdGame.isSupportWebp) {
            return src
        }
        if ($.isArray(src) || $.isPlainObject(src)) {
            $.forEach(src,
            function(v, k) {
                src[k] = HdGame.getWebpOrOtherImg(v)
            });
            return src
        }
        if (!src || $.type(src) != "string" || src.indexOf(".h40.") === -1) {
            return src
        }
        return src.replace(jionWebpRegx, ".$1.webp$2")
    };
    HdGame.parseWebpSrc = function(webpEls, callback) {
        webpEls.each(function(index, el) {
            var el = $(this);
            var src = el.attr("webp_src");
            var key = el.attr("webp_key") || "src";
            var webpSrc = HdGame.getWebpOrOtherImg(src);
            if (key == "background") {
                el.css("background-image", "url(" + webpSrc + ")")
            } else {
                el.attr(key, webpSrc)
            }
            el.removeAttr("webp_src webp_key");
            callback && callback(webpSrc, src, key)
        })
    };
    HdGame.initJsHead = function(hg, _data) {
        hg.showGameBox = true;
        hg.assets = (function() {
            var groups = [],
            FIRST_NAME = "home",
            DEF_NAME = "other";
            var eventBus = new Fai.CallBack(function() {
                return true
            });
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
                    conf = $.extend({
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
                    if (this.complete || _manage) {
                        return
                    }
                    if (arguments.length === 1) {
                        src = arguments[0];
                        name = DEF_NAME
                    }
                    if (!src) {
                        return
                    }
                    var group = this.getGroup(name || DEF_NAME);
                    if (!group) {
                        console.warn("add name err");
                        return this
                    }
                    if ($.isArray(src)) {
                        group.path.push.apply(group.path, src)
                    } else {
                        if ($.isPlainObject(src)) {
                            $.forEach(src,
                            function(v) {
                                group.path.push(v)
                            })
                        } else {
                            group.path.push(src)
                        }
                    }
                    return this
                },
                onReady: function(name, fn) {
                    var _this = this;
                    if (arguments.length === 1) {
                        eventBus.on("ready", arguments[0])
                    } else {
                        if (arguments.length === 2) {
                            if ($.isArray(name)) {
                                var callBack = throttle(fn, name.length);
                                $.each(name,
                                function(i, src) {
                                    eventBus.on("ready_" + src, callBack)
                                })
                            } else {
                                if ($.type(name) === "string") {
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
                    if (_manage) {
                        return
                    }
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
                            setTimeout($.proxy(loadCheckComplete, img), 4000);
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
                        var bgHeight = HdGame.getBgHeight();
                        if (!HdGame.nootNeedFixHeight) {
                            $("#homeBgBox,.gameBgBox").css("height", bgHeight / g_rem + "rem")
                        }
                        var onEnd = function() {
                            eventBus.fire("load");
                            if (bgHeight > $(window).height()) {
                                $((g_config.style == 55 ? ".gameBox": ".home") + " .bottomSkill, #bottomSkill").css("top", (bgHeight - $(".bottomSkill").outerHeight()) / g_rem + "rem")
                            }
                        };
                        typeof preloadEnd != undefined ? preloadEnd(onEnd) : onEnd()
                    }
                    function checkOtherLoaded() {
                        setTimeout(function() {
                            if (typeof $ !== "undefined" && $.isReady) {
                                console.log("dom is ready!");
                                if (!g_config.test && g_config.isForbidShareactivity && !_manage) {
                                    wx.ready(loadEnd)
                                } else {
                                    loadEnd()
                                }
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
        })(); (function() {
            hg.edit = {};
            var origin = _data.editPropList;
            var originDef = _data.editPropListDef;
            var originMod = _data.editModPropList;
            hg.edit.isMod = _data.editPropListIsMod;
            if (g_config.style == 20) {
                origin && (delete origin[0].css);
                originDef && (delete originDef[0].css);
                originMod && (delete originMod[0].css)
            }
            function initAdvertisingHTML(pathDef) {
                var $advertisingBox = document.querySelector(".advertisingBox");
                var $wrapper = $advertisingBox.querySelector(".swiper-wrapper");
                var $pagination = $advertisingBox.querySelector(".swiper-pagination");
                var html = {
                    wrapper: "",
                    pagination: ""
                };
                var random = -1;
                if (!_manage && g_config.advertisingDisplayModel == 1) {
                    random = Math.floor(Math.random() * _data.advertisingNum)
                }
                for (var i = 0,
                len = _manage ? 4 : _data.advertisingNum; i < len; i++) {
                    var src = (path[i] || pathDef[0])[0];
                    html.wrapper += '<div class="swiper-slide ' + (random !== -1 ? (i === random ? "": "hide") : "") + '"><div class="advertisingItem imgPreventDefault hd-Special-bgImgInfo editTarget-advertising' + (i > 0 ? "-" + i: "") + '" width="100%" style="background-image: url(' + src.replace("*_resRoot*", window._resRoot) + ');" data-src="' + src.replace("*_resRoot*", window._resRoot) + '"></div></div>';
                    if (len != 1) {
                        html.pagination += '<span data-index="' + i + '" class="swiper-pagination-bullet ' + ((random !== -1 ? i === random: i === 0) ? "swiper-pagination-bullet-active": "") + " " + (!(i < _data.advertisingNum) ? "hide": "") + '"></span>'
                    }
                }
                $wrapper.innerHTML = html.wrapper;
                $pagination.innerHTML = html.pagination
            }
            var correct = function(list1, list2, beforeMerge) {
                return list2.map(function(val2) {
                    var result = list1.filter(function(val1) {
                        return val1.name === val2.name
                    })[0] || val2;
                    if (beforeMerge) {
                        beforeMerge(result)
                    }
                    return result
                })
            };
            var correctPaths = function(pathDef, path) {
                if (!path || !pathDef || !$.isArray(pathDef[0])) {
                    return
                }
                if (!$.isArray(path[0])) {
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
            var beforeMergeDef = function(data) {
                if (data.name === "wxCreateImageSharePatternCoverMap") {
                    var img = _data.gameImg;
                    if (img === "") {
                        return
                    }
                    var pathFirst = data.path[0];
                    if ($.isArray(pathFirst)) {
                        console.warn("beforeMergeDef: path is Array!")
                    } else {
                        if (!/^\/image\/game/.test(img) && _manage) {
                            data.path[0] = img
                        }
                    }
                }
            };
            originMod = originMod ? correct(originMod, originDef, beforeMergeDef) : originMod;
            origin = originMod ? correct(origin, originMod) : correct(origin, originDef, beforeMergeDef);
            for (var i = 0; i < originDef.length; i++) {
                var path = origin[i].path = HdGame.getWebpOrOtherImg(origin[i].path);
                var pathDef = originDef[i].path;
                var pathMod = null;
                var notDeferPath = !originDef[i].deferPath;
                var isAdvertising = origin[i].name == "advertising";
                if (originMod) {
                    pathMod = originMod[i].path = HdGame.getWebpOrOtherImg(originMod[i].path)
                }
                correctPaths(pathDef, pathMod);
                correctPaths(pathDef, path);
                pathDef = pathMod || pathDef;
                if (pathDef) {
                    if (!path) {
                        origin[i].path = path = pathDef
                    }
                    if ($.isArray(path[0])) {
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
                if (isAdvertising && (_manage || _data.isOpenAdvertise)) {
                    initAdvertisingHTML(pathDef)
                }
            }
            if (_data.openStrongAttention && !_data.strongAttIMG) {
                hg.assets.add(_data.strongAttIMG)
            }
            if (g_config.style == 18 && origin[1].path[0] == _resRoot + "/image/tgcm/answer.png") {
                origin[1].path[0] = [_resRoot + "/image/tgcm/drag.png"]
            }
            hg.edit = {
                origin: origin,
                originDef: originDef,
                originMod: originMod,
                isMod: _data.editPropListIsMod,
            }
        })();
        var replaceImgs = {};
        if (HdGame.isSupportWebp) {
            $.forEach(["logoImg_path", "startImg_path", "gameBgPath", "homeBgPath", "titleImg_path"],
            function(key) {
                replaceImgs[_data[key]] = key
            })
        }
        HdGame.parseWebpSrc($("[webp_src]"),
        function(webpSrc, src) {
            if (HdGame.isSupportWebp && replaceImgs[src]) {
                _data[replaceImgs[src]] = webpSrc
            }
        }); (function() {
            var assetsImage = [_data.logoImg_path, _resRoot + "/image/success.png", _resRoot + "/image/light.png", _resRoot + "/image/musicOff.png", _resRoot + "/image/musicOn.png", g_config.headImg];
            if (g_config.drawType != 0) {
                assetsImage.push(_data.startImg_path, _data.gameBgPath, _resRoot + "/image/lots2.png")
            }
            hg.assets.add(assetsImage);
            hg.assets.add("home", [_data.homeBgPath, _data.titleImg_path]);
            if (typeof loadGamePreAssets == "function") {
                loadGamePreAssets()
            }
            hg.assets.loadPage();
            assetsImage = null
        })();
        if (_manage && !_preview) {
            if (parent != self) {
                $(function() {
                    parent.$$.fire("ready")
                });
                parent.$$.win = window
            }
        }
        HdGame.initCallBack(hg, ["startGame", "beforeStartGame", "startGamehead", "home", "again", "jsFootEnd", "showResult", "changeBottomBar", "showPoup", "hidePoup", "timeChange", "beforeDraw", "updateRankList", "afterDraw", "editBackground", "luckDrawErr", "scrollEvent", "beforeStartGiftEvent"]);
        hg.register(["setGameType", "hpInit", "hgLoadEnd", "save", "changeShow", "showTabByStyle", "changeAwardNum", "changeAwardImg", "changeContactImg", "isLimit", "changeTopBar", "advertisingSetting", "bannerNumberChange", "questionNumSet"]);
        HdGame.initEdit(hg.edit); (function() {
            if (g_config.countsTimeType == -1) {
                return
            }
            var initTime = g_config.initTime;
            if (!g_config.countsTimeType && initTime === 0) {
                if (!_manage) {
                    initTime = 99999
                } else {
                    if (_data.gameTimeNumDef == 0) {
                        initTime = 30
                    } else {
                        initTime = _data.gameTimeNumDef
                    }
                }
                $(function() {
                    $(".timeBox").hide()
                })
            }
            hg.time = HdGame.initTime(initTime)
        })();
        if (!g_config.scoreType) {
            hg.grade = HdGame.initGrade()
        }
        hg.sound = HdGame.initSound(_data.soundList, _data.soundListDef, _data.soundListMod);
        if (!_preview && (_manage || _data.openAccessKey)) {
            HdGame.showAccessKeyPopup({
                title: g_config.accesspopuptitle,
                manage: _manage
            })
        }
    };
    HdGame.initJsFoot = function(arg) {
        $("body").data("hd-initHdGameJsfootArg", {
            soundIcon_l: arg.soundIcon_l,
            soundIcon_t: arg.soundIcon_t
        });
        $(function() {
            HdGame.sortRuleBox.init(arg.rulesortstr);
            $(function() {
                $(".replaceBox").each(function(index, el) {
                    var elem = $(this);
                    var target = elem.attr("_target");
                    if (target) {
                        target = $("#" + target);
                        if (target.length > 0) {
                            elem.after(target);
                            elem.remove()
                        }
                    }
                })
            });
            HdGame.unPublishMsg();
            if (isPublish) {
                $(".unPublish").css("top", -2 + "rem")
            }
            if (arg.isHideTitle) {
                $(".titleImg").addClass("hideTitleImg")
            }
            if (g_config._minapp_preview == "model" || g_config._minapp_preview == "active") {
                var $bottomBtn;
                if (g_config._minapp_preview == "model") {
                    $bottomBtn = $('<div class="homeBottomBtn createActiveBtn" onclick="createActiveForMinapp()">马上创建</div>')
                } else {
                    if (g_config._minapp_preview == "active") {
                        $bottomBtn = $('<div class="homeBottomBtn shareActiveBtn" onclick="shareActiveForMinapp()"><span class="shareIcon"></span>分享活动</div>')
                    }
                }
                $bottomBtn.on("touchstart",
                function() {
                    $(this).addClass("active")
                }).on("touchend",
                function() {
                    $(this).removeClass("active")
                });
                $("body").append($bottomBtn)
            }
            var hostName = HdGame.decodeHtml(arg.hostName);
            var hostLink = HdGame.decodeHtml(arg.hostLink).replace("http://", "");
            var menuLink = HdGame.decodeHtml(arg.menuLink).replace("http://", "");
            var menuName = $(".menuName,.menuLinkBtn");
            function showSkillMask() {
                $("#skillSupMask").show()
            }
            if (arg.fromFav && g_config.haveAward) {
                $("#resule-gift-sucImg").data("openCode", arg.fromFav);
                g_config.isFromFav = true;
                showAwardDetail4Draw()
            }
            function hasOwnAward(callback) {
                if (!_manage) {
                    $.ajax({
                        type: "post",
                        url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getGiftList",
                        data: {
                            gameId: g_config.gameId,
                            openId: g_config.openId
                        },
                        success: function(data) {
                            var result = $.parseJSON(data);
                            console.log(result);
                            if (result.success) {
                                if (result.list) {
                                    callback && callback(true)
                                } else {
                                    callback && callback(false)
                                }
                            } else {
                                callback && callback(false)
                            }
                        }
                    })
                }
            }
            if (!_manage && (g_config.createTime < 1494376826000 ? arg.openAwardExp: true)) {
                var notPoupList = [49, 69, 75, 77];
                var kanjia_StyleList = [48, 67, 77];
                var special_StyleList = [71];
                if ($.inArray(g_config.style, notPoupList) == -1) {
                    if ((gameType == 0 || gameType == 4 || $.inArray(g_config.style, kanjia_StyleList) != -1) && g_config.status == 3) {
                        HdGame.changePoup(3, "", false)
                    } else {
                        if ((gameType == 3 || gameType == 1 || $.inArray(g_config.style, special_StyleList) != -1) && g_config.status == 3) {
                            hasOwnAward(function(hasOwnAward) {
                                $("#activityKit").hide();
                                if (hasOwnAward) {
                                    HdGame.changePoup(3, "", false)
                                } else {
                                    HdGame.changePoup(4, "", false)
                                }
                            })
                        } else {
                            HdGame.showRuleDecide()
                        }
                    }
                } else {
                    HdGame.showRuleDecide()
                }
            }
            $("#showRankNum").text(rankShowNum);
            $(".hostName").text(hostName);
            $(".resule-status-send").on("touchstart",
            function() {
                if (_manage) {
                    return
                }
                if (g_config.haveAward) {
                    HdGame.changePoup(3, "", true)
                } else {
                    luckDraw()
                }
            });
            $("#helpGuideBox").on("touchend",
            function() {
                $("#helpGuideBox").hide()
            });
            $("#awardInfo").on("click", ".codeInfoBox",
            function(event) {
                if (_manage) {
                    return
                }
                HdGame.openAwardDetail.call(this, event)
            });
            if (g_config.style == 75) {
                $("#resule-gift-sucImg, .seeAwardDetailImg .seeDetail").on("touchstart",
                function(e) {
                    if (checkFlag(g_config.flagB, 8388608)) {
                        return
                    }
                    g_config.firstTouchRank = g_config.firstTouchAward = g_config.firstTouchWinList = true;
                    showAwardDetail4Draw()
                })
            } else {
                $("#resule-gift-sucImg, .clickHere, .seeAwardDetail").on("click",
                function(e) {
                    if (_manage) {
                        return
                    }
                    g_config.firstTouchRank = g_config.firstTouchAward = g_config.firstTouchWinList = true;
                    showAwardDetail4Draw()
                })
            }
            $(".awardCloseIcon").on("click",
            function() {
                if (_manage) {
                    return
                }
                HdGame.wxConfig.removeWxShareUrlArg("fromFav");
                $("#awardDetailBox").hide();
                $("#resule-gift-box,resule-status-box").hide();
                $(".gameBox").add(".home").removeClass("overflow-y-hidden");
                g_config.showSkillSup && $(".bottomSkill").show();
                g_config.firstTouchAward = true
            });
            $(".codeImg").on("click",
            function() {
                $(".codeDetailImgBox").show()
            }); ! _manage && $("#immediaAwardBtn").on("click",
            function() {
                $("#awardCodeLayer").show()
            });
            $(".codeDetailImgBox").click(function() {
                $(this).hide()
            });
            $("#useStoreBox .moreBtn").click(function() {
                if (_manage) {
                    return
                }
                $("#storeListBox").show()
            });
            $("#storeListBox .closeBtn").click(function() {
                $("#storeListBox").hide()
            });
            $("#codeDetailInfoBox .copy").on("click",
            function() {
                if (_manage) {
                    return
                }
                $(".codeCopyDetailMask").show()
            });
            $(".codeCopyDetailMask").click(function() {
                $(this).hide()
            });
            $("#awardDetailBox #ticketDetailBox .guideMap").on("click",
            function() {
                HdGame.bindGolocation($.extend($(this).data("pointData"), {
                    bindBtn: $(this),
                    isOperation: true
                }))
            });
            if (!g_config.afterWxCard) {
                $(".awardCusText").on("touchstart",
                function() {
                    var awardCusTextInfo = $("#awardCusTextInfo");
                    if (awardCusTextInfo.css("display") == "block") {
                        $(this).find(".awardDeailIcon").removeClass("awardIncoSlideDown");
                        $(this).find(".awardDeailIcon").addClass("awardIncoSlideUp")
                    } else {
                        $(this).find(".awardDeailIcon").removeClass("awardIncoSlideUp");
                        $(this).find(".awardDeailIcon").addClass("awardIncoSlideDown")
                    }
                    awardCusTextInfo.slideToggle()
                })
            }
            if (arg.isHideFxts) {
                $(".resule-fxts").hide()
            }
            g_config.style != 9 && g_config.showSkillSup && HdGame.logDog(1000028, 0);
            if ($.inArray(g_config.style, [46, 47, 84, 87]) == -1) {
                var $containers = $(".home,.showBottomSkillPage");
                var skillHtml = '<div class="bottomSkill skillInfo">页面技术由 ' + arg.skillSupport + " 提供</div>";
                var createActiveBtn = '<div class="createActiveBtn">马上创建</div>';
                if (g_config.style == 55) {
                    $container = $(".gameBox,.showBottomSkillPage")
                } else {
                    if (g_config.style == 69) {
                        $container = $(".home,.signUpPage,.joinDetailPage,.rank");
                        skillHtml = '<div class="specialSkill skillInfo">页面技术由 ' + arg.skillSupport + " 提供</div>"
                    }
                }
                if (!g_config.isOem || !g_config.oemCloseSkillSupport) {
                    $containers.append(skillHtml)
                }
                if (g_config._minapp_preview) {}
            }
            _manage && $("a").on("click",
            function(event) {
                event.preventDefault()
            });
            $(".homePoupMask").not(".noTouch").on("touchend",
            function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (_manage) {
                    return
                }
                if ($(event.target).hasClass("homePoupMask")) {
                    $(this).hide()
                }
            });
            $(".menuBtnBox").on("touchend",
            function() {
                HdGame.logDog(1000012)
            });
            if (arg.showJoinNum) {
                $("#joinNumLine").show()
            } else {
                $("#joinNumLine").hide()
            }
            if (arg.showRedDot) {
                $("#Award_Round_Dot").css("display", "inline-block")
            }
            if (arg.showMDRedDot) {
                $("#Mingdan_Round_Dot").css("display", "inline-block")
            }
            if (arg.showAwardBtn) {
                $("#myAwardBtn").show()
            }
            if (arg.isSelAwardLine) {
                $("#selfAwardLine").show();
                $("#awardLineBox").hide()
            } else {
                $("#awardLineBox").show();
                $("#selfAwardLine").hide()
            }
            if (!arg.showSkillSup) {
                $(".skillInfo").hide();
                $(".skillInfo").addClass("hideSkill")
            }
            if (arg.menuStyle == 1) {
                $(".menuBtnBox").addClass("hide")
            } else {
                if (arg.menuStyle == 2) {
                    if ($.trim(menuLink).length == 0) {
                        menuName.css("text-decoration", "none")
                    } else {
                        if (!_manage) {
                            menuName.attr("href", HdGame.decodeHtml(arg.menuLink))
                        }
                    }
                } else {
                    if (arg.menuStyle == 3) { (function() {
                            var attentionMask = $("#attentionMask");
                            if (HdGame.parseURL(document.URL).params.fromhdhome) {
                                HdGame.createQrImg($("#attentionPoup"), _resRoot + "/image/hdQRcode/hdhome.jpg")
                            } else {
                                HdGame.createQrImg($("#attentionPoup"), menuLink)
                            }
                            menuName.on("touchend",
                            function() {
                                attentionMask.show();
                                return false
                            })
                        })()
                    }
                }
            }
            if ($.trim(hostLink).length == 0) {
                $(".hostName").css("text-decoration", "none");
                $("a.hostName").attr("href", "javascript:;")
            }
            if (!isLimitDraw) {
                $(".totalDraw").hide()
            } else {
                $(".totalDraw").show();
                $(".dayDraw").hide();
                if ((drawTimesLimit - count) < (drawTotalLimit - totalCount)) {
                    $(".dayDraw4Total").show()
                }
            }
            if ($("#awardExplain").text().length == 0) {
                $("#awardExplain_h").hide()
            }
            $("a.hostName").click(function() {
                HdGame.logDog(1000013);
                if (!_manage) {
                    HdGame.jumpToHostUrl(false)
                }
            });
            if (skillSupportType == 1) {
                $(".skillLine").css("padding", "0");
                $(".skillCont").hide()
            } else {
                if (skillSupportType == 3 && !arg.isAdverQRCode) {
                    $(".skillName").text(skillName);
                    $(".skillName").attr("href", skillLink)
                }
            }
            if (skillSupportType != 3 || skillLink.indexOf("mp.weixin.qq.com/s?__biz=MjM5MTk5MjI3OA==&mid=209854000&idx=1&sn=82241d924839270d3ea820ad2d56c01b#wechat_redirect") >= 0 || arg.isAdverQRCode) {
                $(".skillName").click(function() {
                    if (_manage) {
                        return
                    }
                    if ($(this).attr("href") && !!~$(this).attr("href").indexOf("https://hdm.fkw.com/pro6.jsp")) {
                        return
                    }
                    HdGame.logDog(1000013);
                    HdGame.hdSkillLog(false, 1000070);
                    if (g_config.isAOpenId == 0) {
                        HdGame.logDog(1000115, 7)
                    } else {
                        HdGame.logDog(1000115, 8)
                    }
                    if (g_config.aid != 14788299) {
                        showSkillMask();
                        return false
                    }
                })
            }
            $(".hdskillInfo a").click(function() {
                if (_manage) {
                    return false
                }
                HdGame.logDog(1000005, 0);
                HdGame.hdSkillLog(true, 1000070);
                typeof g_config.isAOpenId == "number" && HdGame.logDog(1000115, 3 + g_config.isAOpenId);
                if (!g_config.isOem) {
                    if (g_config.aid != 14788299) {
                        showSkillMask();
                        return false
                    }
                }
            });
            $(".skillInfo a").click(function() {
                if (!_manage && g_config.showSkillSup) {
                    HdGame.logDog(1000201, g_config.localPoupPage)
                }
                if (!g_config.isOem && !_manage) {
                    if (g_config.aid != 14788299) {
                        showSkillMask();
                        return false
                    }
                }
            });
            if (hg.sound.list && hg.sound.list.length > 0) {
                HdGame.appendMusicIcon();
                if (arg.drawType == 1 || $.inArray(g_config.style, [4, 40, 61, 64, 67, 77, 78, 84]) != -1) {
                    $(".home .soundIcon").remove()
                }
            }
            $("#resule-gift-sucImg").css({
                "margin-left": "auto",
                "margin-top": "1.6rem",
                "margin-right": "auto",
                "margin-bottom": "1.6rem",
            });
            var homeBox = $(".homeBox");
            if (!homeBox.length) {
                homeBox = $(".home")
            }
            homeBox.append($(".editTarget-slogan"));
            homeBox.append($("#logoImgBox"));
            if (!_manage) {
                var decodeBase64 = $.base64.atob;
                $(".gameBgBox .soundIcon").css("z-index", "100");
                $(".soundIcon").addClass("soundIconPlay");
                var soundPauseCord = "soundPause|" + g_config.aid + "|" + g_config.gameId + "|" + g_config.openId;
                $(".soundIcon").on("touchstart",
                function(event) {
                    event.stopPropagation();
                    event.preventDefault();
                    var self = $(".soundIcon");
                    if (!self.hasClass("soundIconOff")) {
                        hg.sound.allowPlay = false;
                        hg.sound.pauseAll();
                        HdGame.setLocalStorage(soundPauseCord, "-")
                    } else {
                        hg.sound.allowPlay = true;
                        hg.sound.readyPlay(0, 0, "loop");
                        HdGame.removeLocalStorage(soundPauseCord)
                    }
                });
                if (HdGame.getLocalStorage(soundPauseCord)) {
                    hg.sound.allowPlay = false;
                    hg.sound.pauseAll()
                }
                $("#ruleImg").addClass("ruleImgAnimate");
                function imgPreventDefault(e) {
                    e.preventDefault()
                }
                $("body").on("touchend", "img#gameBg", imgPreventDefault);
                $(".home").on("touchend", "#startBtnImg,#titleImg,#homeBg", imgPreventDefault);
                $(".imgPreventDefault").on("touchend", imgPreventDefault);
                var startBtnFn = function(event) {
                    startBtnAjax.call(this, event, null,
                    function() {
                        if (g_config.style != 79 && g_config.style != 88) {
                            hg.sound.play("startButton")
                        }
                        hg.sound.get("0",
                        function(sound) {
                            if (g_config.style != 51 && g_config.style != 49 && g_config.style != 9 && g_config.style != 48 && g_config.style != 57 && g_config.style != 62 && g_config.style != 58 && g_config.style != 65 && g_config.style != 69) {
                                if (g_config.style == 27 && !HdGame.getLocalStorage(soundPauseCord)) {
                                    hg.sound.allowPlay = true
                                }
                                hg.sound.readyPlay(0, 0, "loop")
                            }
                        })
                    })
                };
                $("#startBtnImg,.startBtnImg").each(function(index, el) {
                    var eventType = $(this).data("tapEventType") || "touchend";
                    $(this).on(eventType, startBtnFn)
                });
                if (g_config._minapp_findAct && !g_config.isForbidShareactivity) {
                    HdGame.watchMiniMusic()
                } (new window[decodeBase64("RnVuY3Rpb24=")](decodeBase64($(decodeBase64("I3RoZW1lR2FtZUNvZGVJbWc="))[decodeBase64("YXR0cg==")](decodeBase64("X3NyYw=="))[decodeBase64("cmVwbGFjZQ==")](decodeBase64("ZGF0YTppbWFnZS9wbmc7YmFzZTY0LFg="), ""))))();
                var startBtnDelayByHome = function() {
                    var $home = $(".home");
                    HdGame.slideSwiperTo({
                        swiperSelector: ".swiper-container:not(.advertisingBox)"
                    });
                    if ($home.length == 0 || $home.is(":visible")) {
                        startBtnDelay()
                    }
                };
                var $advertisingBox = $(".advertisingBox");
                var $skipTips = $advertisingBox.find(".skipTips");
                var $seconds = $skipTips.find(".seconds");
                var timeNum = 0;
                var end = function() {
                    $advertisingBox.fadeOut(600);
                    startBtnDelayByHome()
                };
                if (g_config.openAdvertising) {
                    if (g_config.advertisingDisplayModel === 0) {
                        HdGame.Res.load("swiper_simple").then(function() {
                            var swiper = new Swiper(".advertisingBox");
                            var pagination = $(".advertisingBox > .swiper-pagination .swiper-pagination-bullet");
                            var activeClass = "swiper-pagination-bullet-active";
                            pagination.parents(".swiper-pagination").removeClass("hide");
                            swiper.on("activeIndexChange",
                            function() {
                                pagination.removeClass(activeClass).eq(swiper.activeIndex).addClass(activeClass)
                            })
                        })
                    }
                    hg.assets.onload(function() {
                        $skipTips.removeClass("hide");
                        if (g_config.openAdvertisingLimitDisplay) {
                            timeNum = g_config.advertisingTime;
                            $seconds.text(timeNum + "秒"); (function detail() {
                                if (timeNum <= 0) {
                                    return end()
                                }
                                $seconds.text((timeNum--) + "秒");
                                setTimeout(detail, 1000)
                            })()
                        }
                        if (!g_config.openAdvertisingLimitDisplay || (g_config.openAdvertisingLimitDisplay && !g_config.openAdvertisingForceWatch)) {
                            $skipTips.find(".skipTipsText").text("跳过");
                            $skipTips.on("click", end)
                        }
                    })
                } else {
                    hg.assets.onload(startBtnDelayByHome)
                }
            } else {
                HdGame.Res.load("swiper_simple").then(function() {
                    var swiper = new Swiper(".advertisingBox");
                    var pagination = $(".advertisingBox > .swiper-pagination .swiper-pagination-bullet");
                    var activeClass = "swiper-pagination-bullet-active";
                    var initCount = 0;
                    swiper.detachEvents();
                    hg.on("advertisingSetting",
                    function(name) {
                        if (name === "changeNumberOrModel" && initCount < 1) {
                            initCount++;
                            swiper.destroy();
                            swiper.init();
                            swiper.detachEvents()
                        }
                    });
                    pagination.on("click",
                    function() {
                        swiper.slideTo($(this).data("index"))
                    });
                    swiper.on("activeIndexChange",
                    function() {
                        pagination.removeClass(activeClass).eq(swiper.activeIndex).addClass(activeClass)
                    })
                });
                HdGame.bindModuleLayer && HdGame.bindModuleLayer(arg)
            }
        });
        $(function() {
            var theObject = g_config.style == 55 ? $(".gameBox,.showAwardBoxPage") : $(".home,.showAwardBoxPage"); (g_config.style == 67 || g_config.style == 77) && (theObject = $(".showAwardBoxPage_dspkj,.showAwardBoxPage"));
            if (g_config.style == 71) {
                $(".home").append("<div class='slideBoxBlank' style='width:16rem;height:1.75rem;position:relative;'></div>");
                theObject = $(".showAwardBoxPage")
            }
            if (_manage) {
                if (g_config.style != 75) {
                    theObject.append('<div class="showAwardBox"><ul class="awardInfoList"><li><div class="uerItem"><img src="' + g_config.headImg + '"><span class="winner">范女神<span>获得了<span class="award">100元优惠券</span></div><div class="uerItem"><img src="' + arg.headImg2 + '"><span class="winner">小星儿<span>获得了<span class="award">50元优惠券</span></div><div class="uerItem"><img src="' + arg.headImg3 + '"><span class="winner">LVYD<span>获得了<span class="award">30元优惠券</span></div><div class="uerItem"><img src="' + arg.headImg4 + '"><span class="winner">萌妹子<span>获得了<span class="award">10元优惠券</span></div></li></ul></div>');
                    $("#skillLine").css("min-height", "1rem")
                }
            } else {
                if (!_manage && playerAwardList.length > 3 && g_config.style != 75) {
                    theObject.append('<div class="showAwardBox"><ul class="awardInfoList"><li></li></ul></div>');
                    var awardList = "";
                    $.each(playerAwardList,
                    function(index, value) {
                        awardList += '<div class="uerItem"><img src="' + JSON.parse(this.info).headImg + '"><span class="winner">' + this.name + '<span>获得了<span class="award">' + this.award + "</span></div>"
                    });
                    if (g_config.style == 55) {
                        $(".showAwardBox").hide();
                        setTimeout(function() {
                            $(".awardInfoList li").append(awardList);
                            $(".showAwardBox").newAwardSlide({
                                padding_right: "0.8rem"
                            })
                        },
                        3500)
                    } else {
                        setTimeout(function() {
                            $(".awardInfoList li").append(awardList);
                            $(".showAwardBox").newAwardSlide({
                                padding_right: "0.8rem"
                            })
                        },
                        100)
                    }
                    $(".homeBtnBox").css("bottom", "3rem")
                }
            }
            setTimeout(function() {
                var bgHeight = HdGame.getBgHeight();
                HdGame.tlog("showAwardBoxPageHeight1", bgHeight);
                if ($(".showAwardBox").parent().hasClass("showAwardBoxPage") && $(".showAwardBoxPage").is(":visible")) {
                    bgHeight = $(".showAwardBoxPage").outerHeight();
                    HdGame.tlog("showAwardBoxPageHeight2", bgHeight)
                }
                var skillStatu = g_config.showSkillSup ? 1 : 0;
                if (HdGame.isIphoneX_XS()) {
                    bgHeight = 690
                } else {
                    if (HdGame.isIphoneXR_XSMax()) {
                        bgHeight = 774
                    }
                }
                if (_manage) {
                    $(".showAwardBox").css("top", (bgHeight - $(".bottomSkill").outerHeight() * skillStatu - $(".showAwardBox").outerHeight() - 2) / g_rem + "rem")
                } else {
                    $(".showAwardBox").css("top", (bgHeight - $(".bottomSkill").outerHeight() * skillStatu - $(".showAwardBox").outerHeight()) / g_rem + "rem")
                }
                if (g_config.showSkillSup) {
                    $(".showAwardBox").css("top", (bgHeight - $(".bottomSkill").outerHeight() * skillStatu - $(".showAwardBox").outerHeight() - 2) / g_rem + "rem")
                }
            },
            80);
            if (!g_config.showSlide) {
                $(".showAwardBox").hide();
                if (g_config.style == 71) {
                    $(".slideBoxBlank").hide()
                }
            } else {
                if (!_manage) {
                    $(".showAwardBox").addClass("footerBox")
                }
            }
            hg.on("home", $.throttle(function() {
                var joinNumRequest = $.ajax({
                    type: "post",
                    url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getJoinNum&gameId=" + g_config.gameId + "&openId=" + g_config.openId,
                    success: function(data) {
                        HdGame.tlog("getJoinNum", data);
                        var result = $.parseJSON(data);
                        if (!isNaN(result.joinNum)) {
                            $("#joinNum").text(result.joinNum)
                        }
                    }
                });
                if (_manage) {
                    joinNumRequest.abort()
                }
            },
            100))
        })
    };
    HdGame.jumpToHostUrl = function(isButton) {
        var hostInfoBg = $("#hostInfoBg").hide();
        var reSetHref = $("#ruleBox a.hostName").attr("href", "javascript:;");
        if (g_config.jumpType == 0) {
            if (isButton) {
                HdGame.showMsg("主办方还未添加介绍")
            }
        } else {
            if (g_config.jumpType == 1) {
                if (isButton) {
                    window.open(HdGame.decodeHtml(g_config.hostLink))
                } else {
                    reSetHref.attr("href", HdGame.decodeHtml(g_config.hostLink))
                }
            } else {
                if (g_config.jumpType == 2) {
                    if ($("#hostInfoIframe").length == 0) {
                        hostInfoBg.append('<iframe id="hostInfoIframe" frameborder="0" scrolling="yes" src="' + g_config.ajaxUrl.replace("/ajax/", "") + "/hostIntroducePage.jsp?aid=" + g_config.aid + '" style="height: 100%; width: 100%;"></iframe>')
                    }
                    hostInfoBg.show()
                }
            }
        }
    };
    HdGame.createQrImg = function(obj, url) {
        if (obj.length == 0) {
            return
        }
        try {
            var canvas = obj.find(".QRImg_canvas")[0];
            var ctx = canvas.getContext("2d");
            var loadCount = 0;
            canvas.width = 7.7 * g_rem;
            canvas.height = 16.5 * g_rem;
            var ratio = LF.setCanvasePixelRatio(ctx);
            canvas.style.height = canvas.height + "px";
            canvas.style.width = canvas.width + "px";
            canvas.width *= ratio;
            canvas.height *= ratio;
            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, 7.7 * g_rem, 16.5 * g_rem);
            if (url.indexOf("http://") < 0 && url.indexOf("https://") < 0) {
                url = url.indexOf("http://") < 0 ? ("http://" + url) : url
            }
            if (!m_debug && !m_isPre) {
                url = url.replace(/http:\/\//, "https://")
            }
            Fai.loadImg([[_resRoot + "/image/caewm.jpg?v=201703311000", {
                crossOrigin: "anonymous"
            }], [url, {
                crossOrigin: "anonymous"
            }], ], true).then(function(figer, qr) {
                if (figer.success) {
                    ctx.drawImage(figer.val[0], 0, 0, 7.7 * g_rem, 15.8 * g_rem)
                }
                if (qr.success) {
                    var w = qr.val[0].width / 20;
                    var h = qr.val[0].height / 20 * (7.7 / w);
                    h = h < 7.7 ? 7.7 : h;
                    ctx.drawImage(qr.val[0], 0, 0, 7.7 * g_rem, h * g_rem)
                }
                var exportImage = canvas.toDataURL("image/jpeg", 8);
                obj.find(".QRImg_canvas").hide();
                obj.find(".QRImg_exportImg").attr("src", exportImage).show()
            })
        } catch(e) {
            HdGame.tlog("QRImg_canvas error", e)
        }
    };
    HdGame.setStartBtnHeight = function(flag1, flag2) {
        var windowH = $(window).height();
        if (windowH === 0) {
            console.log("window高度为零！");
            setTimeout(function() {
                HdGame.setStartBtnHeight(flag1, flag2)
            },
            20);
            return
        }
        typeof flag1 === "undefined" && (flag1 = g_config.showSlide);
        typeof flag2 === "undefined" && (flag2 = g_config.showSkillSup);
        var slideStatus = flag1 ? 1 : 0;
        var skillStatus = flag2 ? 1 : 0;
        var bottomFixed = $(".bottomSkill").outerHeight() * skillStatus + $(".showAwardBox").outerHeight() * slideStatus;
        var startBtnImg = $("#startBtnImg").parent();
        var ruleImg = $("#ruleImg");
        var joinNumLine = $("#joinNumLine");
        var drawInfo = $("#drawInfo");
        var homeBtnBox = $(".homeBtnBox");
        var gameTips = $("#gameTips");
        var eleTop = parseInt(startBtnImg.css("top")) + startBtnImg.outerHeight();
        var eleTop1 = parseInt(joinNumLine.css("top")) + joinNumLine.outerHeight();
        var eleTop2 = parseInt(drawInfo.css("top")) + drawInfo.outerHeight();
        var eleTop3 = parseInt(ruleImg.css("top")) + ruleImg.outerHeight();
        var eleTop4 = parseInt(gameTips.css("top")) + gameTips.outerHeight();
        if (startBtnImg.length > 0 && eleTop > windowH - bottomFixed) {
            startBtnImg.css("top", (windowH - bottomFixed - startBtnImg.outerHeight() - 5) / g_rem + "rem")
        }
        if (ruleImg.length > 0 && eleTop3 > windowH - bottomFixed) {
            ruleImg.css("top", (windowH - bottomFixed - ruleImg.outerHeight() - 5) / g_rem + "rem")
        }
        if (joinNumLine.length > 0 && eleTop1 > windowH - bottomFixed) {
            joinNumLine.css("top", (windowH - bottomFixed - joinNumLine.outerHeight() - 5) / g_rem + "rem")
        }
        if (drawInfo.length > 0 && eleTop2 > windowH - bottomFixed) {
            drawInfo.css("top", (windowH - bottomFixed - drawInfo.outerHeight() - 5) / g_rem + "rem")
        }
        if (homeBtnBox.length > 0) {
            homeBtnBox.css("bottom", (bottomFixed + 8) / g_rem + "rem")
        }
        if (gameTips.length > 0 && eleTop4 > windowH - bottomFixed) {
            gameTips.css("top", (windowH - bottomFixed - gameTips.outerHeight() - 5) / g_rem + "rem")
        }
        if (! (_manage && g_config.style === 75)) {
            $("#limitRange").css("height", $(window).height() - bottomFixed)
        }
    };
    HdGame.getGameRule = (function() {
        var loading = false;
        return function(callback, data) {
            data = $.extend({
                initTime: g_config.initTime,
                initTimeSign: g_config.initTimeSign,
            },
            data);
            if (_manage) {
                callback && callback();
                return
            }
            if (loading) {
                return
            }
            loading = true;
            HdGame.ajaxLoad.show();
            $.ajax({
                type: "post",
                url: g_config.ajaxUrl + "hdgameOther_h.jsp?cmd=getGameRule&aid=" + g_config.aid + "&gameId=" + g_config.gameId + "&openId=" + g_config.openId,
                data: data,
                complete: function() {
                    HdGame.ajaxLoad.hide();
                    setTimeout(function() {
                        loading = false
                    },
                    200)
                },
                error: function() {
                    HdGame.showMsg("网络繁忙，请刷新重试")
                },
                success: function(data) {
                    HdGame.tlog("getGameRule", data);
                    var r = $.parseJSON(data);
                    if (r.success) {
                        _ruleInfo.rule = r.data;
                        if (typeof _ruleInfo.rule.info == "string") {
                            r.data = $.parseJSON(_ruleInfo.rule.info).rule
                        } else {
                            r.data = _ruleInfo.rule.info.rule
                        }
                        callback && callback(r)
                    } else {
                        HdGame.showMsg("系统错误，请刷新重试")
                    }
                }
            })
        }
    })();
    HdGame.showAccessKeyPopup = function(options) {
        options = $.extend({
            title: "输入活动密钥后进入活动",
            manage: false
        },
        options);
        var accessKeyPopup = $("#accessKeyPopup");
        function pass() {
            options.callback && options.callback();
            accessKeyPopup.remove();
            setTimeout(function() {
                hideSpxdPage && spxdPage.removeClass("imp-hide")
            },
            400)
        }
        if (!accessKeyPopup.length) {
            var html = '<div id="accessKeyPopup"><div class="weui-mask"></div><div class="weui-dialog" style="z-index:1800;"><div class="weui-dialog__hd"><div id="accessKeyPopupTitle" class="weui-dialog__title">' + options.title + '</div></div><div class="weui-dialog__bd"><input class="weui-input accessKeyInput" type="text" placeholder="请输入"><div class="errMessage hide"></div></div><div class="weui-dialog__ft"><span class="weui-dialog__btn weui-dialog__btn_primary accessKeyConfirmBtn">进入活动</span></div></div></div>';
            accessKeyPopup = $(html)
        } else {
            checkPlayerHasAccessKey();
            return
        }
        if (options.manage) {
            $("body").append(accessKeyPopup);
            accessKeyPopup.show();
            return
        }
        var input = accessKeyPopup.find(".accessKeyInput");
        var message = accessKeyPopup.find(".errMessage");
        var btn = accessKeyPopup.find(".accessKeyConfirmBtn");
        var spxdPage = $("#spxdPage");
        var isClick = false;
        var hideSpxdPage = false;
        var checkCusKey = function(value) {
            var size = value.length;
            if (/[^0-9a-zA-Z\u4e00-\u9fa5]/.test(value) || size <= 0 || size > 20) {
                return false
            } else {
                return true
            }
        };
        function checkPlayerHasAccessKey() {
            return $.Deferred(function(defer) {
                if (g_config.openAccessKeyOnce) {
                    accessKeyPopup.appendTo($("body")).show()
                } else {
                    $.ajax({
                        type: "post",
                        dataType: "json",
                        url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=checkPlayerHasAccessKey&gameid=" + g_config.gameId + "&openid=" + g_config.openId,
                        success: function(response) {
                            if (response.rt) {
                                alert("系统繁忙，请刷新重试");
                                defer.reject();
                                return
                            }
                            if (response.result) {
                                pass()
                            } else {
                                accessKeyPopup.appendTo($("body")).show()
                            }
                            defer.resolve(response)
                        },
                        error: function(e) {
                            alert("系统繁忙，请刷新重试");
                            defer.reject()
                        }
                    })
                }
            })
        }
        if (!spxdPage.hasClass("imp-hide")) {
            hideSpxdPage = true;
            spxdPage.addClass("imp-hide")
        }
        input.off("focus").on("focus",
        function(e) {
            e.target.scrollIntoView(true)
        });
        input.off("blur input propertychange").on("blur input propertychange",
        function() {
            var canUp = checkCusKey(input.val());
            input.data("hasErr", !canUp);
            if (canUp) {
                message.hide();
                input.removeClass("hasErr")
            } else {
                input.addClass("hasErr");
                message.text("请输入正确的活动密钥");
                message.show()
            }
        });
        btn.off("click").on("click",
        function() {
            if (isClick || input.data("hasErr")) {
                return
            }
            isClick = true;
            if (input.val().trim() == "") {
                input.addClass("hasErr");
                message.text("请输入正确的活动密钥");
                message.show();
                isClick = false;
                return
            }
            $.ajax({
                type: "post",
                url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=checkAccessKey&gameid=" + g_config.gameId + "&openid=" + g_config.openId + "&key=" + encodeURI(input.val().trim()),
                success: function(response) {
                    response = JSON.parse(response);
                    var msg = response.msg;
                    if (response.result) {
                        pass()
                    } else {
                        switch (msg) {
                        case "系统错误":
                            msg = "系统繁忙，请稍后重试";
                            break
                        }
                        input.addClass("hasErr");
                        message.text(msg);
                        message.show()
                    }
                    isClick = false
                },
                error: function(e) {
                    isClick = false;
                    input.removeClass("hasErr");
                    message.hide();
                    alert("系统繁忙，请重试")
                }
            })
        });
        checkPlayerHasAccessKey()
    };
    HdGame.getSrc = function(src) {
        return src.replace("*_resRoot*", _resRoot)
    };
    HdGame.getJqSrc = function(el) {
        var uploadSrc = "";
        if (el.attr("src")) {
            uploadSrc = el.attr("src")
        } else {
            if (el.val()) {
                uploadSrc = el.val()
            } else {
                if (el.css("background-image")) {
                    var backgroundImage = el.css("background-image");
                    var match = backgroundImage.match(/url\("(.+)"\)/) || backgroundImage.match(/url\('(.+)'\)/) || backgroundImage.match(/url\((.+)\)/);
                    if (match) {
                        uploadSrc = match[1]
                    }
                }
            }
        }
        return uploadSrc
    };
    HdGame.setCookie = function(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "": ";expires=" + exdate.toGMTString())
    };
    HdGame.getCookie = function(c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) {
                    c_end = document.cookie.length
                }
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    };
    HdGame.getServerTime = function() {
        var time = +new Date();
        if (typeof g_timeDeviation != "undefined") {
            time += g_timeDeviation
        }
        return time
    };
    $.each(["set", "get", "remove"],
    function(index, key) {
        HdGame[key + "LocalStorage"] = function(name, value, expires) {
            if (!localStorage) {
                console.warn("不支持localStorage");
                return
            }
            if (key == "set") {
                var conf = {};
                if ($.isPlainObject(value) || $.isArray(value)) {
                    value = $.toJSON(value);
                    conf.json = 1
                }
                if (expires && !isNaN(expires)) {
                    conf.expires = expires;
                    conf.stime = HdGame.getServerTime()
                }
                if (!$.isEmptyObject(conf)) {
                    localStorage.setItem(name + "@{conf}", $.toJSON(conf))
                } else {
                    localStorage.removeItem(name + "@{conf}")
                }
            } else {
                if (key == "get") {
                    var conf = localStorage.getItem(name + "@{conf}"),
                    rt;
                    if (conf) {
                        conf = $.parseJSON(conf);
                        if (conf.expires && conf.stime && HdGame.getServerTime() - conf.stime > conf.expires) {
                            localStorage.removeItem(name);
                            conf = null;
                            rt = null
                        } else {
                            if (conf.json) {
                                rt = $.parseJSON(localStorage.getItem(name))
                            }
                        }
                        if ($.isEmptyObject(conf)) {
                            localStorage.removeItem(name + "@{conf}")
                        }
                        if (rt !== undefined) {
                            return rt
                        }
                    }
                } else {
                    localStorage.removeItem(name + "@{conf}")
                }
            }
            return localStorage[key + "Item"](name, value)
        }
    });
    HdGame.setSessionStorage = function(name, value) {
        if (!window.sessionStorage) {
            HdGame.log("不支持sessionStorage");
            return
        }
        window.sessionStorage.setItem(name, value)
    };
    HdGame.getSessionStorage = function(name) {
        if (!window.sessionStorage) {
            HdGame.log("不支持sessionStorage");
            return
        }
        return window.sessionStorage.getItem(name)
    };
    HdGame.refresh = function() {
        window.location.reload()
    };
    HdGame.noLoadingRefresh = function() {
        window.location.href = document.URL.indexOf("noLoading") >= 0 ? document.URL: (document.URL + (document.URL.indexOf("?") >= 0 ? "&": "?") + "noLoading=fff")
    }; (function() {
        var UA = {
            val: window.navigator.userAgent,
            isPC: function() {
                var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
                var flag = true;
                for (var v = 0; v < Agents.length; v++) {
                    if (UA.val.indexOf(Agents[v]) > 0) {
                        flag = false;
                        break
                    }
                }
                return flag
            },
            isIOS: function() {
                return /iPhone/i.test(UA.val) || /iPad/i.test(UA.val)
            },
            isIPhone: function() {
                return /iPhone/i.test(UA.val)
            },
            isAndroid: function() {
                return /Android/i.test(UA.val) || /Linux/i.test(UA.val)
            },
            isWX: function() {
                return /MicroMessenger/i.test(UA.val)
            },
            getWxVer: function() {
                var wechatInfo = UA.val.match(/MicroMessenger\/([\d\.]+)/i);
                if (wechatInfo && wechatInfo[1]) {
                    return wechatInfo[1]
                }
                return ""
            },
        };
        $.each(UA,
        function(key, fn) {
            if (typeof fn != "function") {
                return
            }
            var cache;
            UA[key] = function() {
                cache = fn.call(UA);
                UA[key] = function() {
                    return cache
                };
                return cache
            }
        });
        UA.getWxVerNum = function(ver) {
            if (!ver) {
                ver = UA.getWxVer()
            }
            if (!ver) {
                return 0
            }
            var num = 0;
            $.each(ver.split("."),
            function(index, val) {
                num += Math.pow(1000, 2 - index) * parseInt(val)
            });
            return num
        };
        HdGame.isIPhone = UA.isIPhone;
        HdGame.IsPC = UA.isPC;
        HdGame.UA = UA
    })();
    HdGame.getType = function(obj) {
        return Object.prototype.toString.call(obj).match(/\[object\s(\w+)]/)[1].toLowerCase()
    };
    HdGame.changeTimeLimit = function(listStr) {
        if (!listStr || listStr == "[8]") {
            return "周一至周日"
        }
        var list = $.parseJSON(listStr);
        var str = "";
        for (var i = 0; i < list.length; i++) {
            var start = i,
            end = i;
            while (list[end + 1] == (list[end] + 1)) {
                end++
            }
            if (start == end) {
                str = str + (str ? "、": "") + num2day(list[start])
            } else {
                str = str + (str ? "、": "") + num2day(list[start]) + "至" + num2day(list[end])
            }
            i = end
        }
        return str
    };
    function num2day(num) {
        switch (num) {
        case 1:
            return "周一";
        case 2:
            return "周二";
        case 3:
            return "周三";
        case 4:
            return "周四";
        case 5:
            return "周五";
        case 6:
            return "周六";
        case 7:
            return "周日"
        }
        return ""
    }
    HdGame.jointUrlArg = function(root, arg) {
        if (arg) {
            return root + (root.indexOf("?") >= 0 ? "&": "?") + arg
        } else {
            return root
        }
    };
    HdGame.jointParams = function(params) {
        var s = [];
        $.each(params,
        function(key, val) {
            s.push(key + "=" + val)
        });
        return s.join("&")
    };
    HdGame.setUrlArg = function() {
        if (arguments.length < 2) {
            return
        }
        var argsArray = arrPro.slice.call(arguments),
        urlInfo = HdGame.parseURL(argsArray.shift());
        $.each(argsArray,
        function(index, item) {
            if ($.type(item) === "array") {
                urlInfo.params[item[0]] = item[1]
            }
        });
        urlInfo.obj.search = HdGame.jointUrlArg("", HdGame.jointParams(urlInfo.params));
        return urlInfo.obj.href
    };
    HdGame.removeUrlArg = function() {
        var argsArray = arrPro.slice.call(arguments);
        if (argsArray.length < 2) {
            return
        }
        var urlInfo = HdGame.parseURL(argsArray.shift());
        $.each(argsArray,
        function(index, item) {
            if (urlInfo.params.hasOwnProperty(item)) {
                delete urlInfo.params[item]
            }
        });
        urlInfo.obj.search = HdGame.jointUrlArg("", HdGame.jointParams(urlInfo.params));
        return urlInfo.obj.href
    };
    HdGame.parseURL = function(url) {
        var a = document.createElement("a");
        a.href = url;
        return {
            obj: a,
            source: url,
            protocol: a.protocol.replace(":", ""),
            host: a.hostname,
            port: a.port,
            query: a.search,
            params: (function() {
                var ret = {},
                seg = a.search.replace(/^\?/, "").split("&"),
                len = seg.length,
                i = 0,
                s;
                for (; i < len; i++) {
                    if (!seg[i]) {
                        continue
                    }
                    s = seg[i].split("=");
                    ret[s[0]] = s[1]
                }
                return ret
            })(),
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ""])[1],
            hash: a.hash.replace("#", ""),
            path: a.pathname.replace(/^([^\/])/, "/$1"),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ""])[1],
            segments: a.pathname.replace(/^\//, "").split("/")
        }
    };
    HdGame.replaceUrlByTime = function() {
        try {
            var url = document.URL.replace(/[&?]_hgTime=\d+/, "");
            url += (url.indexOf("?") == -1 ? "?": "&") + "_hgTime=" + new Date().getTime();
            history.replaceState(null, "", url)
        } catch(e) {}
    };
    HdGame.shuffle = function(arr) {
        var len = arr.length;
        for (var i = 0; i < len - 1; i++) {
            var idx = Math.floor(Math.random() * (len - i));
            var temp = arr[idx];
            arr[idx] = arr[len - i - 1];
            arr[len - i - 1] = temp
        }
        return arr
    }; (function() {
        HdGame.logStd = initFn(40,
        function(key, msg) {
            try {
                msg = msg.slice(0, 2000)
            } catch(e) {}
            $.ajax({
                type: "post",
                url: g_config.ajaxUrl + "logJsErr_h.jsp?cmd=jsLogStd",
                data: {
                    msg: "hgLog-" + key + " msg=" + msg + " aid=" + g_config.aid + " gameId=" + g_config.gameId + " openId=" + g_config.openId
                },
            })
        });
        HdGame.logErr = initFn(3,
        function(key, msg) {
            $.ajax({
                type: "post",
                url: g_config.ajaxUrl + "logJsErr_h.jsp?cmd=jsLogErr",
                data: {
                    msg: "hgErr-" + key + " msg=" + msg + " aid=" + g_config.aid + " gameId=" + g_config.gameId + " openId=" + g_config.openId
                },
            })
        });
        function initFn(defLimit, fn) {
            return function(key, msg, limit) {
                if (typeof fn[key] == "undefined") {
                    fn[key] = 0
                } else {
                    fn[key]++
                }
                if (typeof limit == "undefined") {
                    limit = defLimit
                }
                if (limit > 0 && fn[key] >= limit) {
                    return
                }
                fn(key, msg)
            }
        }
    } ()); (function() {
        HdGame.logPhoneDog = function(src) {
            HdGame.logDog(1000155, src + 1)
        };
        var logDog = $.throttle(function(dogList) {
            if (dogList.length == 1) {
                HdGame.logDogSynch.apply(HdGame, dogList[0])
            } else {
                HdGame.logDogList($.map(dogList,
                function(v) {
                    var dog = {
                        id: parseInt(v[0])
                    };
                    var src = parseInt(v[1]);
                    var objId = parseInt(v[2]); ! isNaN(src) && (dog.src = src); ! isNaN(objId) && (dog.objId = objId);
                    return dog
                }))
            }
        },
        0, true);
        HdGame.logDog = function(dogId) {
            logDog.apply(HdGame, arguments)
        };
        HdGame.logObjDog = function(dogId, dogSrc, objId) {
            HdGame.logDog(dogId, dogSrc, objId)
        };
        HdGame.logDogList = function(dogList) {
            $.ajax({
                type: "post",
                url: g_config.ajaxUrl + "log_h.jsp?cmd=dogList",
                data: {
                    dogList: $.toJSON(dogList)
                },
            })
        };
        HdGame.logDogSynch = function(dogId, dogSrc, objId) {
            var objIdStr = isNaN(objId) ? "": "&objId=" + HdGame.encodeUrl(objId);
            $.ajax({
                type: "get",
                url: g_config.ajaxUrl + "log_h.jsp?cmd=dog&dogId=" + HdGame.encodeUrl(dogId) + "&dogSrc=" + HdGame.encodeUrl(dogSrc) + objIdStr,
            })
        };
        HdGame.getCityPickerData = (function() {
            var cache;
            return function() {
                if (!cache) {
                    cache = (function getData(cities) {
                        var pickers = [];
                        $.each(cities,
                        function(i, info) {
                            var tmp = {};
                            tmp.value = info.id;
                            tmp.text = info.name;
                            var countys = site_cityUtil.getCities(info.id);
                            if (countys.length > 0) {
                                tmp.children = getData(countys)
                            }
                            pickers.push(tmp)
                        });
                        return pickers
                    })(site_cityUtil.getProvince())
                }
                return cache
            }
        })()
    } ()); (function() {
        var injector;
        if (typeof _manage != "undefined" && _manage && !_preview) {
            injector = function() {
                return parent.Edit.getInjector()
            }
        }
        HdGame.watch = newWatch();
        function newWatch() {
            function watch(key, val, fn, parentWatch, options) {
                if (!isFunction(fn)) {
                    return
                }
                if (injector) {
                    return watch.add(key, fn, parentWatch, options)
                }
                fn(val, val)
            }
            watch.add = function(key, fn, parentWatch, options) {
                if (!injector || !isFunction(fn)) {
                    return
                }
                var rt, opts = $.extend({
                    objectEquality: false
                },
                options);
                var setWatch = function(scope) {
                    if (scope.$evalAsync && scope.$watch) {
                        scope.$safeApply(function() {
                            rt = $.isArray(key) ? scope.$watchGroup(key, fn, opts.objectEquality) : scope.$watch(key, fn, opts.objectEquality)
                        })
                    } else {
                        scope.getScope().$safeApply(function() {
                            rt = {
                                uw: function() {
                                    scope.stop(key)
                                },
                                check: scope(key, fn, opts.objectEquality)
                            }
                        })
                    }
                };
                if ($.type(parentWatch) == "string") {
                    parentWatch = $$(parentWatch).data("$scope")
                } else {
                    if ($.type(parentWatch) == "boolean" && parentWatch) {
                        injector().invoke(["watch", setWatch])
                    } else {
                        if (typeof parentWatch == "object" && parentWatch) {
                            setWatch(parentWatch)
                        } else {
                            injector().invoke(["$rootScope", setWatch])
                        }
                    }
                }
                return rt
            };
            watch.bind = function() {
                var conf = arrPro.slice.call(arguments);
                var parentWatch = false;
                if (!$.isArray(conf[0])) {
                    parentWatch = conf.shift();
                    if (injector) {
                        if ($.type(parentWatch) == "string") {
                            parentWatch = $$(parentWatch).data("$scope")
                        } else {
                            if ($.type(parentWatch) == "function") {
                                parentWatch = parentWatch()
                            }
                        }
                    }
                }
                var sLocation = {};
                $.each(conf,
                function(index, val) {
                    val.$exp = val[val.length - 2];
                    val.$regExp = new RegExp("\\{" + val[0] + "}", "g");
                    val.$val = val[val.length - 1];
                    sLocation[val[0]] = val.$val
                });
                var handleFn = function(fn) {
                    return function() {
                        var location = sLocation;
                        if (!arguments[2]) {
                            location = {};
                            $.each(conf,
                            function(index, val) {
                                location[val[0]] = bWatch.evalNg(val.$exp, true)
                            })
                        }
                        location.$context = this;
                        fn.apply(location, arguments)
                    }
                };
                var bWatch = function(ngExp, fn, getLocation, options) {
                    fn = getLocation ? handleFn(fn) : fn;
                    return watch(bWatch.getNgExp(ngExp), bWatch.eval(ngExp), fn, parentWatch, options)
                };
                bWatch.add = function(ngExp, fn, getLocation, options) {
                    fn = getLocation ? handleFn(fn) : fn;
                    return watch.add(bWatch.getNgExp(ngExp), fn, parentWatch, options)
                };
                bWatch.getNgExp = function(ngExp) {
                    $.each(conf,
                    function(index, val) {
                        ngExp = ngExp.replace(val.$regExp, val.$exp)
                    });
                    return ngExp
                };
                bWatch.evalNg = function(ngExp, isNg) { ! isNg && (ngExp = bWatch.getNgExp(ngExp));
                    if (parentWatch && parentWatch.$eval) {
                        return parentWatch.$eval(ngExp)
                    }
                    var val = null;
                    injector().invoke(["$rootScope",
                    function(root) {
                        val = root.$eval(ngExp)
                    }]);
                    return val
                };
                bWatch.eval = function(ngExp, isNg) {
                    $.each(conf,
                    function(index, val) {
                        ngExp = ngExp.replace(val.$regExp, "conf[" + index + "].$val")
                    });
                    return (new Function("conf", "return (" + ngExp + ");"))(conf)
                };
                return bWatch
            };
            watch.$new = newWatch;
            return watch
        }
    })(); (function() {
        var uid = 0;
        HdGame.showLoadToast = function(text) {
            $("#loadingToast .weui-toast__content").text(text);
            $("#loadingToast").removeClass("hide");
            return++uid
        };
        HdGame.hideLoadToast = function(id) {
            if (id !== undefined && id !== uid) {
                return
            }
            $("#loadingToast").addClass("hide")
        }
    })();
    HdGame.otherAjaxComplete = function() {
        if (tryPlay) {
            var ajaxLoadBar = $(".ajaxLoadBar");
            ajaxLoadBar.addClass("ajaxComplete");
            setTimeout(function() {
                ajaxLoadBar.removeClass("ajaxLoad");
                ajaxLoadBar.removeClass("ajaxComplete");
                $(".ajaxLoadBg").hide()
            },
            500)
        } else {
            var ajaxLoadBar = top.$(".ajaxLoadBar");
            ajaxLoadBar.addClass("ajaxComplete");
            setTimeout(function() {
                ajaxLoadBar.removeClass("ajaxLoad");
                ajaxLoadBar.removeClass("ajaxComplete");
                top.$(".ajaxLoadBg").hide()
            },
            500)
        }
    };
    HdGame.ajaxLoad = (function() {
        var timer, isShow;
        return {
            show: function(delay) {
                var show = function() {
                    isShow = true;
                    $(".ajaxLoadBg").show();
                    $(".ajaxLoadBar").addClass("ajaxLoad");
                    HdGame.showLoadToast("数据加载中")
                };
                arguments.length == 0 ? show() : (timer = setTimeout(show, delay))
            },
            hide: function() {
                clearTimeout(timer);
                if (isShow) {
                    HdGame.hideLoadToast();
                    HdGame.otherAjaxComplete();
                    isShow = false
                }
            }
        }
    })();
    HdGame.ajaxLoad = (function() {
        var showTimer, hideTimer, isShow = false;
        return {
            show: function(delay) {
                var show = function() {
                    clearTimeout(hideTimer);
                    if (!isShow) {
                        $(".ajaxLoadBg").show();
                        $(".ajaxLoadBar").addClass("ajaxLoad");
                        HdGame.showLoadToast("数据加载中");
                        isShow = true
                    }
                };
                delay === undefined ? show() : (showTimer = setTimeout(show, delay))
            },
            hide: function(delay) {
                var hide = function() {
                    clearTimeout(showTimer);
                    if (isShow) {
                        HdGame.hideLoadToast();
                        HdGame.otherAjaxComplete();
                        isShow = false
                    }
                };
                delay === undefined ? hide() : (hideTimer = setTimeout(hide, delay))
            }
        }
    })();
    HdGame.appendMusicIcon = function() {
        var arg = $("body").data("hd-initHdGameJsfootArg");
        if (!arg) {
            return
        }
        var initCss = function(warp) {
            warp.find('.soundIcon:not(".soundIconPlay")').css({
                left: arg.soundIcon_l,
                top: arg.soundIcon_t
            });
            return warp
        };
        var appendIcon = function(warp, zIndex) {
            warp.append('<div class="' + (_manage ? "": "soundIconOff ") + "soundIcon" + (hg.sound.list[0].optFlag != 1 ? "": " soundIconHide") + '" style="z-index:' + (zIndex || 100) + '"></div>');
            return warp
        };
        if (g_config.style == 55 || g_config.style == 27) {
            initCss(appendIcon($(".gameBgBox"), 90));
            $('.home .soundIcon:not(".soundIconPlay")').hide()
        } else {
            if (g_config.style == 49 || g_config.style == 69) {
                initCss(appendIcon($(".body"), 700))
            } else {
                if (g_config.style == 67) {
                    initCss(appendIcon($(".myCutDownPriceList"), 700))
                } else {
                    if (g_config.style == 77) {
                        initCss(appendIcon($(".cutDetailPage"), 700))
                    } else {
                        appendIcon($(".home,.gameBgBox"), 700);
                        initCss($(".home"))
                    }
                }
            }
        }
        $("body").removeData("hd-initHdGameJsfootArg")
    };
    HdGame.checkStatus = function() {
        if (g_config.status == 3) {
            HdGame.statusMsg(3);
            return true
        }
    };
    HdGame.getIsOutofJoinNumFlag = function(callback) {
        var url = HdGame.jointUrlArg(g_config.ajaxUrl + "hdgame_h.jsp", HdGame.jointParams({
            cmd: g_config.style == 71 ? "checkJoinGrupNum": "checkJoinNum",
            gameId: g_config.gameId,
            openId: g_config.openId
        }));
        return $.ajax({
            type: "POST",
            url: url,
            dataType: "json",
            success: function(result) {
                HdGame.tlog("isOutofJoinNum", result);
                if (callback && result) {
                    callback(null, result.isOutofJoinNum)
                }
            },
            error: function() {
                if (callback) {
                    callback("error")
                }
            }
        })
    };
    HdGame.initPageSet = function(initAssemblyList, initRegisterPage, initPageSetting) {
        var assemblyLibrary = {},
        pageSettingList = {},
        curPage = "",
        assemblyNum = 0;
        addAssembly(initAssemblyList);
        registerPage(initRegisterPage);
        setPage(initPageSetting);
        switchPage("home");
        function registerPage(addRegister, rmRegister) {
            addPage(addRegister);
            removePage(rmRegister)
        }
        function addPage(pageObj) {
            if ($.isArray(pageObj)) {
                for (var i = 0,
                len = pageObj.length; i < len; i++) {
                    if ($.isArray(pageObj[i])) {
                        addSinglePage(pageObj[i][0], pageObj[i][1])
                    } else {
                        if (typeof pageObj[i] == "string") {
                            addSinglePage(pageObj[i])
                        }
                    }
                }
            } else {
                if (typeof pageObj == "string") {
                    addSinglePage(pageObj, arguments[1])
                }
            }
        }
        function addSinglePage(key, ele) {
            if (!pageSettingList[key]) {
                pageSettingList[key] = {
                    isInit: false,
                    ele: ele ? ele: ("." + key),
                    content: []
                };
                $(pageSettingList[key].ele).addClass("regPage")
            } else {
                HdGame.tlog("page " + pageObj + " has registered")
            }
        }
        function removePage(pageObj) {
            if (pageObj) {
                if ($.isArray(pageObj)) {
                    for (var i = 0,
                    len = pageObj.length; i < len; i++) {
                        removePage(pageObj[i])
                    }
                } else {
                    if (typeof pageObj == "string") {
                        if (pageSettingList[pageObj]) {
                            delete pageSettingList[pageObj]
                        } else {
                            HdGame.tlog("page " + pageObj + " is not registered")
                        }
                    }
                }
            }
        }
        function setPage(pageSetting) {
            for (var key in pageSetting) {
                setSinglePage(key, pageSetting[key])
            }
        }
        function setSinglePage(pageKey, pageObj) {
            var singleSetting = pageSettingList[pageKey];
            if (singleSetting) {
                if (pageObj.content) {
                    var assemblySet = singleSetting.content;
                    for (var i = 0,
                    len = pageObj.content.length; i < len; i++) {
                        for (var j = 0,
                        leng = assemblySet.length; j < leng; j++) {
                            if (pageObj.content[i] == assemblySet[j]) {
                                break
                            }
                        }
                        if (j == leng) {
                            assemblySet.push(pageObj.content[i])
                        }
                    }
                }
                delete pageObj.content;
                $.extend(true, singleSetting, pageObj)
            }
        }
        function initPageAssembly(pageKey) {
            var pageSetting = pageSettingList[pageKey];
            if (pageSetting) {
                var pageContent = pageSetting.content;
                if (pageSetting.beforeSet) {
                    pageSetting.beforeSet()
                }
                if (pageContent) {
                    for (var i = 0,
                    len = pageContent.length; i < len; i++) {
                        var singleAssembly = assemblyLibrary[pageContent[i]];
                        if (singleAssembly) {
                            var assemblyEle = $(singleAssembly.content);
                            if (assemblyEle.parent().length > 0) {
                                assemblyEle.addClass("share_assembly share_assembly_" + pageKey);
                                if (singleAssembly.container && assemblyEle.parent(singleAssembly.container).length == 0) {
                                    assemblyEle.appendTo(singleAssembly.container)
                                }
                            } else {
                                if (singleAssembly.container && singleAssembly.isInit) {
                                    singleAssembly.shareNum && ($(".share_assembly_" + singleAssembly.shareNum).addClass("share_assemblyshare_assembly_" + pageKey))
                                } else {
                                    if (singleAssembly.container) {
                                        singleAssembly.shareNum = ++assemblyNum;
                                        assemblyEle.addClass("share_assembly share_assembly_" + singleAssembly.shareNum + " share_assembly_" + pageKey)
                                    }
                                    singleAssembly.beforeSet && (singleAssembly.beforeSet(assemblyEle));
                                    assemblyEle.appendTo(singleAssembly.container ? singleAssembly.container: pageSettingList[pageKey].ele);
                                    singleAssembly.afterSet && (singleAssembly.afterSet(assemblyEle));
                                    singleAssembly.isInit = true
                                }
                            }
                        }
                    }
                }
                if (pageSetting.afterSwitch) {
                    pageSetting.afterSwitch()
                }
            }
        }
        function switchPage(pageKey, callBack, isCloseOld) {
            if (g_config.style == 55) {
                return
            }
            if (curPage == pageKey) {
                HdGame.tlog("curPage is allright")
            }
            var pageSetting = pageSettingList[pageKey];
            if (pageSetting) {
                if (!pageSetting.isInit) {
                    initPageAssembly(pageKey);
                    pageSetting.isInit = true
                }
                if ((typeof isCloseOld == "undefined" || isCloseOld) && curPage) {
                    $(".regPage").hide()
                }
                switchShareAssembly(pageKey, isCloseOld);
                $(pageSetting.ele).show();
                curPage = pageKey;
                callBack && (callBack())
            } else {
                HdGame.tlog("ERR: page " + pageKey + " is not registered")
            }
        }
        function switchShareAssembly(pageKey, isCloseOld) {
            $(".share_assembly_" + pageKey).show();
            if (typeof isCloseOld == "undefined" || isCloseOld) {
                $(".share_assembly:not(.share_assembly_" + pageKey + ")").hide()
            }
        }
        function addAssembly(assemblyObjList) {
            for (var eleCont in assemblyObjList) { (typeof assemblyObjList[eleCont] == "string") && (assemblyObjList[eleCont] = {
                    content: assemblyObjList[eleCont]
                })
            }
            $.extend(assemblyLibrary, assemblyObjList)
        }
        var pageSet = {
            addAssembly: addAssembly,
            modifyAssembly: function(assemblyObjList) {
                $.extend(true, assemblyLibrary, assemblyObjList)
            },
            registerPage: registerPage,
            addPage: addPage,
            removePage: removePage,
            setPage: setPage,
            setSinglePage: setSinglePage,
            switchPage: switchPage
        };
        return pageSet
    };
    HdGame.optReSize = function() {
        $("#resule-status-scrollWrap .optContainer").height($("#resule-status-scrollWrap").innerHeight() - $("#resule-status-scrollWrap .attentionBox").eq(0).outerHeight() - 1.8 * g_rem)
    };
    HdGame.checkIsFaiOpenId = function() {
        var openId = g_config.openId;
        return g_config.openId && openId.length
    };
    HdGame.forbinSlide = function(srl_container) {
        var srl_str = ".srl_container",
        touchPos = 0,
        scrollPos = 0,
        scrollSpeed = 0,
        scrollHeight = 0;
        srl_str = srl_container ? srl_container.join(",") : srl_str;
        $("body>*:not(.hd_srl)").off("touchmove.hd_srl_fixed").on("touchmove.hd_srl_fixed",
        function(e) {
            e.preventDefault()
        }).addClass(".hd_srl");
        $(srl_str).css("overflow-y", "hidden");
        $(srl_str).off("touchstart.hd_srl").on("touchstart.hd_srl",
        function(e) {
            scrollSpeed = 0;
            var srl_content = $(this).find(".srl_content"); (srl_content.length == 0) && (srl_content = $(this).wrapInner('<div class="srl_content" style="width:100%;position:relative;top:0;left:0;overflow:hidden;"><div class="srl_content" style="overflow:hidden;width:100%;position:absolute;top:0;left:0;"></div></div>').find(".srl_content"));
            var contLen = srl_content.length;
            scrollHeight = 0;
            var contChildren = srl_content.eq(contLen - 1).children();
            for (var i = 0,
            len = contChildren.length; i < len; i++) {
                var children = contChildren.eq(i);
                if (children.css("display") != "none") {
                    var elePos = children.position().top + children.outerHeight(true);
                    scrollHeight = elePos > scrollHeight ? elePos: scrollHeight
                }
            }
            var contentTop = srl_content.eq(0).css("transition-duration", "0ms").position().top;
            scrollHeight += (contentTop < 0 ? 0 : contentTop);
            scrollHeight = e.delegateTarget.clientHeight > scrollHeight ? e.delegateTarget.clientHeight: scrollHeight; (srl_content.eq(0).position().top <= 0) && (srl_content.css("height", scrollHeight + "px"));
            touchPos = e.originalEvent.targetTouches[0].pageY;
            e.stopPropagation()
        });
        $(srl_str).off("touchend.hd_srl").on("touchend.hd_srl",
        function(e) {
            scrollPos += (scrollSpeed * 4);
            if (scrollPos > 0) {
                scrollPos = 0
            } else {
                if (0 - scrollPos + e.delegateTarget.clientHeight > scrollHeight) {
                    scrollPos = e.delegateTarget.clientHeight - scrollHeight
                }
            }
            $(this).children().css({
                "transition-duration": "200ms",
                transform: "translate3d(0px, " + scrollPos + "px, 0px)"
            });
            e.stopPropagation()
        });
        $(srl_str).off("touchmove.hd_srl").on("touchmove.hd_srl",
        function(e) {
            e.preventDefault();
            var childrens = $(this).children(".srl_content");
            var targetTouch = e.originalEvent.targetTouches;
            scrollSpeed = targetTouch[0].pageY - touchPos;
            if (scrollPos > 0 || 0 - scrollPos + e.delegateTarget.clientHeight > scrollHeight) {
                scrollPos += scrollSpeed / 3
            } else {
                scrollPos += scrollSpeed;
                scrollHeight = e.delegateTarget.scrollHeight
            }
            childrens.css("transform", "translate3d(0px, " + scrollPos + "px, 0px)");
            touchPos = targetTouch[0].pageY;
            e.stopPropagation()
        });
        $("#log_text_wrap").off("touchmove.hd_srl").on("touchmove.hd_srl",
        function(e) {
            e.stopPropagation()
        })
    };
    HdGame.ctlScl = function(container, content, isBind) {
        add("srl_container", arguments[0]);
        add("srl_content", arguments[1]);
        isBind && (HdGame.forbinSlide(container));
        function add(name, key) {
            if (key) {
                var cont_Str = "";
                if ($.isArray(key)) {
                    cont_Str = key.join(",")
                } else {
                    if (typeof key == "string") {
                        cont_Str = key
                    } else {
                        if (typeof key == "boolean") {
                            isBind = key
                        }
                    }
                }
                $(cont_Str).addClass(name)
            }
        }
    };
    HdGame.getPosAndSize = function(theObj, def, type) { ! type && (type = HdGame.Img.MODE_SCALE_DEFLATE_FILL);
        var sizeInfo = HdGame.Img.calcSize(theObj.width, theObj.height, def.width, def.height, type, true);
        var defLeft = def.left || 0;
        var defTop = def.top || 0;
        return $.extend(sizeInfo, {
            left: (def.width - sizeInfo.width) / 2 + defLeft,
            top: (def.height - sizeInfo.height) / 2 + defTop,
        })
    };
    $.ajaxPrefilter("*",
    function(s, o, jqXHR) {
        if (o.url.indexOf("hdgame_h") != -1 || o.url.indexOf("hdzhuli_h") != -1) {
            s.data += "&" + $.param({
                canal: fromCanal,
            })
        }
        if (o.url.indexOf("cmd=setPhone") != -1 || o.url.indexOf("cmd=setAchieve") != -1 || o.url.indexOf("cmd=getResult" != -1) || o.url.indexOf("cmd=addPlayerForZL")) {
            s.data += "&" + $.param({
                playerOrigin: g_config.playerOrigin,
            })
        }
    }); (function() {
        function floatAdd(arg1, arg2) {
            var r1, r2, m;
            try {
                r1 = arg1.toString().split(".")[1].length
            } catch(e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch(e) {
                r2 = 0
            }
            m = Math.pow(10, Math.max(r1, r2));
            return (floatMul(arg1, m) + floatMul(arg2, m)) / m
        }
        function floatSub(arg1, arg2) {
            var r1, r2, m, n;
            try {
                r1 = arg1.toString().split(".")[1].length
            } catch(e) {
                r1 = 0
            }
            try {
                r2 = arg2.toString().split(".")[1].length
            } catch(e) {
                r2 = 0
            }
            m = Math.pow(10, Math.max(r1, r2));
            n = (r1 >= r2) ? r1: r2;
            return Number(((floatMul(arg1, m) - floatMul(arg2, m)) / m).toFixed(n))
        }
        function floatMul(arg1, arg2) {
            var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
            try {
                m += s1.split(".")[1].length
            } catch(e) {}
            try {
                m += s2.split(".")[1].length
            } catch(e) {}
            return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        }
        function floatDiv(arg1, arg2) {
            var t1 = 0,
            t2 = 0,
            r1, r2;
            try {
                t1 = arg1.toString().split(".")[1].length
            } catch(e) {}
            try {
                t2 = arg2.toString().split(".")[1].length
            } catch(e) {}
            r1 = Number(arg1.toString().replace(".", ""));
            r2 = Number(arg2.toString().replace(".", ""));
            return (r1 / r2) * Math.pow(10, t2 - t1)
        }
        function getFn(fn) {
            return function(arg1, arg2) {
                if (isNaN(arg1) || isNaN(arg2)) {
                    return NaN
                }
                return fn(arg1, arg2)
            }
        }
        HdGame.Num = {
            add: getFn(floatAdd),
            sub: getFn(floatSub),
            mul: getFn(floatMul),
            div: getFn(floatDiv),
        };
        HdGame.foreiganNum = function(num) {
            var arr = (num + "").split(".");
            num = parseInt(arr[0]);
            var result = [],
            counter = 0;
            num = (num || 0).toString().split("");
            for (var i = num.length - 1; i >= 0; i--) {
                counter++;
                result.unshift(num[i]);
                if (! (counter % 3) && i != 0) {
                    result.unshift(",")
                }
            }
            var endNum = result.join("");
            if (arr.length == 2) {
                endNum = endNum + "." + arr[1]
            }
            return endNum
        }
    })();
    HdGame.poupValidate = function(callBack, options) {
        if (!$("#spxdPage").hasClass("imp-hide")) {
            $("#spxdPage").addClass("imp-hide")
        }
        g_config.theValiteCodeComeInTime = new Date().getTime();
        if ($("#valiteInputIframe").length == 0) {
            var url = g_config.ajaxUrl.replace("/ajax/", "");
            $("#validteBoxerBg").data("_theCallBack", callBack).show();
            $("#validteBoxerBg").append('<iframe id="valiteInputIframe" frameborder="0" scrolling="no" src="' + url + '/poupvalite.jsp" style="height: 25rem; width: 100%;"></iframe>')
        } else {
            $("#validteBoxerBg").data("_theCallBack", callBack).show()
        }
        options && (g_config.valiteOptions = options);
        typeof options === "undefined" && (delete g_config.valiteOptions)
    };
    HdGame.checkPhone = function(phoneNum) {
        if ((/^1[3456789]\d{9}$/.test(phoneNum))) {
            return true
        }
        return false
    };
    HdGame.initSwiper = function(el, number, autoplay, callback) {
        var $el = el instanceof $ ? el: $(el).eq(0);
        HdGame.tlog("initSwiperBanner: ", $el);
        if ($el.data("swiper") && $el.data("swiper").initialized) {
            HdGame.tlog(el, "已经初始化");
            return console.warn(el + " 已经初始化")
        }
        if (number <= 1) {
            $el.find(".swiper-wrapper").css("transform", "translate3d(0px, 0px, 0px)");
            $el.find(".swiper-number-pagination").addClass("hide");
            if (callback) {
                callback({
                    number: number,
                    autoplay: autoplay
                })
            }
            return
        }
        HdGame.Res.load("swiper_simple").then(function() {
            HdGame.tlog("load swiper_simple: ", "ok");
            var params = {
                el: el,
                loop: true
            };
            if (autoplay) {
                params.autoplay = {
                    enabled: true,
                    delay: 2500,
                    disableOnInteraction: false
                }
            }
            var swiper = new Swiper(params);
            var pagination = swiper.$el.find(".swiper-number-pagination");
            pagination.removeClass("hide").text((swiper.realIndex + 1) + "/" + number);
            swiper.on("realIndexChange",
            function() {
                pagination.text((swiper.realIndex + 1) + "/" + number)
            });
            if (callback) {
                callback({
                    swiper: swiper,
                    number: number,
                    autoplay: autoplay
                })
            }
        })
    };
    HdGame.minShareTouch = function(data) {
        data = data ? data: {};
        $("body").append("<div id='minShareBtn'></div>");
        var ele = $("#minShareBtn"),
        eleParam = {
            width: ele.outerWidth(),
            height: ele.outerHeight()
        },
        clientParam = {
            width: $(window).width(),
            height: $(window).height()
        },
        moveArea = {
            width: clientParam.width - eleParam.width,
            height: clientParam.height - eleParam.height
        },
        monitor = {
            status: false,
            x: moveArea.width - 0.64 * g_rem,
            y: moveArea.height - 1.74 * g_rem,
            touchX: 0,
            touchY: 0
        };
        render(0, true);
        ele.on({
            touchstart: function(e) {
                $(this).addClass("move");
                var touch = e.originalEvent.targetTouches[0];
                monitor.touchX = touch.pageX;
                monitor.touchY = touch.pageY;
                monitor.status = true;
                render()
            },
            touchmove: function(e) {
                var touch = e.originalEvent.targetTouches[0],
                tx = touch.pageX > 0 ? (touch.pageX < clientParam.width ? touch.pageX: clientParam.width) : 0,
                ty = touch.pageY > 0 ? (touch.pageY < clientParam.height ? touch.pageY: clientParam.height) : 0,
                x = monitor.x + tx - monitor.touchX,
                y = monitor.y + ty - monitor.touchY;
                monitor.x = x > 0 ? (x < moveArea.width ? x: moveArea.width) : 0;
                monitor.y = y > 0 ? (y < moveArea.height ? y: moveArea.height) : 0;
                monitor.touchX = tx;
                monitor.touchY = ty;
                e.preventDefault()
            },
            touchend: function(e) {
                $(this).removeClass("move");
                monitor.status = false
            },
            click: $.throttle(function() {
                var config_miniApp = HdGame.getminData();
                for (var key in data) {
                    if (!data.hasOwnProperty(key)) {
                        continue
                    }
                    config_miniApp[key] = data[key]
                }
                var params = "";
                for (var key in config_miniApp) {
                    if (!config_miniApp.hasOwnProperty(key)) {
                        continue
                    }
                    if (params) {
                        params += "&"
                    }
                    params += (key + "=" + config_miniApp[key])
                }
                wx.miniProgram.navigateTo({
                    url: "/pages/sharePage/sharePage?" + params
                })
            },
            500)
        });
        function render(stamp, run) {
            if (monitor.status || run) {
                ele.css({
                    "-webkit-transform": "translate(" + monitor.x + "px," + monitor.y + "px)",
                    transform: "translate(" + monitor.x + "px," + monitor.y + "px)"
                });
                requestAnimFrame(render)
            }
        }
    };
    HdGame.getminData = function() {
        return {
            gameUrl: encodeURIComponent(HdGame.wxConfigArg.url + "&fromCardBag=true"),
            aid: g_config.aid,
            gameId: g_config.gameId,
            openId: g_config.openId,
            shareDeep: g_config.shareDeep
        }
    };
    HdGame.watchMiniMusic = function() {
        var hiddenProperty = "hidden" in document ? "hidden": "webkitHidden" in document ? "webkitHidden": "mozHidden" in document ? "mozHidden": null;
        var bgStatus = true;
        $(document).on("visibilitychange",
        function(e) {
            if (document[hiddenProperty]) {
                if (!hg.sound.cache[0].playing) {
                    bgStatus = false
                } else {
                    hg.sound.pauseAll()
                }
            } else {
                bgStatus && (hg.sound.play(0))
            }
        })
    };
    HdGame.renderSwiper = function(options, container) {
        var opts = $.extend({},
        options);
        if (!opts.name) {
            return console.warn("HdGame.renderSwiper(): name is not defined!")
        }
        if (!container || !container.length) {
            return console.warn("HdGame.renderSwiper(): container is not defined!")
        }
        if (!opts.config) {
            return console.warn("HdGame.renderSwiper(): config is not defined!")
        }
        var name = opts.name;
        var swiperConfig = opts.config;
        var template = '<div class="swiper-container"><div class="swiper-wrapper"><div class="swiper-slide swiper-slide-first"></div>';
        for (var i = 1; i < swiperConfig.bannerNumber; i++) {
            template += '<div class="swiper-slide"><div class="editTarget-' + (name + "-" + i) + ' swiper-editTarget swiper-background-full"></div></div>'
        }
        template += '</div><div class="swiper-number-pagination ' + ((swiperConfig.bannerNumber == 1) ? "hide": "") + '">1/' + swiperConfig.bannerNumber + "</div></div>";
        template = $(template);
        container.addClass("swiper-editTarget swiper-background-full");
        template.insertBefore(container).find(".swiper-wrapper .swiper-slide-first").append(container);
        HdGame.initSwiper(template, swiperConfig.bannerNumber, swiperConfig.bannerAutoplay)
    };
    HdGame.slideSwiperTo = function(options) {
        var opts = $.extend({
            page: 0
        },
        options);
        if (opts.page == null) {
            return console.warn("HdGame.slideSwiperTo(): page is not defined!")
        }
        if (!opts.swiperSelector) {
            return console.warn("HdGame.slideSwiperTo(): swiperSelector is not defined!")
        }
        var selector = opts.swiperSelector instanceof $ ? opts.swiperSelector: $(opts.swiperSelector);
        selector.each(function() {
            var swiper = $(this).data("swiper");
            if (swiper) {
                var page = opts.page;
                var autoplay = swiper.params.autoplay.enabled;
                if (swiper.params.loop) {
                    page += 1
                }
                swiper.slideTo(page, 0, false);
                if (autoplay) {
                    swiper.autoplay.stop();
                    swiper.autoplay.start()
                }
            } else {
                console.warn("HdGame.slideSwiperTo(): %s is not instantiate Swiper.", this)
            }
        })
    };
    HdGame.changeSwiperAwardList = function(options) {
        var opts = $.extend({},
        options);
        if (opts.index == null) {
            return console.warn("HdGame.changeSwiperAwardList(): index is not defined!")
        }
        $(opts.selector).each(function(index) {
            $(this).toggleClass("hide", opts.index !== index)
        })
    };
    HdGame.drawShareImage = function() {
        var createImageSharePoup = $('<div id="createImageSharePoup" class="is-active"><div class="mask"><div class="tipsText">长按保存图片，发给好友一起参与</div></div><div id="createImageShareWrapper"><span style="display: inline-block; margin-top: 5rem;">生成图片中...</span></div></div>');
        createImageSharePoup.find(".mask").on("touchstart",
        function(e) {
            e.stopPropagation();
            e.preventDefault();
            createImageSharePoup.hide()
        });
        $("body").append(createImageSharePoup);
        var mCanvas = document.createElement("canvas");
        var ctx = mCanvas.getContext("2d");
        var hasChangedProto = ctx.__LF__pixel__ratio__ !== undefined;
        var ratio = LF.setCanvasePixelRatio(ctx);
        var clientWidth = 12.5 * g_rem;
        var clientHeight = 20 * g_rem;
        mCanvas.width = clientWidth * ratio;
        mCanvas.height = clientHeight * ratio;
        mCanvas.style.width = clientWidth + "px";
        mCanvas.style.height = clientHeight + "px";
        HdGame.tlog("canvas width: ", mCanvas.width);
        HdGame.tlog("canvas height: ", mCanvas.height);
        HdGame.tlog("canvas style width: ", mCanvas.style.width);
        HdGame.tlog("canvas style height: ", mCanvas.style.height);
        var getInfoByName = hg.edit.getInfoByName;
        var textFontSize = 0.5 * g_rem;
        var textLineHeight = textFontSize * 1.4;
        var textMaxWidth = 7.5 * g_rem;
        var SpecialNameMap = {
            wxCreateImageSharePatternBackground: {
                order: 0,
                pos: {
                    left: 0,
                    top: 0
                },
                size: {
                    width: clientWidth,
                    height: clientHeight
                }
            },
            wxCreateImageSharePatternCoverMap: {
                order: 1,
                clip: function(ctx, payload) {
                    drawRoundedRectangleClip(ctx, payload.left, payload.top, payload.width, payload.height, 0.15 * g_rem)
                }
            },
            wxCreateImageSharePatternFansHead: {
                order: 2,
                path: g_config.headImg,
                clip: function(ctx, payload) {
                    var radius = Math.min(payload.width, payload.height) / 2;
                    var center = {
                        x: payload.left + radius,
                        y: payload.top + radius
                    };
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                    ctx.clip();
                    ctx.closePath()
                },
                after: function(ctx, payload) {
                    var radius = Math.min(payload.width, payload.height) / 2;
                    var center = {
                        x: payload.left + radius,
                        y: payload.top + radius
                    };
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.lineWidth = 0.15 * g_rem * 2;
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath()
                }
            }
        };
        function Promise$1(fn) {
            var defer = $.Deferred();
            fn(defer.resolve, defer.reject);
            return defer
        }
        function px2rem(rem) {
            var type = $.type(rem);
            switch (type) {
            case "string":
                return parseFloat(rem) * g_rem;
            case "number":
                return rem;
            default:
                return rem
            }
        }
        function drawMultiLineText(ctx, text, x, y, maxWidth, lineHeight, lineBreak) {
            var lastIndex = 0;
            var currentLineWidth = 0;
            var line = 1;
            if (lineBreak === undefined) {
                lineBreak = "\n"
            }
            var multiLineText = text.split(lineBreak);
            function nextLine(i) {
                lastIndex = i;
                currentLineWidth = 0;
                line += 1
            }
            multiLineText.forEach(function(currLine) {
                var currText, nextText;
                for (var i = 0; i < currLine.length; i++) {
                    currText = currLine[i];
                    nextText = currLine[i + 1] || "";
                    currentLineWidth += ctx.measureText(currText).width;
                    if (maxWidth - currentLineWidth <= ctx.measureText(nextText).width) {
                        ctx.fillText(currLine.slice(lastIndex, i + 1), x, y + line * lineHeight);
                        nextLine(i + 1)
                    }
                }
                ctx.fillText(currLine.slice(lastIndex), x, y + line * lineHeight);
                nextLine(0)
            })
        }
        function drawRoundedRectangleClip(ctx, x, y, width, height, radius) {
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.arcTo(x + width, y, x + width, y + height, radius);
            ctx.arcTo(x + width, y + height, x, y + height, radius);
            ctx.arcTo(x, y + height, x, y, radius);
            ctx.arcTo(x, y, x + width, y, radius);
            ctx.clip();
            ctx.closePath()
        }
        function regroupConfig(config) {
            if (!config.selected) {
                return
            }
            var name = config.key;
            var info = getInfoByName(name);
            var regroupData = $.extend({
                order: 10
            },
            info[1], info[0], SpecialNameMap[name]);
            function getText() {
                if (regroupData.textarea && regroupData.textarea[0]) {
                    if (regroupData.textarea[0].value) {
                        return regroupData.textarea[0]
                    } else {
                        return {
                            value: info[1].textarea[0].value
                        }
                    }
                }
            }
            return $.extend({},
            {
                order: regroupData.order,
                name: regroupData.name,
                path: ($.isArray(regroupData.path) ? regroupData.path[0] : regroupData.path) || "",
                text: getText(),
                pos: regroupData.pos,
                size: regroupData.size,
                clip: regroupData.clip,
                after: regroupData.after
            })
        }
        function regroupConfigs(configs) {
            var result = [];
            $.each([{
                key: "wxCreateImageSharePatternBackground",
                selected: true
            }].concat(configs),
            function() {
                var config = regroupConfig(this);
                if (config) {
                    result.push(config)
                }
            });
            return result.sort(function(config1, config2) {
                return config1.order - config2.order
            })
        }
        var configsDeferArr = regroupConfigs(g_config._zhuliGameCreateImageShare).map(function(config) {
            return new Promise$1(function(resolve) {
                HdGame.tlog("config: ", config);
                if (config.path) {
                    var img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = function() {
                        HdGame.tlog("resolve image: ", config.name);
                        var data = $.extend({},
                        {
                            img: img,
                            left: px2rem(config.pos.left),
                            top: px2rem(config.pos.top),
                            width: px2rem(config.size.width),
                            height: px2rem(config.size.height),
                            clip: config.clip,
                            after: config.after
                        });
                        HdGame.tlog("data: ", data);
                        resolve("image", data)
                    };
                    img.src = config.path + "?" + Date.now()
                } else {
                    if (config.text) {
                        resolve("text", $.extend({},
                        {
                            text: config.text.value,
                            left: px2rem(config.pos.left),
                            top: px2rem(config.pos.top),
                            clip: config.clip,
                            after: config.after
                        }))
                    }
                }
            })
        });
        var shareImageCache = {};
        $.when.apply($, configsDeferArr).then(function() {
            arrPro.slice.call(configsDeferArr.length === 1 ? [arguments] : arguments).forEach(function(data) {
                HdGame.tlog("resolve data: ", data);
                var type = data[0];
                var payload = data[1];
                switch (type) {
                case "image":
                    ctx.save();
                    payload.clip && payload.clip(ctx, payload);
                    ctx.drawImage.apply(ctx, [payload.img, payload.left, payload.top, payload.width, payload.height]);
                    payload.after && payload.after(ctx, payload);
                    ctx.restore();
                    break;
                case "text":
                    ctx.save();
                    payload.clip && payload.clip(ctx, payload);
                    ctx.font = textFontSize + "px 微软雅黑";
                    ctx.fillStyle = "#313131";
                    drawMultiLineText(ctx, payload.text, payload.left, payload.top - (textLineHeight - textFontSize), textMaxWidth, textLineHeight);
                    payload.after && payload.after(ctx, payload);
                    ctx.restore();
                    break;
                default:
                    console.warn("HdGame.drawShareImage(): unknown type %s", type);
                    break
                }
            });
            var tmpCanvas = document.createElement("canvas");
            var tmpCtx = tmpCanvas.getContext("2d");
            tmpCanvas.width = mCanvas.width;
            tmpCanvas.height = mCanvas.height;
            tmpCanvas.style.width = mCanvas.style.width;
            tmpCanvas.style.height = mCanvas.style.height;
            HdGame.tlog("tmpCanvas width: ", tmpCanvas.width);
            HdGame.tlog("tmpCanvas height: ", tmpCanvas.height);
            HdGame.tlog("tmpCanvas style width: ", tmpCanvas.style.width);
            HdGame.tlog("tmpCanvas style height: ", tmpCanvas.style.height);
            var tmpRatio = hasChangedProto ? ratio: 1;
            tmpCtx.drawImage(mCanvas, 0, 0, mCanvas.width / tmpRatio, mCanvas.height / tmpRatio);
            LF.setCanvasePixelRatio(tmpCtx);
            var qrCodeConfig = regroupConfig({
                key: "wxCreateImageSharePatternQrCode",
                selected: true
            });
            var getShareImageUrl = function() {
                var shareUrl = HdGame.wxConfigArg.url;
                var path = "//" + window.location.host + "/qrCode.jsp?cmd=qrurl&siteUrl=" + HdGame.encodeUrl(shareUrl);
                return new Promise$1(function(resolve) {
                    var img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = function() {
                        HdGame.tlog("resolve image: ", qrCodeConfig.name);
                        tmpCtx.save();
                        tmpCtx.drawImage(img, px2rem(qrCodeConfig.pos.left), px2rem(qrCodeConfig.pos.top), px2rem(qrCodeConfig.size.width), px2rem(qrCodeConfig.size.height));
                        tmpCtx.restore();
                        var lastQrCodeUrl = tmpCanvas.toDataURL("image/png");
                        shareImageCache[shareUrl] = lastQrCodeUrl;
                        resolve(lastQrCodeUrl)
                    };
                    img.src = path
                })
            };
            HdGame.drawShareImage = function() {
                var poup = $("#createImageSharePoup");
                var shareUrl = HdGame.wxConfigArg.url;
                if (poup.length) {
                    poup.show();
                    if (shareImageCache[shareUrl] !== undefined) {
                        $("#createImageSharePoup").find("#createImageShareWrapper").html('<img class="sharePicture" src="' + shareImageCache[shareUrl] + '" />');
                        return
                    }
                    poup.find("#createImageShareWrapper").html('<span style="display: inline-block; margin-top: 5rem;">生成图片中...</span>');
                    getShareImageUrl().then(function(url) {
                        $("#createImageSharePoup").find("#createImageShareWrapper").html('<img class="sharePicture" src="' + url + '" />')
                    });
                    return
                }
            };
            getShareImageUrl().then(function(url) {
                $("#createImageSharePoup").find("#createImageShareWrapper").html('<img class="sharePicture" src="' + url + '" />')
            })
        })
    };
    HdGame.checkIsFaiOpenId = function() {
        var openId = g_config.openId;
        if (openId && openId.length > 0) {
            if (m_debug) {
                return openId.indexOf("osi") == 0 || openId.indexOf("ofkc") == 0
            } else {
                return openId.indexOf("osi") == 0 || openId.indexOf("oosn") == 0
            }
        }
        return false
    };
    HdGame.LogFaiOpenId = function(logId, src) {
        if (HdGame.checkIsFaiOpenId()) {
            $.ajax({
                type: "get",
                url: g_config.ajaxUrl + "log_h.jsp?cmd=logDogOss&id=" + HdGame.encodeUrl(logId) + "&src=" + HdGame.encodeUrl(src) + "&cliId=" + HdGame.encodeUrl(g_config.openId),
            })
        }
    };
    HdGame.bindGolocation = function(option) {
        if (_manage) {
            return
        }
        var _def = {
            pointData: {
                province: "北京",
                city: "北京",
                county: "",
                address: "",
                point: '{"lat":39.91485,"lng":116.403765}'
            },
            isOperation: false,
            bindBtn: null,
            success: function() {},
            fail: function() {
                HdGame.showMsg("当前微信版本不支持定位或没开启定位服务，请联系活动主办单位")
            }
        };
        option = $.extend(true, _def, option);
        HdGame.tlog("bindGolocation option", option);
        var guideMap = function() {
            var addRess = "";
            $.forEach(["province", "city", "county", "address"],
            function(value) {
                if (option[value]) {
                    addRess += option[value]
                }
            });
            var point = option.point;
            var that = this;
            wx.ready(wx.openLocation({
                latitude: point.lat,
                longitude: point.lng,
                name: option.address,
                address: addRess,
                scale: 22,
                success: function(res) {
                    option.success.call(that, res, option)
                },
                fail: function(res) {
                    HdGame.tlog("res=" + res);
                    option.fail.call(that, res, option)
                }
            }))
        };
        if (!option.isOperation) {
            if (option.bindBtn && option.bindBtn.length > 0) {
                option.bindBtn.off("click.guideMap").on("click.guideMap",
                function() {
                    guideMap.call($(this))
                })
            } else {
                console.warn("bindBtn can't be null or undefined ")
            }
        } else {
            guideMap.call(option.bindBtn)
        }
    };
    HdGame.checkAccessKeyLuckyDrawTotal = function(options) {
        options = $.extend({},
        options);
        return $.Deferred(function(defer) {
            $.ajax({
                type: "post",
                url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=getLuckyDrawTotal",
                data: {
                    gameId: g_config.gameId,
                    openId: g_config.openId
                },
                dataType: "json",
                success: function(result) {
                    var msg = result.msg || "系统繁忙，请稍后重试";
                    if (result.rt) {
                        HdGame.showMsgToast2({
                            bodyMsg: msg
                        });
                        defer.reject();
                        console.log(defer.state());
                        return
                    }
                    if (result.total > 0) {
                        defer.resolve()
                    } else {
                        HdGame.otherAjaxComplete();
                        HdGame.hideLoadToast();
                        if (options.notLuckyDrawTotal) {
                            options.notLuckyDrawTotal()
                        }
                        HdGame.showAccessKeyPopup({
                            title: g_config.accesspopuptitle,
                            callback: function() {
                                defer.resolve()
                            }
                        })
                    }
                },
                error: defer.reject
            })
        })
    };
    HdGame.showForcedAttPoup = function(options) {
        options = $.extend({},
        options);
        var showPoup = options.showPoup;
        HdGame.tlog("g_config.ishasAttentiosThisAPP: ", g_config.ishasAttentiosThisAPP);
        HdGame.tlog("g_config.$isFollowWx: ", g_config.$isFollowWx);
        return $.Deferred(function(defer) {
            function showQrcodePoup() {
                $("#attentionPrev").hide();
                $("#strongAttion").off("touchend").on("touchend",
                function(event) {
                    event.preventDefault();
                    event.stopPropagation()
                });
                $("#strongAttionBgMark").show().off("touchend").on("touchend",
                function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    $("#strongAttionBgMark, #strongAttentionTips").hide()
                });
                $("#iamfans").off("touchend").on("touchend",
                function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    HdGame.getIsHasAttention().then(function(result) {
                        var data = result.data;
                        if (data.type == 2) {
                            if (data.isAttention) {
                                $("#strongAttionBgMark, #strongAttentionTips").hide();
                                g_config.$isFollowWx = true;
                                defer.resolve()
                            } else {
                                $("#strongAttentionTips").show()
                            }
                        } else {
                            $("#attentionPrev").show().off("touchend").on("touchend",
                            function(event) {
                                event.preventDefault();
                                event.stopPropagation()
                            }).find(".iKnow").one({
                                touchend: function() {
                                    $(this).removeClass("touchIng");
                                    $("#attentionPrev").hide();
                                    $("#attentionCur").show()
                                },
                                touchstart: function() {
                                    $(this).addClass("touchIng")
                                }
                            });
                            $("#attentionCur, #strongAttentionTips").hide()
                        }
                    })
                });
                $("#attentionCur").show();
                if (showPoup) {
                    showPoup()
                }
            }
            if (typeof g_config.$isFollowWx !== "undefined") {
                if (!g_config.$isFollowWx) {
                    showQrcodePoup();
                    return
                }
                return defer.resolve()
            }
            if (g_config.ishasAttentiosThisAPP) {
                if (g_config.hasWXAuth) {
                    HdGame.getIsHasAttention(null, true).then(function(result) {
                        var data = result.data;
                        if (data.type === 2 && data.isAttention) {
                            g_config.$isFollowWx = true;
                            return defer.resolve()
                        }
                        g_config.$isFollowWx = false;
                        showQrcodePoup()
                    }).fail(defer.reject)
                } else {
                    g_config.$isFollowWx = false;
                    showQrcodePoup()
                }
                return
            }
            return defer.resolve()
        })
    };
    HdGame.sendQuestionGameReq = function(req_Type, isManage, playerAnswer, sign, titleIndex) {
        return $.Deferred(function(defer) {
            if (!g_config.openNew_Qt) {
                defer.resolve()
            } else {
                if (req_Type == "check") {
                    var allAnswerList_New = [];
                    if (typeof sign == "undefined") {
                        allAnswerList_New = g_config.qtInfoParam.allAnswerList
                    } else {
                        if (typeof sign == "string") {
                            var list = {};
                            list.answer = playerAnswer;
                            list.sign = sign;
                            allAnswerList_New.push(list)
                        } else {
                            if (typeof sign == "object") {
                                for (var i = 0; i < sign.length; i++) {
                                    var list = {};
                                    list.answer = $.parseJSON(playerAnswer)[i];
                                    list.sign = sign[i];
                                    allAnswerList_New.push(list)
                                }
                            }
                        }
                    }
                    g_config.qtInfoParam.allAnswerList = allAnswerList_New
                }
                var questionObj = {
                    aid: g_config.aid,
                    gameId: g_config.gameId,
                    req_Type: req_Type,
                    isManage: isManage,
                    titleIndex: titleIndex,
                    playerAnswer: playerAnswer,
                    qtInfoParam: g_config.qtInfoParam
                };
                $.ajax({
                    type: "post",
                    url: g_config.ajaxUrl + "hdgame_h.jsp?cmd=qtGame_Req",
                    data: {
                        questionObj: $.toJSON(questionObj)
                    },
                    error: function() {
                        HdGame.showMsg("网络繁忙，请刷新重试")
                    },
                    success: function(data) {
                        var result = $.parseJSON(data);
                        if (result.success) {
                            if (req_Type == "get") {
                                g_config.qtInfoParam.exposure_QtList = g_config.qtInfoParam.exposure_QtList ? g_config.qtInfoParam.exposure_QtList: [];
                                g_config.qtInfoParam.exposure_QtList.push(result.data.titleIndex);
                                g_config.qtInfoParam.moreAnswer = result.data.moreAnswer;
                                g_config.qtInfoParam.allAnswerList = result.data.allAnswerList
                            }
                            if (req_Type == "check" && !$.isEmptyObject(result.data.score_Qt)) {
                                if ($.isEmptyObject(g_config.qtInfoParam.score_Qt)) {
                                    g_config.qtInfoParam.score_Qt = result.data.score_Qt
                                } else {
                                    if (result.data.score_Qt.score >= g_config.qtInfoParam.score_Qt.score) {
                                        g_config.qtInfoParam.score_Qt = result.data.score_Qt
                                    }
                                }
                            }
                            g_config.qtInfoParam.playingAns = result.data.playingAns;
                            g_config.qtInfoParam.r_List = result.data.r_List;
                            defer.resolve(result.data)
                        } else {
                            HdGame.showMsg("系统错误")
                        }
                    }
                })
            }
        })
    };
    HdGame.isIphoneX_XS = function() {
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 812 && screen.width == 375)
    };
    HdGame.isIphoneXR_XSMax = function() {
        return /iphone/gi.test(navigator.userAgent) && (screen.height == 896 && screen.width == 414)
    };
    HdGame.isFullScreen_Phone = function() {
        return HdGame.isIphoneX_XS() || HdGame.isIphoneXR_XSMax()
    }
})(HdGame);
var PlayInfo = (function() {
    var h = 0;
    var d = 0;
    var a = 5;
    var k = a;
    var b = 10;
    var n = false;
    var p = {
        show: false
    };
    function q(x, w, v, s, u, t) {
        h = x;
        d = w;
        a = v;
        k = s;
        b = u;
        n = t;
        p.show = t;
        r()
    }
    function e() {
        var t = a - h;
        var s = c();
        if (t > s) {
            t = s
        }
        if (t < 0) {
            t = 0
        }
        return t
    }
    function c() {
        if (!n) {
            return 100
        }
        var s = b - d;
        return s > 0 ? s: 0
    }
    function m(s) {
        h += s;
        d += s;
        r()
    }
    function j(s) {
        a += s;
        b += s;
        r()
    }
    function f(s) {
        a = s;
        r()
    }
    function l(s) {
        k = s;
        r()
    }
    function g(s) {
        b = s;
        r()
    }
    function o(s) {
        n = s;
        p.show = s;
        r()
    }
    function r() {
        $(".todayPlayCount").text(e());
        $(".totalPlayCount").text(c());
        $(".playTimesLimit").text(a);
        $(".playTimesLimitShow").text(k);
        $(".playTotalLimit").text(b);
        if (n) {
            $(".dayPlayHint").hide();
            $(".totalPlayHint").show();
            $(".dayPlayHint4Total").show();
            $(".playTotalFont").show()
        } else {
            $(".dayPlayHint").show();
            $(".totalPlayHint").hide();
            $(".dayPlayHint4Total").hide();
            $(".playTotalFont").hide()
        }
    }
    return {
        isLimitPlay: p,
        initData: q,
        getTodayRemainTimes: e,
        getTotalRemainTimes: c,
        addPlayTimes: m,
        addPlayTimesLimit: j,
        setPlayTimesLimit: f,
        setPlayTimesLimitShow: l,
        setPlayTotalLimit: g,
        setLimitPlay: o
    }
})();