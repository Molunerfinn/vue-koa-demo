import LGlobal from '../utils/LGlobal';
import LGraphics from '../display/LGraphics';
import LTweenLite from '../transitions/LTweenLite';
class LTransition {
    constructor(displayObject, transObj) {
        this.child = displayObject;
        this.trans = transObj;
    }
    startTransition() {
        let self = this;
        switch (self.trans.type) {
        case LTransition.Blinds:
            self.blinds();
            break;
        case LTransition.Fade:
            self.fade();
            break;
        case LTransition.Fly:
            self.fly();
            break;
        case LTransition.Iris:
            self.iris();
            break;
        case LTransition.Squeeze:
            self.squeeze();
            break;
        case LTransition.Wipe:
            self.wipe();
            break;
        case LTransition.Zoom:
            self.zoom();
            break;
        case LTransition.PixelDissolve:
            self.pixelDissolve();
            break;
        case LTransition.Curtain:
            self.curtain();
            break;
        default:
            throw ('the type is not exists.');
        }
    }
    blindsComplete(self) {
        if (self.trans.direction === LTransition.OUT) {
            self.child.mask.clear();
        } else {
            self.blindsUpdateRun();
        }
        self.child.mask = null;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    blindsUpdateRun() {
        let self = this, g = self.child.mask, c = LGlobal.canvas;
        g.clear();
        if (self.trans.dimension) {
            g.add(function() {
                c.save();
                for (let i = 0; i < self.trans.numStrips; i++) {
                    c.rect(i * self.maxSize, 0, self.blindsSize, self.child.getHeight());
                }
                c.restore();
            });
        } else {
            g.add(function() {
                c.save();
                for (let i = 0; i < self.trans.numStrips; i++) {
                    c.rect(0, 0 + i * self.maxSize, self.child.getWidth(), self.blindsSize);
                }
                c.restore();
            });
        }
    }
    blindsUpdate(self) {
        self.blindsUpdateRun();
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    blinds() {
        let self = this;
        if (!self.trans.numStrips)
            self.trans.numStrips = 1;
        self.blindsSize = 0;
        if (self.trans.dimension) {
            self.maxSize = self.child.getWidth() / self.trans.numStrips >> 0;
        } else {
            self.maxSize = self.child.getHeight() / self.trans.numStrips >> 0;
        }
        let g = new LGraphics();
        self.child.mask = g;
        let toSize = self.maxSize;
        if (self.trans.direction === LTransition.OUT) {
            self.blindsSize = self.maxSize;
            toSize = 0;
        }
        LTweenLite.to(self, self.trans.duration, {
            blindsSize: toSize,
            onComplete: self.blindsComplete,
            onUpdate: self.blindsUpdate,
            ease: self.trans.easing
        });
    }
    fadeComplete(self) {
        self.child.alpha = self.alpha;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    fadeUpdate(self) {
        self.child.alpha = self.alpha;
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    fade() {
        let self = this;
        let toAlpha = 1;
        self.alpha = 0;
        if (self.trans.direction === LTransition.OUT) {
            self.alpha = 1;
            toAlpha = 0;
        }
        self.child.alpha = self.alpha;
        LTweenLite.to(self, self.trans.duration, {
            alpha: toAlpha,
            onComplete: self.fadeComplete,
            onUpdate: self.fadeUpdate,
            ease: self.trans.easing
        });
    }
    flyComplete(self) {
        self.child.x = self.x;
        self.child.y = self.y;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    flyUpdate(self) {
        self.child.x = self.x;
        self.child.y = self.y;
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    fly() {
        let self = this;
        let toX = self.child.x;
        let toY = self.child.y;
        switch (self.trans.startPoint) {
        case 1:
            self.x = -self.child.getWidth();
            self.y = -self.child.getHeight();
            break;
        case 2:
            self.x = (LGlobal.width - self.child.getWidth()) * 0.5;
            self.y = -self.child.getHeight();
            break;
        case 3:
            self.x = LGlobal.width;
            self.y = -self.child.getHeight();
            break;
        case 4:
            self.x = -self.child.getWidth();
            self.y = (LGlobal.height - self.child.getHeight()) * 0.5;
            break;
        case 6:
            self.x = LGlobal.width;
            self.y = (LGlobal.height - self.child.getHeight()) * 0.5;
            break;
        case 7:
            self.x = -self.child.getWidth();
            self.y = LGlobal.height;
            break;
        case 8:
            self.x = (LGlobal.width - self.child.getWidth()) * 0.5;
            self.y = LGlobal.height;
            break;
        case 9:
            self.x = LGlobal.width;
            self.y = LGlobal.height;
            break;
        case 5:
        default:
            self.x = (LGlobal.width - self.child.getWidth()) * 0.5;
            self.y = (LGlobal.height - self.child.getHeight()) * 0.5;
        }
        if (self.trans.direction === LTransition.OUT) {
            toX = self.x;
            toY = self.y;
            self.x = self.child.x;
            self.y = self.child.y;
        } else {
            self.child.x = self.x;
            self.child.y = self.y;
        }
        LTweenLite.to(self, self.trans.duration, {
            x: toX,
            y: toY,
            onComplete: self.flyComplete,
            onUpdate: self.flyUpdate,
            ease: self.trans.easing
        });
    }
    irisComplete(self) {
        if (self.trans.direction === LTransition.OUT) {
            self.child.mask.clear();
        } else {
            self.irisUpdateRun();
        }
        self.child.mask = null;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    irisUpdateRun() {
        let self = this, g = self.child.mask;
        g.clear();
        if (self.trans.shape === LIris.CIRCLE) {
            g.drawArc(0, '#000000', [self.x, self.y, self.r, 0, Math.PI * 2]);
        } else {
            g.drawRect(0, '#000000', [self.x + self.sLeft, self.y + self.sTop, self.width, self.height]);
        }
    }
    irisUpdate(self) {
        self.irisUpdateRun();
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    iris() {
        let self = this;
        self.sLeft = 0;
        self.sTop = 0;
        self.width = 0;
        self.height = 0;
        self.x = 0;
        self.y = 0;
        self.r = 0;
        self.eWidth = self.child.getWidth();
        self.eHeight = self.child.getHeight();
        switch (self.trans.startPoint) {
        case 1:
            self.eR = Math.sqrt(self.eWidth * self.eWidth + self.eHeight * self.eHeight);
            break;
        case 2:
            self.eR = Math.sqrt((self.eWidth * 0.5) * (self.eWidth * 0.5) + self.eHeight * self.eHeight);
            self.x = self.child.getWidth() * 0.5;
            break;
        case 3:
            self.eR = Math.sqrt(self.eWidth * self.eWidth + self.eHeight * self.eHeight);
            self.x = self.child.getWidth();
            break;
        case 4:
            self.eR = Math.sqrt(self.eWidth * self.eWidth + (self.eHeight * 0.5) * (self.eHeight * 0.5));
            self.y = self.child.getHeight() * 0.5;
            break;
        case 6:
            self.eR = Math.sqrt(self.eWidth * self.eWidth + (self.eHeight * 0.5) * (self.eHeight * 0.5));
            self.x = self.child.getWidth();
            self.y = self.child.getHeight() * 0.5;
            break;
        case 7:
            self.eR = Math.sqrt(self.eWidth * self.eWidth + self.eHeight * self.eHeight);
            self.y = self.child.getHeight();
            break;
        case 8:
            self.eR = Math.sqrt((self.eWidth * 0.5) * (self.eWidth * 0.5) + self.eHeight * self.eHeight);
            self.x = self.child.getWidth() * 0.5;
            self.y = self.child.getHeight();
            break;
        case 9:
            self.eR = Math.sqrt(self.eWidth * self.eWidth + self.eHeight * self.eHeight);
            self.x = self.child.getWidth();
            self.y = self.child.getHeight();
            break;
        case 5:
        default:
            self.eR = Math.sqrt((self.eWidth * 0.5) * (self.eWidth * 0.5) + (self.eHeight * 0.5) * (self.eHeight * 0.5));
            self.x = self.child.getWidth() * 0.5;
            self.y = self.child.getHeight() * 0.5;
        }
        self.eLeft = -self.x;
        self.eTop = -self.y;

        let g = new LGraphics();
        self.child.mask = g;
        if (self.trans.direction === LTransition.OUT) {
            self.sLeft = self.eLeft;
            self.sTop = self.eTop;
            self.eLeft = 0;
            self.eTop = 0;
            self.width = self.eWidth;
            self.height = self.eHeight;
            self.eWidth = 0;
            self.eHeight = 0;
            self.r = self.eR;
            self.eR = 0;
        }
        LTweenLite.to(self, self.trans.duration, {
            width: self.eWidth,
            height: self.eHeight,
            sLeft: self.eLeft,
            sTop: self.eTop,
            r: self.eR,
            onComplete: self.irisComplete,
            onUpdate: self.irisUpdate,
            ease: self.trans.easing
        });
    }
    curtainComplete(self) {
        if (self.trans.direction === LTransition.OUT) {
            self.child.mask.clear();
        } else {
            self.curtainUpdateRun();
        }
        self.child.mask = null;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    curtainUpdateRun() {
        let self = this, g = self.child.mask, c = LGlobal.canvas;
        g.clear();
        if (self.trans.dimension) {
            g.add(function() {
                c.beginPath();
                c.save();
                c.rect(0, 0, self.width, self.child.getHeight());
                c.rect(self.child.getWidth() - self.width, 0, self.width, self.child.getHeight());
                c.restore();
            });
        } else {
            g.add(function() {
                c.beginPath();
                c.save();
                c.rect(0, 0, self.child.getWidth(), self.height);
                c.rect(0, self.child.getHeight() - self.height, self.child.getWidth(), self.height);
                c.restore();
            });
        }
    }
    curtainUpdate(self) {
        self.curtainUpdateRun();
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    curtain() {
        let self = this;
        let eW = self.child.getWidth() * 0.5;
        let eH = self.child.getHeight() * 0.5;
        if (self.trans.dimension) {
            eH = 0;
        } else {
            eW = 0;
        }
        self.width = 0;
        self.height = 0;
        let g = new LGraphics();
        self.child.mask = g;
        if (self.trans.direction === LTransition.OUT) {
            self.width = eW;
            self.height = eH;
            eW = 0;
            eH = 0;
        }
        LTweenLite.to(self, self.trans.duration, {
            width: eW,
            height: eH,
            onComplete: self.curtainComplete,
            onUpdate: self.curtainUpdate,
            ease: self.trans.easing
        });
    }
    squeezeComplete(self) {
        self.child.scaleX = self.scaleX;
        self.child.scaleY = self.scaleY;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    squeezeUpdate(self) {
        self.child.scaleX = self.scaleX;
        self.child.scaleY = self.scaleY;
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    squeeze() {
        let self = this;
        let toScaleX = 1, toScaleY = 1;
        self.scaleX = 0, self.scaleY = 0;
        if (self.trans.dimension) {
            self.scaleX = 1;
        } else {
            self.scaleY = 1;
        }
        if (self.trans.direction === LTransition.OUT) {
            toScaleX = self.scaleX, toScaleY = self.scaleY;
            self.scaleX = 1, self.scaleY = 1;
        }
        self.child.scaleX = self.scaleX;
        self.child.scaleY = self.scaleY;
        LTweenLite.to(self, self.trans.duration, {
            scaleX: toScaleX,
            scaleY: toScaleY,
            onComplete: self.squeezeComplete,
            onUpdate: self.squeezeUpdate,
            ease: self.trans.easing
        });
    }
    zoomComplete(self) {
        self.child.scaleX = self.scaleX;
        self.child.scaleY = self.scaleY;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    zoomUpdate(self) {
        self.child.scaleX = self.scaleX;
        self.child.scaleY = self.scaleY;
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    zoom() {
        let self = this;
        let toScaleX = 1, toScaleY = 1;
        self.scaleX = 0, self.scaleY = 0;
        if (self.trans.direction === LTransition.OUT) {
            toScaleX = 0, toScaleY = 0;
            self.scaleX = 1, self.scaleY = 1;
        }
        self.child.scaleX = self.scaleX;
        self.child.scaleY = self.scaleY;
        LTweenLite.to(self, self.trans.duration, {
            scaleX: toScaleX,
            scaleY: toScaleY,
            onComplete: self.zoomComplete,
            onUpdate: self.zoomUpdate,
            ease: self.trans.easing
        });
    }
    wipeComplete(self) {
        if (self.trans.direction === LTransition.OUT) {
            self.child.mask.clear();
        } else {
            self.wipeUpdateRun();
        }
        self.child.mask = null;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    wipeUpdateRun() {
        let self = this, g = self.child.mask;
        g.clear();
        g.drawVertices(0, '#000000', [[self.leftTopX, self.leftTopY], [self.leftBottomX, self.leftBottomY], [self.rightBottomX, self.rightBottomY], [self.rightTopX, self.rightTopY]]);
    }
    wipeUpdate(self) {
        self.wipeUpdateRun();
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    wipe() {
        let self = this, w = self.child.getWidth(), h = self.child.getHeight(), ltX = self.leftTopX = 0, ltY = self.leftTopY = 0, lbX = self.leftBottomX = 0, lbY = self.leftBottomY = h, rtX = self.rightTopX = w, rtY = self.rightTopY = 0, rbX = self.rightBottomX = w, rbY = self.rightBottomY = h;
        switch (self.trans.startPoint) {
        case 1:
            ltX = self.leftTopX = -w;
            lbX = self.leftBottomX = -w * 2;
            self.rightTopX = 0;
            rtX = w * 2;
            self.rightBottomX = -w;
            rbX = w;
            break;
        case 2:
            ltY = self.leftTopY = -h;
            self.leftBottomY = 0;
            lbY = h;
            rtY = self.rightTopY = -h;
            self.rightBottomY = 0;
            rbY = h;
            break;
        case 3:
            self.leftTopX = w;
            ltX = -w;
            self.leftBottomX = w * 2;
            lbX = 0;
            rtX = self.rightTopX = w * 2;
            rbX = self.rightBottomX = w * 3;
            break;
        case 4:
            self.rightTopX = 0;
            rtX = w;
            self.rightBottomX = 0;
            rbX = w;
            break;
        case 6:
            self.leftTopX = w;
            ltX = 0;
            self.leftBottomX = w;
            lbX = 0;
            break;
        case 7:
            lbX = self.leftBottomX = -w;
            ltX = self.leftTopX = -w * 2;
            self.rightBottomX = 0;
            rbX = w * 2;
            self.rightTopX = -w;
            rtX = w;
            break;
        case 8:
            lbY = self.leftBottomY = h;
            self.leftTopY = h;
            ltY = 0;
            rbY = self.rightBottomY = h;
            self.rightTopY = h;
            rtY = 0;
            break;
        case 9:
            self.leftBottomX = w;
            lbX = -w;
            self.leftTopX = w * 2;
            ltX = 0;
            rbX = self.rightBottomX = w * 2;
            rtX = self.rightTopX = w * 3;
            break;
        case 5:
        default:
            self.leftTopX = w * 0.5;
            self.leftTopY = h * 0.5;
            self.rightTopX = w * 0.5;
            self.rightTopY = h * 0.5;
            self.leftBottomX = w * 0.5;
            self.leftBottomY = h * 0.5;
            self.rightBottomX = w * 0.5;
            self.rightBottomY = h * 0.5;
            ltX = 0, ltY = 0;
            lbX = 0, lbY = h;
            rtX = w, rtY = 0;
            rbX = w, rbY = h;
        }

        let g = new LGraphics();
        self.child.mask = g;
        if (self.trans.direction === LTransition.OUT) {
            let oltX = ltX, oltY = ltY, olbX = lbX, olbY = lbY, ortX = rtX, ortY = rtY, orbX = rbX, orbY = rbY;
            ltX = self.leftTopX, ltY = self.leftTopY, lbX = self.leftBottomX, lbY = self.leftBottomY, rtX = self.rightTopX, rtY = self.rightTopY, rbX = self.rightBottomX, rbY = self.rightBottomY;
            self.leftTopX = oltX, self.leftTopY = oltY, self.leftBottomX = olbX, self.leftBottomY = olbY, self.rightTopX = ortX, self.rightTopY = ortY, self.rightBottomX = orbX, self.rightBottomY = orbY;
        }
        LTweenLite.to(self, self.trans.duration, {
            leftTopX: ltX,
            leftTopY: ltY,
            leftBottomX: lbX,
            leftBottomY: lbY,
            rightTopX: rtX,
            rightTopY: rtY,
            rightBottomX: rbX,
            rightBottomY: rbY,
            onComplete: self.wipeComplete,
            onUpdate: self.wipeUpdate,
            ease: self.trans.easing
        });
    }
    pixelDissolveComplete(self) {
        if (self.trans.direction === LTransition.OUT) {
            self.child.mask.clear();
        } else {
            self.pixelDissolveUpdateRun();
        }
        self.child.mask = null;
        if (self.trans.onComplete) {
            self.trans.onComplete(self.child);
        }
    }
    pixelDissolveUpdateRun() {
        let self = this, g = self.child.mask, c = LGlobal.canvas, list;
        g.clear();
        g.add(function() {
            c.beginPath();
            c.save();
            for (let i = 0; i < self.index; i++) {
                list = self.list[i];
                c.rect(list[0] * self.w, list[1] * self.h, self.w, self.h);
            }
            c.restore();
        });
    }
    pixelDissolveUpdate(self) {
        self.pixelDissolveUpdateRun();
        if (self.trans.onUpdate) {
            self.trans.onUpdate(self.child);
        }
    }
    pixelDissolve() {
        let self = this;
        let g = new LGraphics();
        self.child.mask = g;
        LGlobal.mg = g;
        self.w = self.child.getWidth() / self.trans.xSections, self.h = self.child.getHeight() / self.trans.ySections;
        self.list = [];
        for (let i = 0; i < self.trans.xSections; i++) {
            for (let j = 0; j < self.trans.ySections; j++) {
                self.list.push([i, j]);
            }
        }
        self.index = 0;
        let to = self.trans.xSections * self.trans.ySections;
        if (self.trans.direction === LTransition.OUT) {
            self.index = to;
            to = 0;
        }
        self.list = self.list.sort(function(a, b) {
            return Math.random() > 0.5;
        });
        self.pixelDissolveUpdateRun();
        LTweenLite.to(self, self.trans.duration, {
            index: to,
            onComplete: self.pixelDissolveComplete,
            onUpdate: self.pixelDissolveUpdate,
            ease: self.trans.easing
        });
    }
}
LTransition.IN = 'in';
LTransition.OUT = 'out';
LTransition.Blinds = 1;
LTransition.Fade = 2;
LTransition.Fly = 3;
LTransition.Iris = 4;
LTransition.Curtain = 5;
LTransition.PixelDissolve = 6;
LTransition.Squeeze = 7;
LTransition.Wipe = 8;
LTransition.Zoom = 9;
const LIris = { SQUARE: 0, CIRCLE: 1 };
class LTransitionManager {
    constructor(displayObject) {
        this.child = displayObject;
    }
    startTransition(transParams) {
        return LTransitionManager.start(this.child, transParams);
    }
}
LTransitionManager.start = function(displayObject, transParams) {
    let trans = new LTransition(displayObject, transParams);
    trans.startTransition();
    return trans;
};
export default {
    LTransition: LTransition,
    LIris: LIris,
    LTransitionManager: LTransitionManager
};