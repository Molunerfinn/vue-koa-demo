var LF = {}; (function(e, g) {
    var f = "undefined",
    k = "__LF__pixel__ratio__";
    var j = navigator.userAgent.indexOf("Android") > 0 ? true: false;
    var c = (function() {
        function m() {
            var p = this;
            p.currentTime = 0;
            p.currentStart = 0;
            p.currentSave = 0;
            p.length = 0;
            p.loopStart = 0;
            p.loopEnd = 0;
            p.loopIndex = 0;
            p.loopLength = 1;
            p.playing = false;
            p.volume = 1;
            p.soundType = "LWebAudio";
            p.soundCache = [];
            a.Container.add(p);
            HdGame.initCallBack(p, ["complete", "sound_complete"])
        }
        m.container = [];
        m.containerCount = 0;
        try {
            m.audioTag = new Audio()
        } catch(o) {
            HdGame.tlog("ReferenceError: Can't find variable: Audio");
            m.audioTag = {
                canPlayType: function() {
                    return false
                }
            }
        }
        m._context = null;
        var n = {
            getWebAudio: function() {
                var p;
                if (m.containerCount > 0) {
                    p = m.container.shift()
                } else {
                    if (typeof AudioContext !== f) {
                        try {
                            p = new AudioContext()
                        } catch(q) {
                            m.containerCount = m.container.length;
                            p = m.container.shift()
                        }
                    } else {
                        if (typeof webkitAudioContext !== f) {
                            try {
                                p = new webkitAudioContext()
                            } catch(q) {
                                m.containerCount = m.container.length;
                                p = m.container.shift()
                            }
                        } else {
                            throw "AudioContext not supported. :("
                        }
                    }
                }
                if (!p.createGainNode) {
                    p.createGainNode = p.createGain
                }
                m.container.push(p);
                return p
            },
            onload: function(q) {
                var p = this;
                if (Object.prototype.toString.apply(q) !== "[object AudioBuffer]") {
                    p.load(q);
                    return
                }
                if (!p.data) {
                    p.data = p.getWebAudio()
                }
                p.buffer = q;
                p.length = p.buffer.duration;
                p.fire("complete")
            },
            _onended: function() {
                var p = this;
                p.fire("sound_complete");
                p.close();
                if (++p.loopIndex < p.loopLength) {
                    p.play(p.currentStart, undefined, p.currentTimeTo)
                }
            },
            load: function(y) {
                var A = this;
                if (typeof y !== "string") {
                    if (Object.prototype.toString.apply(y) == "[object AudioBuffer]") {
                        A.onload(y)
                    } else {
                        if (Object.prototype.toString.apply(y) == "[object ArrayBuffer]") {
                            if (!A.data) {
                                A.data = A.getWebAudio()
                            }
                            A.data.decodeAudioData(y, A.onload.bind(A),
                            function(q) {
                                throw "AudioContext decodeAudioData error : " + q.toString()
                            })
                        }
                    }
                    return
                }
                var x, w, v, r, t, p = {
                    mov: ["quicktime"],
                    "3gp": ["3gpp"],
                    midi: ["midi"],
                    mid: ["midi"],
                    ogv: ["ogg"],
                    m4a: ["acc"],
                    mp3: ["mpeg"],
                    wav: ["wav", "x-wav", "wave"],
                    wave: ["wav", "x-wav", "wave"],
                    aac: ["mp4", "aac"]
                };
                x = y.split(",");
                for (r = 0; r < x.length; r++) {
                    w = x[r].split(".");
                    t = w[w.length - 1];
                    if (p[t]) {
                        t = p[t]
                    } else {
                        t = [t]
                    }
                    v = t.some(function(s, q, u) {
                        return m.audioTag.canPlayType(A._type + "/" + s)
                    });
                    if (v) {
                        var z = (function() {
                            if (typeof XMLHttpRequest != f) {
                                return new XMLHttpRequest()
                            }
                            try {
                                return new ActiveXObject("Msxml2.XMLHTTP")
                            } catch(q) {
                                try {
                                    return new ActiveXObject("Microsoft.XMLHTTP")
                                } catch(q) {
                                    HdGame.tlog("Create xhr error", q)
                                }
                            }
                            return false
                        })();
                        if (!z) {
                            return
                        }
                        z.open("get", x[r], true);
                        z.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                        z.responseType = "arraybuffer";
                        z.onreadystatechange = function() {
                            if (z.readyState == 4) {
                                if (z.status >= 200 && z.status < 300 || z.status === 304) {
                                    A.onload.bind(A)(z.response)
                                } else {
                                    HdGame.tlog("Send xhr error")
                                }
                            }
                        };
                        z.send(null);
                        return
                    } else {
                        HdGame.tlog("Not support " + w[w.length - 1] + " : " + x[r]);
                        A.fire("complete")
                    }
                }
            },
            getCurrentTime: function() {
                var p = this;
                if (p.playing) {
                    return p.data.currentTime - p.currentSave + p.currentTime
                } else {
                    return p.currentSave
                }
            },
            setVolume: function(p) {
                var q = this;
                q.volume = p;
                if (q.playing) {
                    q.volumeNode.gain.value = p
                }
            },
            getVolume: function() {
                return this.volume
            },
            play: function(t, p, r) {
                var q = this;
                if (q.length == 0) {
                    return
                }
                if (p === "loop") {
                    q.loopIndex = 0;
                    q.loopLength = 99999
                } else {
                    if (typeof p !== f) {
                        q.loopIndex = 0;
                        q.loopLength = p
                    }
                }
                if (typeof t !== f) {
                    q.currentTime = t;
                    q.currentStart = t
                }
                if (typeof r !== f) {
                    q.currentTimeTo = r > q.length ? q.length: r
                } else {
                    q.currentTimeTo = q.length
                }
                if (q.playing && q.bufferSource) {
                    q.soundCache.push(q.bufferSource)
                }
                q.data.loop = false;
                q.playing = true;
                if (q.timeout) {
                    clearTimeout(q.timeout);
                    delete q.timeout
                }
                q.timeout = setTimeout(q._onended.bind(q), (q.currentTimeTo - q.currentTime) * 1000);
                q.bufferSource = q.data.createBufferSource();
                q.bufferSource.buffer = q.buffer;
                q.volumeNode = q.data.createGainNode();
                q.volumeNode.gain.value = q.volume;
                q.volumeNode.connect(q.data.destination);
                q.bufferSource.connect(q.volumeNode);
                q.currentSave = q.data.currentTime;
                if (q.bufferSource.start) {
                    q.bufferSource.start(0, q.currentTime, q.length - q.currentTime)
                } else {
                    q.bufferSource.noteGrainOn(0, q.currentTime, q.length - q.currentTime)
                }
            },
            playSegment: function(r, q, p) {
                this.playTo(r, r + q, p)
            },
            playTo: function(r, q, p) {
                this.play(r, p, q)
            },
            stopCache: function() {
                var q = this;
                var r = null;
                for (var p = 0; p < q.soundCache.length; p++) {
                    r = q.soundCache[p];
                    if (r.stop) {
                        r.stop(0)
                    } else {
                        r.noteOff(0)
                    }
                }
                q.soundCache = []
            },
            stop: function() {
                var p = this;
                if (!p.playing) {
                    return
                }
                if (p.timeout) {
                    clearTimeout(p.timeout);
                    delete p.timeout
                }
                if (p.bufferSource.stop) {
                    p.bufferSource.stop(0)
                } else {
                    p.bufferSource.noteOff(0)
                }
                p.stopCache();
                p.currentSave = p.getCurrentTime();
                p.currentTime = p.currentSave;
                p.playing = false
            },
            close: function() {
                var p = this;
                if (!p.playing) {
                    return
                }
                if (p.timeout) {
                    clearTimeout(p.timeout);
                    delete p.timeout
                }
                if (p.bufferSource.stop) {
                    p.bufferSource.stop(0)
                } else {
                    p.bufferSource.noteOff(0)
                }
                p.stopCache();
                p.playing = false;
                p.currentTime = 0;
                p.currentSave = 0
            },
            ll_check: function() {
                var p = this;
                if (!p.playing) {
                    return
                }
                if (p.currentTimeTo < p.data.currentTime - p.currentSave + a.Container.time * 0.001) {
                    p._onended()
                }
            },
            die: function() {
                a.Container.remove(this)
            }
        };
        for (var l in n) {
            m.prototype[l] = n[l]
        }
        return m
    })();
    var d = (function() {
        function m() {
            var o = this;
            o.length = 0;
            o.loopIndex = 0;
            o.loopLength = 1;
            o.playing = false;
            o.oncomplete = null;
            o.onsoundcomplete = null;
            o.currentStart = 0;
            o.soundType = "LMedia";
            a.Container.add(this);
            HdGame.initCallBack(o, ["complete"])
        }
        var n = {
            onload: function() {
                var o = this;
                if (o.data.readyState) {
                    o.length = o.data.duration - (j ? 0.1 : 0);
                    o.fire("complete");
                    o.data.removeEventListener("canplaythrough", o._canplaythrough, false);
                    o.data.removeEventListener("canplay", o._canplaythrough, false);
                    o.data.removeEventListener("loadedmetadata", o._canplaythrough, false);
                    return
                }
                o._canplaythrough = function() {
                    o.onload()
                };
                o.data.addEventListener("canplaythrough", o._canplaythrough, false);
                o.data.addEventListener("canplay", o._canplaythrough, false);
                o.data.addEventListener("loadedmetadata", o._canplaythrough, false)
            },
            _onended: function() {
                var q = this,
                p, o;
                q.dispatchEvent("sound_complete");
                if (++q.loopIndex < q.loopLength) {
                    p = q.loopIndex;
                    o = q.loopLength;
                    q.close();
                    q.play(q.currentStart, q.loopLength, q.currentTimeTo);
                    q.loopIndex = p
                } else {
                    q.close()
                }
            },
            load: function(t) {
                var v = this;
                if (Object.prototype.toString.apply(t) == "[object HTMLAudioElement]") {
                    v.data = t;
                    v.onload();
                    return
                }
                var p, o, y, r, x, w = {
                    mov: ["quicktime"],
                    "3gp": ["3gpp"],
                    midi: ["midi"],
                    mid: ["midi"],
                    ogv: ["ogg"],
                    m4a: ["acc"],
                    mp3: ["mpeg"],
                    wav: ["wav", "x-wav", "wave"],
                    wave: ["wav", "x-wav", "wave"],
                    aac: ["mp4", "aac"]
                };
                p = t.split(",");
                for (r = 0; r < p.length; r++) {
                    o = p[r].split(".");
                    x = o[o.length - 1];
                    if (w[x]) {
                        x = w[x]
                    } else {
                        x = [x]
                    }
                    y = x.some(function(s, q, u) {
                        return v.data.canPlayType(v._type + "/" + s)
                    });
                    if (y) {
                        v.onload();
                        v.data.preload = "auto";
                        v.data.src = p[r];
                        v.data.load();
                        return
                    } else {
                        HdGame.tlog("Not support " + o[o.length - 1] + " : " + p[r]);
                        v.fire("complete")
                    }
                }
                if (v.oncomplete) {
                    v.oncomplete({})
                }
            },
            getCurrentTime: function() {
                return this.data.currentTime
            },
            setVolume: function(o) {
                this.data.volume = o
            },
            getVolume: function() {
                return this.data.volume
            },
            play: function(r, o, q) {
                var p = this;
                if (typeof r != f) {
                    p.data.currentTime = r
                }
                if (typeof o != f) {
                    p.data.loop = o
                }
                p.data.play()
            },
            playSegment: function(q, p, o) {
                this.playTo(q, q + p, o)
            },
            playTo: function(q, p, o) {
                this.play(q, o, p)
            },
            stop: function() {
                var o = this;
                o.data.pause()
            },
            close: function() {
                var o = this;
                o.data.pause();
                o.data.currentTime = 0;
                o.currentSave = 0
            },
            ll_check: function() {
                var o = this;
                if (!o.playing) {
                    return
                }
                if (o.data.duration != o._ll_duration) {
                    o._ll_duration = o.data.duration;
                    o.length = o.data.duration - (j ? 0.1 : 0)
                }
                if (o.currentTimeTo < o.data.currentTime + a.Container.time * 0.005) {
                    o._onended()
                }
            },
            die: function() {
                a.Container.remove(this)
            }
        };
        for (var l in n) {
            m.prototype[l] = n[l]
        }
        return m
    })();
    var a = (function() {
        function l(o) {
            var p = this;
            p.type = "LSound";
            p._type = "audio";
            if (l.webAudioEnabled && LGlobal.webAudio) {
                LExtends(p, c, [])
            } else {
                LExtends(p, d, []);
                try {
                    p.data = new Audio()
                } catch(q) {
                    HdGame.tlog("ReferenceError: Can't find variable: Audio");
                    p.data = {}
                }
                p.data.loop = false;
                p.data.autoplay = false;
                p.playing = false;
                p.data.addEventListener("play",
                function() {
                    p.playing = true
                },
                false);
                p.data.addEventListener("pause",
                function() {
                    p.playing = false
                },
                false)
            }
            if (o) {
                p.load(o)
            }
        }
        l.TYPE_SOUND = "sound";
        l.webAudioEnabled = false;
        var n = location.protocol;
        if (n == "http:" || n == "https:") {
            if (typeof AudioContext !== f) {
                try {
                    c._context = new AudioContext()
                } catch(m) {}
            } else {
                if (typeof webkitAudioContext !== f) {
                    try {
                        c._context = new webkitAudioContext()
                    } catch(m) {}
                }
            }
            if (c._context) {
                c.container.push(c._context);
                l.webAudioEnabled = true
            }
        }
        l.Container = {
            ll_save: 0,
            time: 0,
            list: [],
            ll_show: function() {
                var r = l.Container;
                var q = (new Date()).getTime();
                r.time = q - (r.ll_save ? r.ll_save: q);
                r.ll_save = q;
                var o = r.list;
                for (var p = o.length - 1; p >= 0; p--) {
                    if (o[p]) {
                        o[p].ll_check()
                    }
                }
            },
            add: function(o) {
                if (l.Container.list.indexOf(o) >= 0) {
                    return
                }
                l.Container.list.push(o)
            },
            remove: function(q) {
                var o = l.Container.list;
                for (var p = o.length - 1; p >= 0; p--) {
                    if (o[p].objectIndex == q.objectIndex) {
                        o.splice(p, 1);
                        break
                    }
                }
            },
            stopOther: function(q) {
                var o = l.Container.list;
                for (var p = o.length - 1; p >= 0; p--) {
                    if (o[p].objectIndex != q.objectIndex) {
                        o[p].stop()
                    }
                }
            }
        };
        return l
    })();
    e.webAudio = c;
    e.media = d;
    e.sound = a;
    e.setTopBarNotLF = function(l, m) {
        e.setGameTopBar(l.getContext("2d"), m)
    };
    e.setGameTopBar = function(r, o) {
        if (e.notCanvasTopBar) {
            return
        }
        var n = $("#gameTopBar").hide();
        if (n.length == 0) {
            return
        }
        r = r || e.global.canvas;
        o = o || 1;
        var p = {};
        var l = g_rem * o;
        p.background = [[0, 0, n.outerWidth() * o, n.outerHeight() * o], {
            fillStyle: n.css("background-color")
        }];
        if ($(".userImgBox").length > 0) {
            var m = $(".userImgBox").find(".userImg")[0];
            p.userImg = [0.2 * l, $(".userImgBox").css("border-color"), [2.1 * l, 1.75 * l, 1.25 * l, 0, 2 * Math.PI], [m, 0, 0, m.width, m.height, 0.85 * l, 0.5 * l, 2.5 * l, 2.5 * l]]
        }
        if ($("#grade").length > 0) {
            p.grade = [0, 3.9 * l, 1.7 * l, {
                font: q($("#grade").css("font")),
                textAlign: "left",
                textBaseline: "middle",
                fillStyle: n.css("color")
            }]
        }
        if ($(".timeBox").length > 0 && hg.time.initTime !== 99999) {
            p.timeText = ["时间", 8 * l, 1 * l, {
                font: q($(".timeBox").css("font")),
                textAlign: "center",
                textBaseline: "middle",
                fillStyle: n.css("color")
            }];
            p.time = ["10.00", 8 * l, 2.25 * l, {
                font: q($(".time").css("font"))
            }]
        }
        hg.time && hg.time.initTime !== 99999 && (hg.time.on("setTime",
        function(s) {
            p.time[0] = s
        }).targetFlag = false);
        hg.grade && (hg.grade.on("setGrade",
        function(s) {
            p.grade[0] = s
        }).target = null);
        hg.time.init();
        b(r, p);
        n.remove();
        e.canvas = r;
        e.gameTopBar = p;
        function q(s) {
            return s.replace(/([.\d]+)(px|em|rem|pt)/g,
            function(v, t, x) {
                return (t * o) + x
            })
        }
    };
    e.showTopBar = function() {
        b(e.canvas, e.gameTopBar)
    };
    e.setCanvasePixelRatio = function(l, o) {
        var l = l || CanvasRenderingContext2D.prototype;
        if (!l[k]) {
            l[k] = (function(p) {
                var r = 1;
                try {
                    r = p.backingStorePixelRatio || p.webkitBackingStorePixelRatio || p.mozBackingStorePixelRatio || p.msBackingStorePixelRatio || p.oBackingStorePixelRatio || 1
                } catch(q) {}
                return (g.devicePixelRatio || 1) / r
            })(l);
            var n = function(s, q) {
                for (var r in s) {
                    if (s.hasOwnProperty(r)) {
                        q(s[r], r)
                    }
                }
            },
            m = {
                fillRect: "all",
                clearRect: "all",
                strokeRect: "all",
                moveTo: "all",
                lineTo: "all",
                arc: [0, 1, 2],
                arcTo: "all",
                bezierCurveTo: "all",
                isPointinPath: "all",
                isPointinStroke: "all",
                quadraticCurveTo: "all",
                rect: "all",
                translate: "all",
                createRadialGradient: "all",
                createLinearGradient: "all",
                transform: [4, 5],
                setTransform: [4, 5],
            };
            n(m,
            function(q, p) {
                l[p] = (function(r) {
                    return function() {
                        var u, s, t = Array.prototype.slice.call(arguments),
                        v = this[k];
                        if (q === "all") {
                            t = t.map(function(w) {
                                return w * v
                            })
                        } else {
                            if (Array.isArray(q)) {
                                for (u = 0, s = q.length; u < s; u++) {
                                    t[q[u]] *= v
                                }
                            }
                        }
                        return r.apply(this, t)
                    }
                })(l[p])
            });
            l.stroke = (function(p) {
                return function() {
                    var q = this[k];
                    this.lineWidth *= q;
                    p.apply(this, arguments);
                    this.lineWidth /= q
                }
            })(l.stroke);
            l.fillText = (function(p) {
                return function() {
                    var q = Array.prototype.slice.call(arguments);
                    var r = this[k];
                    q[1] *= r;
                    q[2] *= r;
                    if (q[3]) {
                        q[3] *= r
                    }
                    this.font = this.font.replace(/([.\d]+)(px|em|rem|pt)/g,
                    function(t, s, v) {
                        return (s * r) + v
                    });
                    p.apply(this, q);
                    this.font = this.font.replace(/([.\d]+)(px|em|rem|pt)/g,
                    function(t, s, v) {
                        return (s / r) + v
                    })
                }
            })(l.fillText);
            l.strokeText = (function(p) {
                return function() {
                    var q = Array.prototype.slice.call(arguments);
                    var r = this[k];
                    q[1] *= r;
                    q[2] *= r;
                    this.font = this.font.replace(/([.\d]+)(px|em|rem|pt)/g,
                    function(t, s, v) {
                        return (s * r) + v
                    });
                    p.apply(this, q);
                    this.font = this.font.replace(/([.\d]+)(px|em|rem|pt)/g,
                    function(t, s, v) {
                        return (s / r) + v
                    })
                }
            })(l.strokeText);
            l.drawImage = (function(p) {
                return function() {
                    var q = Array.prototype.slice.call(arguments);
                    var r = this[k];
                    if (q.length === 3) {
                        q[1] *= r;
                        q[2] *= r
                    } else {
                        if (q.length === 5) {
                            q[1] *= r;
                            q[2] *= r;
                            q[3] *= r;
                            q[4] *= r
                        } else {
                            if (q.length === 9) {
                                q[5] *= r;
                                q[6] *= r;
                                q[7] *= r;
                                q[8] *= r
                            }
                        }
                    }
                    p.apply(this, q)
                }
            })(l.drawImage);
            l.putImageData = (function(p) {
                return function() {
                    var q = Array.prototype.slice.call(arguments);
                    var r = this[k];
                    for (i = 1, len = q.length; i < len; i++) {
                        q[i] *= r
                    }
                    p.apply(this, q)
                }
            })(l.putImageData)
        }
        if (o) {
            l[k] = o
        }
        return l[k]
    };
    function b(o, m) {
        if (!o || (typeof m.visible != "undefined" && !m.visible)) {
            return
        }
        o.save();
        $.extend(o, m.background[1]);
        o.fillRect.apply(o, m.background[0]);
        if (m.userImg) {
            var n = m.userImg[3];
            var l = m.userImg[2];
            o.beginPath();
            o.moveTo(l[0] + l[2], l[1]);
            o.arc.apply(o, l);
            o.lineWidth = m.userImg[0];
            o.strokeStyle = m.userImg[1];
            o.stroke();
            if (n[0].width > 0 && n[0].height > 0) {
                o.save();
                o.clip();
                o.drawImage.apply(o, n);
                o.restore()
            }
        }
        h(o, m.grade);
        h(o, m.timeText);
        h(o, m.time);
        o.restore()
    }
    function h(m, l) {
        if (!l) {
            return
        }
        $.extend(m, l[3]);
        m.fillText(l[0], l[1], l[2])
    }
})(LF, window);
