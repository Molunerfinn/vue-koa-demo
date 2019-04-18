export  function checkWebp() {
    try {
        return (document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") == 0)
    } catch(err) {
        return false
    }
};



// HdGame.getWebpOrOtherImg = function(src) {
//     if (!HdGame.isSupportWebp) {
//         return src
//     }
//     if ($.isArray(src) || $.isPlainObject(src)) {
//         $.forEach(src,
//         function(v, k) {
//             src[k] = HdGame.getWebpOrOtherImg(v)
//         });
//         return src
//     }
//     if (!src || $.type(src) != "string" || src.indexOf(".h40.") === -1) {
//         return src
//     }
//     return src.replace(jionWebpRegx, ".$1.webp$2")
// };

// HdGame.parseWebpSrc = function(webpEls, callback) {
//     webpEls.each(function(index, el) {
//         var el = $(this);
//         var src = el.attr("webp_src");
//         var key = el.attr("webp_key") || "src";
//         var webpSrc = HdGame.getWebpOrOtherImg(src);
//         if (key == "background") {
//             el.css("background-image", "url(" + webpSrc + ")")
//         } else {
//             el.attr(key, webpSrc)
//         }
//         el.removeAttr("webp_src webp_key");
//         callback && callback(webpSrc, src, key)
//     })
// };
