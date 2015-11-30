define(function(require) {

    if (!window.avalon) {
        console.error("此验证框架依赖于avalon框架。请先引入 avalon 框架");
        return false;
    }

    var avalon = window.avalon;
    if(sysConfig.jsTracking) avalon.log('seajs-Tracking："validation---验证插件"');    
    var Promise = require("promise");

    if (!avalon.duplexHooks) {
        throw new Error("你的版本少于avalon1.3.7，不支持ms-duplex2.0，请使用avalon.validation.old.js")
    }
    //==========================avalon.validation的专有逻辑========================
    function idCard(val) {
        if ((/^\d{15}$/).test(val)) {
            return true;
        } else if ((/^\d{17}[0-9xX]$/).test(val)) {
            var vs = "1,0,x,9,8,7,6,5,4,3,2".split(","),
                ps = "7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2".split(","),
                ss = val.t
                oLowerCase().split(""),
                r = 0;
            for (var i = 0; i < 17; i++) {
                r += ps[i] * ss[i];
            }
            return (vs[r % 11] == ss[17]);
        }
    }

    function adminPWD(val) {
        if ((/^\d{15}$/).test(val)) {
            return true;
        } else if ((/^\d{17}[0-9xX]$/).test(val)) {
            var vs = "1,0,x,9,8,7,6,5,4,3,2".split(","),
                ps = "7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2".split(","),
                ss = val.t
                oLowerCase().split(""),
                r = 0;
            for (var i = 0; i < 17; i++) {
                r += ps[i] * ss[i];
            }
            return (vs[r % 11] == ss[17]);
        }
    }

    function isCorrectDate(value) {
        if (rdate.test(value)) {
            var date = parseInt(RegExp.$1, 10);
            var month = parseInt(RegExp.$2, 10);
            var year = parseInt(RegExp.$3, 10);
            var xdata = new Date(year, month - 1, date, 12, 0, 0, 0);
            if ((xdata.getUTCFullYear() === year) && (xdata.getUTCMonth() === month - 1) && (xdata.getUTCDate() === date)) {
                return true
            }
        }
        return false
    }
    var rdate = /^\d{4}\-\d{1,2}\-\d{1,2}$/
        //  var remail = /^[a-zA-Z0-9.!#$%&amp;'*+\-\/=?\^_`{|}~\-]+@[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*$/
    var remail = /^([A-Z0-9]+[_|\_|\.]?)*[A-Z0-9]+@([A-Z0-9]+[_|\_|\.]?)*[A-Z0-9]+\.[A-Z]{2,3}$/i
    var ripv4 = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i
    var ripv6 = /^((([0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}:[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){5}:([0-9A-Fa-f]{1,4}:)?[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){4}:([0-9A-Fa-f]{1,4}:){0,2}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){3}:([0-9A-Fa-f]{1,4}:){0,3}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){2}:([0-9A-Fa-f]{1,4}:){0,4}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){6}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(([0-9A-Fa-f]{1,4}:){0,5}:((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|(::([0-9A-Fa-f]{1,4}:){0,5}((\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b)\.){3}(\b((25[0-5])|(1\d{2})|(2[0-4]\d)|(\d{1,2}))\b))|([0-9A-Fa-f]{1,4}::([0-9A-Fa-f]{1,4}:){0,5}[0-9A-Fa-f]{1,4})|(::([0-9A-Fa-f]{1,4}:){0,6}[0-9A-Fa-f]{1,4})|(([0-9A-Fa-f]{1,4}:){1,7}:))$/i
        //规则取自淘宝注册登录模块
    var phoneOne = {            
            cm: /^(?:0?1)((?:3[56789]|5[0124789]|8[278])\d|34[0-8]|47\d)\d{7}$/,//中国移动          
            cu: /^(?:0?1)(?:3[012]|4[5]|5[356]|8[356]\d|349)\d{7}$/,  //中国联通           
            ce: /^(?:0?1)(?:33|53|8[079])\d{8}$/, //中国电信           
            cn: /^(?:0?1)[3458]\d{9}$/ //中国大陆
        }     

    // var pwdRegex0 = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W)(.*){8,20}$", "g");//必须包括大、小写字母、数字和符号。可以包含字母
    // var pwdRegex1 = new RegExp("^(?=.{8,})(?=.*([A-Z\\W]))(?=.*[a-z])(?=.*[0-9])(.*){8,20}$", "g"); //必须包括大、小写字母、数字。可以包含字母
    // var pwdRegex2 = new RegExp("^(?=.{8,})(?=.*([A-Z\\W]))(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,20}$", "g");//必须包括大、小写字母、数字。不可以包含字母
    // var pwdRegex3 = new RegExp("^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9])))[A-Za-z0-9]{8,20}$", "g");

    avalon.mix(avalon.duplexHooks, {
            trim: {
                get: function(value, data) {
                    if (data.element.type !== "password") {
                        value = String(value || "").trim()
                    }
                    return value
                }
            },
            input: {
                message: '只能输入汉字、英文、数字及符号(-,_,%,@)',
                get: function(value, data, next) {
                    next(/^\-?[a-zA-Z0-9\u4E00-\u9FA5]*$/.test(value))
                    return value
                }
            },
            input1s: {
                message: '只能输入汉字、英文和数字',
                get: function(value, data, next) {
                    next(/^\-?[a-zA-Z0-9\u4E00-\u9FA5\-\_\@\%]*$/.test(value))
                    return value
                }
            },
            input2s: {
                message: '只能输入汉字、英文、数字及符号(-,_,%,@,./:)',
                get: function(value, data, next) {
                    next(/^\-?[a-zA-Z0-9\u4E00-\u9FA5\-\_\@\%\.\/\:]*$/.test(value))
                    return value
                }
            },
            pwd1s: {
                message: '密码必须为8-18位，必须含有大小写字母和数字三种类型中的2种',
                get: function(value, data, next) {
                    next(/^(?=.{8,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9])))[A-Za-z0-9]{8,20}$/.test(value))
                    return value
                }
            },
             pwd2s: {
                message: '密码必须为8-18位，必须含有大小写字母和数字三种类型，不可以含有特殊字符',
                get: function(value, data, next) {
                    next(/(?=.{8,})(?=.*([A-Z\\W]))(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{8,20}$/.test(value))
                    return value
                }
            },
            pwd3s: {
                message: '密码必须为8-18位，必须含有大小写字母和数字三种类型，可以含有特殊字符',
                get: function(value, data, next) {
                    next(/^(?=.{8,})(?=.*([A-Z\\W]))(?=.*[a-z])(?=.*[0-9])(.*){8,20}$/.test(value))
                    return value
                }
            },
            pwd4s: {
                message: '密码必须为8-18位，必须含有大小写字母和数字三种类型同时必须含有特殊字符',
                get: function(value, data, next) {
                    next(/^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W)(.*){8,20}$/.test(value))
                    return value
                }
            },
            username: {
                message: '用户名必须为3-20个字符，不能含有特殊字符',
                get: function(value, data, next) {
                    next(/^[A-Za-z0-9]{3,20}$/.test(value))
                    return value
                }
            },
            required: {
                message: '必须填写',
                get: function(value, data, next) {
                    next(value !== "")
                    return value
                }
            },
            norequired: {
                message: '可以不写',
                get: function(value, data, next) {
                    next(true)
                    return value
                }
            },
            "int": {
                message: "必须是整数",
                get: function(value, data, next) {
                    next(/^\-?\d+$/.test(value))
                    return value
                }
            },
            phone: {
                message: "手机号码不合法",
                get: function(value, data, next) {
                    var ok = false
                    for (var i in phoneOne) {
                        if (phoneOne[i].test(value)) {
                            ok = true;
                            break
                        }
                    }
                    next(ok)
                    return value
                }
            },
            decimal: {
                message: '必须是小数',
                get: function(value, data, next) {
                    next(/^\-?\d*\.?\d+$/.test(value))
                    return value
                }
            },
            alpha: {
                message: '必须是字母',
                get: function(value, data, next) {
                    next(/^[a-z]+$/i.test(value))
                    return value
                }
            },
            alpha_numeric: {
                message: '必须为字母或数字',
                get: function(value, data, next) {
                    next(/^[a-z0-9]+$/i.test(value))
                    return value
                }
            },
            alpha_dash: {
                message: '必须为字母或数字及下划线等特殊字符',
                validate: function(value, data, next) {
                    next(/^[a-z0-9_\-]+$/i.test(value))
                    return value
                }
            },
            chs: {
                message: '必须是中文字符',
                get: function(value, data, next) {
                    next(/^[\u4e00-\u9fa5]+$/.test(value))
                    return value
                }
            },
            chs_numeric: {
                message: '必须是中文字符或数字及下划线等特殊字符',
                get: function(value, data, next) {
                    next(/^[\\u4E00-\\u9FFF0-9_\-]+$/i.test(value))
                    return value
                }
            },
            qq: {
                message: "腾讯QQ号从10000开始",
                get: function(value, data, next) {
                    next(/^[1-9]\d{4,10}$/.test(value))
                    return value
                }
            },
            id: {
                message: "身份证格式错误",
                get: function(value, data, next) {
                    next(idCard(value))
                    return value
                }
            },
            ipv4: {
                message: "ip地址不正确",
                get: function(value, data, next) {
                    next(ripv4.test(value))
                    return value
                }
            },
            ipv6: {
                message: "ip地址不正确",
                get: function(value, data, next) {
                    next(ripv6.test(value))
                    return value
                }
            },
            email: {
                message: "邮件地址错误",
                get: function(value, data, next) {
                    next(remail.test(value))
                    return value
                }
            },
            url: {
                message: "URL格式错误",
                get: function(value, data, next) {
                    next(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/.test(value))
                    return value
                }
            },
            repeat: {
                message: "密码输入不一致",
                get: function(value, data, next) {
                    var id = data.element.getAttribute("data-duplex-repeat") || ""
                    var other = avalon(document.getElementById(id)).val() || ""
                    next(value === other)
                    return value
                }
            },
            date: {
                message: '必须符合日期格式 YYYY-MM-DD',
                get: function(value, data, next) {
                    next(isCorrectDate(value))
                    return value
                }
            },
            passport: {
                message: '护照格式错误或过长',
                get: function(value, data, next) {
                    next(/^[a-zA-Z0-9]{4,20}$/i.test(value))
                    return value
                }
            },
            minlength: {
                message: '最少输入{{min}}个字',
                get: function(value, data, next) {
                    var elem = data.element
                    var a = parseInt(elem.getAttribute("minlength"), 10)
                    if (!isFinite(a)) {
                        a = parseInt(elem.getAttribute("data-duplex-minlength"), 10)
                    }
                    var num = data.data.min = a
                    next(value.length >= num)
                    return value
                }
            },
            maxlength: {
                message: '最多输入{{max}}个字',
                get: function(value, data, next) {
                    var elem = data.element
                    var a = parseInt(elem.getAttribute("maxlength"), 10)
                    if (!isFinite(a)) {
                        a = parseInt(elem.getAttribute("data-duplex-maxlength"), 10)
                    }
                    var num = data.data.max = a
                    next(value.length <= num)
                    return value
                }
            },
            gt: {
                message: '必须大于{{max}}',
                get: function(value, data, next) {
                    var elem = data.element
                    var a = parseInt(elem.getAttribute("max"), 10)
                    if (!isFinite(a)) {
                        a = parseInt(elem.getAttribute("data-duplex-gt"), 10)
                    }
                    var num = data.data.max = a
                    next(parseFloat(value) > num)
                    return value
                }
            },
            lt: {
                message: '必须小于{{min}}',
                get: function(value, data, next) {
                    var elem = data.element
                    var a = parseInt(elem.getAttribute("min"), 10)
                    if (!isFinite(a)) {
                        a = parseInt(elem.getAttribute("data-duplex-lt"), 10)
                    }
                    var num = data.data.min = a
                    next(parseFloat(value) < num)
                    return value
                }
            },
            //contain
            eq: {
                message: '必须等于{{eq}}',
                get: function(value, data, next) {
                    var elem = data.element
                    var a = parseInt(elem.getAttribute("data-duplex-eq"), 10)
                    var num = data.data.eq = a
                    next(parseFloat(value) == num)
                    return value
                }
            },
            contains: {
                message: "必须包含{{array}}中的一个",
                get: function(val, data, next) {
                    var vmValue = [].concat(val).map(String)
                    var domValue = (data.element.getAttribute("data-duplex-contains") || "").split(",")
                    data.data.array = domValue
                    var has = false
                    for (var i = 0, n = vmValue.length; i < n; i++) {
                        var v = vmValue[i]
                        if (domValue.indexOf(v) >= 0) {
                            has = true
                            break
                        }
                    }
                    next(has)
                    return val
                }
            },
            contain: {
                message: "必须包含{{array}}",
                get: function(val, data, next) {
                    var vmValue = [].concat(val).map(String)
                    var domValue = (data.element.getAttribute("data-duplex-contain") || "").split(",")
                    data.data.array = domValue.join('与')
                    if (!vmValue.length) {
                        var has = false
                    } else {
                        has = true
                        for (var i = 0, n = domValue.length; i < n; i++) {
                            var v = domValue[i]
                            if (vmValue.indexOf(v) === -1) {
                                has = false
                                break
                            }
                        }
                    }
                    next(has)
                    return val
                }
            },
            pattern: {
                message: '必须匹配/{{pattern}}/这样的格式',
                get: function(value, data, next) {
                    var elem = data.element
                    var h5pattern = elem.getAttribute("pattern")
                    var mspattern = elem.getAttribute("data-duplex-pattern")
                    var pattern = data.data.pattern = h5pattern || mspattern
                    var re = new RegExp('^(?:' + pattern + ')$')
                    next(re.test(value))
                    return value
                }
            }
        })
    function fixEvent(event) {
        if (event.target) {
            return event
        }
        var ret = {}
        for (var i in event) {
            ret[i] = event[i]
        }
        var target = ret.target = event.srcElement
        if (event.type.indexOf("key") === 0) {
            ret.which = event.charCode != null ? event.charCode : event.keyCode
        } else if (/mouse|click/.test(event.type)) {
            var doc = target.ownerDocument || document
            var box = doc.compatMode === "BackCompat" ? doc.body : doc.documentElement
            ret.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
            ret.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
            ret.wheelDeltaY = ret.wheelDelta
            ret.wheelDeltaX = 0
        }
        ret.timeStamp = new Date - 0
        ret.originalEvent = event
        ret.preventDefault = function() { //阻止默认行为
            event.returnValue = false
        }
        ret.stopPropagation = function() { //阻止事件在DOM树中的传播
            event.cancelBubble = true
        }
        return ret
    }
    var widget = avalon.ui.validation = function(element, data, vmodels) {
        var options = data.validationOptions
        var onSubmitCallback
        var vmodel = avalon.define(data.validationId, function(vm) {
            avalon.mix(vm, options)
            vm.$skipArray = ["widgetElement", "data", "validationHooks", "validateInKeyup", "validateAllInSubmit", "resetInBlur"]
            vm.widgetElement = element
            vm.data = []
                /**
                 * @interface 为元素绑定submit事件，阻止默认行为
                 */
            vm.$init = function() {
                    element.setAttribute("novalidate", "novalidate");
                    avalon.scan(element, [vmodel].concat(vmodels))
                    if (vm.validateAllInSubmit) {
                        onSubmitCallback = avalon.bind(element, "submit", function(e) {
                            e.preventDefault()
                            vm.validateAll(vm.onValidateAll)
                        })
                    }
                    if (typeof options.onInit === "function") { //vmodels是不包括vmodel的
                        options.onInit.call(element, vmodel, options, vmodels)
                    }
                }
                /**
                 * @interface 销毁组件，移除相关回调
                 */
            vm.$destory = function() {
                vm.data = []
                onSubmitCallback && avalon.unbind(element, "submit", onSubmitCallback)
                element.textContent = element.innerHTML = ""
            }

            /**
             * @interface 验证当前元素下的所有非disabled元素
             * @param callback {Null|Function} 最后执行的回调，如果用户没传就使用vm.onValidateAll
             */

            vm.validateAll = function(callback) {
                var fn = typeof callback === "function" ? callback : vm.onValidateAll
                var promise = vm.data.filter(function(data) {
                    var el = data.element
                    return el && !el.disabled && vmodel.widgetElement.contains(el)
                }).map(function(data) {
                    return vm.validate(data, true)
                })
                Promise.all(promise).then(function(array) {
                    var reasons = []
                    for (var i = 0, el; el = array[i++];) {
                        reasons = reasons.concat(el)
                    }
                    if (vm.deduplicateInValidateAll) {
                        var uniq = {}
                        reasons = reasons.filter(function(data) {
                            var el = data.element
                            var id = el.getAttribute("data-validation-id")
                            if (!id) {
                                id = setTimeout("1")
                                el.setAttribute("data-validation-id", id)
                            }
                            if (uniq[id]) {
                                return false
                            } else {
                                uniq[id] = true
                                return true
                            }
                        })
                    }
                    fn.call(vm.widgetElement, reasons,vmodels) //这里只放置未通过验证的组件
                })
            }

            /**
             * @interface 重置当前表单元素
             * @param callback {Null|Function} 最后执行的回调，如果用户没传就使用vm.onResetAll
             */
            vm.resetAll = function(callback) {
                    vm.data.filter(function(el) {
                        return el.element
                    }).forEach(function(data) {
                        try {
                            vm.onReset.call(data.element, {
                                type: "reset"
                            }, data)
                        } catch (e) {}
                    })
                    var fn = typeof callback == "function" ? callback : vm.onResetAll
                    fn.call(vm.widgetElement)
                }
                /**
                 * @interface 验证单个元素对应的VM中的属性是否符合格式<br>此方法是框架自己调用
                 * @param data {Object} 绑定对象
                 * @param isValidateAll {Undefined|Boolean} 是否全部验证,是就禁止onSuccess, onError, onComplete触发
                 * @param event {Undefined|Event} 方便用户判定这是由keyup,还是blur等事件触发的
                 */
            vm.validate = function(data, isValidateAll, event) {
                    var value = data.valueAccessor()
                    var inwardHooks = vmodel.validationHooks
                    var globalHooks = avalon.duplexHooks
                    var promises = []
                    var elem = data.element
                    data.validateParam.replace(/\w+/g, function(name) {
                            var hook = inwardHooks[name] || globalHooks[name]
                            if (!elem.disabled) {
                                var resolve, reject
                                promises.push(new Promise(function(a, b) {
                                    resolve = a
                                    reject = b
                                }))
                                var next = function(a) {
                                    if (data.norequired && value === "") {
                                        a = true
                                    }
                                    if (a) {
                                        resolve(true)
                                    } else {
                                        var reason = {
                                            element: elem,
                                            data: data.data,
                                            message: elem.getAttribute("data-duplex-" + name + "-message") || elem.getAttribute("data-duplex-message") || hook.message,
                                            validateRule: name,
                                            getMessage: getMessage
                                        }
                                        resolve(reason)
                                    }
                                }
                                data.data = {}
                                hook.get(value, data, next)
                            }
                        })
                        //如果promises不为空，说明经过验证拦截器
                    var lastPromise = Promise.all(promises).then(function(array) {
                        var reasons = []
                        for (var i = 0, el; el = array[i++];) {
                            if (typeof el === "object") {
                                reasons.push(el)
                            }
                        }
                        if (!isValidateAll) {
                            if (reasons.length) {
                                vm.onError.call(elem, reasons, event)
                            } else {
                                vm.onSuccess.call(elem, reasons, event)
                            }
                            vm.onComplete.call(elem, reasons, event)
                        }
                        return reasons
                    })
                    return lastPromise

                }
                //收集下方表单元素的数据
            vm.$watch("avalon-ms-duplex-init", function(data) {
                var inwardHooks = vmodel.validationHooks
                data.valueAccessor = data.evaluator.apply(null, data.args)

                switch (avalon.type(data.valueAccessor())) {
                    case "array":
                        data.valueResetor = function() {
                            this.valueAccessor([])
                        }
                        break
                    case "boolean":
                        data.valueResetor = function() {
                            this.valueAccessor(false)
                        }
                        break
                    case "number":
                        data.valueResetor = function() {
                            this.valueAccessor(0)
                        }
                        break
                    default:
                        data.valueResetor = function() {
                            this.valueAccessor("")
                        }
                        break
                }

                var globalHooks = avalon.duplexHooks
                if (typeof data.pipe !== "function" && avalon.contains(element, data.element)) {
                    var params = []
                    var validateParams = []
                    data.param.replace(/\w+/g, function(name) {
                        var hook = inwardHooks[name] || globalHooks[name]
                        if (hook && typeof hook.get === "function" && hook.message) {
                            validateParams.push(name)
                        } else {
                            params.push(name)
                        }
                        if (name === "norequired") {
                            data.norequired = true
                        }
                    })
                    data.validate = vm.validate
                    data.param = params.join("-")
                    data.validateParam = validateParams.join("-")
                    if (validateParams.length) {
                        if (vm.validateInKeyup) {
                            data.bound("keyup", function(e) {
                                var type = data.element && data.element.getAttribute("data-duplex-event")
                                if (!type || /^(?:key|mouse|click|input)/.test(type)) {
                                    var ev = fixEvent(e)
                                    setTimeout(function() {
                                        vm.validate(data, 0, ev)
                                    })
                                }
                            })
                        }
                        if (vm.validateInBlur) {
                            data.bound("blur", function(e) {
                                vm.validate(data, 0, fixEvent(e))
                            })
                        }
                        if (vm.resetInFocus) {
                            data.bound("focus", function(e) {
                                vm.onReset.call(data.element, fixEvent(e), data)
                            })
                        }
                        var array = vm.data.filter(function(el) {
                            return el.element
                        })
                        avalon.Array.ensure(array, data)
                        vm.data = array
                    }

                    return false
                }
            })
        })

        return vmodel
    }
    var rformat = /\\?{{([^{}]+)\}}/gm

    function getMessage() {
        var data = this.data || {}
        return this.message.replace(rformat, function(_, name) {
            return data[name] == null ? "" : data[name]
        })
    }


    widget.defaults = {
        validationHooks: {}, //@config {Object} 空对象，用于放置验证规则
        onSuccess: avalon.noop, //@config {Function} 空函数，单个验证成功时触发，this指向被验证元素this指向被验证元素，传参为一个对象数组外加一个可能存在的事件对象
        onError: avalon.noop, //@config {Function} 空函数，单个验证失败时触发，this与传参情况同上
        onComplete: avalon.noop, //@config {Function} 空函数，单个验证无论成功与否都触发，this与传参情况同上
        onValidateAll: avalon.noop, //@config {Function} 空函数，整体验证后或调用了validateAll方法后触发；有了这东西你就不需要在form元素上ms-on-submit="submitForm"，直接将提交逻辑写在onValidateAll回调上
        onReset: avalon.noop, //@config {Function} 空函数，表单元素获取焦点时触发，this指向被验证元素，大家可以在这里清理className、value
        onResetAll: avalon.noop, //@config {Function} 空函数，当用户调用了resetAll后触发，
        validateInBlur: true, //@config {Boolean} true，在blur事件中进行验证,触发onSuccess, onError, onComplete回调
        validateInKeyup: true, //@config {Boolean} true，在keyup事件中进行验证,触发onSuccess, onError, onComplete回调
        validateAllInSubmit: true, //@config {Boolean} true，在submit事件中执行onValidateAll回调
        resetInFocus: true, //@config {Boolean} true，在focus事件中执行onReset回调,
        deduplicateInValidateAll: false //@config {Boolean} false，在validateAll回调中对reason数组根据元素节点进行去重
    }


    var validationtip;
    //var validationVM;
    widget.defaults = avalon.mix(widget.defaults, {
        onInit: function(vmodel, options, vmodels) {
            vmodels[0]["validationVM"] =vmodel; 
        },
        onReset: function(e, data) {
            if (e.type == "reset") data.valueResetor&& data.valueResetor();
            var str = data.element.getAttribute("placeholder");
            str = (str && str.length > 0) ? ("正在输入："+str):"正在输入...";
            validationTip(this, "onReset", str);
        },
        onError: function(reasons) {
            reasons.forEach(function(reason) {
                validationTip(this, "onError", reason.getMessage());
            }, this)
        },
        onSuccess: function() {
            validationTip(this, "onSuccess", "输入格式正确");
        },
        onValidateAll: function(reasons,vmodels) {
            reasons.forEach(function(reason) {
                validationTip(reason.element, "onError",reason.message);
            })
            if (vmodels.length >0)
            {
                var m =  vmodels[0];
                if (reasons.length === 0 && m.verifySuccSubmit && typeof m.verifySuccSubmit === "function") {
                        m.verifySuccSubmit.call();
                }else if(m.verifyFailSubmit && typeof m.verifyFailSubmit === "function")
                {
                      m.verifyFailSubmit.call();
                }
            }
        }
    });

    function validationTip(obj, state, message) {
        require.async(["bj-tip", "bj-tip-css2"], function(tip) {
            if (validationtip == undefined) validationtip = new tip();
            validationtip.verify(obj, {
                state: state,
                txt: message
            });
        })
    }

    return avalon;
})