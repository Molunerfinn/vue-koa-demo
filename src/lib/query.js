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
    ele() {
      let elems = getElements();
      return elems[0];
    },
    attr(attributes) {
      let elems = getElements();

      if (elems.length === 0) {
        return false;
      }

      elems.forEach(function(elem) {
        for (let i in attributes) {
          elem[i] = attributes[i];
        }
      })
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
          if (elem[style] != null) {
            obj[style] = elem[style]
          } else {
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
      })
    },

    hasClass(newClassName) {
      let ele = this.ele()

      return ele.className.match(new RegExp('(\\s|^)' + newClassName + '(\\s|$)'));
    },

    addClass(newClassName) {
      let ele = this.ele()
      if (!this.hasClass(newClassName)) ele.className += " " + newClassName;
    },

    removeClass(newClassName) {
      let ele = this.ele()
      if (this.hasClass(newClassName)) {
        var reg = new RegExp('(\\s|^)' + newClassName + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
      }
    },

    toggleClass(className) {
      if (this.hasClass(className)) {
        this.removeClass(className);
      } else {
        this.addClass(className);
      }
    },

    data(key, value) {
      let ele = this.ele(),
        dataName = 'dataset', // 存储至DOM上的对象标记, 这里只是测试用名
        data = {};
      // 未指定参数,返回全部
      if (typeof key === 'undefined' && typeof value === 'undefined') {
        return ele[dataName];
      }
      // setter
      if (typeof(value) !== 'undefined') {
        // 存储值类型为字符或数字时, 使用attr执行
        var _type = typeof(value);
        if (_type === 'string' || _type === 'number') {
          ele.setAttribute(key, value);
        }
        data = ele[dataName] || {};
        data[key] = value;
        ele[dataName] = data;
        return this;
      }
      // getter
      else {
        data = ele[dataName] || {};
        return data[key] || ele.getAttribute(key);
      }
    }
  }
}
