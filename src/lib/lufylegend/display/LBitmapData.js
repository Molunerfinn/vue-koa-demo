import LObject from '../utils/LObject';
import { UNDEFINED } from '../utils/LConstant';
import LRectangle from '../geom/LRectangle';
import ll from '../ll';
class LBitmapData extends LObject {
    constructor(image, x, y, width, height, dataType) {
        super();
        this.type = 'LBitmapData';
        if (typeof dataType === UNDEFINED) {
            dataType = LBitmapData.DATA_IMAGE;
        }
        this.oncomplete = null;
        this._locked = false;
        this._setPixel = false;
        this.x = x || 0;
        this.y = y || 0;
        this.width = 0;
        this.height = 0;
        this.dataType = null;
        if (image && typeof image === 'object') {
            this.image = image;
            this.dataType = LBitmapData.DATA_IMAGE;
            this.width = width || this.image.width;
            this.height = height || this.image.height;
            this._setDataType(dataType);
        } else {
            this._createCanvas();
            this.dataType = LBitmapData.DATA_CANVAS;
            this._canvas.width = this.width = (width ? width : 1);
            this._canvas.height = this.height = (height ? height : 1);
            if (typeof image === 'string') {
                this._context.fillStyle = image;
                this._context.fillRect(0, 0, this.width, this.height);
            } else if (typeof image === 'number') {
                let d = this._context.createImageData(this.width, this.height);
                for (let i = 0; i < d.data.length; i += 4) {
                    d.data[i + 0] = image >> 16 & 0xFF;
                    d.data[i + 1] = image >> 8 & 0xFF;
                    d.data[i + 2] = image & 0xFF;
                    d.data[i + 3] = 255;
                }
                this._context.putImageData(d, 0, 0);
            }

            this.image = this._canvas;
            if (dataType === LBitmapData.DATA_IMAGE) {
                this._setDataType(dataType);
            }
        }
        this.resize();
    }

    _setDataType(dataType) {
        let s = this;
        if (s.dataType === dataType) {
            return;
        }
        if (dataType === LBitmapData.DATA_CANVAS) {
            s._createCanvas();
            s._canvas.width = s.image.width;
            s._canvas.height = s.image.height;
            s._context.clearRect(0, 0, s._canvas.width, s._canvas.height);
            s._context.drawImage(s.image, 0, 0);
            s.image = s._canvas;
        } else if (dataType === LBitmapData.DATA_IMAGE) {
            s.image = new Image();
            s.image.width = s._canvas.width;
            s.image.height = s._canvas.height;
            s.image.src = s._canvas.toDataURL();
        }
        s.dataType = dataType;
    }
    _createCanvas() {
        let s = this;
        if (!s._canvas) {
            s._canvas = document.createElement('canvas');
            s._context = s._canvas.getContext('2d');
        }
    }
    clear(rectangle) {
        let s = this;
        s._createCanvas();
        if (rectangle) {
            s._context.clearRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        } else {
            s._canvas.width = s.image.width;
        }
        if (s.dataType === LBitmapData.DATA_IMAGE) {
            s.image.src = s._canvas.toDataURL();
        }
    }
    setProperties(x, y, width, height) {
        let s = this;
        s.x = x;
        s.y = y;
        s.width = width;
        s.height = height;
        s.resize();
    }
    setCoordinate(x, y) {
        let s = this;
        s.x = x;
        s.y = y;
        s.resize();
    }
    clone() {
        let s = this;
        return new LBitmapData(s.image, s.x, s.y, s.width, s.height, s.dataType);
    }
    _ready() {
        let s = this;
        s._dataType = s.dataType;
        s._setDataType(LBitmapData.DATA_CANVAS);
        s._data = s._context.getImageData(s.x, s.y, s.width, s.height);
    }
    _update() {
        let s = this;
        s._context.putImageData(s._data, s.x, s.y, 0, 0, s.width, s.height);
        s._setDataType(s._dataType);
        s._data = null;
    }
    applyFilter(sourceBitmapData, sourceRect, destPoint, filter, c) {
        let s = this;
        let r = s._context.getImageData(s.x + sourceRect.x, s.y + sourceRect.y, sourceRect.width, sourceRect.height);
        let data = filter.filter(r, sourceRect.width, c);
        s.putPixels(new LRectangle(destPoint.x, destPoint.y, sourceRect.width, sourceRect.height), data);
    }
    getPixel(x, y, colorType) {
        let s = this, i, d;
        x = x >> 0;
        y = y >> 0;
        if (!s._locked) {
            s._ready();
        }
        i = s.width * 4 * y + x * 4;
        d = s._data.data;
        if (!s._locked) {
            s._update();
        }
        if (colorType === 'number') {
            return d[i] << 16 | d[i + 1] << 8 | d[i + 2];
        } else {
            return [d[i], d[i + 1], d[i + 2], d[i + 3]];
        }
    }
    setPixel(x, y, data) {
        let s = this;
        x = x >> 0;
        y = y >> 0;
        if (!s._locked) {
            s._ready();
        }
        let d = s._data, i = s.width * 4 * y + x * 4;
        if (typeof data === 'object') {
            d.data[i + 0] = data[0];
            d.data[i + 1] = data[1];
            d.data[i + 2] = data[2];
            d.data[i + 3] = data[3];
        } else {
            if (typeof data === 'string') {
                data = parseInt(data.replace('#', '0x'));
            }
            d.data[i + 0] = data >> 16 & 0xFF;
            d.data[i + 1] = data >> 8 & 0xFF;
            d.data[i + 2] = data & 0xFF;
            d.data[i + 3] = 255;
        }
        if (!s._locked) {
            s._update();
        }
    }
    getPixels(rect) {
        let s = this, r;
        if (!s._locked) {
            s._ready();
        }
        r = s._context.getImageData(s.x + rect.x, s.y + rect.y, rect.width, rect.height);
        if (!s._locked) {
            s._update();
        }
        return r;
    }
    setPixels(rect, data) {
        let s = this, i, j, d, w, x, y;
        if (!s._locked) {
            s._ready();
        }
        d = s._data;
        if (typeof data === 'object') {
            w = s._canvas.width;
            for (x = rect.x; x < rect.right; x++) {
                for (y = rect.y; y < rect.bottom; y++) {
                    i = w * 4 * (s.y + y) + (s.x + x) * 4;
                    j = data.width * 4 * (y - rect.y) + (x - rect.x) * 4;
                    d.data[i + 0] = data.data[j + 0];
                    d.data[i + 1] = data.data[j + 1];
                    d.data[i + 2] = data.data[j + 2];
                    d.data[i + 3] = data.data[j + 3];
                }
            }
        } else {
            if (typeof data === 'string') {
                data = parseInt(data.replace('#', '0x'));
            }
            data = [data >> 16 & 0xFF, data >> 8 & 0xFF, data & 0xFF];
            w = s._canvas.width;
            for (x = rect.x; x < rect.right; x++) {
                for (y = rect.y; y < rect.bottom; y++) {
                    i = w * 4 * (s.y + y) + (s.x + x) * 4;
                    d.data[i + 0] = data[0];
                    d.data[i + 1] = data[1];
                    d.data[i + 2] = data[2];
                    d.data[i + 3] = 255;
                }
            }
        }
        if (!s._locked) {
            s._update();
        }
    }
    putPixels(rect, data) {
        let s = this;
        if (s.dataType !== LBitmapData.DATA_CANVAS || typeof data !== 'object') {
            return;
        }
        s._context.putImageData(data, s.x + rect.x, s.y + rect.y, 0, 0, rect.width, rect.height);
    }
    lock() {
        let s = this;
        s._locked = true;
        s._ready();
    }
    unlock() {
        let s = this;
        s._locked = false;
        s._update();
    }
    draw(source, matrix, colorTransform, blendMode, clipRect) {
        let s = this, c, bd = source, x, y, w, h, save = false;
        let _dataType = s.dataType;
        s._setDataType(LBitmapData.DATA_CANVAS);
        if (matrix || colorTransform || blendMode || clipRect) {
            s._context.save();
            save = true;
        }
        if (clipRect) {
            if (!(bd instanceof LBitmapData)) {
                x = y = 0;
            } else {
                x = bd.x;
                y = bd.y;
            }
            bd = new LBitmapData(bd.getDataCanvas(), x + clipRect.x, y + clipRect.y, clipRect.width, clipRect.height, LBitmapData.DATA_CANVAS);
        }
        w = bd.getWidth() >>> 0;
        h = bd.getHeight() >>> 0;
        if (w === 0 || h === 0) {
            s._setDataType(_dataType);
            return;
        }
        c = bd.getDataCanvas();
        if (colorTransform) {
            bd.colorTransform(new LRectangle(0, 0, w, h), colorTransform);
            c = bd.image;
        }
        if (matrix) {
            s._context.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
        }
        if (blendMode) {
            s._context.globalCompositeOperation = blendMode;
        }
        s._context.drawImage(c, bd.x, bd.y, w, h, 0, 0, w, h);
        if (save) {
            s._context.restore();
        }
        s._setDataType(_dataType);
        s.resize();
    }
    getDataCanvas() {
        let s = this;
        let _dataType = s.dataType;
        s._setDataType(LBitmapData.DATA_CANVAS);
        s._setDataType(_dataType);
        return s._canvas;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    resize() {
        let s = this, w = s.image.width - s.x, h = s.image.height - s.y;
        s.width = s.width < w ? s.width : w;
        s.height = s.height < h ? s.height : h;
    }
    colorTransform(rect, colorTransform) {
        let s = this;
        if (s.dataType !== LBitmapData.DATA_CANVAS) {
            return;
        }
        let img = s._context.getImageData(s.x + rect.x, s.y + rect.y, rect.width, rect.height);
        let data = img.data;
        for (let i = 0, l = data.length; i < l; i += 4) {
            let r = i, g = i + 1, b = i + 2, a = i + 3;
            data[r] = data[r] * colorTransform.redMultiplier + colorTransform.redOffset;
            data[g] = data[g] * colorTransform.greenMultiplier + colorTransform.greenOffset;
            data[b] = data[b] * colorTransform.blueMultiplier + colorTransform.blueOffset;
            data[a] = data[a] * colorTransform.alphaMultiplier + colorTransform.alphaOffset;
        }
        s._context.putImageData(img, s.x + rect.x, s.y + rect.y, 0, 0, rect.width, rect.height);
    }
    copyPixels(sourceBitmapData, sourceRect, destPoint) {
        let s = this, left, top, width, height, bd = sourceBitmapData;
        if (s.dataType !== LBitmapData.DATA_CANVAS) {
            return;
        }
        left = bd.x;
        top = bd.y;
        width = bd.width;
        height = bd.height;
        bd.setProperties(sourceRect.x + bd.x, sourceRect.y + bd.y, sourceRect.width, sourceRect.height);
        s._context.drawImage(bd.image, bd.x, bd.y, bd.width, bd.height, destPoint.x, destPoint.y, bd.width, bd.height);
        bd.x = left;
        bd.y = top;
        bd.width = width;
        bd.height = height;
    }
}
LBitmapData.DATA_IMAGE = 'data_image';
LBitmapData.DATA_CANVAS = 'data_canvas';
ll.LBitmapData = LBitmapData;
export default LBitmapData;