import LSprite from './LSprite';
import LBitmapData from './LBitmapData';
import LBitmap from './LBitmap';
import LSpriteAtlasType from '../system/LSpriteAtlasType';
import LPanel from '../lib/ui/LPanel';
class LAtlasSprite extends LSprite {
    constructor(texture, setting, data, atlasType) {
        super();
        this.atlasType = atlasType;
        this._rotated = data.rotated;
        if (atlasType === LSpriteAtlasType.SIMPLE || !setting) {
            this.atlasType = LSpriteAtlasType.SIMPLE;
            let bitmap = this._getBitmap(texture, data);
            this.addChild(bitmap);
        } else if (atlasType === LSpriteAtlasType.SLICED) {
            let panel = this._getPanel(texture, setting, data);
            this.addChild(panel);
        }
    }
    resize(width, height) {
        if (this.atlasType === LSpriteAtlasType.SIMPLE) {
            let sprite = this.getChildAt(0);
            let bitmap = sprite.getChildAt(0);
            let bitmapWidth = this._rotated ? bitmap.bitmapData.getHeight() : bitmap.bitmapData.getWidth();
            let bitmapHeight = this._rotated ? bitmap.bitmapData.getWidth() : bitmap.bitmapData.getHeight();
            sprite.scaleX = width / bitmapWidth;
            sprite.scaleY = height / bitmapHeight;
        } else if (this.atlasType === LSpriteAtlasType.SLICED) {
            let panel = this.getChildAt(0);
            if (this._rotated) {
                panel.resize(height, width);
                panel.y = height;
            } else {
                panel.resize(width, height);
            }
        }
    }
    _getBitmapData(texture, data) {
        let x = data.frame[0][0];
        let y = data.frame[0][1];
        let width = data.frame[1][data.rotated ? 1 : 0];
        let height = data.frame[1][data.rotated ? 0 : 1];
        let bitmapData = new LBitmapData(texture, x, y, width, height);
        return bitmapData;
    }
    _getBitmap(texture, data) {
        let bitmapData = this._getBitmapData(texture, data);
        let bitmap = new LBitmap(bitmapData);
        bitmap.rotateCenter = false;
        if (data.rotated) {
            bitmap.y = bitmapData.getWidth();
            bitmap.rotate = -90;
        }
        let sprite = new LSprite();
        sprite.addChild(bitmap);
        return sprite;
    }
    _getPanel(texture, setting, data) {
        let bitmapData = this._getBitmapData(texture, data);
        let width = bitmapData.getWidth();
        let height = bitmapData.getHeight();
        let left = data.rotated ? setting.bottom : setting.left;
        let right = data.rotated ? setting.top : setting.right;
        let top = data.rotated ? setting.left : setting.top;
        let bottom = data.rotated ? setting.right : setting.bottom;
        let x1 = left;
        let x2 = width - right;
        let y1 = top;
        let y2 = height - bottom;
        let panel = new LPanel(bitmapData, width, height, x1, x2, y1, y2);
        if (data.rotated) {
            panel.y = width;
            panel.rotate = -90;
        }
        return panel;
    }
}
export default LAtlasSprite;