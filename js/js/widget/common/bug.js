define(function() {
    /*********************************************************************
     *                         javascript 底层补丁                       *
     **********************************************************************/
    if (!"司徒正美".trim) {
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
        String.prototype.trim = function() {
            return this.replace(rtrim, "")
        }
    }
    var hasDontEnumBug = !({
            'toString': null
        }).propertyIsEnumerable('toString'),
        hasProtoEnumBug = (function() {}).propertyIsEnumerable('prototype'),
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;
    if (!Object.keys) {
        Object.keys = function(object) { //ecma262v5 15.2.3.14
            var theKeys = [];
            var skipProto = hasProtoEnumBug && typeof object === "function"
            if (typeof object === "string" || (object && object.callee)) {
                for (var i = 0; i < object.length; ++i) {
                    theKeys.push(String(i))
                }
            } else {
                for (var name in object) {
                    if (!(skipProto && name === "prototype") && ohasOwn.call(object, name)) {
                        theKeys.push(String(name))
                    }
                }
            }

            if (hasDontEnumBug) {
                var ctor = object.constructor,
                    skipConstructor = ctor && ctor.prototype === object;
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j]
                    if (!(skipConstructor && dontEnum === "constructor") && ohasOwn.call(object, dontEnum)) {
                        theKeys.push(dontEnum)
                    }
                }
            }
            return theKeys
        }
    }
    if (!Array.isArray) {
        Array.isArray = function(a) {
            return serialize.call(a) === "[object Array]"
        }
    }
})
