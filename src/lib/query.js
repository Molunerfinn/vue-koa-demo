// https://www.cnblogs.com/mycognos/p/9131180.html
// about width, offsetWidth, clientWidth
// 查询dom对象，样式表属性
export default function query(element) {
    function getElements() {
        if (element instanceof HTMLElement) {
            return [element];
        } else if (typeof element === 'string') {
            return document.querySelectorAll(element)
        }

        return [];
    }

    return {
        ele(){
          let elems = getElements();
          return elems[0];
        },
        get(styles) {
            if (!Array.isArray(styles)) {
                throw new Error('Second parameter of this function should be an array');
            }

            let elems = getElements();

            if (elems.length === 0) {
                return false;
            }

            let elem = elems[0];

            let obj = {};

            if (elem instanceof HTMLElement && styles) {
                styles.map((style) => {
                  // support offsetWidth, clientWidth
                  if(elem[style] != null){
                    obj[style] = elem[style]
                  }else{
                    obj[style] = window.getComputedStyle(elem, null).getPropertyValue(style)
                  }

                });
                return obj;
            }
        },

        set(styles) {
            if (typeof styles !== 'object') {
                throw new Error('Second parameter of this function should be an object');
            }

            let elems = getElements();

            if (elems.length === 0) {
                return false;
            }

            elems.forEach(function(elem) {
                for (let i in styles) {
                    if (styles.hasOwnProperty(i)) {
                        elem.style[i] = styles[i];
                    }
                }
            });
        }
    }
}
