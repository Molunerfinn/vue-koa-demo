import LObject from '../utils/LObject';
import ll from '../ll';
import { UNDEFINED } from '../utils/LConstant';
class LGraphics extends LObject {
    constructor() {
        super();
        let s = this;
        s.type = 'LGraphics';
        s.color = '#000000';
        s.alpha = 1;
        s.bitmap = null;
        s.setList = new Array();
        s.showList = new Array();
    }
	
    ll_show(ctx) {
        let s = this, k, l = s.setList.length;
        if (l === 0) {
            return;
        }
        for (k = 0; k < l; k++) {
            s.setList[k](ctx);
            if (ll.LGlobal.fpsStatus) {
                ll.LGlobal.fpsStatus.graphics++;
            }
        }
    }
    clone() {
        let s = this, a = new LGraphics(), i, l, c;
        a.color = s.color;
        a.alpha = s.alpha;
        a.bitmap = s.bitmap;
        for (i = 0, l = s.setList.length; i < l; i++) {
            c = s.setList[i];
            a.setList.push(c);
        }
        for (i = 0, l = s.showList.length; i < l; i++) {
            c = s.showList[i];
            a.showList.push(c);
        }
        return a;
    }
    lineCap(t) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.lineCap = t;
        });
    }
    lineJoin(t) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.lineJoin = t;
        });
    }
    lineWidth(t) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.lineWidth = t;
        });
    }
    strokeStyle(co) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.strokeStyle = co;
        });
    }
    stroke() {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.stroke();
        });
    }
    beginPath() {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.beginPath();
        });
    }
    closePath() {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.closePath();
        });
    }
    moveTo(x, y) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.moveTo(x, y);
        });
        s.showList.push({ type: ll.LShape.POINT, arg: [x, y] });
    }
    lineTo(x, y) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.lineTo(x, y);
        });
        s.showList.push({ type: ll.LShape.POINT, arg: [x, y] });
    }
    rect(x, y, w, h) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.rect(x, y, w, h);
        });
        s.showList.push({ type: ll.LShape.RECT, arg: [x, y, w, h] });
    }
    fillStyle(co) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.fillStyle = co;
        });
    }
    fill() {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.fill();
        });
    }
    arc(x, y, r, sa, ea, aw) {
        let s = this;
        s.setList.push(function(ctx) {
            ctx.arc(x, y, r, sa, ea, aw);
        });
        s.showList.push({ type: ll.LShape.ARC, arg: sa });
    }
    lineStyle(tn, co) {
        let s = this;
        if (!co) {
            co = s.color;
        }
        s.color = co;
        s.setList.push(function(c) {
            c.lineWidth = tn;
            c.strokeStyle = co;
        });
    }
    clear() {
        let s = this;
        s.bitmap = null;
        s.setList.length = 0;
        s.showList.length = 0;
    }
    beginBitmapFill(b) {
        let s = this;
        s.setList.push(function() {
            s.bitmap = b;
        });
    }
    drawEllipse(tn, lco, pa, isf, co) {
        let s = this;
        s.setList.push(function(c) {
            let x, y, w, h, k, ox, oy, xe, ye, xm, ym;
            c.beginPath();
            k = 0.5522848;
            x = pa[0];
            y = pa[1];
            w = pa[2];
            h = pa[3];
            ox = (w / 2) * k;
            oy = (h / 2) * k;
            xe = x + w;
            ye = y + h;
            xm = x + w / 2;
            ym = y + h / 2;
            c.moveTo(x, ym);
            c.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            c.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            c.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            c.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
            if (s.bitmap) {
                c.save();
                c.clip();
                c.drawImage(s.bitmap.image,
                    s.bitmap.x, s.bitmap.y, s.bitmap.width, s.bitmap.height,
                    0, 0, s.bitmap.width, s.bitmap.height);
                c.restore(); 
                s.bitmap = null;
                return;
            }
            if (isf) {
                c.fillStyle = co;
                c.fill();
            }
            if (tn > 0) {
                c.lineWidth = tn;
                c.strokeStyle = lco;
                c.stroke();
            }
        });
        s.showList.push({ type: ll.LShape.RECT, arg: pa });
    }
    drawArc(tn, lco, pa, isf, co) {
        let s = this;
        s.setList.push(function(c) {
            c.beginPath();
            if (pa.length > 6 && pa[6]) {
                c.moveTo(pa[0], pa[1]);
            }
            c.arc(pa[0], pa[1], pa[2], pa[3], pa[4], pa[5]);
            if (pa.length > 6 && pa[6]) {
                c.lineTo(pa[0], pa[1]);
            }
            if (s.bitmap) {
                c.save();
                c.clip();
                c.drawImage(s.bitmap.image,
                    s.bitmap.x, s.bitmap.y, s.bitmap.width, s.bitmap.height,
                    0, 0, s.bitmap.width, s.bitmap.height);
                c.restore(); 
                s.bitmap = null;
                return;
            }
            if (isf) {
                c.fillStyle = co;
                c.fill();
            }
            if (tn > 0) {
                c.lineWidth = tn;
                c.strokeStyle = lco;
                c.stroke();
            }
        });
        s.showList.push({ type: ll.LShape.ARC, arg: pa });
    }
    drawRect(tn, lco, pa, isf, co) {
        let s = this;
        s.setList.push(function(c) {
            c.beginPath();
            c.rect(pa[0], pa[1], pa[2], pa[3]);
            c.closePath();
            if (s.bitmap) {
                c.save();
                c.clip();
                c.drawImage(s.bitmap.image,
                    s.bitmap.x, s.bitmap.y,
                    s.bitmap.width, s.bitmap.height,
                    0, 0,
                    s.bitmap.width, s.bitmap.height);
                c.restore(); 
                s.bitmap = null;
                return;
            }
            if (isf) {
                c.fillStyle = co;
                c.fill();
            }
            if (tn > 0) {
                c.lineWidth = tn;
                c.strokeStyle = lco;
                c.stroke();
            }
        });
        s.showList.push({ type: ll.LShape.RECT, arg: pa });
    }
    drawRoundRect(tn, lco, pa, isf, co) {
        let s = this;
        if (ll.LGlobal.enableWebGL) {
            s.drawRect(tn, lco, pa, isf, co);
            return;
        }
        s.setList.push(function(c) {
            c.beginPath();
            c.moveTo(pa[0] + pa[4], pa[1]);
            c.lineTo(pa[0] + pa[2] - pa[4], pa[1]);
            c.arcTo(pa[0] + pa[2], pa[1], pa[0] + pa[2], pa[1] + pa[4], pa[4]);
            c.lineTo(pa[0] + pa[2], pa[1] + pa[3] - pa[4]);
            c.arcTo(pa[0] + pa[2], pa[1] + pa[3], pa[0] + pa[2] - pa[4], pa[1] + pa[3], pa[4]);
            c.lineTo(pa[0] + pa[4], pa[1] + pa[3]);
            c.arcTo(pa[0], pa[1] + pa[3], pa[0], pa[1] + pa[3] - pa[4], pa[4]);
            c.lineTo(pa[0], pa[1] + pa[4]);
            c.arcTo(pa[0], pa[1], pa[0] + pa[4], pa[1], pa[4]);
            c.closePath();
            if (s.bitmap) {
                c.save();
                c.clip();
                c.drawImage(s.bitmap.image,
                    0, 0,
                    s.bitmap.width, s.bitmap.height,
                    0, 0,
                    s.bitmap.width, s.bitmap.height);
                c.restore(); 
                s.bitmap = null;
                return;
            }
            if (isf) {
                c.fillStyle = co;
                c.fill();
            }
            if (tn > 0) {
                c.lineWidth = tn;
                c.strokeStyle = lco;
                c.stroke();
            }
        });
        s.showList.push({ type: ll.LShape.RECT, arg: pa });
    }
    drawVertices(tn, lco, v, isf, co) {
        let s = this;
        if (v.length < 3) {
            return;
        }
        s.setList.push(function(c) {
            c.beginPath();
            c.moveTo(v[0][0], v[0][1]);
            let i, l = v.length, pa;
            for (i = 1; i < l; i++) {
                pa = v[i];
                c.lineTo(pa[0], pa[1]);
            }
            c.lineTo(v[0][0], v[0][1]);
            c.closePath();
            if (s.bitmap) {
                c.save();
                c.clip();
                c.drawImage(s.bitmap.image,
                    s.bitmap.x, s.bitmap.y, s.bitmap.width, s.bitmap.height,
                    0, 0, s.bitmap.width, s.bitmap.height);
                c.restore(); 
                s.bitmap = null;
                return;
            }
            if (isf) {
                c.fillStyle = co;
                c.fill();
            }
            if (tn > 0) {
                c.lineWidth = tn;
                c.strokeStyle = lco;
                c.closePath();
                c.stroke();
            }
        });
        s.showList.push({ type: ll.LShape.VERTICES, arg: v });
    }
    drawTriangles(ve, ind, u, tn, lco) {
        let s = this;
        let i, j, sh, l = ind.length;
        s.setList.push(function(c) {
            let v = ve, k, sw;
            for (i = 0, j = 0; i < l; i += 3) {
                c.save();
                c.beginPath();
                c.moveTo(v[ind[i] * 2], v[ind[i] * 2 + 1]);
                c.lineTo(v[ind[i + 1] * 2], v[ind[i + 1] * 2 + 1]);
                c.lineTo(v[ind[i + 2] * 2], v[ind[i + 2] * 2 + 1]);
                c.lineTo(v[ind[i] * 2], v[ind[i] * 2 + 1]);
                c.closePath();
                if (tn) {
                    c.lineWidth = tn;
                    c.strokeStyle = lco;
                    c.stroke();
                }
                c.clip();
                if (i % 6 === 0) {
                    sw = -1;
                    let w = (u[ind[i + 1 + j] * 2] - u[ind[i + j] * 2]) * s.bitmap.width;
                    let h = (u[ind[i + 2] * 2 + 1] - u[ind[i] * 2 + 1]) * s.bitmap.height;
                    if (j === 0 && w < 0) {
                        for (k = i + 9; k < l; k += 3) {
                            if (u[ind[i + 2] * 2 + 1] === u[ind[k + 2] * 2 + 1]) {
                                j = k - i;
                                break;
                            }
                        }
                        if (j === 0) {
                            j = l - i;
                        }
                        w = (u[ind[i + 1 + j] * 2] - u[ind[i + j] * 2]) * s.bitmap.width;
                    }
                    if (i + j >= l) {
                        w = (u[ind[i + j - l] * 2] - u[ind[i + 1] * 2]) * s.bitmap.width;
                        sw = u[ind[i] * 2] === 1 ? 0 : s.bitmap.width * u[ind[i] * 2] + w;
                        if (sw > s.bitmap.width) {
                            sw -= s.bitmap.width;
                        }
                    } else {
                        sw = s.bitmap.width * u[ind[i + j] * 2];
                    }
                    sh = s.bitmap.height * u[ind[i] * 2 + 1];
                    if (h < 0) {
                        h = (u[ind[i + 2 - (i > 0 ? 6 : -6)] * 2 + 1] - u[ind[i - (i > 0 ? 6 : -6)] * 2 + 1]) * s.bitmap.height;
                        sh = 0;
                    }
                    let t1 = (v[ind[i + 1] * 2] - v[ind[i] * 2]) / w;
                    let t2 = (v[ind[i + 1] * 2 + 1] - v[ind[i] * 2 + 1]) / w;
                    let t3 = (v[ind[i + 2] * 2] - v[ind[i] * 2]) / h;
                    let t4 = (v[ind[i + 2] * 2 + 1] - v[ind[i] * 2 + 1]) / h;
                    c.transform(t1, t2, t3, t4, v[ind[i] * 2], v[ind[i] * 2 + 1]);
                    c.drawImage(s.bitmap.image,
                        s.bitmap.x + sw,
                        s.bitmap.y + sh,
                        w, h,
                        0, 0,
                        w, h);
                } else {
                    let w = (u[ind[i + 2 + j] * 2] - u[ind[i + 1 + j] * 2]) * s.bitmap.width;
                    let h = (u[ind[i + 2] * 2 + 1] - u[ind[i] * 2 + 1]) * s.bitmap.height;
                    if (j === 0 && w < 0) {
                        for (k = i + 9; k < l; k += 3) {
                            if (u[ind[i + 2] * 2 + 1] === u[ind[k + 2] * 2 + 1]) {
                                j = k - i;
                                break;
                            }
                        }
                        if (j === 0) {
                            j = l - i;
                        }
                        w = (u[ind[i + 2 + j] * 2] - u[ind[i + 1 + j] * 2]) * s.bitmap.width;
                    }
                    if (i + 1 + j >= l) {
                        w = (u[ind[i + 1 + j - l] * 2] - u[ind[i + 2] * 2]) * s.bitmap.width;
                        sw = u[ind[i + 1] * 2] === 1 ? 0 : s.bitmap.width * u[ind[i + 1] * 2] + w;
                        if (sw > s.bitmap.width) {
                            sw -= s.bitmap.width;
                        }
                    } else {
                        sw = s.bitmap.width * u[ind[i + 1 + j] * 2];
                    }
                    sh = s.bitmap.height * u[ind[i] * 2 + 1];
                    if (h < 0) {
                        h = (u[ind[i + 2 - (i > 0 ? 6 : -6)] * 2 + 1] - u[ind[i - (i > 0 ? 6 : -6)] * 2 + 1]) * s.bitmap.height;
                        sh = 0;
                    }
                    let t1 = (v[ind[i + 2] * 2] - v[ind[i + 1] * 2]) / w;
                    let t2 = (v[ind[i + 2] * 2 + 1] - v[ind[i + 1] * 2 + 1]) / w;
                    let t3 = (v[ind[i + 2] * 2] - v[ind[i] * 2]) / h;
                    let t4 = (v[ind[i + 2] * 2 + 1] - v[ind[i] * 2 + 1]) / h;
                    c.transform(t1, t2, t3, t4, v[ind[i + 1] * 2], v[ind[i + 1] * 2 + 1]);
                    c.drawImage(s.bitmap.image,
                        s.bitmap.x + sw,
                        s.bitmap.y + sh,
                        w, h,
                        0, -h,
                        w, h);
                }
                c.restore();
            }
        });
    }
    drawLine(tn, lco, pa) {
        let s = this;
        s.setList.push(function(c) {
            c.beginPath();
            c.moveTo(pa[0], pa[1]);
            c.lineTo(pa[2], pa[3]);
            c.lineWidth = tn;
            c.strokeStyle = lco;
            c.closePath();
            c.stroke();
        });
        s.showList.push({ type: ll.LShape.LINE, arg: pa });
    }
    add(f) {
        this.setList.push(f);
    }
    ismouseon(e, co) {
        let s = this;
        if (!e || s.showList.length === 0 || !s.parent) {
            return false;
        }
        return s.parent.ismouseonShapes(s.showList, e.offsetX, e.offsetY);
    }
    getWidth() {
        let s = this, k, k1, min, max, v, l, l1;
        for (k = 0, l = s.showList.length; k < l; k++) {
            if (s.showList[k].type === ll.LShape.RECT) {
                if (min > s.showList[k].arg[0] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[0];
                }
                if (max < s.showList[k].arg[0] + s.showList[k].arg[2] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[0] + s.showList[k].arg[2];
                }
            } else if (s.showList[k].type === ll.LShape.ARC) {
                if (min > s.showList[k].arg[0] - s.showList[k].arg[2] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[0] - s.showList[k].arg[2];
                }
                if (max < s.showList[k].arg[0] + s.showList[k].arg[2] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[0] + s.showList[k].arg[2];
                }
            } else if (s.showList[k].type === ll.LShape.VERTICES) {
                for (k1 = 0, l1 = s.showList[k].arg.length; k1 < l1; k1++) {
                    v = s.showList[k].arg[k1];
                    if (min > v[0] || typeof min === UNDEFINED) {
                        min = v[0];
                    }
                    if (max < v[0] || typeof max === UNDEFINED) {
                        max = v[0];
                    }
                }
            } else if (s.showList[k].type === ll.LShape.LINE) {
                if (min > s.showList[k].arg[0] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[0];
                }
                if (min > s.showList[k].arg[2] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[2];
                }
                if (max < s.showList[k].arg[0] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[0];
                }
                if (max < s.showList[k].arg[2] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[2];
                }
            } else if (s.showList[k].type === ll.LShape.POINT) {
                if (min > s.showList[k].arg[0] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[0];
                }
                if (max < s.showList[k].arg[0] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[0];
                }
            }
        }
        if (typeof min === UNDEFINED) {
            min = max = 0;
        }
        s.left = min;
        if (l > 0 && max === min) {
            max = min + 1;
        }
        return max - min;
    }
    getHeight() {
        let s = this, k = null, k1 = null, l, l1, min, max, v;
        for (k = 0, l = s.showList.length; k < l; k++) {
            if (s.showList[k].type === ll.LShape.RECT) {
                if (min > s.showList[k].arg[1] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[1];
                }
                if (max < s.showList[k].arg[1] + s.showList[k].arg[3] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[1] + s.showList[k].arg[3];
                }
            } else if (s.showList[k].type === ll.LShape.ARC) {
                if (min > s.showList[k].arg[1] - s.showList[k].arg[2] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[1] - s.showList[k].arg[2];
                }
                if (max < s.showList[k].arg[1] + s.showList[k].arg[2] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[1] + s.showList[k].arg[2];
                }
            } else if (s.showList[k].type === ll.LShape.VERTICES) {
                for (k1 = 0, l1 = s.showList[k].arg.length; k1 < l1; k1++) {
                    v = s.showList[k].arg[k1];
                    if (min > v[1] || typeof min === UNDEFINED) {
                        min = v[1];
                    }
                    if (max < v[1] || typeof max === UNDEFINED) {
                        max = v[1];
                    }
                }
            } else if (s.showList[k].type === ll.LShape.LINE) {
                if (min > s.showList[k].arg[1] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[1];
                }
                if (min > s.showList[k].arg[3] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[3];
                }
                if (max < s.showList[k].arg[1] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[1];
                }
                if (max < s.showList[k].arg[3] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[3];
                }
            } else if (s.showList[k].type === ll.LShape.POINT) {
                if (min > s.showList[k].arg[1] || typeof min === UNDEFINED) {
                    min = s.showList[k].arg[1];
                }
                if (max < s.showList[k].arg[1] || typeof max === UNDEFINED) {
                    max = s.showList[k].arg[1];
                }
            }
        }
        if (typeof min === UNDEFINED) {
            min = max = 0;
        }
        s.top = min;
        if (l > 0 && max === min) {
            max = min + 1;
        }
        return max - min;
    }
    startX() {
        let s = this;
        s.getWidth();
        return s.left;
    }
    startY() {
        let s = this;
        s.getHeight();
        return s.top;
    }
}
ll.LGraphics = LGraphics;
export default LGraphics;