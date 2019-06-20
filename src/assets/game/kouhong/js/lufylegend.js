var LF = LF || {}; (function(N, ae) {
    var U = "pc",
    F = "iPhone",
    x = "iPod",
    ag = "iPad",
    ap = "Android",
    O = "Windows Phone",
    ah = "BlackBerry",
    Y = "none",
    T = "undefined",
    l = "landscape",
    r = "portrait",
    ak = "__LF__pixel__ratio__",
    ab, Z;
    function ar(au) {
        this.eventType = au;
        this._ll_preventDefault = false
    }
    ar.prototype.preventDefault = function() {
        this._ll_preventDefault = true
    };
    ar.INIT = "init";
    ar.COMPLETE = "complete";
    ar.ENTER_FRAME = "enter_frame";
    ar.WINDOW_RESIZE = "resize";
    ar.WINDOW_ORIENTATIONCHANGE = "orientationchange";
    ar.SOUND_COMPLETE = "sound_complete";
    ar.END_CONTACT = "endContact";
    ar.PRE_SOLVE = "preSolve";
    ar.POST_SOLVE = "postSolve";
    ar.BEGIN_CONTACT = "beginContact";
    ar.addEventListener = function(ax, av, aw, au) {
        if (au == null) {
            au = false
        }
        if (ax.addEventListener) {
            ax.addEventListener(av, aw, au)
        } else {
            if (ax.attachEvent) {
                ax["e" + av + aw] = aw;
                ax[av + aw] = function() {
                    ax["e" + av + aw]()
                };
                ax.attachEvent("on" + av, ax[av + aw])
            }
        }
    };
    ar.removeEventListener = function(ax, av, aw, au) {
        if (au == null) {
            au = false
        }
        if (ax.removeEventListener) {
            ax.removeEventListener(av, aw, au)
        } else {
            if (ax.detachEvent) {
                ax["e" + av + aw] = aw;
                ax[av + aw] = function() {
                    ax["e" + av + aw]()
                };
                ax.detachEvent("on" + av, ax[av + aw])
            }
        }
    };
    var af = function() {
        throw "LMouseEvent cannot be instantiated"
    };
    af.MOUSE_DOWN = "mousedown";
    af.MOUSE_UP = "mouseup";
    af.TOUCH_START = "touchstart";
    af.TOUCH_MOVE = "touchmove";
    af.TOUCH_END = "touchend";
    af.MOUSE_MOVE = "mousemove";
    af.MOUSE_OVER = "mouseover";
    af.MOUSE_OUT = "mouseout";
    af.DOUBLE_CLICK = "dblclick";
    var a = function() {
        throw "LMultitouchInputMode cannot be instantiated"
    };
    a.NONE = "none";
    a.GESTURE = "gesture";
    a.TOUCH_POINT = "touchPoint";
    var ai = function() {
        throw "LMultitouch cannot be instantiated"
    };
    ai.inputMode = "none";
    ai.touchs = [];
    var k = function() {
        throw "LFocusEvent cannot be instantiated"
    };
    k.FOCUS_IN = "focusIn";
    k.FOCUS_OUT = "focusOut";
    var ad = (function() {
        function au() {
            var av = this;
            av.container = {};
            av.dispatchAllEvent = false;
            av.mouseDownContainer = [];
            av.mouseUpContainer = [];
            av.mouseMoveContainer = [];
            av.mouseOverContainer = [];
            av.mouseOutContainer = [];
            av.mouseDblContainer = [];
            av.textFieldInputContainer = [];
            av.buttonContainer = []
        }
        au.prototype = {
            pushInputBox: function(ay) {
                var ax = this,
                az = ax.textFieldInputContainer,
                aw, av;
                for (aw = 0, av = az.length; aw < av; aw++) {
                    if (ay.objectIndex == az[aw].objectIndex) {
                        return
                    }
                }
                ax.textFieldInputContainer.push(ay)
            },
            removeInputBox: function(ay) {
                var ax = this,
                az = ax.textFieldInputContainer,
                aw, av;
                for (aw = 0, av = az.length; aw < av; aw++) {
                    if (ay.objectIndex == az[aw].objectIndex) {
                        ax.textFieldInputContainer.splice(aw, 1);
                        break
                    }
                }
            },
            pushButton: function(ay) {
                var ax = this,
                az = ax.buttonContainer,
                aw, av;
                for (aw = 0, av = az.length; aw < av; aw++) {
                    if (ay.objectIndex == az[aw].objectIndex) {
                        return
                    }
                }
                ax.buttonContainer.push(ay)
            },
            removeButton: function(ay) {
                var ax = this,
                az = ax.buttonContainer,
                aw, av;
                for (aw = 0, av = az.length; aw < av; aw++) {
                    if (ay.objectIndex == az[aw].objectIndex) {
                        ax.buttonContainer.splice(aw, 1);
                        break
                    }
                }
            },
            dispatchEventButton: function(ay) {
                var ax = this,
                az = ax.buttonContainer,
                aw, av;
                for (aw = 0, av = az.length; aw < av; aw++) {
                    if (typeof ax.buttonContainer[aw].ll_button_mode == "") {
                        ax.buttonContainer[aw].ll_button_mode(ay)
                    }
                }
            },
            addEvent: function(ay, ax, aw) {
                var av = this;
                ax.push({
                    container: ay,
                    listener: aw
                })
            },
            removeEvent: function(aA, az, ay) {
                var ax = this,
                aw, av;
                for (aw = 0, av = az.length; aw < av; aw++) {
                    if (az[aw].container.objectIndex === aA.objectIndex && (!ay || az[aw].listener == ay)) {
                        az.splice(aw, 1);
                        break
                    }
                }
            },
            addMouseDownEvent: function(ax, aw) {
                var av = this;
                av.addEvent(ax, av.mouseDownContainer, aw)
            },
            addMouseUpEvent: function(ax, aw) {
                var av = this;
                av.addEvent(ax, av.mouseUpContainer, aw)
            },
            addMouseMoveEvent: function(ax, aw) {
                var av = this;
                av.addEvent(ax, av.mouseMoveContainer, aw)
            },
            addMouseOverEvent: function(ax, aw) {
                var av = this;
                av.addEvent(ax, av.mouseOverContainer, aw)
            },
            addMouseOutEvent: function(ax, aw) {
                var av = this;
                av.addEvent(ax, av.mouseOutContainer, aw)
            },
            addMouseDblEvent: function(ax, aw) {
                var av = this;
                av.addEvent(ax, av.mouseDblContainer, aw)
            },
            addMouseEvent: function(ay, av, ax) {
                var aw = this;
                if (av == af.MOUSE_DOWN) {
                    aw.addMouseDownEvent(ay, ax)
                } else {
                    if (av == af.MOUSE_UP) {
                        aw.addMouseUpEvent(ay, ax)
                    } else {
                        if (av == af.MOUSE_OVER) {
                            aw.addMouseOverEvent(ay, ax)
                        } else {
                            if (av == af.MOUSE_OUT) {
                                aw.addMouseOutEvent(ay, ax)
                            } else {
                                if (av == af.MOUSE_MOVE) {
                                    aw.addMouseMoveEvent(ay, ax)
                                } else {
                                    aw.addMouseDblEvent(ay, ax)
                                }
                            }
                        }
                    }
                }
            },
            hasEventListener: function(aB, ax, aA) {
                var ay = this,
                az;
                if (ax == af.MOUSE_DOWN) {
                    az = ay.mouseDownContainer
                } else {
                    if (ax == af.MOUSE_UP) {
                        az = ay.mouseUpContainer
                    } else {
                        if (ax == af.MOUSE_OVER) {
                            az = ay.mouseOverContainer
                        } else {
                            if (ax == af.MOUSE_OUT) {
                                az = ay.mouseOutContainer
                            } else {
                                if (ax == af.MOUSE_MOVE) {
                                    az = ay.mouseMoveContainer
                                } else {
                                    az = ay.mouseDblContainer
                                }
                            }
                        }
                    }
                }
                for (var aw = 0,
                av = az.length; aw < av; aw++) {
                    if (az[aw].container.objectIndex === aB.objectIndex && (!aA || az[aw].listener == aA)) {
                        return true
                    }
                }
                return false
            },
            removeMouseDownEvent: function(ax, aw) {
                var av = this;
                av.removeEvent(ax, av.mouseDownContainer, aw)
            },
            removeMouseUpEvent: function(ax, aw) {
                var av = this;
                av.removeEvent(ax, av.mouseUpContainer, aw)
            },
            removeMouseMoveEvent: function(ax, aw) {
                var av = this;
                av.removeEvent(ax, av.mouseMoveContainer, aw)
            },
            removeMouseOverEvent: function(ax, aw) {
                var av = this;
                av.removeEvent(ax, av.mouseOverContainer, aw)
            },
            removeMouseOutEvent: function(ax, aw) {
                var av = this;
                av.removeEvent(ax, av.mouseOutContainer, aw)
            },
            removeMouseDblEvent: function(ax, aw) {
                var av = this;
                av.removeEvent(ax, av.mouseDblContainer, aw)
            },
            removeMouseEvent: function(ay, av, ax) {
                var aw = this;
                if (av == af.MOUSE_DOWN) {
                    aw.removeMouseDownEvent(ay, ax)
                } else {
                    if (av == af.MOUSE_UP) {
                        aw.removeMouseUpEvent(ay, ax)
                    } else {
                        if (av == af.MOUSE_OVER) {
                            aw.removeMouseOverEvent(ay, ax)
                        } else {
                            if (av == af.MOUSE_OUT) {
                                aw.removeMouseOutEvent(ay, ax)
                            } else {
                                if (av == af.MOUSE_MOVE) {
                                    aw.removeMouseMoveEvent(ay, ax)
                                } else {
                                    aw.removeMouseDblEvent(ay, ax)
                                }
                            }
                        }
                    }
                }
            },
            dispatchMouseEvent: function(ax, aw) {
                var av = this;
                if (aw == af.MOUSE_DOWN) {
                    av.dispatchEvent(ax, av.mouseDownContainer, af.MOUSE_DOWN);
                    av.dispatchEvent(ax, av.textFieldInputContainer)
                } else {
                    if (aw == af.MOUSE_UP) {
                        av.dispatchEvent(ax, av.mouseUpContainer, af.MOUSE_UP)
                    } else {
                        if (aw == af.DOUBLE_CLICK) {
                            av.dispatchEvent(ax, av.mouseDblContainer, af.DOUBLE_CLICK)
                        } else {
                            av.dispatchEventButton(ax);
                            av.dispatchEvent(ax, av.mouseOutContainer, af.MOUSE_OUT);
                            av.dispatchEvent(ax, av.mouseOverContainer, af.MOUSE_OVER);
                            av.dispatchEvent(ax, av.mouseMoveContainer, af.MOUSE_MOVE)
                        }
                    }
                }
            },
            getRootParams: function(av) {
                var ax = av.parent,
                aw = {
                    x: 0,
                    y: 0,
                    scaleX: 1,
                    scaleY: 1
                };
                while (ax && ax != "root") {
                    aw.x *= ax.scaleX;
                    aw.y *= ax.scaleY;
                    aw.x += ax.x;
                    aw.y += ax.y;
                    aw.scaleX *= ax.scaleX;
                    aw.scaleY *= ax.scaleY;
                    ax = ax.parent
                }
                return aw
            },
            _mouseEnabled: function(aw) {
                var av = this;
                if (!aw || !aw.parent) {
                    return false
                }
                if (!aw.visible || (typeof aw.mouseEnabled != T && !aw.mouseEnabled)) {
                    return false
                }
                var ax = aw.parent;
                while (ax && ax != "root") {
                    if (!ax.mouseEnabled || !ax.mouseChildren || !ax.visible) {
                        return false
                    }
                    ax = ax.parent;
                    if (!ax) {
                        return false
                    }
                }
                return true
            },
            _dispatchEvent: function(av, aB, aD, aA, aC, az) {
                var aE = this,
                ay, ax, aw = aD.length;
                for (ay = aC; ay <= az && ay < aw; ay++) {
                    o = aD[ay];
                    if (o.sp.objectIndex != aA) {
                        continue
                    }
                    av.currentTarget = av.clickTarget = o.sp;
                    if (!av.target) {
                        av.target = o.sp
                    }
                    av.event_type = aB;
                    av.selfX = (av.offsetX - o.co.x - o.sp.x) / (o.co.scaleX * o.sp.scaleX);
                    av.selfY = (av.offsetY - o.co.y - o.sp.y) / (o.co.scaleY * o.sp.scaleY);
                    o.listener(av, o.sp)
                }
            },
            dispatchEvent: function(av, aB, aC) {
                var aF = this,
                ax, aD, aE = [],
                ay,
                aA,
                az;
                for (aA = 0, az = aB.length; aA < az; aA++) {
                    ax = aB[aA].container || aB[aA];
                    if (!aF._mouseEnabled(ax)) {
                        continue
                    }
                    aD = aF.getRootParams(ax);
                    if (!aC && ax.mouseEvent) {
                        ax.mouseEvent(av, af.MOUSE_DOWN, aD);
                        continue
                    }
                    if (ax.ismouseon(av, aD)) {
                        if (aC == af.MOUSE_OUT) {
                            continue
                        }
                        if (aC == af.MOUSE_OVER) {
                            if (ax.ll_mousein) {
                                continue
                            }
                        }
                        if (aC != af.MOUSE_UP) {
                            ax.ll_mousein = true
                        }
                        aE.push({
                            sp: ax,
                            co: aD,
                            listener: aB[aA].listener
                        })
                    } else {
                        if (aC != af.MOUSE_OUT && aC != af.MOUSE_OVER) {
                            continue
                        }
                        if (!ax.ll_mousein) {
                            continue
                        }
                        ax.ll_mousein = false;
                        aE.push({
                            sp: ax,
                            co: aD,
                            listener: aB[aA].listener
                        })
                    }
                }
                if (aE.length == 0) {
                    return
                }
                if (aE.length > 1) {
                    aE = aE.sort(aF._sort.bind(aF))
                }
                az = aE.length;
                for (aA = 0; aA < az; aA++) {
                    ay = aE[aA];
                    aF._dispatchEvent(av, aC, aE, ay.sp.objectIndex, aA, aF.dispatchAllEvent ? az - 1 : aA);
                    if (aA < aE.length - 1 && ay.sp.objectIndex == aE[aA + 1].sp.objectIndex) {
                        aE.splice(aA, 1);
                        aA--;
                        continue
                    }
                    var aw;
                    while (true) {
                        if (!aw) {
                            aw = ay.sp.parent;
                            av.target = ay.sp
                        }
                        if (!aw || aw == "root") {
                            break
                        }
                        aF._dispatchEvent(av, aC, aE, aw.objectIndex, aA + 1, az);
                        av.target = aw;
                        aw = aw.parent;
                        if (!aw || aw == "root") {
                            break
                        }
                    }
                    if (!aF.dispatchAllEvent) {
                        break
                    } else {
                        continue
                    }
                }
            },
            set: function(aw, av) {
                this.container[aw] = av
            },
            _sort: function(aD, aC) {
                var aE = this,
                ay, aw, aB = aE._getSort(aD.sp),
                av = aE._getSort(aC.sp),
                aA,
                az,
                ax;
                for (aA = 0, az = aB.length, ax = av.length; aA < az && aA < ax; aA++) {
                    ay = aB[aA];
                    aw = av[aA];
                    if (ay.objectIndex == aw.objectIndex) {
                        continue
                    }
                    return aw.parent.getChildIndex(aw) - ay.parent.getChildIndex(ay)
                }
                return av.length - aB.length
            },
            _getSort: function(av) {
                var ax = av.parent,
                aw = [av];
                while (ax && ax != "root") {
                    aw.unshift(ax);
                    ax = ax.parent
                }
                return aw
            }
        };
        return new au()
    })();
    var j = function() {
        throw "LKeyboardEvent cannot be instantiated"
    };
    j.KEY_DOWN = "keydown";
    j.KEY_UP = "keyup";
    j.KEY_PRESS = "keypress";
    var B = function() {
        throw "LAccelerometerEvent cannot be instantiated"
    };
    B.DEVICEMOTION = "devicemotion";
    function J() {
        throw "LStageAlign cannot be instantiated"
    }
    J.TOP = "T";
    J.BOTTOM = "B";
    J.LEFT = "L";
    J.RIGHT = "Re";
    J.TOP_LEFT = "TL";
    J.TOP_RIGHT = "TR";
    J.TOP_MIDDLE = "TM";
    J.BOTTOM_LEFT = "BL";
    J.BOTTOM_RIGHT = "BR";
    J.BOTTOM_MIDDLE = "BM";
    J.MIDDLE = "M";
    function c() {
        throw "LStageScaleMode cannot be instantiated"
    }
    c.EXACT_FIT = "exactFit";
    c.SHOW_ALL = "showAll";
    c.NO_BORDER = "noBorder";
    c.NO_SCALE = "noScale";
    var ac = (function() {
        function au() {
            throw "LGlobal cannot be instantiated"
        }
        au.FULL_SCREEN = "full_screen";
        au.traceDebug = false;
        au.displayState = Y;
        au.aspectRatio = Y;
        au.canvasObj = null;
        au.canvas = null;
        au.webAudio = true;
        au.objectIndex = 1;
        au.stage = null;
        au.width = 0;
        au.height = 0;
        au.box2d = null;
        au.speed = 50;
        au.IS_MOUSE_DOWN = false;
        au.stopPropagation = false;
        au.preventDefault = true;
        au.childList = new Array();
        au.dragList = new Array();
        au.excludingContainer = new Array();
        au.fpsStatus = null;
        au.stageScale = "noScale";
        au.align = "M";
        au.mobile = false;
        au.canTouch = false;
        au.os = U;
        au.ios = false;
        au.android = false;
        au.android_new = false;
        au.backgroundColor = null;
        au.destroy = true;
        au.forceRefresh = false;
        au.ratio = ae.devicePixelRatio || 1;
        au.startTimer = 0;
        au.keepClear = true;
        au.top = 0;
        au.left = 0;
        au.window = ae;
        au.pauseLoop = false;
        au._setPauseLoopTrue = false;
        au.setPauseLoop = function(aw, av) {
            if (aw && av) {
                au._setPauseLoopTrue = true
            } else {
                au.pauseLoop = aw;
                au._setPauseLoopTrue = false
            }
        }; (function(aw) {
            au.isOldFirefox = (function(ay) {
                var az = ay.toLowerCase().indexOf("firefox");
                if (az < 0) {
                    return false
                }
                var ax = ay.substring(az + 8, ay.length);
                return parseFloat(ax) < 39
            })(aw);
            if (aw.indexOf(F) > 0) {
                au.os = F;
                au.canTouch = true;
                au.ios = true
            } else {
                if (aw.indexOf(x) > 0) {
                    au.os = x;
                    au.canTouch = true;
                    au.ios = true
                } else {
                    if (aw.indexOf(ag) > 0) {
                        au.os = ag;
                        au.ios = true;
                        au.canTouch = true
                    } else {
                        if (aw.indexOf(ap) > 0) {
                            au.os = ap;
                            au.canTouch = true;
                            au.android = true;
                            var av = aw.indexOf(ap);
                            if (parseInt(aw.substr(av + 8, 1)) > 3) {
                                au.android_new = true
                            }
                        } else {
                            if (aw.indexOf(O) > 0) {
                                au.os = O;
                                au.canTouch = true
                            } else {
                                if (aw.indexOf(ah) > 0) {
                                    au.os = ah;
                                    au.canTouch = true
                                }
                            }
                        }
                    }
                }
            }
            au.mobile = au.canTouch
        })(navigator.userAgent);
        au.requestAnimFrame = function() {
            return ae.requestAnimationFrame || ae.webkitRequestAnimationFrame || ae.mozRequestAnimationFrame || ae.oRequestAnimationFrame || ae.msRequestAnimationFrame ||
            function(av) {
                ae.setTimeout(av, 1000 / 60, (new Date).getTime())
            }
        } ();
        au.setDebug = function(av) {
            au.traceDebug = av
        };
        au.setCanvas = function(ax, av, aw) {
            au.ll_createCanvas(ax, av, aw);
            au.ll_createStage();
            if (au.displayState == t.FULL_SCREEN) {
                au.resize()
            } else {
                if (typeof au.displayState == "number") {
                    au.resize(au.width * au.displayState, au.height * au.displayState)
                }
            }
            if (au.notMouseEvent) {
                return
            }
            if (au.canTouch) {
                au.ll_clicks = 0;
                au.ll_prev_clickTime = 0;
                ar.addEventListener(au.canvasObj, af.TOUCH_START, au.ll_touchStart);
                ar.addEventListener(au.canvasObj, af.TOUCH_END, au.ll_touchEnd);
                ar.addEventListener(au.canvasObj, af.TOUCH_MOVE, au.ll_touchMove)
            }
        };
        au.ll_createCanvas = function(az, av, aw) {
            au.id = az;
            au.object = document.getElementById(az);
            av = av || $(au.object).innerWidth();
            aw = aw || $(au.object).innerHeight();
            au.object.innerHTML = '<div style="position:absolute;margin:0;padding:0;overflow:visible;-webkit-transform: translateZ(0);z-index:0;"><canvas id="' + au.id + '_canvas" style="margin:0;padding:0;width:' + av + "px;height:" + aw + 'px;"><div id="noCanvas"><p>Hey there, it looks like you\'re using Microsoft\'s Internet Explorer. Microsoft hates the Web and doesn\'t support HTML5 :(</p></div></canvas></div><div id="' + au.id + '_InputText" style="position:absolute;margin:0;padding:0;z-index:10;display:none;"><textarea rows="1" id="' + au.id + '_InputTextareaBox" style="resize:none;background:transparent;border:0px;"></textarea><input type="text" id="' + au.id + '_InputTextBox"  style="background:transparent;border:0px;" /><input type="password" id="' + au.id + '_passwordBox"  style="background:transparent;border:0px;" /></div>';
            au.canvasObj = document.getElementById(au.id + "_canvas");
            au._canvas = document.createElement("canvas");
            au._context = au._canvas.getContext("2d");
            if (au._context) {
                au.canvasObj.innerHTML = ""
            }
            var ay = 1;
            try {
                ay = au._context.backingStorePixelRatio || au._context.webkitBackingStorePixelRatio || au._context.mozBackingStorePixelRatio || au._context.msBackingStorePixelRatio || au._context.oBackingStorePixelRatio || 1
            } catch(ax) {}
            au.ratio = (ae.devicePixelRatio || 1) / ay;
            if (av) {
                au.canvasObj.width = av
            }
            if (aw) {
                au.canvasObj.height = aw
            }
            au.width = au.canvasObj.width;
            au.height = au.canvasObj.height;
            au.canvasStyleWidth = au.width;
            au.canvasStyleHeight = au.height;
            au.canvas = au.canvasObj.getContext("2d");
            au.canvasObj.style.height = au.canvasObj.height + "px";
            au.canvasObj.style.width = au.canvasObj.width + "px";
            au.canvasObj.width *= au.ratio;
            au.canvasObj.height *= au.ratio;
            au.offsetX = ab = 0;
            au.offsetY = Z = 0
        };
        au.ll_createStage = function() {
            au.stage = new d();
            au.stage.parent = "root";
            au.childList.push(au.stage);
            au.stage.baseAddEvent = au.stage.addEventListener;
            au.stage.baseRemoveEvent = au.stage.removeEventListener;
            au.stage.addEventListener = function(av, aw) {
                if (av == ar.WINDOW_RESIZE || av == ar.WINDOW_ORIENTATIONCHANGE) {
                    if (av == ar.WINDOW_RESIZE) {
                        au.stage.onresizeListener = aw
                    } else {
                        au.stage.onorientationchangeListener = aw
                    }
                    if (!au.stage.onresize) {
                        au.stage.onresize = function(ax) {
                            au.stage.onresizeEvent = ax
                        };
                        ar.addEventListener(au.window, av, au.stage.onresize)
                    }
                } else {
                    if (av == j.KEY_DOWN || av == j.KEY_UP || av == j.KEY_PRESS) {
                        ar.addEventListener(au.window, av, aw)
                    } else {
                        au.stage.baseAddEvent(av, aw)
                    }
                }
            };
            au.stage.removeEventListener = function(av, aw) {
                if (av == ar.WINDOW_RESIZE || av == ar.WINDOW_ORIENTATIONCHANGE) {
                    if (av == ar.WINDOW_RESIZE) {
                        delete au.stage.onresizeListener;
                        if (au.stage.onorientationchangeListener) {
                            return
                        }
                    } else {
                        delete au.stage.onorientationchangeListener;
                        if (au.stage.onresizeListener) {
                            return
                        }
                    }
                    ar.removeEventListener(au.window, ar.WINDOW_RESIZE, au.stage.onresize);
                    delete au.stage.onresize
                } else {
                    if (av == j.KEY_DOWN || av == j.KEY_UP || av == j.KEY_PRESS) {
                        ar.removeEventListener(au.window, av, aw)
                    } else {
                        au.stage.baseRemoveEvent(av, aw)
                    }
                }
            };
            au.innerWidth = ae.innerWidth;
            au.innerHeight = ae.innerHeight;
            ar.addEventListener(au.window, "blur",
            function() {
                au.stage.dispatchEvent(new ar(k.FOCUS_OUT))
            })
        };
        au.ll_touchStart = function(av) {
            au._outStageCheckCount = 1;
            au.IS_MOUSE_DOWN = true;
            au.stage.dispatchEvent(new ar(k.FOCUS_IN));
            var aC, aA, aD, az, aB;
            aC = parseInt(0 + au.object.style.left) + parseInt(au.canvasObj.style.marginLeft);
            aA = parseInt(0 + au.object.style.top) + parseInt(au.canvasObj.style.marginTop);
            if (ai.inputMode == a.NONE) {
                aD = au.ll_touchStartEvent(av, 0, aC, aA)
            } else {
                if (ai.inputMode == a.TOUCH_POINT) {
                    for (var aB = 0,
                    ay = av.touches.length; aB < ay; aB++) {
                        if (!ai.touchs["touch" + av.touches[aB].identifier]) {
                            aD = au.ll_touchStartEvent(av, aB, aC, aA)
                        }
                    }
                }
            }
            var ax = new Date();
            var aw = ax.getTime();
            au.ll_clicks = (aw <= (au.ll_prev_clickTime + 500)) ? (au.ll_clicks + 1) : 1;
            au.ll_prev_clickTime = aw;
            if (au.ll_clicks === 2) {
                au.mouseEvent(aD, af.DOUBLE_CLICK);
                au.ll_clicks = 0
            }
            if (au.mouseJoint_start) {
                au.mouseJoint_start(aD)
            }
            au.touchHandler(av)
        };
        au.ll_touchStartEvent = function(ay, az, aw, av) {
            var ax = {
                offsetX: (ay.touches[az].pageX - aw),
                offsetY: (ay.touches[az].pageY - av),
                touchPointID: ay.touches[az].identifier
            };
            ax.offsetX = au.ll_scaleX(ax.offsetX);
            ax.offsetY = au.ll_scaleY(ax.offsetY);
            ab = au.offsetX = ax.offsetX;
            Z = au.offsetY = ax.offsetY;
            ai.touchs["touch" + ax.touchPointID] = ax;
            au.mouseEvent(ax, af.MOUSE_DOWN);
            au.buttonStatusEvent = ax;
            return ax
        };
        au.ll_touchEnd = function(aA) {
            var aB, az, aw, ax, av, ay;
            au.IS_MOUSE_DOWN = false;
            if (ai.inputMode == a.TOUCH_POINT) {
                for (aw in ai.touchs) {
                    aB = ai.touchs[aw];
                    ay = false;
                    for (ax = 0, av = aA.touches.length; ax < av; ax++) {
                        if (aA.touches[ax].identifier == aB.touchPointID) {
                            ay = true;
                            break
                        }
                    }
                    if (!ay) {
                        az = aB;
                        delete ai.touchs[aw];
                        au.mouseEvent(az, af.MOUSE_UP)
                    }
                }
            }
            if (!az) {
                az = {
                    offsetX: au.offsetX,
                    offsetY: au.offsetY
                }
            }
            au.mouseEvent(az, af.MOUSE_UP);
            au.touchHandler(aA);
            au.buttonStatusEvent = null;
            if (au.mouseJoint_end) {
                au.mouseJoint_end()
            }
            au.stage.dispatchEvent(new ar(k.FOCUS_OUT))
        };
        au.ll_touchMove = function(ay) {
            var aA, az, aw, av, ax = ay.touches.length;
            aA = parseInt(0 + au.object.style.left) + parseInt(au.canvasObj.style.marginLeft);
            az = parseInt(0 + au.object.style.top) + parseInt(au.canvasObj.style.marginTop);
            if (ai.inputMode == a.NONE) {
                ax = 1
            }
            for (i = 0, av = ay.touches.length; i < av && i < ax; i++) {
                aw = {
                    offsetX: (ay.touches[i].pageX - aA),
                    offsetY: (ay.touches[i].pageY - az),
                    touchPointID: ay.touches[i].identifier
                };
                aw.offsetX = au.ll_scaleX(aw.offsetX);
                aw.offsetY = au.ll_scaleY(aw.offsetY);
                ab = au.offsetX = aw.offsetX;
                Z = au.offsetY = aw.offsetY;
                if (ai.touchs["touch" + aw.touchPointID] && ai.touchs["touch" + aw.touchPointID].offsetX == aw.offsetX && ai.touchs["touch" + aw.touchPointID].offsetY == aw.offsetY) {
                    continue
                }
                au.buttonStatusEvent = aw;
                ai.touchs["touch" + aw.touchPointID] = aw;
                if (aw.offsetX <= 0 || aw.offsetX >= au.innerWidth || aw.offsetX >= au.width || aw.offsetY <= 0 || aw.offsetY >= au.innerHeight || aw.offsetY >= au.height) {
                    au._outStageCheckCount = 0
                } else {
                    au._outStageCheckCount = 1
                }
                au.mouseEvent(aw, af.MOUSE_MOVE)
            }
            au.touchHandler(ay);
            if (au.mouseJoint_move) {
                au.mouseJoint_move(aw)
            }
        };
        au.touchHandler = function(av) {
            if (au.stopPropagation) {
                av.stopPropagation();
                if (av.stopImmediatePropagation) {
                    av.stopImmediatePropagation()
                }
            }
            if (au.preventDefault) {
                av.preventDefault()
            }
            return av
        };
        au.mouseEvent = function(ax, aw) {
            if (aw == af.MOUSE_MOVE) {
                au.dragHandler(ax)
            }
            if (ad.container[aw]) {
                ad.dispatchMouseEvent(ax, aw);
                return
            }
            for (var av = au.childList.length - 1; av >= 0; av--) {
                if (au.childList[av].mouseEvent && au.childList[av].mouseEvent(ax, aw)) {
                    break
                }
            }
        };
        au.dragHandler = function(ax) {
            var av, aw, az, ay = au.dragList;
            for (av = ay.length - 1; av >= 0; av--) {
                aw = ay[av];
                if (au.canTouch && aw.ll_touchPointID != ax.touchPointID) {
                    continue
                }
                az = aw.parent.globalToLocal(new S(ax.offsetX - aw.ll_dragMX + aw.ll_dragGlobalPoint.x, ax.offsetY - aw.ll_dragMY + aw.ll_dragGlobalPoint.y));
                aw.x = az.x;
                aw.y = az.y;
                if (aw.dragRange) {
                    if (aw.x < aw.dragRange.left) {
                        aw.x = aw.dragRange.left
                    } else {
                        if (aw.x > aw.dragRange.right) {
                            aw.x = aw.dragRange.right
                        }
                    }
                    if (aw.y < aw.dragRange.top) {
                        aw.y = aw.dragRange.top
                    } else {
                        if (aw.y > aw.dragRange.bottom) {
                            aw.y = aw.dragRange.bottom
                        }
                    }
                }
                break
            }
        };
        au.onShow = function() {
            if (au.pauseLoop) {
                return
            }
            if (au._setPauseLoopTrue) {
                au.pauseLoop = true;
                au._setPauseLoopTrue = false
            }
            hg.time && hg.time.updateInFrame(au.delta);
            if (au.canvas == null) {
                return
            }
            if (au._outStageCheckCount <= 0) {
                au._outStageCheckCount--;
                if (au._outStageCheckCount < -2) {
                    au.stage.dispatchEvent(new ar(k.FOCUS_OUT));
                    au._outStageCheckCount = 1
                }
            }
            if (au.fpsStatus) {
                au.fpsStatus.reset()
            }
            if (au.stage.onresizeEvent) {
                if (au.stage.onresizeListener) {
                    au.stage.onresizeListener(au.stage.onresizeEvent)
                }
                if (au.stage.onorientationchangeListener) {
                    au.stage.onorientationchangeListener({
                        orientation: (ae.innerWidth > ae.innerHeight ? l: r)
                    })
                }
                delete au.stage.onresizeEvent
            }
            if (au.forceRefresh) {
                au.canvasObj.width = au.canvasObj.width;
                au.forceRefresh = false
            }
            au.canvas.beginPath();
            if (au.box2d != null) {
                au.box2d.ll_show();
                if (!au.traceDebug && au.keepClear) {
                    au.canvas.clearRect(0, 0, au.width + 1, au.height + 1)
                }
            } else {
                if (au.keepClear) {
                    au.canvas.clearRect(0, 0, au.width + 1, au.height + 1)
                }
                if (au.backgroundColor !== null) {
                    au.canvas.fillStyle = au.backgroundColor;
                    au.canvas.fillRect(0, 0, au.width, au.height)
                }
            }
            au.show(au.childList);
            N.showTopBar()
        };
        au.show = function(ax) { ! ax && (ax = au.childList);
            for (var aw = 0,
            av = ax.length,
            ay; aw < av; aw++) {
                ay = ax[aw];
                if (ay && ay.ll_show) {
                    ay.ll_show();
                    if (ay._ll_removeFromSelf) {
                        aw--;
                        av--
                    }
                }
            }
        };
        au.divideCoordinate = function(aD, aB, aE, ax) {
            var aA, ay, az = aD / ax,
            aw = aB / aE,
            av = [],
            aC;
            for (aA = 0; aA < aE; aA++) {
                aC = [];
                for (ay = 0; ay < ax; ay++) {
                    aC.push({
                        x: az * ay,
                        y: aw * aA,
                        width: az,
                        height: aw
                    })
                }
                av.push(aC)
            }
            return av
        };
        au.divideList = function(aC, aB, aD, ax) {
            var aA, ay, az = aC / ax,
            aw = aB / aD,
            av = [];
            for (aA = 0; aA < aD; aA++) {
                for (ay = 0; ay < ax; ay++) {
                    av.push({
                        x: az * ay,
                        y: aw * aA,
                        width: az,
                        height: aw
                    })
                }
            }
            return av
        };
        au._create_loading_color = function() {
            var av = au.canvas.createRadialGradient(au.width / 2, au.height, 0, au.width / 2, 0, au.height);
            av.addColorStop(0, "red");
            av.addColorStop(0.3, "orange");
            av.addColorStop(0.4, "yellow");
            av.addColorStop(0.5, "green");
            av.addColorStop(0.8, "blue");
            av.addColorStop(1, "violet");
            return av
        };
        au.hitPolygon = function(aA, aD, aC) {
            var aB = 0,
            aF = aA[0],
            ay = (aD <= aF[0]),
            ax = (aC <= aF[1]),
            az,
            aw,
            aE,
            av,
            aG;
            for (az = 1, aw = aA.length; az < aw + 1; az++) {
                aE = aA[az % aw];
                av = (aD <= aE[0]);
                aG = (aC <= aE[1]);
                if (ax != aG) {
                    if (ay == av) {
                        if (ay) {
                            aB += (ax ? -1 : 1)
                        }
                    } else {
                        if (aD <= (aF[0] + (aE[0] - aF[0]) * (aC - aF[1]) / (aE[1] - aF[1]))) {
                            aB += (ax ? -1 : 1)
                        }
                    }
                }
                aF = aE;
                ay = av;
                ax = aG
            }
            return 0 != aB
        };
        au.hitTestPolygon = function(aF, aE) {
            var aA, az, ay, av, aD, aC, aB = [[aF, [], []], [aE, [], []]];
            for (az = 0; az < aB.length; az++) {
                av = aB[az][0],
                aD = aB[az][1];
                for (aA = 0, ay = av.length; aA < ay; aA++) {
                    aB[az][2].push(new aq(av[aA][0], av[aA][1]));
                    if (aA < ay - 1) {
                        aD.push((new aq(av[aA + 1][0] - av[aA][0], av[aA + 1][1] - av[aA][1])).normL())
                    }
                }
                aD.push((new aq(av[0][0] - av[ay - 1][0], av[0][1] - av[ay - 1][1])).normL())
            }
            for (az = 0; az < aB.length; az++) {
                aD = aB[az][1];
                for (aA = 0, ay = aD.length; aA < ay; aA++) {
                    var ax = aq.getMinMax(aB[0][2], aD[aA]);
                    var aw = aq.getMinMax(aB[1][2], aD[aA]);
                    if (ax.max_o < aw.min_o || ax.min_o > aw.max_o) {
                        return false
                    }
                }
            }
            return true
        };
        au.hitTestPolygonArc = function(aG, av) {
            if (au.hitPolygon(aG, av[0], av[1])) {
                return true
            }
            var aA, az, ay, aF, aE, aD, aC, aw, aB, ax;
            for (aA = 0, ay = aG.length; aA < ay; aA++) {
                az = aA < ay - 1 ? aA + 1 : 0;
                aF = aG[aA],
                aE = aG[az];
                aD = new aq(av[0] - aF[0], av[1] - aF[1]),
                aC = new aq(aE[0] - aF[0], aE[1] - aF[1]);
                ax = aC.normalize();
                aB = aq.dot(aD, ax);
                if (aB <= 0) {
                    if (aD.x * aD.x + aD.y * aD.y < av[3]) {
                        return true
                    }
                } else {
                    if (aB * aB < aC.x * aC.x + aC.y * aC.y) {
                        aw = aq.cross(aD, ax);
                        if (aw * aw < av[3]) {
                            return true
                        }
                    }
                }
            }
            return false
        };
        au.hitTestArc = function(aG, aE, aF, ax) {
            var aD = aG.getWidth() * 0.5,
            aB = aE.getWidth() * 0.5,
            az = aG._startX ? aG._startX() : aG.startX(),
            ay = aE._startX ? aE._startX() : aE.startX(),
            aw = aG._startY ? aG._startY() : aG.startY(),
            av = aE._startY ? aE._startY() : aE.startY();
            if (typeof aF != T) {
                az += (aD - aF);
                aw += (aD - aF);
                aD = aF
            }
            if (typeof ax != T) {
                ay += (aB - ax);
                av += (aB - ax);
                aB = ax
            }
            var aC = az + aD - ay - aB,
            aA = aw + aD - av - aB;
            return aC * aC + aA * aA < (aD + aB) * (aD + aB)
        };
        au.hitTestRect = function(aB, az, aI, aG) {
            var aE = aB.getWidth(),
            aD = az.getWidth(),
            aK = aB.getHeight(),
            aJ = az.getHeight(),
            ay = aB._startX ? aB._startX() : aB.startX(),
            ax = az._startX ? az._startX() : az.startX(),
            aw = aB._startY ? aB._startY() : aB.startY(),
            av = az._startY ? az._startY() : az.startY();
            if (typeof aI != T) {
                ay += (aE - aI[0]) * 0.5;
                aw += (aK - aI[1]) * 0.5;
                aE = aI[0];
                aK = aI[1]
            }
            if (typeof aG != T) {
                ax += (aD - aG[0]) * 0.5;
                av += (aJ - aG[1]) * 0.5;
                aD = aG[0];
                aJ = aG[1]
            }
            var aH = ay > ax ? ay: ax,
            aF = aw > av ? aw: av,
            aC = (ay + aE) > (ax + aD) ? (ax + aD) : (ay + aE),
            aA = (aw + aK) > (av + aJ) ? (av + aJ) : (aw + aK);
            return aH <= aC && aF <= aA
        };
        au.hitTest = au.hitTestRect;
        au.setFrameRate = function(av) {
            if (au.frameRate) {
                clearInterval(au.frameRate)
            }
            au.speed = av;
            au.frameRate = setInterval(function() {
                au.onShow()
            },
            av)
        };
        au.ll_scaleX = function(av) {
            return (av - au.left) * au.width / au.canvasStyleWidth
        };
        au.ll_scaleY = function(av) {
            return (av - au.top) * au.height / au.canvasStyleHeight
        };
        au.ll_setStageSize = function(av, aw) {
            av = Math.ceil(av);
            aw = Math.ceil(aw);
            au.canvasObj.style.width = av + "px";
            au.canvasObj.style.height = aw + "px";
            au.canvasStyleWidth = av;
            au.canvasStyleHeight = aw
        };
        au.resize = function(ay, aB) {
            var ax, aA, az = 0,
            aw = 0,
            aC = ae.innerWidth,
            av = ae.innerHeight;
            au.innerWidth = aC;
            au.innerHeight = av;
            if (ay) {
                ax = ay
            }
            if (aB) {
                aA = aB
            }
            if (au.stageScale == "noScale") {
                ax = ay || au.width;
                aA = aB || au.height
            }
            switch (au.stageScale) {
            case "exactFit":
                ax = ay || aC;
                aA = aB || av;
                break;
            case "noBorder":
                ax = ay || aC;
                aA = aB || au.height * aC / au.width;
                switch (au.align) {
                case J.BOTTOM:
                case J.BOTTOM_LEFT:
                case J.BOTTOM_RIGHT:
                case J.BOTTOM_MIDDLE:
                    az = av - aA;
                    break
                }
                break;
            case "showAll":
                if (aC / av > au.width / au.height) {
                    aA = aB || av;
                    ax = ay || au.width * av / au.height
                } else {
                    ax = ay || aC;
                    aA = aB || au.height * aC / au.width
                }
            case "noScale":
            default:
                switch (au.align) {
                case J.BOTTOM:
                case J.BOTTOM_LEFT:
                    az = av - aA;
                    break;
                case J.RIGHT:
                case J.TOP_RIGHT:
                    aw = aC - ax;
                    break;
                case J.TOP_MIDDLE:
                    aw = (aC - ax) * 0.5;
                    break;
                case J.BOTTOM_RIGHT:
                    az = av - aA;
                    aw = aC - ax;
                    break;
                case J.BOTTOM_MIDDLE:
                    az = av - aA;
                    aw = (aC - ax) * 0.5;
                    break;
                case J.MIDDLE:
                    az = (av - aA) * 0.5;
                    aw = (aC - ax) * 0.5;
                    break;
                case J.TOP:
                case J.LEFT:
                case J.TOP_LEFT:
                default:
                }
            }
            au.canvasObj.style.marginTop = az + "px";
            au.canvasObj.style.marginLeft = aw + "px";
            if (au.isOldFirefox) {
                au.left = parseInt(au.canvasObj.style.marginLeft);
                au.top = parseInt(au.canvasObj.style.marginTop)
            }
            au.ll_setStageSize(ax, aA)
        };
        au.sleep = function(av) {
            var aw = new Date();
            while ((new Date().getTime() - aw.getTime()) < av) {}
        };
        au.screen = function(av) {
            au.displayState = av;
            if (au.stage) {
                if (typeof au.displayState == "number") {
                    au.resize(au.width * au.displayState, au.height * au.displayState)
                } else {
                    au.resize()
                }
            }
        };
        return au
    })();
    var R = ac;
    var t = ac;
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function(av) {
            var au = this.length >>> 0;
            var aw = Number(arguments[1]) || 0;
            aw = (aw < 0) ? Math.ceil(aw) : Math.floor(aw);
            if (aw < 0) {
                aw += au
            }
            for (; aw < au; aw++) {
                if (aw in this && this[aw] === av) {
                    return aw
                }
            }
            return - 1
        }
    }
    if (!Array.isArray) {
        Array.isArray = function(au) {
            return Object.prototype.toString.apply(au) == "[object Array]"
        }
    }
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(au) {
            if (typeof this !== "function") {
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable")
            }
            var ay = Array.prototype.slice.call(arguments, 1),
            ax = this,
            av = function() {},
            aw = function() {
                return ax.apply(this instanceof av && au ? this: au, ay.concat(Array.prototype.slice.call(arguments)))
            };
            av.prototype = this.prototype;
            aw.prototype = new av();
            return aw
        }
    }
    if (!Array.prototype.forEach) {
        Array.prototype.forEach = function(aA, av) {
            var ax, aw;
            if (this == null) {
                throw new TypeError(" this is null or not defined")
            }
            var az = Object(this);
            var au = az.length >>> 0;
            if (typeof aA !== "function") {
                throw new TypeError(aA + " is not a function")
            }
            if (arguments.length > 1) {
                ax = av
            }
            aw = 0;
            while (aw < au) {
                var ay;
                if (aw in az) {
                    ay = az[aw];
                    aA.call(ax, ay, aw, az)
                }
                aw++
            }
        }
    }
    if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
        Object.defineProperty(Function.prototype, "name", {
            get: function() {
                var av = /function\s([^(]{1,})\(/;
                var au = (av).exec((this).toString());
                return (au && au.length > 1) ? au[1].trim() : ""
            },
            set: function(au) {}
        })
    }
    function M() {
        if (!ac.traceDebug) {
            return
        }
        var aw = document.getElementById("traceObject"),
        av;
        if (M.arguments.length > 0 && aw == null) {
            var ay = document.createElement("DIV");
            ay.position = 0;
            ay.style.position = "absolute";
            document.body.appendChild(ay);
            aw = document.createElement("TEXTAREA");
            aw.id = "traceObject";
            aw.style.width = (ae.innerWidth * 0.5) + "px";
            aw.style.height = "200px";
            var au = document.createElement("BUTTON");
            au.style.width = (ae.innerWidth * 0.25) + "px";
            au.innerHTML = "Hide";
            ay.appendChild(au);
            ar.addEventListener(au, ac.mobile ? "touchstart": "click",
            function(az) {
                aw.style.display = (aw.style.display == "none" ? "": "none")
            });
            au = document.createElement("BUTTON");
            au.style.width = (ae.innerWidth * 0.25) + "px";
            au.innerHTML = "position";
            ay.appendChild(au);
            var ax = function(az) {
                ay.position++;
                if (ay.position == 0) {
                    ay.style.top = "5px";
                    ay.style.left = "5px"
                } else {
                    if (ay.position == 1) {
                        ay.style.top = (ae.innerHeight - 20 - parseInt(aw.style.height)) + "px";
                        ay.style.left = "5px"
                    } else {
                        if (ay.position == 2) {
                            ay.style.top = "5px";
                            ay.style.left = (ae.innerWidth - parseInt(aw.style.width)) + "px"
                        } else {
                            ay.style.top = (ae.innerHeight - 20 - parseInt(aw.style.height)) + "px";
                            ay.style.left = (ae.innerWidth - parseInt(aw.style.width)) + "px";
                            ay.position = -1
                        }
                    }
                }
            };
            ax();
            ar.addEventListener(au, ac.mobile ? "touchstart": "click", ax);
            ay.appendChild(document.createElement("BR"));
            ay.appendChild(aw)
        }
        for (av = 0; av < M.arguments.length; av++) {
            aw.value = aw.value + M.arguments[av] + "\r\n";
            aw.scrollTop = aw.scrollHeight
        }
    }
    if (!ae.console) {
        ae.console = {
            log: M,
            warn: M
        }
    }
    function D(au) {
        ac.stage.addChild(au)
    }
    function q(au) {
        ac.stage.removeChild(au)
    }
    var an = al;
    function G(az, au, av) {
        var ax = null,
        ay = az.constructor.prototype,
        aw = {};
        if (az.constructor.name == "Object") {
            console.warn("When you use the extends. You must make a method like 'XX.prototype.xxx=function(){}'. but not 'XX.prototype={xxx:function(){}}'.")
        }
        if (typeof az.__ll__parent__ == T) {
            az.__ll__parent__ = [];
            az.__ll__parent__ = []
        }
        az.__ll__parent__.push(au.prototype);
        for (ax in ay) {
            aw[ax] = 1
        }
        for (ax in au.prototype) {
            if (!aw[ax]) {
                ay[ax] = au.prototype[ax]
            }
        }
        if (ay.toString == Object.prototype.toString) {
            ay.toString = I.prototype.toString
        }
        au.apply(az, av)
    }
    var n = G;
    function P() {
        return (new Date()).getTime() - ac.startTimer
    }
    function L(aw) {
        var au, av = /([^#?]+\.)([^.#?]+)/;
        au = aw.match(av);
        if (au.length >= 3) {
            return au[2].toLowerCase()
        }
        return null
    }
    var I = (function() {
        function au() {
            this.type = "LObject";
            this.objectIndex = ++ac.objectIndex;
            this.objectindex = this.objectIndex
        }
        au.prototype = {
            callParent: function(av, ax) {
                if (!av || !ax) {
                    return
                }
                var ay = this,
                aA = false,
                az, aw = "__ll__parent_call" + av;
                if (typeof ay[aw] == "undefined") {
                    aA = true;
                    ay[aw] = 0
                } else {
                    ay[aw]++
                }
                if (ay[aw] >= ay.__ll__parent__.length) {
                    return false
                }
                if (!ay.__ll__parent__[ay[aw]][av]) {
                    az = ay.callParent(av, ax)
                } else {
                    az = ay.__ll__parent__[ay[aw]][av].apply(ay, ax)
                }
                if (aA) {
                    delete ay[aw]
                }
                return az
            },
            copyProperty: function(av) {
                var ax = this,
                aw;
                for (aw in av) {
                    if (typeof av[aw] == "number" || typeof av[aw] == "string" || typeof av[aw] == "boolean") {
                        if (aw == "objectindex" || aw == "objectIndex") {
                            continue
                        }
                        ax[aw] = av[aw]
                    } else {
                        if (Array.isArray(av[aw])) {
                            ax[aw] = av[aw].slice()
                        }
                    }
                }
                if (av.mask) {
                    ax.mask = av.mask.clone()
                }
            },
            toString: function() {
                return "[object " + this.constructor.name + "]"
            }
        };
        return au
    })();
    var H = (function() {
        function au(aA, av, ay, ax, aC, az, aw, aD) {
            var aB = this;
            n(aB, I, []);
            aB.redMultiplier = aA;
            aB.greenMultiplier = av;
            aB.blueMultiplier = ay;
            aB.alphaMultiplier = ax;
            aB.redOffset = aC;
            aB.greenOffset = az;
            aB.blueOffset = aw;
            aB.alphaOffset = aD
        }
        return au
    })();
    var aa = (function() {
        function au() {
            var av = this;
            n(av, I, []);
            av.matrix = null
        }
        return au
    })();
    var y = (function() {
        function av(aC, aB, aA, az, ay, ax, aF, aE, aD) {
            var aG = this;
            n(aG, I, []);
            aG.a = 1;
            aG.b = 0;
            aG.u = 0;
            aG.c = 0;
            aG.d = 1;
            aG.v = 0;
            aG.tx = 0;
            aG.ty = 0;
            aG.w = 1;
            if (typeof aC != T) {
                aG.a = aC
            }
            if (typeof aB != T) {
                aG.b = aB
            }
            if (typeof aA != T) {
                aG.c = aA
            }
            if (typeof az != T) {
                aG.d = az
            }
            if (typeof ay != T) {
                aG.tx = ay
            }
            if (typeof ax != T) {
                aG.ty = ax
            }
            if (typeof aF != T) {
                aG.u = aF
            }
            if (typeof aE != T) {
                aG.v = aE
            }
            if (typeof aD != T) {
                aG.w = aD
            }
        }
        var aw = {
            setTo: function(aC, aB, aA, az, ay, ax, aF, aE, aD) {
                var aG = this;
                if (typeof aC != T) {
                    aG.a = aC
                }
                if (typeof aB != T) {
                    aG.b = aB
                }
                if (typeof aA != T) {
                    aG.c = aA
                }
                if (typeof az != T) {
                    aG.d = az
                }
                if (typeof ay != T) {
                    aG.tx = ay
                }
                if (typeof ax != T) {
                    aG.ty = ax
                }
                if (typeof aF != T) {
                    aG.u = aF
                }
                if (typeof aE != T) {
                    aG.v = aE
                }
                if (typeof aD != T) {
                    aG.w = aD
                }
                return aG
            },
            isIdentity: function() {
                var ax = this;
                return (ax.a == 1 && ax.b == 0 && ax.c == 0 && ax.d == 1 && ax.tx == 0 && ax.ty == 0 && u == 0 && v == 0 && w == 1)
            },
            transform: function(ay) {
                var ax = this;
                ay.transform(ax.a, ax.b, ax.c, ax.d, ax.tx, ax.ty);
                return ax
            },
            identity: function() {
                this.setTo(1, 0, 0, 1, 0, 0, 0, 0, 1)
            },
            rotate: function(aB) {
                var az = this,
                aC = aB * Math.PI / 180,
                aA = Math.cos(aC),
                ax = Math.sin(aC),
                ay = new av(aA, ax, -ax, aA, 0, 0, 0, 0, 1);
                az.add(ay);
                return az
            },
            scale: function(aA, az) {
                var ay = this,
                ax = new av(aA, 0, 0, az, 0, 0, 0, 0, 1);
                ay.add(ax);
                return ay
            },
            translate: function(ay, ax) {
                var aA = this,
                az = new av(1, 0, 0, 1, ay, ax, 0, 0, 1);
                aA.add(az);
                return aA
            },
            skew: function(aA, ax) {
                var az = this,
                ay = new av(1, ax, aA, 1, 0, 0, 0, 0, 1);
                az.add(ay);
                return az
            },
            add: function(ax) {
                var aH = this,
                aD, aC, aB, aA, az, ay, aG, aF, aE;
                aD = aH.a * ax.a + aH.b * ax.c + aH.u * ax.tx;
                aC = aH.a * ax.b + aH.b * ax.d + aH.u * ax.ty;
                aG = aH.a * ax.u + aH.b * ax.v + aH.u * ax.w;
                aB = aH.c * ax.a + aH.d * ax.c + aH.v * ax.tx;
                aA = aH.c * ax.b + aH.d * ax.d + aH.v * ax.ty;
                aF = aH.c * ax.u + aH.d * ax.v + aH.v * ax.w;
                az = aH.tx * ax.a + aH.ty * ax.c + aH.w * ax.tx;
                ay = aH.tx * ax.b + aH.ty * ax.d + aH.w * ax.ty;
                aE = aH.tx * ax.u + aH.ty * ax.v + aH.w * ax.w;
                aH.setTo(aD, aC, aB, aA, az, ay, aG, aF, aE)
            },
            toArray: function(ax) {
                var aK = this;
                if (Array.isArray(ax) && ax.length == 3) {
                    var az = ax[0] * aK.a + ax[1] * aK.c + ax[2] * aK.tx,
                    ay = ax[0] * aK.b + ax[1] * aK.d + ax[2] * aK.ty,
                    aA = ax[0] * aK.u + ax[1] * aK.v + ax[2] * aK.w;
                    return [az, ay, aA]
                } else {
                    var aG = aK.a * ax.a + aK.b * ax.c + aK.u * ax.tx,
                    aF = aK.a * ax.b + aK.b * ax.d + aK.u * ax.ty,
                    aJ = aK.a * ax.u + aK.b * ax.v + aK.u * ax.w,
                    aE = aK.c * ax.a + aK.d * ax.c + aK.v * ax.tx,
                    aD = aK.c * ax.b + aK.d * ax.d + aK.v * ax.ty,
                    aI = aK.c * ax.u + aK.d * ax.v + aK.v * ax.w,
                    aC = aK.tx * ax.a + aK.ty * ax.c + aK.w * ax.tx,
                    aB = aK.tx * ax.b + aK.ty * ax.d + aK.w * ax.ty,
                    aH = aK.tx * ax.u + aK.ty * ax.v + aK.w * ax.w;
                    return [aG, aF, aE, aD, aC, aB, aJ, aI, aH]
                }
            },
            clone: function() {
                var ax = this;
                return new av(ax.a, ax.b, ax.c, ax.d, ax.tx, ax.ty, ax.u, ax.v, ax.w)
            }
        };
        for (var au in aw) {
            av.prototype[au] = aw[au]
        }
        return av
    })();
    var aq = (function() {
        function au(av, aw) {
            this.x = av || 0;
            this.y = aw || 0
        }
        au.dot = function(aw, av) {
            return aw.x * av.x + aw.y * av.y
        };
        au.cross = function(aw, av) {
            return aw.x * av.y - aw.y * av.x
        };
        au.distance = function(ax, aw) {
            var av = ax.x - aw.x;
            var ay = ax.y - aw.y;
            return Math.sqrt(av * av + ay * ay)
        };
        au.getMinMax = function(aD, ax) {
            var aw = au.dot(aD[0], ax);
            var az = au.dot(aD[0], ax);
            var aA = 0;
            var aC = 0;
            for (var aB = 1; aB < aD.length; aB++) {
                var ay = au.dot(aD[aB], ax);
                if (aw > ay) {
                    aw = ay;
                    aA = aB
                }
                if (az < ay) {
                    az = ay;
                    aC = aB
                }
            }
            var av = {
                min_o: aw,
                min_i: aA,
                max_o: az,
                max_i: aC
            };
            return av
        };
        au.prototype = {
            length: function() {
                var av = this;
                return Math.sqrt(av.x * av.x + av.y * av.y)
            },
            normalize: function() {
                var aw = this,
                av = aw.length();
                return new au(aw.x / av, aw.y / av)
            },
            normR: function() {
                return new au( - this.y, this.x)
            },
            normL: function() {
                return new au(this.y, -this.x)
            }
        };
        return au
    })();
    var am = (function() {
        function av() {
            var ax = this;
            n(ax, I, []);
            ax._eventList = new Array()
        }
        var aw = {
            addEventListener: function(ax, ay) {
                this._eventList.push({
                    listener: ay,
                    type: ax
                })
            },
            removeEventListener: function(az, aB) {
                var ay = this,
                ax, aA;
                aA = ay._eventList.length;
                for (ax = 0; ax < aA; ax++) {
                    if (!ay._eventList[ax]) {
                        continue
                    }
                    if (az == ay._eventList[ax].type && (!aB || ay._eventList[ax].listener == aB)) {
                        ay._eventList.splice(ax, 1);
                        return
                    }
                }
            },
            removeAllEventListener: function() {
                this._eventList = []
            },
            dispatchEvent: function(aB) {
                var az = this,
                ax, aA = az._eventList.length,
                ay = (typeof aB == "string") ? aB: aB.eventType;
                for (ax = 0; ax < aA; ax++) {
                    if (!az._eventList[ax]) {
                        continue
                    }
                    if (ay == az._eventList[ax].type) {
                        if (typeof aB == "string") {
                            az.currentTarget = az.target = az;
                            az.eventType = az.event_type = ay;
                            az._eventList[ax].listener(az);
                            delete az.currentTarget;
                            delete az.target;
                            delete az.eventType
                        } else {
                            if (!aB.target) {
                                aB.target = az
                            }
                            if (!aB.currentTarget) {
                                aB.currentTarget = aB.target
                            }
                            aB._ll_preventDefault = false;
                            az._eventList[ax].listener(aB);
                            if (aB._ll_preventDefault) {
                                return false
                            }
                        }
                        return true
                    }
                }
                return false
            },
            hasEventListener: function(az, aB) {
                var ay = this,
                ax, aA = ay._eventList.length;
                for (ax = 0; ax < aA; ax++) {
                    if (!ay._eventList[ax]) {
                        continue
                    }
                    if (az == ay._eventList[ax].type) {
                        if (typeof aB == T || aB == ay._eventList[ax].listener) {
                            return true
                        }
                    }
                }
                return false
            }
        };
        for (var au in aw) {
            av.prototype[au] = aw[au]
        }
        return av
    })();
    var A = (function() {
        function aw() {
            var ax = this;
            n(ax, am, []);
            ax.name = "instance" + ax.objectIndex;
            ax.x = 0;
            ax.y = 0;
            ax.width = 0;
            ax.height = 0;
            ax.scaleX = 1;
            ax.scaleY = 1;
            ax.alpha = 1;
            ax.visible = true;
            ax.rotate = 0;
            ax.mask = null;
            ax.blendMode = null;
            ax.filters = null;
            ax.transform = new aa();
            ax.parent = null;
            ax.setScaleOrigin(0, 0)
        }
        var av = {
            _createCanvas: function() {
                var ax = this;
                if (!ax._canvas) {
                    ax._canvas = document.createElement("canvas");
                    ax._context = ax._canvas.getContext("2d")
                }
            },
            ll_show: function() {
                var ax = this,
                ay = ac.canvas;
                if (!ax._canShow()) {
                    return
                }
                ax._ll_trans = false;
                if (!ac.box2d && typeof ax._ll_loopframe == "function") {
                    ax._ll_loopframe()
                }
                ay.save();
                ax._showReady(ay);
                if (ax.blendMode) {
                    ay.globalCompositeOperation = ax.blendMode
                }
                if (ax.filters) {
                    ax._ll_setFilters()
                }
                ax._rotateReady();
                if (ax.mask != null && ax.mask.ll_show) {
                    ax.mask.ll_show();
                    ay.clip()
                }
                ax._transformRotate();
                ax._transformScale();
                ax._coordinate(ay);
                if (ax.transform.matrix) {
                    ax.transform.matrix.transform(ay)
                }
                if (ax.alpha < 1) {
                    ax._ll_trans = true;
                    ay.globalAlpha = ax.alpha
                }
                if (ac.fpsStatus) {
                    ac.fpsStatus.display++;
                    if (ax._ll_trans) {
                        ac.fpsStatus.transform++
                    }
                }
                if (ax._ll_cacheAsBitmap) {
                    ax._ll_cacheAsBitmap._ll_show()
                } else {
                    ax._ll_show(ay)
                }
                ay.restore();
                if (ac.box2d != null && typeof ax._ll_loopframe == "function") {
                    ax._ll_loopframe()
                }
            },
            _canShow: function() {
                return this.visible
            },
            _coordinate: function(ay) {
                var ax = this;
                if (ax.x != 0 || ax.y != 0) {
                    ax._ll_trans = true;
                    ay.transform(1, 0, 0, 1, ax.x, ax.y)
                }
            },
            _rotateReady: function() {},
            _showReady: function(ax) {},
            _ll_show: function(ax) {},
            _ll_setFilters: function() {
                var az = this,
                aA = az.filters,
                ay, ax;
                if (!aA) {
                    return
                }
                for (ay = 0, ax = aA.length; ay < ax; ay++) {
                    aA[ay].ll_show(az)
                }
            },
            startX: function() {
                return 0
            },
            startY: function() {
                return 0
            },
            getWidth: function() {
                return 1
            },
            getHeight: function() {
                return 1
            },
            _transformRotate: function() {
                var ax = this,
                ay;
                if (ax.rotate == 0) {
                    return
                }
                ax._ll_trans = true;
                ay = ac.canvas,
                rotateFlag = Math.PI / 180,
                rotateObj = new y();
                if ((typeof ax.rotatex) == T) {
                    ax.rotatex = 0;
                    ax.rotatey = 0
                }
                if (ax.box2dBody) {
                    rotateFlag = 1
                }
                rotateObj.a = Math.cos(ax.rotate * rotateFlag);
                rotateObj.b = Math.sin(ax.rotate * rotateFlag);
                rotateObj.c = -rotateObj.b;
                rotateObj.d = rotateObj.a;
                rotateObj.tx = ax.x + ax.rotatex;
                rotateObj.ty = ax.y + ax.rotatey;
                rotateObj.transform(ay).setTo(1, 0, 0, 1, -rotateObj.tx, -rotateObj.ty).transform(ay)
            },
            setScaleOrigin: function() {
                var ay = this,
                ax = arguments;
                if (!ay._scaleOrigin) {
                    ay._scaleOrigin = [0, 0]
                } ["width", "height"].forEach(function(aC, aB) {
                    var az = ax[aB],
                    aA = parseFloat(az);
                    if (!isNaN(aA)) {
                        if (typeof az == "string" && az.indexOf("%") != -1) {
                            aA = ay[aC] * aA / 100
                        }
                        ay._scaleOrigin[aB] = aA
                    }
                })
            },
            _transformScale: function() {
                var ax = this,
                az = ac.canvas,
                ay;
                if (ax.scaleX == 1 && ax.scaleY == 1) {
                    return
                }
                ax._ll_trans = true;
                ay = new y();
                if (ax.scaleX != 1) {
                    ay.tx = ax.x + ax._scaleOrigin[0]
                }
                if (ax.scaleY != 1) {
                    ay.ty = ax.y + ax._scaleOrigin[1]
                }
                ay.a = ax.scaleX;
                ay.d = ax.scaleY;
                ay.transform(az).setTo(1, 0, 0, 1, -ay.tx, -ay.ty).transform(az)
            },
            getAbsoluteScale: function() {
                var ax = this,
                aA, az, ay;
                aA = ax.scaleX;
                az = ax.scaleY;
                ay = ax.parent;
                while (ay && ay != "root") {
                    aA *= ay.scaleX;
                    az *= ay.scaleY;
                    ay = ay.parent
                }
                return {
                    scaleX: aA,
                    scaleY: az
                }
            },
            getRootCoordinate: function() {
                return this.localToGlobal(new S(0, 0))
            },
            localToGlobal: function(ay) {
                var az = this,
                ax, aB, aA;
                m = az.getRootMatrix();
                aA = m.toArray([ay.x, ay.y, 1]);
                return new S(aA[0], aA[1])
            },
            globalToLocal: function(ay) {
                var az = this,
                ax, aB, aA;
                m = az.getLocalMatrix();
                aA = m.toArray([ay.x, ay.y, 1]);
                return new S(aA[0], aA[1])
            },
            getBounds: function(aC) {
                if (typeof aC == T) {
                    return new f(0, 0, 0, 0)
                }
                var aA = this,
                ax = 0,
                aE = 0,
                ay = 0,
                az = 0,
                aB, aD;
                if (aA.objectIndex != aC.objectIndex) {
                    aB = aA.getRootCoordinate();
                    aD = aC.getRootCoordinate();
                    ax = aB.x - aD.x;
                    aE = aB.y - aD.y
                }
                if (aC.getWidth) {
                    ay = aC.getWidth()
                }
                if (aC.getHeight) {
                    az = aC.getHeight()
                }
                return new f(ax, aE, ay, az)
            },
            cacheAsBitmap: function(aD, aE, az) {
                var aF = this;
                if (!aD) {
                    aF._ll_cacheAsBitmap = null;
                    return
                }
                var aC = aF.x - aF.startX(),
                aA = aF.y - aF.startY();
                var ay = aF.getDataCanvas(aC, aA, aF.getWidth(), aF.getHeight());
                var aB = new p(ay, 0, 0, null, null, p.DATA_CANVAS);
                var ax = new W(aB, 0, 0, aF.getWidth(), aF.getHeight());
                ax.x = -aC;
                ax.y = -aA;
                aF._ll_cacheAsBitmap = ax
            },
            getDataCanvas: function(aF, aE, aG, az) {
                var aH = this,
                ax, ay, aA, aC, aD, aB;
                aH._createCanvas();
                ay = ac.canvasObj;
                aC = ac.canvas;
                ax = aH._canvas;
                aA = aH._context;
                aH.width = aG || aH.getWidth();
                aH.height = az || aH.getHeight();
                ax.width = aH.width;
                ax.height = aH.height;
                aA.clearRect(0, 0, aH.width, aH.height);
                ac.canvasObj = aH._canvas;
                ac.canvas = aH._context;
                aD = aH.x;
                aB = aH.y;
                aH.x = aF || 0;
                aH.y = aE || 0;
                aH.ll_show();
                aH.x = aD;
                aH.y = aB;
                aH._canvas = ax;
                aH._context = aA;
                ac.canvasObj = ay;
                ac.canvas = aC;
                return aH._canvas
            },
            getDataURL: function() {
                var ax = this,
                ay = ax.getDataCanvas();
                return ay.toDataURL.apply(ay, arguments)
            },
            ismouseonShapes: function(ax, aE, aB) {
                var aG = this,
                aC = aG,
                az, ay, aA, aD, aF;
                if (typeof ax == T) {
                    ax = aG.shapes
                }
                az = aG.getRootMatrix();
                for (aA = ax.length - 1; aA >= 0; aA--) {
                    ay = ax[aA];
                    aF = ay.arg;
                    aD = aG._changeShape(ay.type, aF, az);
                    if (ay.type == E.VERTICES) {
                        if (ac.hitPolygon(aD, aE, aB)) {
                            return true
                        }
                    } else {
                        if (ay.type == E.RECT) {
                            if (ac.hitPolygon(aD, aE, aB)) {
                                return true
                            }
                        } else {
                            if (ay.type == E.ARC) {
                                if ((aD[0] - aE) * (aD[0] - aE) + (aD[1] - aB) * (aD[1] - aB) < aD[3]) {
                                    return true
                                }
                            }
                        }
                    }
                }
                return false
            },
            _changeShape: function(aB, aF, ay) {
                var aE, aF = aF,
                ax, aA, az, aD, aC;
                if (aB == E.VERTICES) {
                    aE = [];
                    for (aA = 0, az = aF.length; aA < az; aA++) {
                        aE[aA] = ay.toArray([aF[aA][0], aF[aA][1], 1])
                    }
                } else {
                    if (aB == E.RECT) {
                        aE = [[aF[0], aF[1]], [aF[0] + aF[2], aF[1]], [aF[0] + aF[2], aF[1] + aF[3]], [aF[0], aF[1] + aF[3]]];
                        for (aA = 0, az = aE.length; aA < az; aA++) {
                            aE[aA] = ay.toArray([aE[aA][0], aE[aA][1], 1])
                        }
                    } else {
                        if (aB == E.ARC) {
                            aD = ay.toArray([aF[0], aF[1], 1]);
                            aC = ay.toArray([aF[0] + aF[2], aF[1], 1]);
                            ax = (aD[0] - aC[0]) * (aD[0] - aC[0]) + (aD[1] - aC[1]) * (aD[1] - aC[1]);
                            aE = [aD[0], aD[1], Math.sqrt(ax), ax]
                        }
                    }
                }
                return aE
            },
            getRootMatrix: function() {
                var ay = this,
                ax = new y();
                while (ay && ay != "root") {
                    if (ay.scaleX != 1 || ay.scaleY != 1) {
                        ax.scale(ay.scaleX, ay.scaleY)
                    }
                    if (ay.rotate != 0) {
                        ax.rotate(ay.rotate)
                    }
                    if (ay.x != 0 || ay.y != 0) {
                        ax.translate(ay.x, ay.y)
                    }
                    ay = ay.parent
                }
                return ax
            },
            getLocalMatrix: function() {
                var az = this,
                ax = new y(),
                aA = [];
                while (az && az != "root") {
                    aA.push(az);
                    az = az.parent
                }
                for (var ay = aA.length - 1; ay >= 0; ay--) {
                    az = aA[ay];
                    if (az.x != 0 || az.y != 0) {
                        ax.translate( - az.x, -az.y)
                    }
                    if (az.rotate != 0) {
                        ax.rotate( - az.rotate)
                    }
                    if (az.scaleX != 1 || az.scaleY != 1) {
                        ax.scale(1 / az.scaleX, 1 / az.scaleY)
                    }
                }
                return ax
            },
            remove: function() {
                var ax = this,
                ay = ax.parent;
                if (!ay || ay == "root") {
                    return
                }
                ay.removeChild(ax);
                ax._ll_removeFromSelf = true
            }
        };
        for (var au in av) {
            aw.prototype[au] = av[au]
        }
        return aw
    })();
    var g = (function() {
        function au() {
            var ax = this;
            n(ax, A, []);
            ax.type = "LInteractiveObject";
            ax.mouseEnabled = true;
            ax.mouseList = new Array()
        }
        var aw = {
            addEventListener: function(ay, az) {
                var ax = this;
                if (ay.indexOf("mouse") >= 0 || ay.indexOf("touch") >= 0 || ay == af.DOUBLE_CLICK) {
                    if (ad.container[ay] || ((ay == af.MOUSE_OVER || ay == af.MOUSE_OUT) && ad.container[af.MOUSE_MOVE])) {
                        ad.addMouseEvent(ax, ay, az);
                        return
                    }
                    ax.mouseList.push({
                        listener: az,
                        type: ay
                    })
                } else {
                    ax._eventList.push({
                        listener: az,
                        type: ay
                    })
                }
            },
            removeEventListener: function(az, aB) {
                var ay = this,
                ax, aA;
                if (az.indexOf("mouse") >= 0 || az.indexOf("touch") >= 0 || az == af.DOUBLE_CLICK) {
                    if (ad.container[az] || ((az == af.MOUSE_OVER || az == af.MOUSE_OUT) && ad.container[af.MOUSE_MOVE])) {
                        ad.removeMouseEvent(ay, az, aB);
                        return
                    }
                    aA = ay.mouseList.length;
                    for (ax = 0; ax < aA; ax++) {
                        if (!ay.mouseList[ax]) {
                            continue
                        }
                        if (az == ay.mouseList[ax].type && ay.mouseList[ax].listener == aB) {
                            ay.mouseList.splice(ax, 1);
                            return
                        }
                    }
                } else {
                    return ay.callParent("removeEventListener", arguments)
                }
            },
            removeAllEventListener: function() {
                var ax = this;
                ax.mouseList.length = 0;
                ax._eventList.length = 0;
                if (ad.container[af.MOUSE_DOWN]) {
                    ad.removeMouseEvent(ax, af.MOUSE_DOWN)
                }
                if (ad.container[af.MOUSE_UP]) {
                    ad.removeMouseEvent(ax, af.MOUSE_UP)
                }
                if (ad.container[af.MOUSE_MOVE]) {
                    ad.removeMouseEvent(ax, af.MOUSE_MOVE);
                    ad.removeMouseEvent(ax, af.MOUSE_OVER);
                    ad.removeMouseEvent(ax, af.MOUSE_OUT)
                }
            },
            hasEventListener: function(az, aB) {
                var ay = this,
                ax, aA;
                if (ad.container[az]) {
                    return ad.hasEventListener(ay, az, aB)
                }
                if (az.indexOf("mouse") >= 0 || az.indexOf("touch") >= 0 || az == af.DOUBLE_CLICK) {
                    aA = ay.mouseList.length;
                    for (ax = 0; ax < aA; ax++) {
                        if (!ay.mouseList[ax]) {
                            continue
                        }
                        if (az == ay.mouseList[ax].type && (!aB || ay.mouseList[ax].listener == aB)) {
                            return true
                        }
                    }
                } else {
                    return ay.callParent("hasEventListener", arguments)
                }
                return false
            }
        };
        for (var av in aw) {
            au.prototype[av] = aw[av]
        }
        return au
    })();
    var Q = (function() {
        function aw() {
            var ax = this;
            n(ax, g, []);
            ax.childList = new Array();
            ax.numChildren = 0;
            ax.mouseChildren = true
        }
        var av = {
            addChild: function(az) {
                var ay = this,
                ax;
                if (az.parent) {
                    ax = ac.destroy;
                    ac.destroy = false;
                    az.parent.removeChild(az);
                    ac.destroy = ax
                }
                az.parent = ay;
                ay.childList.push(az);
                ay.numChildren = ay.childList.length;
                ay._ll_removeFromSelf = false;
                return az
            },
            addChildAt: function(aA, ay) {
                var az = this,
                ax;
                if (ay < 0 || ay > az.childList.length) {
                    return
                }
                if (typeof aA.remove == "function") {
                    ax = ac.destroy;
                    ac.destroy = false;
                    aA.remove();
                    ac.destroy = ax
                }
                aA.parent = az;
                az.childList.splice(ay, 0, aA);
                az.numChildren = az.childList.length;
                az._ll_removeFromSelf = false;
                return aA
            },
            removeChild: function(aA) {
                var az = this,
                aB = az.childList,
                ay, ax;
                for (ay = 0, ax = aB.length; ay < ax; ay++) {
                    if (aA.objectIndex == aB[ay].objectIndex) {
                        if (ac.destroy && aA.die) {
                            aA.die()
                        }
                        az.childList.splice(ay, 1);
                        break
                    }
                }
                az.numChildren = az.childList.length;
                delete aA.parent
            },
            getChildAt: function(ax) {
                var ay = this,
                az = ay.childList;
                if (az.length == 0 || az.length <= ax) {
                    return null
                }
                return az[ax]
            },
            getChildByName: function(aB) {
                var az = this,
                aA = az.childList,
                ay, ax;
                for (ay = 0, ax = aA.length; ay < ax; ay++) {
                    if (!aA[ay]) {
                        continue
                    }
                    if (aA[ay].name == aB) {
                        return aA[ay]
                    }
                }
                return null
            },
            removeChildAt: function(ax) {
                var ay = this,
                aA = ay.childList;
                if (aA.length <= ax) {
                    return
                }
                if (ac.destroy && aA[ax].die) {
                    aA[ax].die()
                }
                var az = ay.childList.splice(ax, 1);
                ay.numChildren = ay.childList.length;
                return az
            },
            getChildIndex: function(aB) {
                if (!aB) {
                    return - 1
                }
                var az = this,
                aA = az.childList,
                ay, ax = aA.length;
                for (ay = 0; ay < ax; ay++) {
                    if (aA[ay].objectIndex == aB.objectIndex) {
                        return ay
                    }
                }
                return - 1
            },
            setChildIndex: function(aC, ay) {
                var aA = this,
                aB = aA.childList,
                az, ax = aB.length;
                if (aC.parent == "root" || aC.parent.objectIndex != aA.objectIndex || ay < 0 || ay >= ax) {
                    return - 1
                }
                for (az = 0; az < ax; az++) {
                    if (aB[az].objectIndex == aC.objectIndex) {
                        break
                    }
                }
                aA.childList.splice(az, 1);
                aA.childList.splice(ay, 0, aC);
                return ay
            },
            resize: function() {
                var ax = this;
                ax.width = ax.getWidth();
                ax.height = ax.getHeight()
            },
            removeAllChild: function() {
                var az = this,
                aA = az.childList,
                ay, ax;
                for (ay = 0, ax = aA.length; ay < ax; ay++) {
                    if (ac.destroy && aA[ay].die) {
                        aA[ay].die()
                    }
                }
                az.childList.length = 0;
                az.width = 0;
                az.height = 0;
                az.numChildren = 0
            }
        };
        for (var au in av) {
            aw.prototype[au] = av[au]
        }
        return aw
    })();
    var S = (function() {
        function au(av, ax) {
            var aw = this;
            aw.x = av;
            aw.y = ax
        }
        au.distance = function(aw, av) {
            return au.distance2(aw.x, aw.y, av.x, av.y)
        };
        au.distance2 = function(ax, az, aw, ay) {
            var av = ax - aw,
            aA = az - ay;
            return Math.sqrt(av * av + aA * aA)
        };
        au.interpolate = function(ax, aw, av) {
            return new au(ax.x + (aw.x - ax.x) * (1 - av), ax.y + (aw.y - ax.y) * (1 - av))
        };
        au.polar = function(aw, av) {
            return new au(aw * Math.cos(av), aw * Math.sin(av))
        };
        au.prototype = {
            toString: function() {
                return "[object LPoint(" + this.x + "," + this.y + ")]"
            },
            length: function() {
                return au.distance2(this.x, this.y, 0, 0)
            },
            add: function(av) {
                return new au(this.x + av.x, this.y + av.y)
            },
            clone: function() {
                return new au(this.x, this.y)
            },
            setTo: function(av, aw) {
                this.x = av,
                this.y = aw
            },
            copyFrom: function(av) {
                this.setTo(av.x, av.y)
            },
            equals: function(av) {
                return this.x == av.x && this.y == av.y
            },
            normalize: function(av) {
                var aw = this,
                ax = av / aw.length();
                aw.x *= ax,
                aw.y *= ax
            },
            offset: function(aw, av) {
                this.x += aw;
                this.y += av
            },
            subtract: function(av) {
                return new au(this.x - av.x, this.y - av.y)
            }
        };
        return au
    })();
    var f = (function() {
        function au(av, az, aw, ay) {
            var ax = this;
            ax.x = av;
            ax.y = az;
            ax.width = aw;
            ax.height = ay;
            ax.setRectangle()
        }
        au.prototype = {
            setRectangle: function() {
                var av = this;
                av.bottom = av.y + av.height;
                av.right = av.x + av.width;
                av.left = av.x;
                av.top = av.y
            },
            clone: function() {
                var av = this;
                return new au(av.x, av.y, av.width, av.height)
            },
            contains: function(av, ax) {
                var aw = this;
                return av >= aw.x && av <= aw.right && ax >= aw.y && ax <= aw.bottom
            },
            containsRect: function(aw) {
                var av = this;
                return aw.x >= av.x && aw.right <= av.right && aw.y >= av.y && aw.bottom <= av.bottom
            },
            equals: function(av) {
                var aw = this;
                return av.x == aw.x && av.width == aw.width && av.y == aw.y && av.height == aw.height
            },
            inflate: function(aw, av) {
                var ax = this;
                ax.width += aw;
                ax.height += av;
                ax.setRectangle()
            },
            intersection: function(az) {
                var aA = this;
                var aw = aA.x > az.x ? aA.x: az.x;
                var av = aA.y > az.y ? aA.y: az.y;
                var aC = aA.right > az.right ? az.right: aA.right;
                var aB = aA.bottom > az.bottom ? az.bottom: aA.bottom;
                if (aw <= aC && av <= aB) {
                    return new au(aw, av, aC, aB)
                } else {
                    return new au(0, 0, 0, 0)
                }
            },
            intersects: function(az) {
                var aA = this;
                var aw = aA.x > az.x ? aA.x: az.x;
                var av = aA.y > az.y ? aA.y: az.y;
                var aC = aA.right > az.right ? az.right: aA.right;
                var aB = aA.bottom > az.bottom ? az.bottom: aA.bottom;
                return aw <= aC && av <= aB
            },
            isEmpty: function() {
                var av = this;
                return av.x == 0 && av.y == 0 && av.width == 0 && av.height == 0
            },
            offset: function(aw, av) {
                var ax = this;
                ax.x += aw;
                ax.y += av;
                ax.setRectangle()
            },
            setEmpty: function() {
                var av = this;
                av.x = 0;
                av.y = 0;
                av.width = 0;
                av.height = 0;
                av.setRectangle()
            },
            setTo: function(az, aw, av, ay) {
                var ax = this;
                ax.x = az;
                ax.y = aw;
                ax.width = av;
                ax.height = ay;
                ax.setRectangle()
            },
            toString: function() {
                var av = this;
                return "[object LRectangle(" + av.x + "," + av.y + "," + av.width + "," + av.height + ")]"
            },
            union: function(av) {
                var aw = this;
                return new au(aw.x > av.x ? av.x: aw.x, aw.y > av.y ? av.y: aw.y, aw.right > av.right ? aw.right: av.right, aw.bottom > av.bottom ? aw.bottom: av.bottom)
            }
        };
        return au
    })();
    var V = (function() {
        function av() {
            var ax = this;
            n(ax, I, []);
            ax.type = "LGraphics";
            ax.color = "#000000";
            ax.alpha = 1;
            ax.bitmap = null;
            ax.setList = new Array();
            ax.showList = new Array()
        }
        var aw = {
            ll_show: function() {
                var az = this,
                ay, ax = az.setList.length;
                if (ax == 0) {
                    return
                }
                for (ay = 0; ay < ax; ay++) {
                    az.setList[ay].call(az);
                    if (ac.fpsStatus) {
                        ac.fpsStatus.graphics++
                    }
                }
            },
            clone: function() {
                var aA = this,
                ay = new av(),
                az,
                ax,
                aB;
                ay.color = aA.color;
                ay.alpha = aA.alpha;
                ay.bitmap = aA.bitmap;
                for (az = 0, ax = aA.setList.length; az < ax; az++) {
                    aB = aA.setList[az];
                    ay.setList.push(aB)
                }
                for (az = 0, ax = aA.showList.length; az < ax; az++) {
                    aB = aA.showList[az];
                    ay.showList.push(aB)
                }
                return ay
            },
            lineCap: function(ax) {
                var ay = this;
                ay.setList.push(function() {
                    ac.canvas.lineCap = ax
                })
            },
            lineJoin: function(ax) {
                var ay = this;
                ay.setList.push(function() {
                    ac.canvas.lineJoin = ax
                })
            },
            lineWidth: function(ax) {
                var ay = this;
                ay.setList.push(function() {
                    ac.canvas.lineWidth = ax
                })
            },
            strokeStyle: function(ay) {
                var ax = this;
                ax.setList.push(function() {
                    ac.canvas.strokeStyle = ay
                })
            },
            stroke: function() {
                var ax = this;
                ax.setList.push(function() {
                    ac.canvas.stroke()
                })
            },
            beginPath: function() {
                var ax = this;
                ax.setList.push(function() {
                    ac.canvas.beginPath()
                })
            },
            closePath: function() {
                var ax = this;
                ax.setList.push(function() {
                    ac.canvas.closePath()
                })
            },
            moveTo: function(ax, az) {
                var ay = this;
                ay.setList.push(function() {
                    ac.canvas.moveTo(ax, az)
                });
                ay.showList.push({
                    type: E.POINT,
                    arg: [ax, az]
                })
            },
            lineTo: function(ax, az) {
                var ay = this;
                ay.setList.push(function() {
                    ac.canvas.lineTo(ax, az)
                });
                ay.showList.push({
                    type: E.POINT,
                    arg: [ax, az]
                })
            },
            rect: function(ax, aB, ay, aA) {
                var az = this;
                az.setList.push(function() {
                    ac.canvas.rect(ax, aB, ay, aA)
                });
                az.showList.push({
                    type: E.RECT,
                    arg: [ax, aB, ay, aA]
                })
            },
            fillStyle: function(ay) {
                var ax = this;
                ax.setList.push(function() {
                    ac.canvas.fillStyle = ay
                })
            },
            fill: function() {
                var ax = this;
                ax.setList.push(function() {
                    ac.canvas.fill()
                })
            },
            arc: function(ay, aD, aB, ax, aA, aC) {
                var az = this;
                az.setList.push(function() {
                    ac.canvas.arc(ay, aD, aB, ax, aA, aC)
                });
                az.showList.push({
                    type: E.ARC,
                    arg: ax
                })
            },
            lineStyle: function(ax, az) {
                var ay = this,
                aA;
                if (az == null) {
                    az = ay.color
                }
                ay.color = az;
                ay.setList.push(function() {
                    aA = ac.canvas;
                    aA.lineWidth = ax;
                    aA.strokeStyle = az
                })
            },
            clear: function() {
                var ax = this;
                ax.bitmap = null;
                ax.setList.length = 0;
                ax.showList.length = 0
            },
            beginBitmapFill: function(ax) {
                var ay = this;
                ay.setList.push(function() {
                    ay.bitmap = ax
                })
            },
            drawEllipse: function(ax, aB, aA, ay, aC) {
                var az = this;
                az.setList.push(function() {
                    var aK, aM, aL, aN, aH, aG, aF, aD, aO, aJ, aI, aE;
                    aK = ac.canvas;
                    aK.beginPath();
                    aG = 0.5522848;
                    aM = aA[0];
                    aL = aA[1];
                    aN = aA[2];
                    aH = aA[3];
                    aF = (aN / 2) * aG;
                    aD = (aH / 2) * aG;
                    aO = aM + aN;
                    aJ = aL + aH;
                    aI = aM + aN / 2;
                    aE = aL + aH / 2;
                    aK.moveTo(aM, aE);
                    aK.bezierCurveTo(aM, aE - aD, aI - aF, aL, aI, aL);
                    aK.bezierCurveTo(aI + aF, aL, aO, aE - aD, aO, aE);
                    aK.bezierCurveTo(aO, aE + aD, aI + aF, aJ, aI, aJ);
                    aK.bezierCurveTo(aI - aF, aJ, aM, aE + aD, aM, aE);
                    if (az.bitmap) {
                        aK.save();
                        aK.clip();
                        aK.drawImage(az.bitmap.image, az.bitmap.x, az.bitmap.y, az.bitmap.width, az.bitmap.height, 0, 0, az.bitmap.width, az.bitmap.height);
                        aK.restore();
                        az.bitmap = null;
                        return
                    }
                    if (ay) {
                        aK.fillStyle = aC;
                        aK.fill()
                    }
                    if (ax > 0) {
                        aK.lineWidth = ax;
                        aK.strokeStyle = aB;
                        aK.stroke()
                    }
                });
                az.showList.push({
                    type: E.RECT,
                    arg: aA
                })
            },
            drawArc: function(ax, aB, aA, ay, aD, aC) {
                var az = this;
                az.setList.push(function() {
                    var aE = ac.canvas;
                    aE.beginPath();
                    if (aA.length > 6 && aA[6] && !aC) {
                        aE.moveTo(aA[0], aA[1])
                    }
                    aE.arc(aA[0], aA[1], aA[2], aA[3], aA[4], aA[5]);
                    if (aA.length > 6 && aA[6] && !aC) {
                        aE.lineTo(aA[0], aA[1])
                    }
                    if (az.bitmap) {
                        aE.save();
                        aE.clip();
                        aE.drawImage(az.bitmap.image, az.bitmap.x, az.bitmap.y, az.bitmap.width, az.bitmap.height, 0, 0, az.bitmap.width, az.bitmap.height);
                        aE.restore();
                        az.bitmap = null;
                        return
                    }
                    if (ay) {
                        aE.fillStyle = aD;
                        aE.fill()
                    }
                    if (ax > 0) {
                        aE.lineWidth = ax;
                        aE.strokeStyle = aB;
                        aE.stroke()
                    }
                });
                az.showList.push({
                    type: E.ARC,
                    arg: aA
                })
            },
            drawRect: function(ax, aB, aA, ay, aC) {
                var az = this;
                az.setList.push(function() {
                    var aD = ac.canvas;
                    aD.beginPath();
                    aD.rect(aA[0], aA[1], aA[2], aA[3]);
                    aD.closePath();
                    if (az.bitmap) {
                        aD.save();
                        aD.clip();
                        aD.drawImage(az.bitmap.image, az.bitmap.x, az.bitmap.y, az.bitmap.width, az.bitmap.height, 0, 0, az.bitmap.width, az.bitmap.height);
                        aD.restore();
                        az.bitmap = null;
                        return
                    }
                    if (ay) {
                        aD.fillStyle = aC;
                        aD.fill()
                    }
                    if (ax > 0) {
                        aD.lineWidth = ax;
                        aD.strokeStyle = aB;
                        aD.stroke()
                    }
                });
                az.showList.push({
                    type: E.RECT,
                    arg: aA
                })
            },
            drawRoundRect: function(ax, aB, aA, ay, aC) {
                var az = this;
                az.setList.push(function() {
                    var aD = ac.canvas;
                    aD.beginPath();
                    aD.moveTo(aA[0] + aA[4], aA[1]);
                    aD.lineTo(aA[0] + aA[2] - aA[4], aA[1]);
                    aD.arcTo(aA[0] + aA[2], aA[1], aA[0] + aA[2], aA[1] + aA[4], aA[4]);
                    aD.lineTo(aA[0] + aA[2], aA[1] + aA[3] - aA[4]);
                    aD.arcTo(aA[0] + aA[2], aA[1] + aA[3], aA[0] + aA[2] - aA[4], aA[1] + aA[3], aA[4]);
                    aD.lineTo(aA[0] + aA[4], aA[1] + aA[3]);
                    aD.arcTo(aA[0], aA[1] + aA[3], aA[0], aA[1] + aA[3] - aA[4], aA[4]);
                    aD.lineTo(aA[0], aA[1] + aA[4]);
                    aD.arcTo(aA[0], aA[1], aA[0] + aA[4], aA[1], aA[4]);
                    aD.closePath();
                    if (az.bitmap) {
                        aD.save();
                        aD.clip();
                        aD.drawImage(az.bitmap.image, 0, 0, az.bitmap.width, az.bitmap.height, 0, 0, az.bitmap.width, az.bitmap.height);
                        aD.restore();
                        az.bitmap = null;
                        return
                    }
                    if (ay) {
                        aD.fillStyle = aC;
                        aD.fill()
                    }
                    if (ax > 0) {
                        aD.lineWidth = ax;
                        aD.strokeStyle = aB;
                        aD.stroke()
                    }
                });
                az.showList.push({
                    type: E.RECT,
                    arg: aA
                })
            },
            drawVertices: function(ax, aB, ay, az, aC) {
                var aA = this;
                if (ay.length < 3) {
                    return
                }
                aA.setList.push(function() {
                    var aG = ac.canvas;
                    aG.beginPath();
                    aG.moveTo(ay[0][0], ay[0][1]);
                    var aE, aD = ay.length,
                    aF;
                    for (aE = 1; aE < aD; aE++) {
                        aF = ay[aE];
                        aG.lineTo(aF[0], aF[1])
                    }
                    aG.lineTo(ay[0][0], ay[0][1]);
                    aG.closePath();
                    if (aA.bitmap) {
                        aG.save();
                        aG.clip();
                        aG.drawImage(aA.bitmap.image, aA.bitmap.x, aA.bitmap.y, aA.bitmap.width, aA.bitmap.height, 0, 0, aA.bitmap.width, aA.bitmap.height);
                        aG.restore();
                        aA.bitmap = null;
                        return
                    }
                    if (az) {
                        aG.fillStyle = aC;
                        aG.fill()
                    }
                    if (ax > 0) {
                        aG.lineWidth = ax;
                        aG.strokeStyle = aB;
                        aG.closePath();
                        aG.stroke()
                    }
                });
                aA.showList.push({
                    type: E.VERTICES,
                    arg: ay
                })
            },
            drawTriangles: function(aC, ax, aF, aE, ay) {
                var aG = this;
                var aB, aA, az = ax.length,
                aD;
                aG.setList.push(function() {
                    aD = ac.canvas;
                    var aQ = aC,
                    aN, aH, aP;
                    for (aB = 0, aA = 0; aB < az; aB += 3) {
                        aN = 0;
                        aD.save();
                        aD.beginPath();
                        aD.moveTo(aQ[ax[aB] * 2], aQ[ax[aB] * 2 + 1]);
                        aD.lineTo(aQ[ax[aB + 1] * 2], aQ[ax[aB + 1] * 2 + 1]);
                        aD.lineTo(aQ[ax[aB + 2] * 2], aQ[ax[aB + 2] * 2 + 1]);
                        aD.lineTo(aQ[ax[aB] * 2], aQ[ax[aB] * 2 + 1]);
                        aD.closePath();
                        if (aE) {
                            aD.lineWidth = aE;
                            aD.strokeStyle = ay;
                            aD.stroke()
                        }
                        aD.clip();
                        if (aB % 6 == 0) {
                            aP = -1;
                            var aO = (aF[ax[aB + 1 + aA] * 2] - aF[ax[aB + aA] * 2]) * aG.bitmap.width;
                            var aK = (aF[ax[aB + 2] * 2 + 1] - aF[ax[aB] * 2 + 1]) * aG.bitmap.height;
                            if (aA == 0 && aO < 0) {
                                for (aH = aB + 9; aH < az; aH += 3) {
                                    if (aF[ax[aB + 2] * 2 + 1] == aF[ax[aH + 2] * 2 + 1]) {
                                        aA = aH - aB;
                                        break
                                    }
                                }
                                if (aA == 0) {
                                    aA = az - aB
                                }
                                aO = (aF[ax[aB + 1 + aA] * 2] - aF[ax[aB + aA] * 2]) * aG.bitmap.width
                            }
                            if (aB + aA >= az) {
                                aO = (aF[ax[aB + aA - az] * 2] - aF[ax[aB + 1] * 2]) * aG.bitmap.width;
                                aP = aF[ax[aB] * 2] == 1 ? 0 : aG.bitmap.width * aF[ax[aB] * 2] + aO;
                                if (aP > aG.bitmap.width) {
                                    aP -= aG.bitmap.width
                                }
                            } else {
                                aP = aG.bitmap.width * aF[ax[aB + aA] * 2]
                            }
                            sh = aG.bitmap.height * aF[ax[aB] * 2 + 1];
                            if (aK < 0) {
                                aK = (aF[ax[aB + 2 - (aB > 0 ? 6 : -6)] * 2 + 1] - aF[ax[aB - (aB > 0 ? 6 : -6)] * 2 + 1]) * aG.bitmap.height;
                                sh = 0
                            }
                            var aM = (aQ[ax[aB + 1] * 2] - aQ[ax[aB] * 2]) / aO;
                            var aL = (aQ[ax[aB + 1] * 2 + 1] - aQ[ax[aB] * 2 + 1]) / aO;
                            var aJ = (aQ[ax[aB + 2] * 2] - aQ[ax[aB] * 2]) / aK;
                            var aI = (aQ[ax[aB + 2] * 2 + 1] - aQ[ax[aB] * 2 + 1]) / aK;
                            aD.transform(aM, aL, aJ, aI, aQ[ax[aB] * 2], aQ[ax[aB] * 2 + 1]);
                            aD.drawImage(aG.bitmap.image, aG.bitmap.x + aP, aG.bitmap.y + sh, aO, aK, 0, 0, aO, aK)
                        } else {
                            var aO = (aF[ax[aB + 2 + aA] * 2] - aF[ax[aB + 1 + aA] * 2]) * aG.bitmap.width;
                            var aK = (aF[ax[aB + 2] * 2 + 1] - aF[ax[aB] * 2 + 1]) * aG.bitmap.height;
                            if (aA == 0 && aO < 0) {
                                for (aH = aB + 9; aH < az; aH += 3) {
                                    if (aF[ax[aB + 2] * 2 + 1] == aF[ax[aH + 2] * 2 + 1]) {
                                        aA = aH - aB;
                                        break
                                    }
                                }
                                if (aA == 0) {
                                    aA = az - aB
                                }
                                aO = (aF[ax[aB + 2 + aA] * 2] - aF[ax[aB + 1 + aA] * 2]) * aG.bitmap.width
                            }
                            if (aB + 1 + aA >= az) {
                                aO = (aF[ax[aB + 1 + aA - az] * 2] - aF[ax[aB + 2] * 2]) * aG.bitmap.width;
                                aP = aF[ax[aB + 1] * 2] == 1 ? 0 : aG.bitmap.width * aF[ax[aB + 1] * 2] + aO;
                                if (aP > aG.bitmap.width) {
                                    aP -= aG.bitmap.width
                                }
                            } else {
                                aP = aG.bitmap.width * aF[ax[aB + 1 + aA] * 2]
                            }
                            sh = aG.bitmap.height * aF[ax[aB] * 2 + 1];
                            if (aK < 0) {
                                aK = (aF[ax[aB + 2 - (aB > 0 ? 6 : -6)] * 2 + 1] - aF[ax[aB - (aB > 0 ? 6 : -6)] * 2 + 1]) * aG.bitmap.height;
                                sh = 0
                            }
                            var aM = (aQ[ax[aB + 2] * 2] - aQ[ax[aB + 1] * 2]) / aO;
                            var aL = (aQ[ax[aB + 2] * 2 + 1] - aQ[ax[aB + 1] * 2 + 1]) / aO;
                            var aJ = (aQ[ax[aB + 2] * 2] - aQ[ax[aB] * 2]) / aK;
                            var aI = (aQ[ax[aB + 2] * 2 + 1] - aQ[ax[aB] * 2 + 1]) / aK;
                            aD.transform(aM, aL, aJ, aI, aQ[ax[aB + 1] * 2], aQ[ax[aB + 1] * 2 + 1]);
                            aD.drawImage(aG.bitmap.image, aG.bitmap.x + aP, aG.bitmap.y + sh, aO, aK, 0, -aK, aO, aK)
                        }
                        aD.restore()
                    }
                })
            },
            drawLine: function(ax, aA, az) {
                var ay = this;
                ay.setList.push(function() {
                    var aB = ac.canvas;
                    aB.beginPath();
                    aB.moveTo(az[0], az[1]);
                    aB.lineTo(az[2], az[3]);
                    aB.lineWidth = ax;
                    aB.strokeStyle = aA;
                    aB.closePath();
                    aB.stroke()
                });
                ay.showList.push({
                    type: E.LINE,
                    arg: az
                })
            },
            add: function(ax) {
                this.setList.push(ax)
            },
            remove: function(ay) {
                for (var ax = 0,
                az = this.setList.length; ax < az; ax++) {
                    if (this.setList[ax] === ay) {
                        this.setList.splice(ax, 1);
                        return
                    }
                }
            },
            ismouseon: function(ay, az) {
                var ax = this;
                if (ay == null || ay == T || ax.showList.length == 0 || !ax.parent) {
                    return false
                }
                return ax.parent.ismouseonShapes(ax.showList, ay.offsetX, ay.offsetY)
            },
            getWidth: function() {
                var aD = this,
                aB, aE, aC, ax, aA, az, ay;
                for (aB = 0, az = aD.showList.length; aB < az; aB++) {
                    if (aD.showList[aB].type == E.RECT) {
                        if (aC > aD.showList[aB].arg[0] || typeof aC == T) {
                            aC = aD.showList[aB].arg[0]
                        }
                        if (ax < aD.showList[aB].arg[0] + aD.showList[aB].arg[2] || typeof ax == T) {
                            ax = aD.showList[aB].arg[0] + aD.showList[aB].arg[2]
                        }
                    } else {
                        if (aD.showList[aB].type == E.ARC) {
                            if (aC > aD.showList[aB].arg[0] - aD.showList[aB].arg[2] || typeof aC == T) {
                                aC = aD.showList[aB].arg[0] - aD.showList[aB].arg[2]
                            }
                            if (ax < aD.showList[aB].arg[0] + aD.showList[aB].arg[2] || typeof ax == T) {
                                ax = aD.showList[aB].arg[0] + aD.showList[aB].arg[2]
                            }
                        } else {
                            if (aD.showList[aB].type == E.VERTICES) {
                                for (aE = 0, ay = aD.showList[aB].arg.length; aE < ay; aE++) {
                                    aA = aD.showList[aB].arg[aE];
                                    if (aC > aA[0] || typeof aC == T) {
                                        aC = aA[0]
                                    }
                                    if (ax < aA[0] || typeof ax == T) {
                                        ax = aA[0]
                                    }
                                }
                            } else {
                                if (aD.showList[aB].type == E.LINE) {
                                    if (aC > aD.showList[aB].arg[0] || typeof aC == T) {
                                        aC = aD.showList[aB].arg[0]
                                    }
                                    if (aC > aD.showList[aB].arg[2] || typeof aC == T) {
                                        aC = aD.showList[aB].arg[2]
                                    }
                                    if (ax < aD.showList[aB].arg[0] || typeof ax == T) {
                                        ax = aD.showList[aB].arg[0]
                                    }
                                    if (ax < aD.showList[aB].arg[2] || typeof ax == T) {
                                        ax = aD.showList[aB].arg[2]
                                    }
                                } else {
                                    if (aD.showList[aB].type == E.POINT) {
                                        if (aC > aD.showList[aB].arg[0] || typeof aC == T) {
                                            aC = aD.showList[aB].arg[0]
                                        }
                                        if (ax < aD.showList[aB].arg[0] || typeof ax == T) {
                                            ax = aD.showList[aB].arg[0]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (typeof aC == T) {
                    aC = ax = 0
                }
                aD.left = aC;
                if (az > 0 && ax == aC) {
                    ax = aC + 1
                }
                return ax - aC
            },
            getHeight: function() {
                var aD = this,
                aB = null,
                aE = null,
                az, ay, aC, ax, aA;
                for (aB = 0, az = aD.showList.length; aB < az; aB++) {
                    if (aD.showList[aB].type == E.RECT) {
                        if (aC > aD.showList[aB].arg[1] || typeof aC == T) {
                            aC = aD.showList[aB].arg[1]
                        }
                        if (ax < aD.showList[aB].arg[1] + aD.showList[aB].arg[3] || typeof ax == T) {
                            ax = aD.showList[aB].arg[1] + aD.showList[aB].arg[3]
                        }
                    } else {
                        if (aD.showList[aB].type == E.ARC) {
                            if (aC > aD.showList[aB].arg[1] - aD.showList[aB].arg[2] || typeof aC == T) {
                                aC = aD.showList[aB].arg[1] - aD.showList[aB].arg[2]
                            }
                            if (ax < aD.showList[aB].arg[1] + aD.showList[aB].arg[2] || typeof ax == T) {
                                ax = aD.showList[aB].arg[1] + aD.showList[aB].arg[2]
                            }
                        } else {
                            if (aD.showList[aB].type == E.VERTICES) {
                                for (aE = 0, ay = aD.showList[aB].arg.length; aE < ay; aE++) {
                                    aA = aD.showList[aB].arg[aE];
                                    if (aC > aA[1] || typeof aC == T) {
                                        aC = aA[1]
                                    }
                                    if (ax < aA[1] || typeof ax == T) {
                                        ax = aA[1]
                                    }
                                }
                            } else {
                                if (aD.showList[aB].type == E.LINE) {
                                    if (aC > aD.showList[aB].arg[1] || typeof aC == T) {
                                        aC = aD.showList[aB].arg[1]
                                    }
                                    if (aC > aD.showList[aB].arg[3] || typeof aC == T) {
                                        aC = aD.showList[aB].arg[3]
                                    }
                                    if (ax < aD.showList[aB].arg[1] || typeof ax == T) {
                                        ax = aD.showList[aB].arg[1]
                                    }
                                    if (ax < aD.showList[aB].arg[3] || typeof ax == T) {
                                        ax = aD.showList[aB].arg[3]
                                    }
                                } else {
                                    if (aD.showList[aB].type == E.POINT) {
                                        if (aC > aD.showList[aB].arg[1] || typeof aC == T) {
                                            aC = aD.showList[aB].arg[1]
                                        }
                                        if (ax < aD.showList[aB].arg[1] || typeof ax == T) {
                                            ax = aD.showList[aB].arg[1]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (typeof aC == T) {
                    aC = ax = 0
                }
                aD.top = aC;
                if (az > 0 && ax == aC) {
                    ax = aC + 1
                }
                return ax - aC
            },
            startX: function() {
                var ax = this;
                ax.getWidth();
                return ax.left
            },
            startY: function() {
                var ax = this;
                ax.getHeight();
                return ax.top
            }
        };
        for (var au in aw) {
            av.prototype[au] = aw[au]
        }
        return av
    })();
    var E = (function() {
        function au(ax) {
            var ay = this;
            n(ay, g, []);
            ay.type = "LShape";
            ay.graphics = new V();
            ay.graphics.parent = ay;
            if (ax) {
                D(ay)
            }
        }
        au.POINT = "point";
        au.LINE = "line";
        au.ARC = "arc";
        au.RECT = "rect";
        au.VERTICES = "vertices";
        var aw = {
            _ll_show: function(ay) {
                var ax = this;
                ax.graphics.ll_show()
            },
            getWidth: function(az) {
                var ay = this,
                aB, aC, aA = ay.graphics.startX(),
                ax = aA + ay.graphics.getWidth();
                if (az && ay.mask) {
                    aB = ay.mask._startX ? ay.mask._startX() : ay.mask.startX();
                    aC = ay.mask.getWidth();
                    if (aA < aB) {
                        aA = aB
                    }
                    if (ax > aB + aC) {
                        ax = aB + aC
                    }
                }
                ay.ll_left = ay.x + aA;
                ay.ll_right = ay.x + ax;
                return (ax - aA) * ay.scaleX
            },
            getHeight: function(aA) {
                var az = this,
                aC, ay, aB = az.graphics.startY(),
                ax = aB + az.graphics.getHeight();
                if (aA && az.mask) {
                    aC = az.mask._startY ? az.mask._startY() : az.mask.startY();
                    ay = az.mask.getHeight();
                    if (aB < aC) {
                        aB = aC
                    }
                    if (ax > aC + ay) {
                        ax = aC + ay
                    }
                }
                az.ll_top = az.y + aB;
                az.ll_bottom = az.y + ax;
                return (ax - aB) * az.scaleY
            },
            _startX: function() {
                var ax = this;
                ax.getWidth();
                return ax.ll_left
            },
            startX: function() {
                var ax = this;
                return ax._startX() * ax.scaleX
            },
            _startY: function() {
                var ax = this;
                ax.getHeight();
                return ax.ll_top
            },
            startY: function() {
                var ax = this;
                return ax._startY() * ax.scaleY
            },
            clone: function() {
                var ay = this,
                ax = new au(),
                aA,
                az;
                ax.copyProperty(ay);
                ax.graphics = ay.graphics.clone();
                ax.graphics.parent = ax;
                return ax
            },
            ismouseon: function(az, aB) {
                var ay = this,
                ax = false,
                aA;
                if (!ay.visible || az == null) {
                    return false
                }
                if (ay.mask) {
                    if (!ay.mask.parent) {
                        ay.mask.parent = ay.parent
                    }
                    if (!ay.mask.ismouseon(az, aB)) {
                        return false
                    }
                }
                aA = {
                    x: ay.x * aB.scaleX + aB.x,
                    y: ay.y * aB.scaleY + aB.y,
                    scaleX: aB.scaleX * ay.scaleX,
                    scaleY: aB.scaleY * ay.scaleY
                };
                if (ay.graphics) {
                    ax = ay.graphics.ismouseon(az, aA)
                }
                return ax
            },
            die: function() {
                var ax = this;
                ax.graphics.clear()
            }
        };
        for (var av in aw) {
            au.prototype[av] = aw[av]
        }
        return au
    })();
    var d = (function() {
        function aw(ax) {
            var ay = this;
            n(ay, Q, []);
            ay.type = "LSprite";
            ay.rotatex;
            ay.rotatey;
            ay.graphics = new V();
            ay.underGraphics = false;
            ay.graphics.parent = ay;
            ay.box2dBody = null;
            ay.shapes = new Array();
            ay.dragRange = null;
            ay.useCursor = null;
            if (ax) {
                D(ay)
            }
        }
        var av = {
            setRotate: function(ay) {
                var ax = this;
                if (ax.box2dBody) {
                    ax.box2dBody.SetAngle(ay)
                } else {
                    ax.rotate = ay
                }
            },
            _rotateReady: function() {
                var ax = this;
                if (ax.box2dBody) {
                    if ((typeof ax.rotatex) == T) {
                        ax.getRotateXY()
                    }
                    ax.x = ax.box2dBody.GetPosition().x * ac.box2d.drawScale - ax.parent.x - ax.rotatex;
                    ax.y = ax.box2dBody.GetPosition().y * ac.box2d.drawScale - ax.parent.y - ax.rotatey;
                    ax.rotate = ax.box2dBody.GetAngle()
                }
            },
            _ll_show: function(ay) {
                var ax = this;
                if (ax.underGraphics) {
                    ac.show(ax.childList);
                    ax.graphics.ll_show()
                } else {
                    ax.graphics.ll_show();
                    ac.show(ax.childList)
                }
                ax._ll_debugShape()
            },
            startDrag: function(ay) {
                var ax = this;
                if (ax.ll_dragStart) {
                    return
                }
                ax.ll_touchPointID = ay;
                ax.ll_dragGlobalPoint = ax.parent.localToGlobal(new S(ax.x, ax.y));
                ax.ll_dragMX = ab;
                ax.ll_dragMY = Z;
                ax.ll_dragStart = true;
                ac.dragList.push(ax)
            },
            stopDrag: function() {
                var az = this,
                ay, ax;
                for (ay = 0, ax = ac.dragList.length; ay < ax; ay++) {
                    if (az.objectIndex == ac.dragList[ay].objectIndex) {
                        az.ll_dragStart = false;
                        ac.dragList.splice(ay, 1);
                        break
                    }
                }
            },
            getRotateXY: function(ax, az) {
                var ay = this;
                if (!ax || !az) {
                    ax = ay.getWidth();
                    az = ay.getHeight()
                }
                ay.rotatex = ax / 2;
                ay.rotatey = az / 2
            },
            getWidth: function(aB) {
                var aH = this,
                aA, az, ax, aD, aC, aF, aG, ay = aH.graphics.startX(),
                aE = ay + aH.graphics.getWidth();
                for (aA = 0, az = aH.childList.length; aA < az; aA++) {
                    ax = aH.childList[aA];
                    if (typeof ax.visible == T || !ax.visible) {
                        continue
                    }
                    aD = ax.x;
                    if (typeof ax._startX == "function") {
                        aD = ax._startX()
                    }
                    aC = aD + ax.getWidth(aB);
                    if (aD < ay) {
                        ay = aD
                    }
                    if (aC > aE) {
                        aE = aC
                    }
                }
                if (aB && aH.mask) {
                    aF = aH.mask._startX ? aH.mask._startX() : aH.mask.startX();
                    aG = aH.mask.getWidth();
                    if (ay < aF) {
                        ay = aF
                    }
                    if (aE > aF + aG) {
                        aE = aF + aG
                    }
                }
                aH.ll_left = aH.x + ay;
                aH.ll_right = aH.x + aE;
                return (aE - ay) * aH.scaleX
            },
            getHeight: function(aB) {
                var aH = this,
                aA, az, ay, aF, aE, aG, aC, aD = aH.graphics.startY(),
                ax = aD + aH.graphics.getHeight();
                for (aA = 0, az = aH.childList.length; aA < az; aA++) {
                    ay = aH.childList[aA];
                    if (typeof ay.visible == T || !ay.visible) {
                        continue
                    }
                    aF = ay.y;
                    if (typeof ay._startY == "function") {
                        aF = ay._startY()
                    }
                    aE = aF + ay.getHeight(aB);
                    if (aF < aD) {
                        aD = aF
                    }
                    if (aE > ax) {
                        ax = aE
                    }
                }
                if (aB && aH.mask) {
                    aG = aH.mask._startY ? aH.mask._startY() : aH.mask.startY();
                    aC = aH.mask.getHeight();
                    if (aD < aG) {
                        aD = aG
                    }
                    if (ax > aG + aC) {
                        ax = aG + aC
                    }
                }
                aH.ll_top = aH.y + aD;
                aH.ll_bottom = aH.y + ax;
                return (ax - aD) * aH.scaleY
            },
            _startX: function() {
                var ax = this;
                ax.getWidth();
                return ax.ll_left
            },
            startX: function() {
                var ax = this;
                return ax._startX() * ax.scaleX
            },
            _startY: function() {
                var ax = this;
                ax.getHeight();
                return ax.ll_top
            },
            startY: function() {
                var ax = this;
                return ax._startY() * ax.scaleY
            },
            _ll_loopframe: function() {
                this.dispatchEvent(ar.ENTER_FRAME)
            },
            clone: function() {
                var aA = this,
                ay = new aw(),
                aC,
                aB,
                az,
                ax;
                ay.copyProperty(aA);
                ay.graphics = aA.graphics.clone();
                ay.graphics.parent = ay;
                ay.childList.length = 0;
                for (az = 0, ax = aA.childList.length; az < ax; az++) {
                    aC = aA.childList[az];
                    if (aC.clone) {
                        aB = aC.clone();
                        aB.parent = ay;
                        ay.childList.push(aB)
                    }
                }
                return ay
            },
            _mevent: function(az) {
                var ay = this,
                ax;
                for (ax = 0; ax < ay.mouseList.length; ax++) {
                    var aA = ay.mouseList[ax];
                    if (aA.type == az) {
                        return true
                    }
                }
                return false
            },
            ll_dispatchMouseEvent: function(aA, aB, aD, ay, ax) {
                var az = this;
                if (!az.mouseEnabled) {
                    return
                }
                for (au = 0; au < az.mouseList.length; au++) {
                    var aC = az.mouseList[au];
                    if (aC.type == aA) {
                        aB.selfX = (ay - (az.x * aD.scaleX + aD.x)) / (aD.scaleX * az.scaleX);
                        aB.selfY = (ax - (az.y * aD.scaleY + aD.y)) / (aD.scaleY * az.scaleY);
                        aB.currentTarget = aB.clickTarget = az;
                        if (!aB.target) {
                            aB.target = az
                        }
                        aC.listener(aB, az)
                    }
                }
            },
            ll_mouseout: function(aC, aB, aD, az, ax) {
                var aA = this;
                if (aB == af.MOUSE_MOVE && aA.ll_mousein) {
                    aA.ll_mousein = false;
                    if (aA._mevent(af.MOUSE_OUT)) {
                        aA.ll_dispatchMouseEvent(af.MOUSE_OUT, aC, aD, az, ax)
                    }
                    if (aA.mouseChildren) {
                        for (var ay = aA.childList.length - 1; ay >= 0; ay--) {
                            if (aA.childList[ay].mouseEvent && aA.childList[ay].ll_mouseout) {
                                aA.childList[ay].ll_mouseout(aC, aB, aD, az, ax)
                            }
                        }
                    }
                }
            },
            mouseEvent: function(aD, aE, az) {
                if (!aD) {
                    return false
                }
                var aG = this,
                aB, aA, ay = aD.offsetX,
                ax = aD.offsetY,
                aC, aF;
                if (!aG.visible) {
                    return false
                }
                if (az == null) {
                    az = {
                        x: 0,
                        y: 0,
                        scaleX: 1,
                        scaleY: 1
                    }
                }
                aC = aG.ismouseon(aD, az);
                if (aC) {
                    if (ac.os == U && aG.useCursor && aE == af.MOUSE_MOVE) {
                        ac.cursor = aG.useCursor
                    }
                    if (aE == af.MOUSE_MOVE && !aG.ll_mousein) {
                        aG.ll_mousein = true;
                        if (aG._mevent(af.MOUSE_OVER)) {
                            aG.ll_dispatchMouseEvent(af.MOUSE_OVER, aD, az, ay, ax)
                        }
                    }
                    if (aG.mouseChildren) {
                        aF = {
                            x: aG.x * az.scaleX + az.x,
                            y: aG.y * az.scaleY + az.y,
                            scaleX: az.scaleX * aG.scaleX,
                            scaleY: az.scaleY * aG.scaleY
                        };
                        for (aA = aG.childList.length - 1; aA >= 0; aA--) {
                            if (aG.childList[aA].mouseEvent) {
                                aB = aG.childList[aA].mouseEvent(aD, aE, aF);
                                if (aB) {
                                    aD.target = aG.childList[aA];
                                    if (aE != af.MOUSE_MOVE) {
                                        break
                                    }
                                }
                            }
                        }
                        if (aG._mevent(aE)) {
                            aG.ll_dispatchMouseEvent(aE, aD, az, ay, ax)
                        }
                    }
                    return true
                } else {
                    aG.ll_mouseout(aD, aE, az, ay, ax)
                }
                return false
            },
            hitTestPoint: function(ax, aA) {
                var az = this,
                ay = az.shapes;
                if (!ay || ay.length == 0) {
                    az.getWidth();
                    az.getHeight();
                    ay = [{
                        type: E.RECT,
                        arg: [az.ll_left - az.x, az.ll_top - az.y, az.ll_right - az.ll_left, az.ll_bottom - az.ll_top]
                    }]
                }
                return az.ismouseonShapes(ay, ax, aA)
            },
            hitTestObject: function(aC) {
                var aI = this,
                ax = aI.shapes,
                aA = aC.shapes,
                az, aG, aB, ay, aH, aD, aF, aE;
                if (!ax || ax.length == 0) {
                    aI.getWidth();
                    aI.getHeight();
                    ax = [{
                        type: E.RECT,
                        arg: [aI.ll_left - aI.x, aI.ll_top - aI.y, aI.ll_right - aI.ll_left, aI.ll_bottom - aI.ll_top]
                    }]
                }
                if (!aA || aA.length == 0) {
                    aC.getWidth();
                    aC.getHeight();
                    aA = [{
                        type: E.RECT,
                        arg: [aC.ll_left - aC.x, aC.ll_top - aC.y, aC.ll_right - aC.ll_left, aC.ll_bottom - aC.ll_top]
                    }]
                }
                az = aI.getRootMatrix();
                aG = aC.getRootMatrix();
                for (aB = ax.length - 1; aB >= 0; aB--) {
                    ay = ax[aB];
                    aE = aI._changeShape(ay.type, ay.arg, az);
                    for (aH = aA.length - 1; aH >= 0; aH--) {
                        aD = aA[aH];
                        aF = aC._changeShape(aD.type, aD.arg, aG);
                        if (ay.type == E.VERTICES || ay.type == E.RECT) {
                            if (aD.type == E.VERTICES || aD.type == E.RECT) {
                                if (ac.hitTestPolygon(aE, aF)) {
                                    return true
                                }
                            } else {
                                if (aD.type == E.ARC) {
                                    if (ac.hitTestPolygonArc(aE, aF)) {
                                        return true
                                    }
                                }
                            }
                        } else {
                            if (aD.type == E.VERTICES || aD.type == E.RECT) {
                                if (ac.hitTestPolygonArc(aF, aE)) {
                                    return true
                                }
                            } else {
                                if (aD.type == E.ARC) {
                                    if (Math.sqrt((aE[0] - aF[0]) * (aE[0] - aF[0]) + (aE[1] - aF[1]) * (aE[1] - aF[1])) < aE[2] + aF[2]) {
                                        return true
                                    }
                                }
                            }
                        }
                    }
                }
                return false
            },
            addShape: function(az, ax) {
                var ay = this;
                if (az == E.VERTICES && ax.length < 3) {
                    return
                }
                ay.shapes.push({
                    type: az,
                    arg: ax
                });
                return ay.shapes
            },
            addShapes: function(ax) {
                var ay = this;
                if (ay.shapes.length == 0) {
                    ay.shapes = ax
                } else {
                    ay.shapes = ay.shapes.concat(ax)
                }
            },
            clearShape: function() {
                this.shapes = []
            },
            _ll_debugShape: function() {
                var aB = this,
                aA, ay, aE, aD, ax, az, aC;
                if (!ac.traceDebug || aB.shapes.length == 0) {
                    return
                }
                for (aA = 0, ay = aB.shapes.length; aA < ay; aA++) {
                    aE = aB.shapes[aA];
                    aD = ac.canvas;
                    ax = aE.arg;
                    aD.beginPath();
                    if (aE.type == E.RECT) {
                        aD.rect(ax[0], ax[1], ax[2], ax[3])
                    } else {
                        if (aE.type == E.ARC) {
                            aD.arc(ax[0], ax[1], ax[2], 0, 2 * Math.PI)
                        } else {
                            if (aE.type == E.VERTICES) {
                                aD.moveTo(ax[0][0], ax[0][1]);
                                for (az = 1, aC = ax.length; az < aC; az++) {
                                    aD.lineTo(ax[az][0], ax[az][1])
                                }
                                aD.lineTo(ax[0][0], ax[0][1])
                            }
                        }
                    }
                    aD.closePath();
                    aD.strokeStyle = "#00FF00";
                    aD.stroke()
                }
            },
            ismouseon: function(aB, aD) {
                var aA = this;
                if (!aA.visible || aB == null) {
                    return false
                }
                if (aA.mask) {
                    if (!aA.mask.parent) {
                        aA.mask.parent = aA.parent
                    }
                    if (!aA.mask.ismouseon(aB, aD)) {
                        return false
                    }
                }
                if (aA.shapes && aA.shapes.length > 0) {
                    return aA.ismouseonShapes(aA.shapes, aB.offsetX, aB.offsetY)
                }
                var ay, az = false,
                ax = aA.childList,
                aC = {
                    x: aA.x * aD.scaleX + aD.x,
                    y: aA.y * aD.scaleY + aD.y,
                    scaleX: aD.scaleX * aA.scaleX,
                    scaleY: aD.scaleY * aA.scaleY
                };
                for (ay = ax.length - 1; ay >= 0; ay--) {
                    if (ax[ay].ismouseon) {
                        az = ax[ay].ismouseon(aB, aC)
                    }
                    if (az) {
                        aB.target = aA.childList[ay];
                        break
                    }
                }
                if (!az) {
                    az = aA.graphics.ismouseon(aB, aC)
                }
                return az
            },
            die: function() {
                var az = this,
                ay, aA, ax;
                az.graphics.clear();
                az.removeAllEventListener();
                az.stopDrag();
                if (az.box2dBody) {
                    az.clearBody()
                }
                for (ay = 0, aA = az.childList, ax = aA.length; ay < ax; ay++) {
                    if (aA[ay].die) {
                        aA[ay].die()
                    }
                }
            }
        };
        for (var au in av) {
            aw.prototype[au] = av[au]
        }
        return aw
    })();
    var W = (function() {
        function au(aC, ax, aB, ay, aA) {
            var az = this;
            n(az, A, []);
            az.type = "LBitmap";
            az.rotateCenter = true;
            if (aC.type && aC.type === "LBitmapData") {
                az.bitmapData = aC
            } else {
                az.bitmapData = new p(aC)
            }
            az.width = ay || az.bitmapData.width;
            az.height = aA || az.bitmapData.height;
            az.x = ax || 0;
            az.y = aB || 0;
            az.rotatex = az.getWidth() * 0.5;
            az.rotatey = az.getHeight() * 0.5
        }
        var aw = {
            _canShow: function() {
                return (this.visible && this.bitmapData)
            },
            _rotateReady: function() {
                var ax = this;
                if (ax.rotate != 0 && ax.rotateCenter) {
                    ax.rotatex = ax.getWidth() * 0.5;
                    ax.rotatey = ax.getHeight() * 0.5
                } else {
                    if (typeof ax.rotatex == T) {
                        ax.rotatex = ax.rotatey = 0
                    }
                }
            },
            _coordinate: function(ax) {},
            _ll_show: function() {
                this.ll_draw()
            },
            ll_draw: function() {
                var ax = this;
                if (ac.fpsStatus) {
                    ac.fpsStatus.bitmapData++
                }
                ac.canvas.drawImage(ax.bitmapData.image, ax.bitmapData.x, ax.bitmapData.y, ax.bitmapData.width, ax.bitmapData.height, ax.x, ax.y, ax.width, ax.height)
            },
            clone: function() {
                var ay = this,
                ax = new au(ay.bitmapData.clone(), ay.x, ay.y, ay.width, ay.height);
                ax.copyProperty(ay);
                ax.rotateCenter = ay.rotateCenter;
                return ax
            },
            ismouseon: function(az, ay) {
                var ax = this;
                if (!az) {
                    return false
                }
                if (!ax.visible || !ax.bitmapData) {
                    return false
                }
                if (ax.mask) {
                    if (!ax.mask.parent) {
                        ax.mask.parent = ax.parent
                    }
                    if (!ax.mask.ismouseon(az, ay)) {
                        return false
                    }
                }
                return ax.ismouseonShapes([{
                    type: E.RECT,
                    arg: [0, 0, ax.width, ax.height]
                }], az.offsetX, az.offsetY)
            },
            getWidth: function(az) {
                var ay = this,
                ax, aA, aB;
                ax = ay.width || (ay.bitmapData != null ? ay.bitmapData.width * (ay.scaleX > 0 ? ay.scaleX: -ay.scaleX) : 0);
                if (az && ay.mask) {
                    aA = ay.mask._startX ? ay.mask._startX() : ay.mask.startX();
                    if (aA > ax) {
                        return 0
                    }
                    aB = ay.mask.getWidth();
                    if (aA + aB > ax) {
                        return ax - aA
                    } else {
                        return aB
                    }
                }
                ay.ll_left = ay.x;
                ay.ll_right = ay.x + ax;
                return ax
            },
            getHeight: function(aA) {
                var az = this,
                ay, aB, ax;
                ay = az.height || (az.bitmapData != null ? az.bitmapData.height * (az.scaleY > 0 ? az.scaleY: -az.scaleY) : 0);
                if (aA && az.mask) {
                    aB = az.mask._startY ? az.mask._startY() : az.mask.startY();
                    if (aB > ay) {
                        return 0
                    }
                    ax = az.mask.getHeight();
                    if (aB + ax > ay) {
                        return ay - aB
                    } else {
                        return ax
                    }
                }
                az.ll_top = az.y;
                az.ll_bottom = az.y + ay;
                return ay
            },
            startX: function() {
                return this.x
            },
            startY: function() {
                return this.y
            },
            die: function() {}
        };
        for (var av in aw) {
            au.prototype[av] = aw[av]
        }
        return au
    })();
    var p = (function() {
        function av(ay, aD, aB, ax, aE, aC) {
            var aF = this;
            n(aF, I, []);
            aF.type = "LBitmapData";
            if (typeof aC == T) {
                aC = av.DATA_IMAGE
            }
            aF.oncomplete = null;
            aF._locked = false;
            aF._setPixel = false;
            aF.x = (aD == null ? 0 : aD);
            aF.y = (aB == null ? 0 : aB);
            aF.width = 0;
            aF.height = 0;
            aF.dataType = null;
            if (ay && typeof ay == "object") {
                aF.image = ay;
                aF.dataType = av.DATA_IMAGE;
                aF.width = (ax == null ? aF.image.width: ax);
                aF.height = (aE == null ? aF.image.height: aE);
                aF._setDataType(aC)
            } else {
                aF._createCanvas();
                aF.dataType = av.DATA_CANVAS;
                aF._canvas.width = aF.width = (ax == null ? 1 : ax);
                aF._canvas.height = aF.height = (aE == null ? 1 : aE);
                if (typeof ay == "string") {
                    ay = parseInt(ay.replace("#", "0x"))
                }
                if (typeof ay == "number") {
                    var aA = aF._context.createImageData(aF.width, aF.height);
                    for (var az = 0; az < aA.data.length; az += 4) {
                        aA.data[az + 0] = ay >> 16 & 255;
                        aA.data[az + 1] = ay >> 8 & 255;
                        aA.data[az + 2] = ay & 255;
                        aA.data[az + 3] = 255
                    }
                    aF._context.putImageData(aA, 0, 0)
                }
                aF.image = aF._canvas;
                if (aC == av.DATA_IMAGE) {
                    aF._setDataType(aC)
                }
            }
            aF.resize()
        }
        av.DATA_IMAGE = "data_image";
        av.DATA_CANVAS = "data_canvas";
        var aw = {
            _setDataType: function(ax) {
                var ay = this;
                if (ay.dataType == ax) {
                    return
                }
                if (ax == av.DATA_CANVAS) {
                    ay._createCanvas();
                    ay._canvas.width = ay.image.width;
                    ay._canvas.height = ay.image.height;
                    ay._context.clearRect(0, 0, ay._canvas.width, ay._canvas.height);
                    ay._context.drawImage(ay.image, 0, 0);
                    ay.image = ay._canvas
                } else {
                    if (ax == av.DATA_IMAGE) {
                        ay.image = new Image();
                        ay.image.width = ay._canvas.width;
                        ay.image.height = ay._canvas.height;
                        ay.image.src = ay._canvas.toDataURL()
                    }
                }
                ay.dataType = ax
            },
            _createCanvas: function() {
                var ax = this;
                if (!ax._canvas) {
                    ax._canvas = document.createElement("canvas");
                    ax._context = ax._canvas.getContext("2d")
                }
            },
            clear: function() {
                var ax = this;
                ax._createCanvas();
                ax._canvas.width = ax.image.width;
                if (ax.dataType == av.DATA_IMAGE) {
                    ax.image.src = ax._canvas.toDataURL()
                }
            },
            setProperties: function(ay, aB, aA, ax) {
                var az = this;
                az.x = ay;
                az.y = aB;
                az.width = aA;
                az.height = ax;
                az.resize()
            },
            setCoordinate: function(ax, az) {
                var ay = this;
                ay.x = ax;
                ay.y = az;
                ay.resize()
            },
            clone: function() {
                var ax = this;
                return new av(ax.image, ax.x, ax.y, ax.width, ax.height, ax.dataType)
            },
            _ready: function() {
                var ax = this;
                ax._dataType = ax.dataType;
                ax._setDataType(av.DATA_CANVAS);
                ax._data = ax._context.getImageData(ax.x, ax.y, ax.width, ax.height)
            },
            _update: function() {
                var ax = this;
                ax._context.putImageData(ax._data, ax.x, ax.y, 0, 0, ax.width, ax.height);
                ax._setDataType(ax._dataType);
                ax._data = null
            },
            applyFilter: function(aD, aA, ax, az) {
                var ay = this;
                var aB = ay._context.getImageData(ay.x + aA.x, ay.y + aA.y, aA.width, aA.height);
                var aC = az.filter(aB, aA.width);
                ay.putPixels(new f(ax.x, ax.y, aA.width, aA.height), aC)
            },
            getPixel: function(ax, aC, ay) {
                var aA = this,
                az, aB;
                ax = ax >> 0;
                aC = aC >> 0;
                if (!aA._locked) {
                    aA._ready()
                }
                az = aA.width * 4 * aC + ax * 4;
                aB = aA._data.data;
                if (!aA._locked) {
                    aA._update()
                }
                if (ay == "number") {
                    return aB[az] << 16 | aB[az + 1] << 8 | aB[az + 2]
                } else {
                    return [aB[az], aB[az + 1], aB[az + 2], aB[az + 3]]
                }
            },
            setPixel: function(ax, aC, aA) {
                var az = this;
                ax = ax >> 0;
                aC = aC >> 0;
                if (!az._locked) {
                    az._ready()
                }
                var aB = az._data,
                ay = az.width * 4 * aC + ax * 4;
                if (typeof aA == "object") {
                    aB.data[ay + 0] = aA[0];
                    aB.data[ay + 1] = aA[1];
                    aB.data[ay + 2] = aA[2];
                    aB.data[ay + 3] = aA[3]
                } else {
                    if (typeof aA == "string") {
                        aA = parseInt(aA.replace("#", "0x"))
                    }
                    aB.data[ay + 0] = aA >> 16 & 255;
                    aB.data[ay + 1] = aA >> 8 & 255;
                    aB.data[ay + 2] = aA & 255;
                    aB.data[ay + 3] = 255
                }
                if (!az._locked) {
                    az._update()
                }
            },
            getPixels: function(az) {
                var ax = this,
                ay;
                if (!ax._locked) {
                    ax._ready()
                }
                ay = ax._context.getImageData(ax.x + az.x, ax.y + az.y, az.width, az.height);
                if (!ax._locked) {
                    ax._update()
                }
                return ay
            },
            setPixels: function(aD, ay) {
                var aG = this,
                az, ax, aA, aF, aB, aE, aC;
                if (!aG._locked) {
                    aG._ready()
                }
                aA = aG._data;
                if (typeof ay == "object") {
                    aF = aG._canvas.width;
                    for (aE = aD.x; aE < aD.right; aE++) {
                        for (aC = aD.y; aC < aD.bottom; aC++) {
                            az = aF * 4 * (aG.y + aC) + (aG.x + aE) * 4;
                            ax = ay.width * 4 * (aC - aD.y) + (aE - aD.x) * 4;
                            aA.data[az + 0] = ay.data[ax + 0];
                            aA.data[az + 1] = ay.data[ax + 1];
                            aA.data[az + 2] = ay.data[ax + 2];
                            aA.data[az + 3] = ay.data[ax + 3]
                        }
                    }
                } else {
                    if (typeof ay == "string") {
                        ay = parseInt(ay.replace("#", "0x"))
                    }
                    ay = [ay >> 16 & 255, ay >> 8 & 255, ay & 255];
                    aF = aG._canvas.width;
                    for (aE = aD.x; aE < aD.right; aE++) {
                        for (aC = aD.y; aC < aD.bottom; aC++) {
                            az = aF * 4 * (aG.y + aC) + (aG.x + aE) * 4;
                            aA.data[az + 0] = ay[0];
                            aA.data[az + 1] = ay[1];
                            aA.data[az + 2] = ay[2];
                            aA.data[az + 3] = 255
                        }
                    }
                }
                if (!aG._locked) {
                    aG._update()
                }
            },
            putPixels: function(ay, az) {
                var ax = this;
                if (ax.dataType != av.DATA_CANVAS || typeof az != "object") {
                    return
                }
                ax._context.putImageData(az, ax.x + ay.x, ax.y + ay.y, 0, 0, ay.width, ay.height)
            },
            lock: function() {
                var ax = this;
                ax._locked = true;
                ax._ready()
            },
            unlock: function() {
                var ax = this;
                ax._locked = false;
                ax._update()
            },
            draw: function(ax, aH, ay, aF, az) {
                var aK = this,
                aD, aB = ax,
                aG, aE, aI, aA, aC = false;
                var aJ = aK.dataType;
                aK._setDataType(av.DATA_CANVAS);
                if (aH || ay || aF || az) {
                    aK._context.save();
                    aC = true
                }
                if (az) {
                    if (! (aB instanceof av)) {
                        aG = aE = 0
                    } else {
                        aG = aB.x;
                        aE = aB.y
                    }
                    aB = new av(aB.getDataCanvas(), aG + az.x, aE + az.y, az.width, az.height, av.DATA_CANVAS)
                }
                aI = aB.getWidth() >>> 0;
                aA = aB.getHeight() >>> 0;
                if (aI == 0 || aA == 0) {
                    aK._setDataType(aJ);
                    return
                }
                aD = aB.getDataCanvas();
                if (ay) {
                    aB.colorTransform(new f(0, 0, aI, aA), ay);
                    aD = aB.image
                }
                if (aH) {
                    aK._context.setTransform(aH.a, aH.b, aH.c, aH.d, aH.tx, aH.ty)
                }
                if (aF) {
                    aK._context.globalCompositeOperation = aF
                }
                aK._context.drawImage(aD, aB.x, aB.y, aI, aA, 0, 0, aI, aA);
                if (aC) {
                    aK._context.restore()
                }
                aK._setDataType(aJ);
                aK.resize()
            },
            getDataCanvas: function() {
                var ay = this;
                var ax = ay.dataType;
                ay._setDataType(av.DATA_CANVAS);
                ay._setDataType(ax);
                return ay._canvas
            },
            getWidth: function() {
                return this.width
            },
            getHeight: function() {
                return this.height
            },
            resize: function() {
                var az = this,
                ax = az.image.width - az.x,
                ay = az.image.height - az.y;
                az.width = az.width < ax ? az.width: ax;
                az.height = az.height < ay ? az.height: ay
            },
            colorTransform: function(aH, az) {
                var aL = this;
                if (aL.dataType != av.DATA_CANVAS) {
                    return
                }
                var aJ = aH.x >> 0,
                aG = aH.y >> 0,
                aK = aH.width >> 0,
                aD = aH.height >> 0;
                var aC = aL._context.getImageData(aL.x + aH.x, aL.y + aH.y, aH.width, aH.height);
                var aB = aC.data;
                for (var aA = 0,
                ay = aB.length; aA < ay; aA += 4) {
                    var ax = aA,
                    aE = aA + 1,
                    aF = aA + 2,
                    aI = aA + 3;
                    aB[ax] = aB[ax] * az.redMultiplier + az.redOffset;
                    aB[aE] = aB[aE] * az.greenMultiplier + az.greenOffset;
                    aB[aF] = aB[aF] * az.blueMultiplier + az.blueOffset;
                    aB[aI] = aB[aI] * az.alphaMultiplier + az.alphaOffset
                }
                aL._context.putImageData(aC, aL.x + aH.x, aL.y + aH.y, 0, 0, aH.width, aH.height)
            },
            copyPixels: function(az, aD, aB) {
                var aF = this,
                ay, aC, ax, aE, aA = az;
                if (aF.dataType != av.DATA_CANVAS) {
                    return
                }
                ay = aA.x;
                aC = aA.y;
                ax = aA.width;
                aE = aA.height;
                aA.setProperties(aD.x + aA.x, aD.y + aA.y, aD.width, aD.height);
                aF._context.drawImage(aA.image, aA.x, aA.y, aA.width, aA.height, aB.x, aB.y, aA.width, aA.height);
                aA.x = ay;
                aA.y = aC;
                aA.width = ax;
                aA.height = aE
            }
        };
        for (var au in aw) {
            av.prototype[au] = aw[au]
        }
        return av
    })();
    var s = (function() {
        function au() {
            var av = this;
            n(av, I, []);
            av.type = "LBitmapFilter"
        }
        au.prototype.ll_show = function(ay) {
            var av = this;
            if (av.cacheMaking) {
                return
            }
            var az = ac.canvas,
            ax = ay,
            aw;
            if (ax.constructor.name == "LBitmap") {
                aw = ax.bitmapData
            } else {
                if (!ax._ll_cacheAsBitmap) {
                    av.cacheMaking = true;
                    ax.cacheAsBitmap(true);
                    av.cacheMaking = false
                }
                aw = ax._ll_cacheAsBitmap.bitmapData
            }
            if (av.bitmapDataIndex === aw.objectIndex) {
                return
            }
            av.bitmapDataIndex = aw.objectIndex;
            aw.applyFilter(aw, new f(0, 0, aw.width, aw.height), new S(0, 0), av)
        };
        return au
    })();
    var K = (function() {
        function aw(aB, aA, ax, az) {
            var ay = this;
            n(ay, s, []);
            ay.type = "LDropShadowFilter";
            ay.distance = aB ? aB: 0;
            ay.angle = aA ? aA: 0;
            ay.shadowColor = ax ? ax: "#000000";
            ay.shadowBlur = az ? az: 20;
            ay.setShadowOffset()
        }
        var av = {
            setShadowOffset: function() {
                var ay = this;
                var ax = ay.angle * Math.PI / 180;
                ay.shadowOffsetX = ay.distance * Math.cos(ax);
                ay.shadowOffsetY = ay.distance * Math.sin(ax)
            },
            ll_show: function() {
                var ax = this,
                ay = ac.canvas;
                ay.shadowColor = ax.shadowColor;
                ay.shadowBlur = ax.shadowBlur;
                ay.shadowOffsetX = ax.shadowOffsetX;
                ay.shadowOffsetY = ax.shadowOffsetY
            },
            setDistance: function(ax) {
                this.distance = ax;
                this.setShadowOffset()
            },
            setAngle: function(ax) {
                this.angle = ax;
                this.setShadowOffset()
            },
            setColor: function(ax) {
                this.shadowColor = ax
            },
            setBlur: function(ax) {
                this.shadowBlur = ax
            }
        };
        for (var au in av) {
            aw.prototype[au] = av[au]
        }
        return aw
    })();
    var aj = (function() {
        function aw(ax) {
            var ay = this;
            n(ay, s, []);
            ay.type = "LColorMatrixFilter";
            ay.matrix = ax
        }
        var av = {
            filter: function(ax, aF) {
                var aG = this,
                aB = ac.canvas;
                var aC = ax.data;
                var aA = aB.createImageData(ax);
                var aE = aA.data;
                var az = aE.length;
                var aD = aG.matrix;
                for (var ay = 0; ay < az; ay += 4) {
                    aE[ay] = (aD[0] * aC[ay]) + (aD[1] * aC[ay + 1]) + (aD[2] * aC[ay + 2]) + (aD[3] * aC[ay + 3]) + aD[4];
                    aE[ay + 1] = (aD[5] * aC[ay]) + (aD[6] * aC[ay + 1]) + (aD[7] * aC[ay + 2]) + (aD[8] * aC[ay + 3]) + aD[9];
                    aE[ay + 2] = (aD[10] * aC[ay]) + (aD[11] * aC[ay + 1]) + (aD[12] * aC[ay + 2]) + (aD[13] * aC[ay + 3]) + aD[14];
                    aE[ay + 3] = (aD[15] * aC[ay]) + (aD[16] * aC[ay + 1]) + (aD[17] * aC[ay + 2]) + (aD[18] * aC[ay + 3]) + aD[19]
                }
                return aA
            }
        };
        for (var au in av) {
            aw.prototype[au] = av[au]
        }
        return aw
    })();
    var e = (function() {
        function av(aB, ay, aF, ax, aD, aE, aC, aA, az) {
            var aG = this;
            n(aG, s, []);
            aG.type = "LConvolutionFilter";
            aG.matrixX = aB ? aB: 0;
            aG.matrixY = ay ? ay: 0;
            aG.matrix = aF;
            if (!ax) {
                ax = aF.reduce(function(aI, aH) {
                    return aI + aH
                }) || 1
            }
            aG.divisor = ax;
            aG.bias = aD ? aD: 0
        }
        var aw = {
            filter: function(ax, aG) {
                var aH = this,
                aD = ac.canvas;
                var aE = ax.data;
                var aC = aD.createImageData(ax);
                var aF = aC.data;
                var aB = aF.length;
                for (var aA = 0; aA < aB; aA++) {
                    if ((aA + 1) % 4 === 0) {
                        aF[aA] = aE[aA];
                        continue
                    }
                    res = 0;
                    var ay = [aE[aA - aG * 4 - 4] || aE[aA], aE[aA - aG * 4] || aE[aA], aE[aA - aG * 4 + 4] || aE[aA], aE[aA - 4] || aE[aA], aE[aA], aE[aA + 4] || aE[aA], aE[aA + aG * 4 - 4] || aE[aA], aE[aA + aG * 4] || aE[aA], aE[aA + aG * 4 + 4] || aE[aA]];
                    for (var az = 0; az < 9; az++) {
                        res += ay[az] * aH.matrix[az]
                    }
                    res /= aH.divisor;
                    if (aH.bias) {
                        res += aH.bias
                    }
                    aF[aA] = res
                }
                return aC
            }
        };
        for (var au in aw) {
            av.prototype[au] = aw[au]
        }
        return av
    })();
    var h = (function() {
        function av(ay, aC, ax, aA, aE, aD, aF, az, aB) {
            var aG = this;
            n(aG, d, []);
            aG.type = "LAnimation";
            aG.index = 0;
            aG.frameInc = 0;
            aG.loop = aA || "loop";
            aG.count = aB || 0;
            aG.fps = ax || 60 / 1000;
            if (Array.isArray(ay)) {
                aG.bitmapList = ay
            } else {
                aG.bitmapList = [ay]
            }
            aG.bitmap = new W(aG.bitmapList[0], aE, aD, aF, az);
            aG.imageArray = aC;
            aG.addChild(aG.bitmap);
            aG.index = 0;
            aG.addEventListener(ar.ENTER_FRAME, aG.onframe.bind(aG))
        }
        var aw = {
            change: function(ay, aC, ax, aA, aE, aD, aF, az, aB) {
                var aG = this;
                if (ay) {
                    if (Array.isArray(ay)) {
                        aG.bitmapList = ay
                    } else {
                        aG.bitmapList = [ay]
                    }
                    aG.bitmap.bitmapData = aG.bitmapList[0]
                }
                aE && (aG.bitmap.x = aE);
                aD && (aG.bitmap.y = aD);
                aF && (aG.bitmap.width = aF);
                az && (aG.bitmap.height = az);
                aC && (aG.imageArray = aC);
                ax && (aG.fps = ax);
                aA && (aG.loop = aA);
                aG.index = 0;
                aG.frameInc = 0;
                aG.count = aB || 0
            },
            onframe: function() {
                var az = this,
                ax, aC = 0,
                aA = az.imageArray || az.bitmapList;
                if (az._ll_stop) {
                    return
                }
                if (az.loop === "none") {
                    return
                }
                if (az.bitmapList.length === 1 && (!aA || !Array.isArray(aA) || aA.length <= 1)) {
                    return
                }
                if (az.index >= aA.length) {
                    az.index = 0
                }
                az.frameInc += az.fps * ac.delta;
                var ay = Math.floor(az.frameInc);
                var aB = az.index;
                az.index = ay % aA.length;
                if (az.bitmapList.length > 1 && az.index < az.bitmapList.length) {
                    az.bitmap.bitmapData = az.bitmapList[az.index]
                }
                if (az.imageArray && Array.isArray(az.imageArray)) {
                    ax = aA[az.index];
                    if (typeof ax.dataIndex == "number" && Array.isArray(az.bitmapList) && ax.dataIndex < az.bitmapList.length) {
                        az.bitmap.bitmapData = az.bitmapList[ax.dataIndex]
                    }
                    if (typeof ax.width != T && typeof ax.height != T) {
                        az.bitmap.bitmapData.setProperties(ax.x, ax.y, ax.width, ax.height)
                    } else {
                        az.bitmap.bitmapData.setCoordinate(ax.x, ax.y)
                    }
                    if (typeof ax.sx != T) {
                        aC = ax.sx
                    }
                    if (typeof ax.sy != T) {
                        az.bitmap.y = ax.sy
                    }
                    if (typeof ax.mirror != T) {
                        az.bitmap.rotateCenter = false;
                        az.bitmap.scaleX = ax.mirror ? -1 : 1
                    }
                    az.bitmap.x = aC + (az.bitmap.scaleX == 1 ? 0 : az.bitmap.getWidth())
                }
                if (aB !== az.index && az.index === aA.length - 1) {
                    az.dispatchEvent(ar.COMPLETE);
                    if (typeof az.count == "number") {
                        az.count++
                    }
                    if (typeof az.loop === "number") {
                        az.loop--;
                        if (az.loop <= 0) {
                            az.remove();
                            az.die()
                        }
                    }
                }
            },
            play: function() {
                this._ll_stop = false
            },
            stop: function() {
                this._ll_stop = true
            },
            clone: function() {
                var ay = this,
                ax = new ay.constructor(null, ay.bitmapList, ay.imageArray.slice(0));
                ax.copyProperty(ay);
                ax.childList.length = 0;
                ax.bitmap = ay.bitmap.clone();
                ax.addChild(ax.bitmap);
                return ax
            }
        };
        for (var au in aw) {
            av.prototype[au] = aw[au]
        }
        return av
    })();
    var C = {
        None: {
            easeIn: function(av, au, ax, aw) {
                return au + av * ax / aw
            },
            easeOut: function(av, au, ax, aw) {
                return au + av * ax / aw
            },
            easeInOut: function(av, au, ax, aw) {
                return au + av * ax / aw
            }
        },
        Quad: {
            easeIn: function(av, au, ax, aw) {
                return ax * (av /= aw) * av + au
            },
            easeOut: function(av, au, ax, aw) {
                return - ax * (av /= aw) * (av - 2) + au
            },
            easeInOut: function(av, au, ax, aw) {
                if ((av /= aw / 2) < 1) {
                    return ax / 2 * av * av + au
                }
                return - ax / 2 * ((--av) * (av - 2) - 1) + au
            }
        },
        Cubic: {
            easeIn: function(av, au, ax, aw) {
                return ax * (av /= aw) * av * av + au
            },
            easeOut: function(av, au, ax, aw) {
                return ax * ((av = av / aw - 1) * av * av + 1) + au
            },
            easeInOut: function(av, au, ax, aw) {
                if ((av /= aw / 2) < 1) {
                    return ax / 2 * av * av * av + au
                }
                return ax / 2 * ((av -= 2) * av * av + 2) + au
            }
        },
        Quart: {
            easeIn: function(av, au, ax, aw) {
                return ax * (av /= aw) * av * av * av + au
            },
            easeOut: function(av, au, ax, aw) {
                return - ax * ((av = av / aw - 1) * av * av * av - 1) + au
            },
            easeInOut: function(av, au, ax, aw) {
                if ((av /= aw / 2) < 1) {
                    return ax / 2 * av * av * av * av + au
                }
                return - ax / 2 * ((av -= 2) * av * av * av - 2) + au
            }
        },
        Quint: {
            easeIn: function(av, au, ax, aw) {
                return ax * (av /= aw) * av * av * av * av + au
            },
            easeOut: function(av, au, ax, aw) {
                return ax * ((av = av / aw - 1) * av * av * av * av + 1) + au
            },
            easeInOut: function(av, au, ax, aw) {
                if ((av /= aw / 2) < 1) {
                    return ax / 2 * av * av * av * av * av + au
                }
                return ax / 2 * ((av -= 2) * av * av * av * av + 2) + au
            }
        },
        Sine: {
            easeIn: function(av, au, ax, aw) {
                return - ax * Math.cos(av / aw * (Math.PI / 2)) + ax + au
            },
            easeOut: function(av, au, ax, aw) {
                return ax * Math.sin(av / aw * (Math.PI / 2)) + au
            },
            easeInOut: function(av, au, ax, aw) {
                return - ax / 2 * (Math.cos(Math.PI * av / aw) - 1) + au
            }
        },
        Strong: {
            easeIn: function(av, au, ax, aw) {
                return ax * (av /= aw) * av * av * av * av + au
            },
            easeOut: function(av, au, ax, aw) {
                return ax * ((av = av / aw - 1) * av * av * av * av + 1) + au
            },
            easeInOut: function(av, au, ax, aw) {
                if ((av /= aw / 2) < 1) {
                    return ax / 2 * av * av * av * av * av + au
                }
                return ax / 2 * ((av -= 2) * av * av * av * av + 2) + au
            }
        },
        Expo: {
            easeIn: function(av, au, ax, aw) {
                return (av == 0) ? au: ax * Math.pow(2, 10 * (av / aw - 1)) + au
            },
            easeOut: function(av, au, ax, aw) {
                return (av == aw) ? au + ax: ax * ( - Math.pow(2, -10 * av / aw) + 1) + au
            },
            easeInOut: function(av, au, ax, aw) {
                if (av == 0) {
                    return au
                }
                if (av == aw) {
                    return au + ax
                }
                if ((av /= aw / 2) < 1) {
                    return ax / 2 * Math.pow(2, 10 * (av - 1)) + au
                }
                return ax / 2 * ( - Math.pow(2, -10 * --av) + 2) + au
            }
        },
        Circ: {
            easeIn: function(av, au, ax, aw) {
                return - ax * (Math.sqrt(1 - (av /= aw) * av) - 1) + au
            },
            easeOut: function(av, au, ax, aw) {
                return ax * Math.sqrt(1 - (av = av / aw - 1) * av) + au
            },
            easeInOut: function(av, au, ax, aw) {
                if ((av /= aw / 2) < 1) {
                    return - ax / 2 * (Math.sqrt(1 - av * av) - 1) + au
                }
                return ax / 2 * (Math.sqrt(1 - (av -= 2) * av) + 1) + au
            }
        },
        Elastic: {
            easeIn: function(aw, au, aA, az, av, ay) {
                var ax;
                if (aw == 0) {
                    return au
                }
                if ((aw /= az) == 1) {
                    return au + aA
                }
                if (!ay) {
                    ay = az * 0.3
                }
                if (!av || av < Math.abs(aA)) {
                    av = aA;
                    ax = ay / 4
                } else {
                    ax = ay / (2 * Math.PI) * Math.asin(aA / av)
                }
                return - (av * Math.pow(2, 10 * (aw -= 1)) * Math.sin((aw * az - ax) * (2 * Math.PI) / ay)) + au
            },
            easeOut: function(aw, au, aA, az, av, ay) {
                var ax;
                if (aw == 0) {
                    return au
                }
                if ((aw /= az) == 1) {
                    return au + aA
                }
                if (!ay) {
                    ay = az * 0.3
                }
                if (!av || av < Math.abs(aA)) {
                    av = aA;
                    ax = ay / 4
                } else {
                    ax = ay / (2 * Math.PI) * Math.asin(aA / av)
                }
                return (av * Math.pow(2, -10 * aw) * Math.sin((aw * az - ax) * (2 * Math.PI) / ay) + aA + au)
            },
            easeInOut: function(aw, au, aA, az, av, ay) {
                var ax;
                if (aw == 0) {
                    return au
                }
                if ((aw /= az / 2) == 2) {
                    return au + aA
                }
                if (!ay) {
                    ay = az * (0.3 * 1.5)
                }
                if (!av || av < Math.abs(aA)) {
                    av = aA;
                    ax = ay / 4
                } else {
                    ax = ay / (2 * Math.PI) * Math.asin(aA / av)
                }
                if (aw < 1) {
                    return - 0.5 * (av * Math.pow(2, 10 * (aw -= 1)) * Math.sin((aw * az - ax) * (2 * Math.PI) / ay)) + au
                }
                return av * Math.pow(2, -10 * (aw -= 1)) * Math.sin((aw * az - ax) * (2 * Math.PI) / ay) * 0.5 + aA + au
            }
        },
        Back: {
            easeIn: function(av, au, ay, ax, aw) {
                if (typeof aw == T) {
                    aw = 1.70158
                }
                return ay * (av /= ax) * av * ((aw + 1) * av - aw) + au
            },
            easeOut: function(av, au, ay, ax, aw) {
                if (typeof aw == T) {
                    aw = 1.70158
                }
                return ay * ((av = av / ax - 1) * av * ((aw + 1) * av + aw) + 1) + au
            },
            easeInOut: function(av, au, ay, ax, aw) {
                if (typeof aw == T) {
                    aw = 1.70158
                }
                if ((av /= ax / 2) < 1) {
                    return ay / 2 * (av * av * (((aw *= (1.525)) + 1) * av - aw)) + au
                }
                return ay / 2 * ((av -= 2) * av * (((aw *= (1.525)) + 1) * av + aw) + 2) + au
            }
        },
        Bounce: {
            easeIn: function(av, au, ax, aw) {
                return ax - C.Bounce.easeOut(aw - av, 0, ax, aw) + au
            },
            easeOut: function(av, au, ax, aw) {
                if ((av /= aw) < (1 / 2.75)) {
                    return ax * (7.5625 * av * av) + au
                } else {
                    if (av < (2 / 2.75)) {
                        return ax * (7.5625 * (av -= (1.5 / 2.75)) * av + 0.75) + au
                    } else {
                        if (av < (2.5 / 2.75)) {
                            return ax * (7.5625 * (av -= (2.25 / 2.75)) * av + 0.9375) + au
                        } else {
                            return ax * (7.5625 * (av -= (2.625 / 2.75)) * av + 0.984375) + au
                        }
                    }
                }
            },
            easeInOut: function(av, au, ax, aw) {
                if (av < aw / 2) {
                    return C.Bounce.easeIn(av * 2, 0, ax, aw) * 0.5 + au
                }
                return C.Bounce.easeOut(av * 2 - aw, 0, ax, aw) * 0.5 + ax * 0.5 + au
            }
        }
    };
    var at;
    var z = (function() {
        function ay(az, aB, aA) {
            var aC = this;
            n(aC, I, []);
            aC.type = "LTweenLiteChild";
            aC.toNew = [];
            aC.init(az, aB, aA)
        }
        var ax = {
            init: function(aA, aF, aE) {
                var aJ = this,
                aC = null,
                aH = null;
                if (typeof aE.tweenTimeline == T) {
                    aE.tweenTimeline = av.TYPE_FRAME
                }
                aJ.target = aA;
                aJ.duration = aF || 0.001;
                aJ.vars = aE;
                aJ.delay = aJ.vars.delay || 0;
                if (aJ.vars.tweenTimeline == av.TYPE_TIMER) {
                    aJ.currentTime = (new Date()).getTime() / 1000;
                    aJ.initTime = aJ.currentTime;
                    aJ.startTime = aJ.initTime + aJ.delay
                } else {
                    aJ.currentTime = 0;
                    aJ.duration *= 1000;
                    aJ.currentTime -= aJ.delay * 1000;
                    aJ.initTime = (new Date()).getTime() - aJ.currentTime
                }
                aJ.combinedTimeScale = aJ.vars.timeScale || 1;
                aJ.active = aJ.duration == 0 && aJ.delay == 0;
                aJ.varsto = {};
                aJ.varsfrom = {};
                aJ.varsDiff = {};
                aJ.varsListIndex = {};
                aJ.varsListCurr = {};
                aJ.varsListTo = {};
                aJ.varsListLength = {};
                aJ.stop = false;
                if (typeof aJ.vars.ease === "string") {
                    aH = aJ.vars.ease.split(".");
                    if (Array.isArray(aH)) {
                        aJ.vars.ease = C[aH[0]][aH[1]]
                    }
                }
                if (typeof aJ.vars.ease !== "function") {
                    aJ.vars.ease = C.None.easeIn
                }
                aJ.ease = aJ.vars.ease;
                delete aJ.vars.ease;
                if (aJ.vars.onComplete) {
                    aJ.onComplete = aJ.vars.onComplete;
                    delete aJ.vars.onComplete
                } else {
                    aJ.onComplete = null
                }
                if (aJ.vars.onUpdate) {
                    aJ.onUpdate = aJ.vars.onUpdate;
                    delete aJ.vars.onUpdate
                } else {
                    aJ.onUpdate = null
                }
                if (aJ.vars.onStart) {
                    aJ.onStart = aJ.vars.onStart;
                    delete aJ.vars.onStart
                } else {
                    aJ.onStart = null
                }
                for (aC in aJ.vars) {
                    if (aC == "coordinate" && Array.isArray(aJ.vars[aC])) {
                        var aG = 0,
                        aI = {
                            x: aJ.target.x,
                            y: aJ.target.y
                        };
                        for (var aD = 0,
                        aB = aJ.vars[aC].length; aD < aB; aD++) {
                            var az = aJ.vars[aC][aD];
                            aG += S.distance(az, aI);
                            aI = az
                        }
                        aJ.varsListIndex[aC] = 0;
                        aJ.varsListCurr[aC] = 0;
                        aJ.varsListTo[aC] = aG;
                        aJ.varsto[aC] = aJ.vars[aC];
                        aJ.varsfrom[aC] = {
                            x: aJ.target.x,
                            y: aJ.target.y
                        };
                        continue
                    } else {
                        if (typeof aJ.vars[aC] != "number") {
                            continue
                        }
                    }
                    aJ.varsto[aC] = aJ.vars[aC];
                    aJ.varsfrom[aC] = aJ.target[aC];
                    aJ.varsDiff[aC] = aJ.vars[aC] - aJ.target[aC]
                }
            },
            pause: function() {
                this.stop = true
            },
            resume: function() {
                this.stop = false
            },
            tween: function() {
                var aJ = this,
                aF;
                var aH = (aJ.vars.tweenTimeline == av.TYPE_TIMER);
                if (aH) {
                    var aA = (new Date()).getTime() / 1000,
                    aB = aA - aJ.startTime;
                    if (aB < 0) {
                        return
                    }
                } else {
                    if (aJ.stop) {
                        return
                    }
                    if (ac.speed) {
                        aJ.currentTime += ac.speed
                    } else {
                        aJ.currentTime = ((new Date()).getTime() - aJ.initTime)
                    }
                    if (this._end) {
                        aJ.currentTime = aJ.duration
                    }
                    if (aJ.currentTime < 0) {
                        return
                    }
                }
                for (au in aJ.varsto) {
                    if (typeof aJ.varsListTo[au] != T) {
                        var aI = aJ.ease(aH ? aB: aJ.currentTime, 0, aJ.varsListTo[au], aJ.duration);
                        if (aI > aJ.varsListTo[au]) {
                            aI = aJ.varsListTo[au]
                        }
                        var aE = aJ.varsListIndex[au] > 0 ? aJ.vars[au][aJ.varsListIndex[au] - 1] : aJ.varsfrom[au];
                        var aG = aJ.vars[au][aJ.varsListIndex[au]];
                        var aD = S.distance(aE, aG);
                        while (aJ.varsListCurr[au] + aD < aI) {
                            aJ.varsListCurr[au] += aD;
                            aE = aG;
                            aJ.varsListIndex[au]++;
                            aG = aJ.vars[au][aJ.varsListIndex[au]];
                            aD = S.distance(aE, aG)
                        }
                        aJ.target.x = aE.x;
                        aJ.target.y = aE.y;
                        if (aD != 0 && aG.x - aE.x != 0) {
                            aJ.target.x += (aG.x - aE.x) * (aI - aJ.varsListCurr[au]) / aD
                        }
                        if (aD != 0 && aG.y - aE.y != 0) {
                            aJ.target.y += (aG.y - aE.y) * (aI - aJ.varsListCurr[au]) / aD
                        }
                        continue
                    }
                    aJ.target[au] = aJ.ease(aH ? aB: aJ.currentTime, aJ.varsfrom[au], aJ.varsDiff[au], aJ.duration)
                }
                if (aJ.onStart) {
                    aJ._dispatchEvent(aJ.onStart);
                    delete aJ.onStart
                }
                var aC;
                if (aH) {
                    aC = (aB >= aJ.duration)
                } else {
                    aC = (aJ.currentTime >= aJ.duration)
                }
                if (aC) {
                    for (aF in aJ.varsto) {
                        if (typeof aJ.varsListTo[aF] != T) {
                            var az = aJ.varsto[aF][aJ.vars[aF].length - 1];
                            aJ.target.x = az.x;
                            aJ.target.y = az.y;
                            continue
                        }
                        aJ.target[aF] = aJ.varsto[aF]
                    }
                    if (aJ.onComplete) {
                        aJ._dispatchEvent(aJ.onComplete)
                    }
                    return true
                } else {
                    if (aJ.onUpdate) {
                        aJ._dispatchEvent(aJ.onUpdate)
                    }
                }
                return false
            },
            _dispatchEvent: function(aA) {
                var az = this;
                az.target.target = az.target;
                az.target.currentTarget = az;
                aA(az.target);
                delete az.target.currentTarget;
                delete az.target.target
            },
            to: function(az, aB, aA) {
                var aC = this;
                aC.toNew.push({
                    target: az,
                    duration: aB,
                    vars: aA
                });
                return aC
            },
            end: function(az) {
                this._end = true;
                this._endCallback = az
            },
            keep: function() {
                var aB = this,
                aA, aC, az;
                if (aB.toNew.length > 0) {
                    aA = aB.toNew.shift();
                    if (aA.vars.loop) {
                        aB.loop = true
                    }
                    if (aB.loop) {
                        aC = {};
                        for (az in aA.vars) {
                            aC[az] = aA.vars[az]
                        }
                        aB.to(aA.target, aA.duration, aC)
                    }
                    aB.init(aA.target, aA.duration, aA.vars);
                    return true
                }
                return false
            }
        };
        for (var au in ax) {
            ay.prototype[au] = ax[au]
        }
        function av() {
            var az = this;
            n(az, I, []);
            az.type = "LTweenLite";
            az.tweens = []
        }
        av.TYPE_FRAME = "type_frame";
        av.TYPE_TIMER = "type_timer";
        ax = {
            count: function() {
                return this.tweens.length
            },
            ll_show: function() {
                var aB = this;
                var aA, az;
                aB.tweensRuning = true;
                for (aA = 0; aA < aB.tweens.length; aA++) {
                    az = aB.tweens[aA];
                    if (az && !az.deleted && az.tween && az.tween()) {
                        aB.tweens.splice(aA, 1);
                        aA--;
                        if (az._end && az._endCallback) {
                            az._dispatchEvent(az._endCallback);
                            az = null
                        } else {
                            if (az.keep()) {
                                aB.add(az)
                            }
                        }
                    }
                }
                aB.tweensRuning = false;
                for (aA = 0; aA < aB.tweens.length; aA++) {
                    az = aB.tweens[aA];
                    if (az.deleted) {
                        aB.tweens.splice(aA, 1);
                        aA--
                    }
                }
            },
            to: function(az, aC, aB) {
                if (!az) {
                    return
                }
                var aD = this;
                var aA = new ay({},
                0, {});
                aD.tweens.push(aA);
                aA.to(az, aC, aB);
                return aA
            },
            add: function(az) {
                this.tweens.push(az)
            },
            remove: function(aB) {
                var aC = this;
                if (typeof aB == T) {
                    return
                }
                for (var aA = 0,
                az = aC.tweens.length; aA < az; aA++) {
                    if (aB.objectIndex == aC.tweens[aA].objectIndex) {
                        if (aC.tweensRuning) {
                            aC.tweens[aA].deleted = true
                        } else {
                            aC.tweens.splice(aA, 1)
                        }
                        break
                    }
                }
            },
            removeAll: function() {
                var aB = this;
                if (aB.tweensRuning) {
                    for (var aA = 0,
                    az = aB.tweens.length; aA < az; aA++) {
                        aB.tweens[aA].deleted = true
                    }
                } else {
                    aB.tweens.length = 0
                }
            },
            endAll: function(aB) {
                var aA = this;
                for (var az = 0; az < aA.tweens.length; az++) {
                    aA.tweens[az].end()
                }
            },
            pauseAll: function() {
                for (var aA = 0,
                az = this.tweens.length; aA < az; aA++) {
                    this.tweens[aA].pause()
                }
            },
            resumeAll: function() {
                for (var aA = 0,
                az = this.tweens.length; aA < az; aA++) {
                    this.tweens[aA].resume()
                }
            }
        };
        for (var au in ax) {
            av.prototype[au] = ax[au]
        }
        at = new av();
        ac.childList.push(at);
        var aw = new av();
        aw.TYPE_FRAME = av.TYPE_FRAME;
        aw.TYPE_TIMER = av.TYPE_TIMER;
        ac.childList.push(aw);
        return aw
    })();
    var X = (function() {
        function au() {
            this.responseType = null
        }
        au.prototype = {
            TEXT: "text",
            JSON: "json",
            ARRAY_BUFFER: "arraybuffer",
            BLOB: "blob",
            get: function(aw, ay, ax, av) {
                this.getRequest("GET", aw, ay, ax, av)
            },
            post: function(aw, ay, ax, av) {
                this.getRequest("POST", aw, ay, ax, av)
            },
            getRequest: function(aE, av, aB, aw, ax) {
                var aF = this,
                ay, az = "",
                aD = "";
                aF.err = ax;
                var aC = aF.getHttp();
                if (!aC) {
                    return
                }
                if (aB) {
                    for (ay in aB) {
                        az += (aD + ay + "=" + aB[ay]);
                        aD = "&"
                    }
                }
                if (aE.toLowerCase() == "get" && az.length > 0) {
                    av += ((av.indexOf("?") >= 0 ? "&": "?") + az);
                    az = null
                }
                aC.open(aE, av, true);
                if (aF.responseType) {
                    if (aF.responseType == aF.JSON) {
                        try {
                            aC.responseType = aF.responseType
                        } catch(aA) {
                            aC.responseType = aF.TEXT;
                            aC._responseType = "json"
                        }
                    } else {
                        aC.responseType = aF.responseType
                    }
                    aF.responseType = aF.TEXT
                }
                aC.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                aC.onreadystatechange = function() {
                    if (aC.readyState == 4) {
                        if (aC.status >= 200 && aC.status < 300 || aC.status === 304) {
                            if (aw) {
                                if (aC._responseType == aF.JSON) {
                                    aC._responseType = aF.TEXT;
                                    aw(JSON.parse(aC.responseText))
                                } else {
                                    if (aC.responseType == aF.ARRAY_BUFFER || aC.responseType == aF.BLOB || aC.responseType == aF.JSON) {
                                        aw(aC.response)
                                    } else {
                                        if (aC.responseText.length > 0) {
                                            aw(aC.responseText)
                                        } else {
                                            aw(null)
                                        }
                                    }
                                }
                            }
                        } else {
                            if (ax) {
                                ax(aC)
                            }
                        }
                    }
                };
                aC.send(az)
            },
            getHttp: function() {
                if (typeof XMLHttpRequest != T) {
                    return new XMLHttpRequest()
                }
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP")
                } catch(av) {
                    try {
                        return new ActiveXObject("Microsoft.XMLHTTP")
                    } catch(av) {
                        if (!this.err) {
                            this.err(av)
                        }
                    }
                }
                return false
            }
        };
        return new au()
    })();
    var b = (function() {
        function av() {
            var ax = this;
            n(ax, am, []);
            ax.display = document.createElement("div");
            ax.iframe = document.createElement("iframe");
            ax.display.style.position = "absolute";
            ax.display.style.marginTop = "0px";
            ax.display.style.marginLeft = "0px";
            ax.display.style.zIndex = 11;
            if (ac.ios) {
                ax.display.style.overflow = "auto";
                ax.display.style.webkitOverflowScrolling = "touch"
            }
            ax.display.appendChild(ax.iframe);
            ax.idAdded = false
        }
        var aw = {
            loadURL: function(ax) {
                var ay = this;
                ay.iframe.src = ax;
                ay.iframe.onload = function() {
                    ay.dispatchEvent(ar.COMPLETE)
                }
            },
            show: function() {
                var ax = this;
                if (!ax.idAdded) {
                    ac.object.appendChild(ax.display);
                    ax.idAdded = true
                }
                if (ax.display.style.display == "none") {
                    ax.display.style.display = ""
                }
            },
            die: function() {
                ac.object.removeChild(this.display);
                this.idAdded = false
            },
            hide: function() {
                this.display.style.display = "none"
            },
            setViewPort: function(ay) {
                var ax = this,
                aA = parseInt(ac.canvasObj.style.width) / ac.canvasObj.width,
                az = parseInt(ac.canvasObj.style.height) / ac.canvasObj.height;
                ax.display.style.marginTop = (parseInt(ac.canvasObj.style.marginTop) + ((ay.y * az) >>> 0)) + "px";
                ax.display.style.marginLeft = (parseInt(ac.canvasObj.style.marginLeft) + ((ay.x * aA) >>> 0)) + "px";
                ax.iframe.style.width = ax.display.style.width = (ay.width * aA >>> 0) + "px";
                ax.iframe.style.height = ax.display.style.height = (ay.height * az >>> 0) + "px"
            }
        };
        for (var au in aw) {
            av.prototype[au] = aw[au]
        }
        return av
    })();
    var ao = (function() {
        function av(ay) {
            var ax = this;
            n(ax, I, []);
            ax.q1 = null;
            ax.q2 = null;
            ax.q3 = null;
            ax.q4 = null;
            ax.parent = null;
            ax.data = [];
            ax.rect = ay;
            ax.root = ax
        }
        var aw = {
            createChildren: function(ay) {
                if (ay == 0) {
                    return
                }
                var aA = this;
                var ax = aA.rect.width / 2,
                az = aA.rect.height / 2;
                aA.q1 = new av(new f(aA.rect.x + ax, aA.rect.y, ax, az));
                aA.q2 = new av(new f(aA.rect.x + ax, aA.rect.y + az, ax, az));
                aA.q3 = new av(new f(aA.rect.x, aA.rect.y + az, ax, az));
                aA.q4 = new av(new f(aA.rect.x, aA.rect.y, ax, az));
                aA.q1.parent = aA.q2.parent = aA.q3.parent = aA.q4.parent = aA;
                aA.q1.root = aA.q2.root = aA.q3.root = aA.q4.root = aA.root;
                aA.q1.createChildren(ay - 1);
                aA.q2.createChildren(ay - 1);
                aA.q3.createChildren(ay - 1);
                aA.q4.createChildren(ay - 1)
            },
            hasChildren: function() {
                var ax = this;
                return ax.q1 && ax.q2 && ax.q3 && ax.q4
            },
            clear: function() {
                var ax = this;
                if (ax.hasChildren()) {
                    return ax.q1.clear() || ax.q2.clear() || ax.q3.clear() || ax.q4.clear()
                } else {
                    ax.q1 = null;
                    ax.q2 = null;
                    ax.q3 = null;
                    ax.q4 = null;
                    ax.parent = null;
                    ax.data = [];
                    return ax
                }
            },
            add: function(ay, ax, aA) {
                var az = this;
                if (!az.isIn(ax, aA)) {
                    return null
                }
                if (az.hasChildren()) {
                    return az.q1.add(ay, ax, aA) || az.q2.add(ay, ax, aA) || az.q3.add(ay, ax, aA) || az.q4.add(ay, ax, aA)
                } else {
                    az.data.push(ay);
                    return az
                }
            },
            remove: function(ay, ax, aB) {
                var aA = this;
                if (!aA.isIn(ax, aB)) {
                    return null
                }
                if (aA.hasChildren()) {
                    return aA.q1.remove(ay, ax, aB) || aA.q2.remove(ay, ax, aB) || aA.q3.remove(ay, ax, aB) || aA.q4.remove(ay, ax, aB)
                } else {
                    var az = aA.data.indexOf(ay);
                    if (az != -1) {
                        aA.data.splice(az, 1);
                        return aA
                    } else {
                        return null
                    }
                }
            },
            isIn: function(ax, az) {
                var ay = this;
                return (typeof ax == T || (ax >= ay.rect.x && ax < ay.rect.right)) && (typeof az == T || (az >= ay.rect.y && az < ay.rect.bottom))
            },
            getDataInRect: function(az) {
                var ax = this;
                if (!ax.rect.intersects(az)) {
                    return []
                }
                var ay = ax.data.concat();
                if (ax.hasChildren()) {
                    ay.push.apply(ay, ax.q1.getDataInRect(az));
                    ay.push.apply(ay, ax.q2.getDataInRect(az));
                    ay.push.apply(ay, ax.q3.getDataInRect(az));
                    ay.push.apply(ay, ax.q4.getDataInRect(az))
                }
                return ay
            }
        };
        for (var au in aw) {
            av.prototype[au] = aw[au]
        }
        return av
    })();
    N.addChild = D;
    N.removeChild = q;
    N.base = G;
    N.accelerometerEvent = B;
    N.ajax = X;
    N.animation = h;
    N.bitmap = W;
    N.bitmapData = p;
    N.bitmapFilter = s;
    N.colorMatrixFilter = aj;
    N.colorTransform = H;
    N.convolutionFilter = e;
    N.displayObject = A;
    N.displayObjectContainer = Q;
    N.dropShadowFilter = K;
    N.easing = C;
    N.event = ar;
    N.eventDispatcher = am;
    N.focusEvent = k;
    N.global = ac;
    N.graphics = V;
    N.init = an;
    N.interactiveObject = g;
    N.keyboardEvent = j;
    N.matrix = y;
    N.lExtend = n;
    N.mouseEvent = af;
    N.mouseEventContainer = ad;
    N.multitouch = ai;
    N.multitouchInputMode = a;
    N.object = I;
    N.point = S;
    N.rectangle = f;
    N.shape = E;
    N.sprite = d;
    N.stage = t;
    N.stageAlign = J;
    N.stageScaleMode = c;
    N.stageWebView = b;
    N.system = R;
    N.transform = aa;
    N.tweenLite = z;
    N.tweenLiteTimeline = at;
    N.vec2 = aq;
    N.guide = (function() {
        function au(av, aB, aw, aA, ax) {
            if (typeof av === "object") {
                ax = av.color;
                aA = av.h;
                aw = av.w;
                aB = av.y;
                av = av.x
            }
            ax = ax || "#fff";
            var az = this;
            N.base(az, N.shape, []);
            az.x = av;
            az.y = aB;
            az.w = aw;
            az.h = aA;
            az.r = Math.min(aw, aA) / 2;
            az.tweens = [];
            az.timers = [];
            az.arcList = [];
            for (var ay = 0; ay < 3; ay++) { (function() {
                    var aC = {
                        r: 0,
                        p: 1
                    };
                    az.graphics.add(function() {
                        var aD = N.global.canvas;
                        aD.save();
                        aD.beginPath();
                        aD.arc(az.w / 2, az.h / 2, aC.r, 0, 2 * Math.PI);
                        aD.closePath();
                        aD.fillStyle = ax;
                        aD.globalAlpha = aC.p;
                        aD.fill();
                        aD.restore()
                    });
                    az.arcList.push(aC)
                })()
            }
        }
        au.prototype.play = function() {
            var av = this;
            av.stop();
            av.arcList.forEach(function(aw, ax) {
                av.timers.push(setTimeout(function() {
                    av.tweens.push(N.tweenLite.to(aw, 1, {
                        r: av.r,
                        p: 0,
                        loop: true,
                        onComplete: function(ay) {
                            aw.r = 0;
                            aw.p = 1
                        }
                    }))
                },
                (2 - ax) * 200))
            });
            return av
        };
        au.prototype.change = function(aw) {
            var av = this;
            aw.x && (av.x = aw.x);
            aw.y && (av.y = aw.y);
            return av
        };
        au.prototype.stop = function() {
            var av = this;
            av.arcList.forEach(function(aw, ax) {
                clearTimeout(av.timers[ax]);
                aw.r = 0;
                aw.p = 1
            });
            av.tweens.forEach(function(ax, aw) {
                N.tweenLite.remove(ax)
            });
            av.tweens = [];
            av.timers = [];
            return av
        };
        return au
    })();
    N.Score = function(ay, au, ax) {
        var aw = $.extend({
            textAlign: "center",
            baseBaseLine: "middle",
        },
        ay);
        var av = {};
        return function(aE, aA, aF, aC, az) {
            var aD = av[aE];
            if (!aD) {
                aD = new N.bitmapData(null, 0, 0, au * N.global.ratio, ax * N.global.ratio, p.DATA_CANVAS);
                $.extend(aD._context, aw);
                aD._context.fillText(aE, au / 2, ax);
                av[aE] = aD
            }
            var aB = this;
            N.base(aB, N.bitmap, [aD, aA, aF, aC || au, az || ax])
        }
    };
    N.test = (function() {
        var av = false;
        var au = 300;
        var aw = {
            init: function(ax) {
                av = [];
                this.lastTime = new Date().getTime()
            },
            run: function(ay) {
                if (!m_debug || !av) {
                    return
                }
                if (av.length > (ay || au)) {
                    alert(av);
                    av = false;
                    return
                }
                var ax = new Date().getTime();
                av.push(ax - this.lastTime);
                this.lastTime = ax
            }
        };
        aw.init();
        return aw
    })();
    function al(aC, az, aA, aw, ay, aB, au) {
        N.setCanvasePixelRatio();
        ac.speed = ac.delta = aC;
        if (aC === 0) {
            aC = ac.requestAnimFrame
        } else {
            if (au) {
                aC = (function(aD) {
                    return function(aE) {
                        ae.setTimeout(aE, aD)
                    }
                })(aC)
            }
        }
        var ax = function() {
            N.setGameTopBar();
            hg.time && (hg.time.updateFlag = false);
            setTimeout(ay, 100);
            ac.startTimer = (new Date()).getTime()
        };
        var av;
        if (typeof aC == "function") {
            av = function() {
                ac.speed = null;
                ac.currentTime = (new Date).getTime();
                aC(function() {
                    var aD = (new Date).getTime();
                    ac.delta = aD - ac.currentTime;
                    ac.currentTime = aD;
                    ac.delta > 500 && (ac.delta = 0);
                    ac.onShow();
                    aC(arguments.callee)
                });
                ac.setCanvas(az, aA, aw);
                ax()
            }
        } else {
            av = function() {
                ac.frameRate = setInterval(function() {
                    ac.onShow()
                },
                aC);
                ac.setCanvas(az, aA, aw);
                ax()
            }
        }
        if (aB != null && aB == ar.INIT) {
            av()
        } else {
            ar.addEventListener(ae, "load",
            function() {
                av()
            })
        }
    }
})(LF, window);
