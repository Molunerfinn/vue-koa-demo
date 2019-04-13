import _ from 'lodash'
import Callbacks from './hdutil/callbacks'
const HdUtil = {}

HdUtil.encodeHtml = function(e) {
    return e && e.replace ? e.replace(/&/g, "&amp;").replace(/ /g, "&nbsp;").replace(/\b&nbsp;+/g, " ").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\\/g, "&#92;").replace(/\'/g, "&#39;").replace(/\"/g, "&quot;").replace(/\n/g, "<br/>").replace(/\r/g, "") : e
}
HdUtil.CallBack = function() {
  //
  function CallBackable(target) {
      //如果当前对象没有
      //console.log( "new CallBackable = ", this)
      if (! (this instanceof CallBackable)) return new CallBackable(target);
      this.callbacks = {}
      // 保存所有事件名称，ex. { 注册事件名称：1 }
      this._ones = {}
      this.free = target
  }
  var CallBackableMethods= {
      register: function(e, t) {
          var n = this;
          return _.isArray(e) ? (e.forEach(
          function(t, i) {
              _.isArray(t) ? n.register.apply(n, t) : n.register(t)
          }), n) : ("string" == typeof e && void 0 === this.callbacks[e] && (this.callbacks[e] = null, t && (this._ones[e] = 1)), n)
      },
      on: function(e, t) {
          var n;
          if (this.checkFire(e)) return t();
          if (!this.callbacks.hasOwnProperty(e)) {
              if (!this.free) return this;
              "function" == _.type(this.free) && this.free(e) && (this._ones[e] = 1)
          }
          console.log( "new CallBackable = ", this)

          return (n = this.callbacks[e]) || (this.callbacks[e] = n = new Callbacks("unique stopOnFalse" + (this._ones[e] ? " onec": ""))),
          n.add(t),
          this
      },
      // 事件只调用一次
      one: function(e, t) {
          var n = this;
          return t.$$oneCallback = function() {
              t.apply(this, arguments),
              n.off(e, t)
          },
          n.on(e, t.$$oneCallback)
      },
      off: function(e, t) {
          var n, r = this;
          return 0 == arguments.length ? (this.callbacks.forEach(
          function(n, e) {
              r.off(n, t)
          }), r) : (n = this.callbacks[e]) ? (1 == arguments.length ? n.empty() : "function" == typeof t && (t.$$oneCallback ? (n.remove(t.$$oneCallback), delete t.$$oneCallback) : n.remove(t)), r) : r
      },
      checkFire: function(e) {
          return 2 == this._ones[e]
      },
      getApiKeys: function() {
          return Object.keys(CallBackableMethods)
      }
  };

  ["fire", "fireWith"].forEach(  function(n, i) {
      CallBackableMethods[n] = function() {
          var e = Array.from( arguments),
          t = e.shift(),
          r = this.callbacks[t];
          //console.log( "CallBackableMethods r, n = ",r, n, "this =", this )
          return this._ones[t] && (this._ones[t] = 2),
          !r || r[n].apply(r, e)
      }
  })
  _.extend(CallBackable.prototype, CallBackableMethods)

  return CallBackable

}()


export default HdUtil
