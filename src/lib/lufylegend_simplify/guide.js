import ll from '@/lib/lufylegend/ll';
import LGlobal from '@/lib/lufylegend/utils/LGlobal'
import LShape from '@/lib/lufylegend/display/LShape'
import LTweenLite from '@/lib/lufylegend/transitions/LTweenLite'

class LGuide extends LShape {
    constructor(x, y, width, height, color) {
        super();
        if (typeof x === "object") {
            color = x.color;
            height = x.h;
            width = x.w;
            y = x.y;
            x = x.x
        }
        color = color || "#fff";

        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        this.r = Math.min(width, height) / 2;
        this.tweens = [];
        this.timers = [];
        this.arcList = [];
        for (var ay = 0; ay < 3; ay++) {
                var aC = {
                    r: 0,
                    p: 1
                };
                this.graphics.add(()=> {
                    var canvas = LGlobal.canvas;
                    canvas.save();
                    canvas.beginPath();
                    canvas.arc(this.w / 2, this.h / 2, aC.r, 0, 2 * Math.PI);
                    canvas.closePath();
                    canvas.fillStyle = color;
                    canvas.globalAlpha = aC.p;
                    canvas.fill();
                    canvas.restore()
                });
                this.arcList.push(aC)

        }
    }

    play() {
        var av = this;
        av.stop();
        av.arcList.forEach(function(aw, ax) {
            av.timers.push(setTimeout(function() {
                av.tweens.push(LTweenLite.to(aw, 1, {
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
    }
    change(aw) {
        var av = this;
        aw.x && (av.x = aw.x);
        aw.y && (av.y = aw.y);
        return av
    }
    stop() {
        var av = this;
        av.arcList.forEach(function(aw, ax) {
            clearTimeout(av.timers[ax]);
            aw.r = 0;
            aw.p = 1
        });
        av.tweens.forEach(function(ax, aw) {
            LTweenLite.remove(ax)
        });
        av.tweens = [];
        av.timers = [];
        return av
    }

}

ll.LGuide = LGuide;
export default LGuide;
