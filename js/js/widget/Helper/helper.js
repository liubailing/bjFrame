define(function() {
    var helper = function() {}
    helper.type = function(obj) { //取得目标的类型
        if (obj == null) {
            return String(obj)
        } else {
            var class2type = {};
            "Boolean Number String Function Array Date RegExp Object Error".replace(/[^, ]+/g, function(name) {
                class2type["[object " + name + "]"] = name.toLowerCase()
            });
            return typeof obj === "object" || typeof obj === "function" ? class2type[Object.prototype.toString.call(obj)] || "object" : typeof obj;
        }
    }

    var rnative = /\[native code\]/; //判定是否原生函数
    var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;
    var oproto = Object.prototype.toString;
    var serialize = oproto.toString;
    var isFunction = typeof alert === "object" ? function(fn) {
        try {
            return /^\s*\bfunction\b/.test(fn + "")
        } catch (e) {
            return false
        }
    } : function(fn) {
        return Object.prototype.toString.call(fn) === "[object Function]"
    }
    helper.isFunction = isFunction

    helper.isWindow = function(obj) {
        if (!obj)
            return false
                // 利用IE678 window == document为true,document == window竟然为false的神奇特性
                // 标准浏览器及IE9，IE10等使用 正则检测
        return obj == obj.document && obj.document != obj //jshint ignore:line
    }

    function isWindow(obj) {
        return rwindow.test(Object.prototype.toString.call(obj))
    }
    if (isWindow(window)) {
        helper.isWindow = isWindow
    }
    //与jQuery.extend方法，可用于浅拷贝，深拷贝
    helper.mix = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false

        // 如果第一个参数为布尔,判定是否深拷贝
        if (typeof target === "boolean") {
            deep = target
            target = arguments[1] || {}
            i++
        }

        //确保接受方为一个复杂的数据类型
        if (typeof target !== "object" && !isFunction(target)) {
            target = {}
        }

        //如果只有一个参数，那么新成员添加于mix所在的对象上
        if (i === length) {
            target = this
            i--
        }

        for (; i < length; i++) {
            //只处理非空参数
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]
                    try {
                        copy = options[name] //当options为VBS对象时报错
                    } catch (e) {
                        continue
                    }

                    // 防止环引用
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && Array.isArray(src) ? src : []

                        } else {
                            clone = src && avalon.isPlainObject(src) ? src : {}
                        }

                        target[name] = avalon.mix(deep, clone, copy)
                    } else if (copy !== void 0) {
                        target[name] = copy
                    }
                }
            }
        }
        return target
    }
    return helper;
})
