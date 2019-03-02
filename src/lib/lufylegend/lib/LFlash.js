
let LFlash = (function() {
    function LFlash() {}
    LFlash.SpriteSheetConvert = function(frames) {
        let result = [], child;
        for (let i = 0;i < frames.length;i++) {
            child = frames[i];
            result.push({ x: child.frame.x, sx: child.spriteSourceSize.x, y: child.frame.y, sy: child.spriteSourceSize.y, width: child.frame.w, height: child.frame.h });
        }
        return result;
    };
    return LFlash;
})();
export default LFlash;