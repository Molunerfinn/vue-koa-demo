class LRectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.setRectangle();
    }
	
    setRectangle() {
        let s = this;
        s.bottom = s.y + s.height;
        s.right = s.x + s.width;
        s.left = s.x;
        s.top = s.y;
    }
    clone() {
        let s = this;
        return new LRectangle(s.x, s.y, s.width, s.height);
    }
    contains(x, y) {
        let s = this;
        return x >= s.x && x <= s.right && y >= s.y && y <= s.bottom;
    }
    containsRect(rect) {
        let s = this;
        return rect.x >= s.x && rect.right <= s.right && rect.y >= s.y && rect.bottom <= s.bottom;
    }
    equals(v) {
        let s = this;
        return v.x === s.x && v.width === s.width && v.y === s.y && v.height === s.height;
    }
    inflate(dx, dy) {
        let s = this;
        s.width += dx;
        s.height += dy;
        s.setRectangle();
    }
    intersection(t) {
        let s = this;
        let ix = s.x > t.x ? s.x : t.x;
        let iy = s.y > t.y ? s.y : t.y;
        let ax = s.right > t.right ? t.right : s.right;
        let ay = s.bottom > t.bottom ? t.bottom : s.bottom;
        if (ix <= ax && iy <= ay) {
            return new LRectangle(ix, iy, ax, ay);
        } else {
            return new LRectangle(0, 0, 0, 0);
        }
    }
    intersects(t) {
        let s = this;
        let ix = s.x > t.x ? s.x : t.x;
        let iy = s.y > t.y ? s.y : t.y;
        let ax = s.right > t.right ? t.right : s.right;
        let ay = s.bottom > t.bottom ? t.bottom : s.bottom;
        return ix <= ax && iy <= ay;
    }
    isEmpty() {
        let s = this;
        return s.x === 0 && s.y === 0 && s.width === 0 && s.height === 0;
    }
    offset(dx, dy) {
        let s = this;
        s.x += dx;
        s.y += dy;
        s.setRectangle();
    }
    setEmpty() {
        let s = this;
        s.x = 0;
        s.y = 0;
        s.width = 0;
        s.height = 0;
        s.setRectangle();
    }
    setTo(xa, ya, w, h) {
        let s = this;
        s.x = xa;
        s.y = ya;
        s.width = w;
        s.height = h;
        s.setRectangle();
    }
    toString() {
        let s = this;
        return '[object LRectangle(' + s.x + ',' + s.y + ',' + s.width + ',' + s.height + ')]';
    }
    union(t) {
        let s = this;
        return new LRectangle(s.x > t.x ? t.x : s.x, s.y > t.y ? t.y : s.y, s.right > t.right ? s.right : t.right, s.bottom > t.bottom ? s.bottom : t.bottom);
    }
}
export default LRectangle;