import LObject from '../utils/LObject';
import { UNDEFINED } from '../utils/LConstant';
class LMatrix extends LObject {
    constructor(a, b, c, d, tx, ty, u, v, w) {
        super();
        this.a = typeof a !== UNDEFINED ? a : 1;
        this.b = typeof b !== UNDEFINED ? b : 0;
        this.u = typeof u !== UNDEFINED ? u : 0;
        this.c = typeof c !== UNDEFINED ? c : 0;
        this.d = typeof d !== UNDEFINED ? d : 1;
        this.v = typeof v !== UNDEFINED ? v : 0;
        this.tx = typeof tx !== UNDEFINED ? tx : 0;
        this.ty = typeof ty !== UNDEFINED ? ty : 0;
        this.w = typeof w !== UNDEFINED ? w : 1;
    }
	
    setTo(a, b, c, d, tx, ty, u, v, w) {
        let s = this;
        if (typeof a !== UNDEFINED) {
            s.a = a;
        }
        if (typeof b !== UNDEFINED) {
            s.b = b;
        }
        if (typeof c !== UNDEFINED) {
            s.c = c;
        }
        if (typeof d !== UNDEFINED) {
            s.d = d;
        }
        if (typeof tx !== UNDEFINED) {
            s.tx = tx;
        }
        if (typeof ty !== UNDEFINED) {
            s.ty = ty;
        }
        if (typeof u !== UNDEFINED) {
            s.u = u;
        }
        if (typeof v !== UNDEFINED) {
            s.v = v;
        }
        if (typeof w !== UNDEFINED) {
            s.w = w;
        }
        return s;
    }
    isIdentity() {
        let s = this;
        return (s.a === 1 && s.b === 0 && s.c === 0 && s.d === 1 && s.tx === 0 && s.ty === 0 && s.u === 0 && s.v === 0 && s.w === 1);
    }
    transform(c) {
        let s = this;
        c.transform(s.a, s.b, s.c, s.d, s.tx, s.ty);
        return s;
    }
    identity() {
        this.setTo(1, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    rotate(q) {
        let s = this,
            radian = q * Math.PI / 180,
            cos = Math.cos(radian),
            sin = Math.sin(radian),
            mtx = new LMatrix(cos, sin, -sin, cos, 0, 0, 0, 0, 1);
        s.add(mtx);
        return s;
    }
    scale(sx, sy) {
        let s = this,
            mtx = new LMatrix(sx, 0, 0, sy, 0, 0, 0, 0, 1);
        s.add(mtx);
        return s;
    }
    translate(tx, ty) {
        let s = this,
            mtx = new LMatrix(1, 0, 0, 1, tx, ty, 0, 0, 1);
        s.add(mtx);
        return s;
    }
    skew(kx, ky) {
        let s = this,
            mtx = new LMatrix(1, ky, kx, 1, 0, 0, 0, 0, 1);
        s.add(mtx);
        return s;
    }
    add(mtx) {
        let s = this, a, b, c, d, tx, ty, u, v, w;
        a = s.a * mtx.a + s.b * mtx.c + s.u * mtx.tx;
        b = s.a * mtx.b + s.b * mtx.d + s.u * mtx.ty;
        u = s.a * mtx.u + s.b * mtx.v + s.u * mtx.w;
        c = s.c * mtx.a + s.d * mtx.c + s.v * mtx.tx;
        d = s.c * mtx.b + s.d * mtx.d + s.v * mtx.ty;
        v = s.c * mtx.u + s.d * mtx.v + s.v * mtx.w;
        tx = s.tx * mtx.a + s.ty * mtx.c + s.w * mtx.tx;
        ty = s.tx * mtx.b + s.ty * mtx.d + s.w * mtx.ty;
        w = s.tx * mtx.u + s.ty * mtx.v + s.w * mtx.w;
        s.setTo(a, b, c, d, tx, ty, u, v, w);
    }
    toArray(mtx) {
        let s = this;
        if (Array.isArray(mtx) && mtx.length === 3) {
            let m = mtx[0] * s.a + mtx[1] * s.c + mtx[2] * s.tx,
                n = mtx[0] * s.b + mtx[1] * s.d + mtx[2] * s.ty,
                k = mtx[0] * s.u + mtx[1] * s.v + mtx[2] * s.w;
            return [m, n, k];
        } else {
            let a = s.a * mtx.a + s.b * mtx.c + s.u * mtx.tx,
                b = s.a * mtx.b + s.b * mtx.d + s.u * mtx.ty,
                u = s.a * mtx.u + s.b * mtx.v + s.u * mtx.w,
                c = s.c * mtx.a + s.d * mtx.c + s.v * mtx.tx,
                d = s.c * mtx.b + s.d * mtx.d + s.v * mtx.ty,
                v = s.c * mtx.u + s.d * mtx.v + s.v * mtx.w,
                tx = s.tx * mtx.a + s.ty * mtx.c + s.w * mtx.tx,
                ty = s.tx * mtx.b + s.ty * mtx.d + s.w * mtx.ty,
                w = s.tx * mtx.u + s.ty * mtx.v + s.w * mtx.w;
            return [a, b, c, d, tx, ty, u, v, w];
        }
    }
    clone() {
        let s = this;
        return new LMatrix(s.a, s.b, s.c, s.d, s.tx, s.ty, s.u, s.v, s.w);
    }
}
export default LMatrix;