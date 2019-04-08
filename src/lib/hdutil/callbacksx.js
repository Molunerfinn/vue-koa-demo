
    var optionsCache = {};
    function createOptions(options) {
        var object = optionsCache[options] = {};
        options.match(/\S+/g).forEach(function (item, index) {
            object[item] = true;
        })
        return object
    }

    var callbacks = function (options) {
        options = typeof options === 'string' ?
            (optionsCache[options] || createOptions(options)) : Object.assign({}, options);
        var memory, fired, firing, firingStart, firingLength, firingIndex, list = [],
            stack = !options.once && [];

        var fire = function (data) {
            memory = options.memory && data;
            fired = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            firing = true;

            for (; list && firingIndex < firingLength; firingIndex++) {
                if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                    memory = false;
                    break;
                }
            }

            firing = false;
            if (list) {
                if (stack) {
                    if (stack.length) {
                        fire(stack.shift())
                    }
                } else if (memory) {
                    console.log(memory)
                    list = []
                } else {
                    self.disable()
                }
            }
        }

        var inArray = function (elem, arr, i) {
            var len;
            if (arr) {
                if (arr.indexOf) {
                    return arr.indexOf(elem, i)
                }

                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
                for (; i < len; i++) {
                    if (i in arr && arr[i] === elem) {
                        return i
                    }
                }
            }

            return -1;
        }

        var self = {
            add: function () {
                if (list) {
                    var start = list.length;
                    (function add(args) {
                        [].forEach.call(args, function (arg, i) {
                            var type = typeof arg;
                            if (type === 'function') {
                                if (!options.unique || !self.has(arg)) {
                                    list.push(arg);
                                }
                            } else if (arg && arg.length && type !== 'string') {
                                add(arg)
                            }
                        })
                    })(arguments)

                    if (firing) {
                        firingLength = list.length;
                    } else if (memory) {
                        firingStart = start;
                        fire(memory)
                    }
                }
                return this
            },

            fire: function () {
                self.fireWith(this, arguments);
                return this
            },

            fireWith: function (context, args) {
                if (list && (!fired || stack)) {
                    args = args || [];
                    args = [context, args.slice ? args.slice() : args];
                    if (firing) {
                        stack.push(args)
                    } else {
                        fire(args)
                    }
                }
                return this
            },

            disable: function () {
                list = stack = memory = undefined;
                return this;
            },

            has: function (fn) {
                return fn ? inArray(fn, list) > -1 : !!(list && list.length)
            },

            remove: function () {
                if (list) {
                    [].forEach.call(arguments, function (arg, i) {
                        var index;
                        while ((index = inArray(arg, list, index)) > -1) {
                            list.splice(index, 1);
                            if (firing) {
                                if (index <= firingLength) {
                                    firingLength--;
                                }
                                if (index <= firingIndex) {
                                    firingIndex--
                                }
                            }
                        }
                    })
                }
                return this
            },

            empty: function () {
                list = [];
                firingLength = 0;
                return this;
            }
        }
        return self
    }

export default callbacks
