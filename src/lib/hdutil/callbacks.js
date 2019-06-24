// Simulate jQuery.Callbacks object
// https://www.imooc.com/article/253889
function Callbacks(options) {
  var ops = {
    once: false,
    memory: false,
    unique: false,
    stopOnFalse: false
  };

  if (typeof options === 'string' && options.trim() !== '') {
    var opsArray = options.split(/\s+/);
    for (var i = 0; i < options.length; i++) {
      if (opsArray[i] === 'once')
        ops.once = true;
      else if (opsArray[i] === 'memory')
        ops.memory = true;
      else if (opsArray[i] === 'unique')
        ops.unique = true;
      else if (opsArray[i] === 'stopOnFalse')
        ops.stopOnFalse = true;
    }
  }

  var ar = [];
  var lastArgs = null;
  var firedTimes = 0;

  function hasName(name) {
    var h = false;

    if (typeof name === 'string' &&
      name !== null &&
      name.trim() !== '' &&
      ar.length > 0) {
      for (var i = 0; i < ar.length; i++) {
        if (ar[i].name === name) {
          h = true;
          break;
        }
      }
    }

    return h;
  }

  // add a function
  this.add = function(fn) {
    if (typeof fn === 'function') {
      if (ops.unique) {
        // check whether it had been added before
        if (fn.name !== '' && hasName(fn.name)) {
          return this;
        }
      }

      ar.push(fn);

      if (ops.memory) {
        // after added , call it immediately
        fn.call(this, lastArgs);
      }
    }

    return this;
  };

  // remove a function
  this.remove = function(fn) {
    if (typeof(fn) === 'function' &&
      fn.name !== '' &&
      ar.length > 0) {
      for (var i = 0; i < ar.length; i++) {
        if (ar[i].name === fn.name) {
          ar.splice(i, 1);
        }
      }
    }

    return this;
  };

  // remove all functions
  this.empty = function() {
    ar.length = 0;
    return this;
  };

  // check whether it includes a specific function
  this.has = function(fn) {
    var f = false;

    if (typeof(fn) === 'function' &&
      fn.name !== '' &&
      ar.length > 0) {
      for (var i = 0; i < ar.length; i++) {
        if (ar[i].name === fn.name) {
          f = true;
          break;
        }
      }
    }

    return f;
  };

  // invoke funtions it includes one by one
  this.fire = function(args) {
    if (ops.once && firedTimes > 0) {
      return this;
    }

    if (ar.length > 0) {
      var r;

      for (var i = 0; i < ar.length; i++) {
        r = ar[i].call(this, args);

        if (ops.stopOnFalse && r === false) {
          break;
        }
      }
    }

    firedTimes++;

    if (ops.memory) {
      lastArgs = args;
    }

    return this;
  };

  this.fireWith = function( context, args){
    console.log( "callbacks fireWith-> this", this, "context=", context )
    return this.fire( args )
  }
}
export default Callbacks
