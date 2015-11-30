(function ($) {
    "use strict";
    $.optSelectCar = $.optSelectCar || {};
    $.extend($.optSelectCar, {
        defaults: {
        },
        dom: {        
            checkTxt: { text: "已选车型", width: 80, height: 25,css: {} },
            showBtn:true,
            clearBtn: { text: "×", title: "清除", defaultcss: { width: 10, position: "absolute", right: 0, top: "4px", "color": "red", "text-align": "left", "cursor": "pointer", "font-size": "12px", "font-weight": "bolder" }, css: { width: 10 } },
            openBtn: { text: "+", title: "展开", defaultcss: { width: 16, height: "100%", position: "absolute", right: 0, top: 0, "background-color": "#F4F4F4", "color": "#0000ff", "font-size": "16px", "font-weight": "bolder", "cursor": "pointer", "text-align": "center" }, css: { width: 30 } },
            hideBtn: { text: "-", title: "缩起" }
        },
        css: {
            backgroundcolor: "#282828"
        }
    });
})(jQuery);

(function($){
	"use strict";
    if (typeof Array.indexOf !== 'function') {
        Array.prototype.indexOf = function (args) {
            var index = -1;
            for (var i = 0, l = this.length; i < l; i++) {
                if (this[i] === args) { index = i; break; }
            }
            return index;
        }
    }
    $.optSelectCar = $.optSelectCar || {};
    $.extend($.optSelectCar, {
        guid: 1,
        version: "1.0.0",
        //执行方法
        getAccessor: function (obj, expr) {
            var ret, p, prm = [], i;
            if (typeof expr === 'function') { return expr(obj); }
            ret = obj[expr];
            if (ret === undefined) {
                try {
                    if (typeof expr === 'string') {
                        prm = expr.split('.');
                    }
                    i = prm.length;
                    if (i) {
                        ret = obj;
                        while (ret && i--) {
                            p = prm.shift();
                            ret = ret[p];
                        }
                    }
                } catch (e) { }
            }
            return ret;
        },
        //执行方法
        getMethod: function (name) {
            return this.getAccessor($.fn.condCtrlect, name);
        },
        //自定义扩展方法
        extend: function (methods) {
            $.extend($.fn.condCtrl, methods);
            if (!this.no_legacy_api) {
                $.fn.extend(methods);
            }
        },
        getJsonField: function (curJson, fieldName) {
            if (curJson || curJson.length == 0 || fieldName == "") {
                return [];
            }
        }
    });
    var methodsHelp = {
        initOpt: function (opt) {
            $.optSelectCar.dom.clearBtn["showcss"] = $.extend(true, $.optSelectCar.dom.clearBtn.defaultcss, $.optSelectCar.dom.clearBtn.css);
            $.optSelectCar.dom.openBtn["showcss"] = $.extend(true, $.optSelectCar.dom.openBtn.defaultcss, $.optSelectCar.dom.openBtn.css);
            $.optSelectCar.dom.clearBtn.showcss.right = $.optSelectCar.dom.openBtn.showcss.width + "px";
             
             opt = $.extend(true, {
                width: 0,
                height: 25,
                bgColor: "#FFF",
                datasource: [],   //是否是必选项
                popFloat: true,                       
                popHeight:200,
                select2hide:false
            }, opt);
            return opt;
        },
        initOptItem: function (optItem) {
            optItem = $.extend(true, {
                name: 0,
                shoutxt:true,
                width:50,
                select2hide:false,
                callback: {
                    onChoice: null,     //单选有效
                    onCheckbox: null,   //点击checkbox事件  多选时
                    onSelect: null,     //确认选择后事件
                    onSearch: null      //搜索事件
                }
            }, optItem);

            if (optItem.type === "date" && optItem.width === 150) optItem.width = 200;
            return optItem;
        },
        getCarData:function(){           

        }
    }
    var methods = {
        init: function (opt) {
            var $obj = $(this);
            if ($obj.length == 0 || $obj[0].tagName.toUpperCase() !== 'DIV') {
                console.error("Element is not a div");
                return false;
            }
            if ($obj[0].id == '' || $obj[0].id == 'undefind') {
                console.error("Element  未指定ID");
                return false;
            }
            this.opt = methodsHelp.initOpt(opt);
            if (this.opt.width == 0) {
                this.opt.width = $obj.width() > 0 ? $obj.width() - 2 : 120;
            }
            this.$parent = $('<div class="sc-parent"></div>');
            this.$choice = $('<div class="sc-choice"></div>');
            this.$choiceTitle = $('<div class="sc-choicetitle">'+$.optSelectCar.dom.checkTxt.text+'<font>：</font></div>');
            this.$choiceDiv = $('<div class="sc-choicediv"></div>');
            this.$clear = $('<div class="sc-clear" title="' + $.optSelectCar.dom.clearBtn.title + '">' + $.optSelectCar.dom.clearBtn.text + '</div>');
            this.$onoff = $('<div class="on-off"></div>')
            this.$popDiv = $('<div class="sc-popdiv"></div>');
            this.$choice.css({ width: this.opt.width });
            this.$choiceDiv.css({ width: (this.opt.width - $.optSelectCar.dom.checkTxt.width - $.optSelectCar.dom.openBtn.showcss.width - $.optSelectCar.dom.clearBtn.showcss.width) });
            this.$clear.css($.optSelectCar.dom.clearBtn.showcss);
            this.$onoff.css($.optSelectCar.dom.openBtn.showcss);
            this.$choiceTitle.css({ width: $.optSelectCar.dom.checkTxt.width, height: this.opt.height});
            this.$choice.append(this.$choiceTitle).append(this.$choiceDiv).append(this.$clear).append(this.$onoff);
            //this.$choice.append(this.$choiceDiv).append(this.$clear).append(this.$onoff);
            this.$parent.append(this.$choice).append(this.$popDiv);
            $obj.html(this.$parent);
            this.$popDiv.css({ width: this.opt.width });
            if (this.opt.popFloat) {  //@  浮动时候样式处理
                this.$parent.css({ position: "relative" })
                this.$popDiv.css({ position: "absolute", "z-index": "999", "background-color": "#fff" }).offset({ top: 0, left: 0 }).hide();
                this.$onoff.append($.optSelectCar.dom.openBtn.text).prop("title", $.optSelectCar.dom.openBtn.title); 
                 // 绑定在页面的事件
                $('body').click(function (e) {
                    if ($(e.target).parents('div.sc-parent').length > 0) {
                        return;
                    }
                    if ($("div.sc-popdiv").length > 0) {
                        $("div.sc-popdiv").each(function () {
                            if ($(this).data("popFloat")) {
                                var $obj = $(this).parents("div.sc-parent");
                                $obj.removeClass("sc-showDiv").addClass("sc-hideDiv");
                                $(this).offset({ top: 0, left: 0 }).hide();
                                $obj.find("div.on-off").html($.optSelectCar.dom.openBtn.text).attr("title", $.optSelectCar.dom.openBtn.title);
                            }
                        })
                    }
                });
            } else {
                this.$onoff.append($.optSelectCar.dom.hideBtn.text).prop("title", $.optSelectCar.dom.hideBtn.title);
                this.$choice.css({ "border-bottom": "none" });               
            }
            this.opt["domid"] = $obj[0].id;

            this.$popDiv.data({popFloat: this.opt.popFloat})
            this.$parent.data({popFloat: this.opt.popFloat, width: this.opt.width, domid: this.opt["domid"] })
            $obj.data({ popFloat: this.opt.popFloat, width: this.opt.width, domid: this.opt["domid"] })
            ccOptionDom.init(this.opt, this.$popDiv);

            this.$onoff.bind("click", function () {
                var $objP = $(this).parents("div.sc-parent");
                $("#"+$objP.data("domid")).selectCar("repop");
                return false;
            });

            this.$clear.bind("click", function () {
                var $objP = $(this).parents("div.sc-parent");
                $("#"+$objP.data("domid")).selectCar("reChoise");
                return false;
            });
            return $obj;
        },
        getSelResults: function (checked) {
            var objP = $(this);
            var $choise = objP.find("div.ccsel-item");
            var $chkitem = objP.find("div.sc-checkitem");

            var resArr = [];
            for (var i = 0; i < $chkitem.length; i++) {
                var name = $($chkitem[i]).find("div.sc-title strong").text();
                var orgd = $($chkitem[i]).data();
                var res = { name: name, chked: false, cheId: "", chkName: "", chkItem: [], multiple: orgd.multiple };
                for (var j = 0; j < $choise.length; j++) {
                    var d = $($choise[j]).data();
                    if (d && name == d.name) {
                        res.chkId = d.chkId;
                        res.chkName = d.chkName;
                        res.chkItem = d.chkData;
                        res.chked = true;
                        break;
                    }
                }
                if (checked && checked === true) {
                    if (res.chked) {
                        resArr.push(res);
                    }
                } else {
                    resArr.push(res);
                }
            }
            return resArr;
        },
        getSelNames: function () {
        },
        getSelIds: function () {
        },
        setChecked: function (name) {
            if (typeof name !== "string" || name === "") {
                return false;
            }
            var $obj = $(this);
            var checkitems = $obj.find("div.sc-checkitem");
            for (var i = 0; i < checkitems.length; i++) {
                var $item = $(checkitems[i]);
                var itname = $item.find("div.sc-title strong").text();
                if (itname == name) {
                    ccChoiceDom.doSingle($item);
                    break;
                }
            }
        },
        setCheckedAll: function (name,before) {
            if (typeof name !== "string" || name === "") {
                return false;
            }
            var $obj = $(this);
            var checkitems = $obj.find("div.sc-checkitem");
            for (var i = 0; i < checkitems.length; i++) {
                var $item = $(checkitems[i]);
                var itname = $item.find("div.sc-title strong").text();
                if (itname == name) {
                    ccChoiceDom.doSingle($item);
                    break;
                }
            }
        },
        delChecked: function (name) {
            if (typeof name !== "string" || name === "") {
                return false;
            }
            var $obj = $(this);
            var checkitems = $obj.find("div.ccsel-item");
            for (var i = 0; i < checkitems.length; i++) {
                var $item = $(checkitems[i]);
                var itname = $item.find("div.ccsel-t").text();
                if (itname == (name + "：")) {
                    $item.remove();
                    break;
                }
            }
        },
        delChoise: function (name) {
            if (typeof name !== "string" || name === "") {
                return false;
            }
            var $obj = $(this);
            $obj.selectCar("delChecked", name);
            var $checkitems = $obj.find("div.sc-checkitem");
            var index = ccChoiceDomHelp.getChoiseIndex($obj, name);
            if (index < 0) { return false;}
            $.each($checkitems, function(i, val) {
                var $curobj= $($checkitems[i]);
                if(index<i){
                    $curobj.remove();
                    $obj.selectCar("delChecked", $curobj.find('strong').text());
                }
                if(index==i){$curobj.find('div.sc-citemChk').removeClass('sc-citemChk');}
            });           
        },
        replaceChoise: function (optitem) {
            if (typeof optitem !== "object" || typeof optitem.name !== "string" || optitem.name === "") {
                return false;
            }
            var $obj = $(this);
            $obj.selectCar("delChecked", optitem.name);
            var $checkitems = $obj.find("div.sc-checkitem");
            var index = ccChoiceDomHelp.getChoiseIndex($obj, optitem.name);
            if (index < 0) { return false; }
            var $curItme = $($checkitems[index]);
            var set = methodsHelp.initOptItem($curItme.data("chkItemSet"));
            set.orgData = optitem.orgData;
            set.initData = optitem.initData;
            ccOptionDom.iniItem(-1, methodsHelp.initOptItem(set), $obj.data(), $obj.find("div.sc-popdiv"));
            if (set.initData && set.initData.length > 0) {
                $obj.selectCar("setChecked", set.name);
            }
        },
        appendChoise: function (optitem) {
            if (typeof optitem !== "object" || typeof optitem.name !== "string" || optitem.name === "") return false;
            var $obj = $(this);
            $obj.selectCar("delChecked", optitem.name);
            var $checkitems = $obj.find("div.sc-checkitem");
            var index = ccChoiceDomHelp.getChoiseIndex($obj, optitem.name);
            if (index < 0) { return false; }
            var $curItme = $($checkitems[index]);
            var set = methodsHelp.initOptItem($curItme.data("chkItemSet"));
            set.orgData = set.orgData.concat(optitem.orgData);
            set.initData = set.initData.concat(optitem.initData);
            ccOptionDom.iniItem(-1, methodsHelp.initOptItem(set), $obj.data(), $obj.find("div.sc-popdiv"));
            if (set.initData && set.initData.length > 0) {
                $obj.selectCar("setChecked", set.name);
            }
        },
        resetChoise: function (optitem, afterName) {
            if (typeof optitem !== "object" || typeof optitem.name !== "string" || optitem.name === "") return false;
            var $obj = $(this);
            $obj.selectCar("delChecked", optitem.name);
            var checkitems = $obj.find("div.sc-checkitem");
            var aftrindex = ccChoiceDomHelp.getChoiseIndex($obj, afterName);
            ccOptionDom.iniItem(aftrindex, methodsHelp.initOptItem(optitem), $obj.data(), $obj.find("div.sc-popdiv"));
            if (optitem.initData && optitem.initData.length > 0) {
                $obj.selectCar("setChecked", optitem.name);
            }
        },
        reChoise:function(){
            var $obj = $(this);
            var set =  $obj.data();
            var $objP = $obj.find("div.sc-parent");    
            if(set.popFloat)
            {
                $objP.find("div.sc-checkitem").show();
                $objP.find("div.sc-popdiv").show();
                $objP.find("div.sc-popdiv").offset({ top: $objP.offset().top + $objP.outerHeight() - 1, left: $objP.offset().left });
                $objP.find("div.sc-choicediv").html("");
            }else{
                $objP.find("div.sc-choicediv").css({ "border-bottom": "none" }).html("");
                $objP.find("div.sc-popdiv").show();
                $objP.find("div.sc-checkitem").show(); 
            }

            var $checkitems = $obj.find("div.sc-checkitem");
            $.each($checkitems, function(i, val) {
                var $curobj= $($checkitems[i]);
                if(0<i){
                    $curobj.remove();                   
                }
                if(0==i){$curobj.find('div.sc-citemChk').removeClass('sc-citemChk');}
            });   
        },
        repop:function(){
            var $obj = $(this);
            var set =  $obj.data();
            var $objP = $obj.find("div.sc-parent");
            var $popDiv = $objP.find("div.sc-popdiv");
            var $onoff= $objP.find('div.on-off')
            if(set.popFloat)
            {
                if ($objP.hasClass("sc-showDiv")) {
                    $objP.removeClass("sc-showDiv").addClass("sc-hideDiv");
                    $onoff.html($.optSelectCar.dom.openBtn.text).attr("title", $.optSelectCar.dom.openBtn.title);
                    $popDiv.offset({ top: 0, left: 0 }).hide();
                } else {
                    $objP.removeClass("sc-hideDiv").addClass("sc-showDiv");
                    $onoff.html($.optSelectCar.dom.hideBtn.text).attr("title", $.optSelectCar.dom.hideBtn.title);
                    $popDiv.show();
                   
                    $popDiv.offset({ top: $objP.offset().top + $objP.outerHeight() - 1, left: $objP.offset().left });
                }
            }else{
                var $choice = $objP.find("div.sc-choice");
                if ($objP.hasClass("sc-hideDiv")) {
                    $objP.removeClass("sc-hideDiv").addClass("sc-showDiv");
                    $onoff.html($.optSelectCar.dom.hideBtn.text).attr("title", $.optSelectCar.dom.hideBtn.title);
                    $choice.css({ "border-bottom": "none" });
                    $popDiv.show();
                } else {
                    $objP.removeClass("sc-showDiv").addClass("sc-hideDiv");
                    $onoff.html($.optSelectCar.dom.openBtn.text).attr("title", $.optSelectCar.dom.openBtn.title);
                    $choice.css({ border: "1px solid #E5e5e5" });
                    $popDiv.hide();
                }
            }
        }
    };
    var ccOptionDom = {
        init: function (opt, $popDiv) {
            if (opt.datasource.length > 0) {
                for (var i = 0; i < opt.datasource.length; i++) {
                    var item = methodsHelp.initOptItem(opt.datasource[i]);
                    ccOptionDom.iniItem(i, item, { width: 180,height:opt.popHeight, domid: opt.domid, type: opt.type }, $popDiv);
                }//end循环
            }
        },
        iniItem: function (index, item, opt, $popDiv) {
            var $itemdom = $('<div class="sc-checkitem"></div>');
            var $itemtitle = $('<div class="sc-title"><div><strong>' + item.name + '</strong>'+(item.name?"：":"")+'</div></div>');
            var $itemcontext = $('<div class="sc-context"></div>');
            var $optionsdiv = $('<div class="sc-optionsdiv"></div>');

            $itemcontext.append($optionsdiv);
            $itemcontext.css({height:opt.height})
            ccOptionDom.initCheck(item, $optionsdiv, opt.width - 85);
            //保存初始化属性
            $itemdom.append($itemtitle).append($itemcontext).data({ "chkItemSet": item, "parentDomID": opt.domid });
            $itemdom.css({width:item.width});
            $itemcontext.slimscroll();
            var $checkitems = $popDiv.find("div.sc-checkitem");
            var isAppend = true;
            for (var i = 0; i < $checkitems.length; i++) {
                if ($($checkitems[i]).find("div.sc-title strong").text() === (item.name)) {
                    $($checkitems[i]).replaceWith($itemdom);
                    isAppend = false;
                    break;
                }
            }
            if (isAppend) {
                if (index >= $checkitems.length || index < 0)
                    $popDiv.append($itemdom);//.append($cleardom)
                else {
                    $($checkitems[index]).after($itemdom);
                }
            }
        },
        initCheck: function (item, $optionsdiv, allwidth) {
            var $itemsdiv = $('<div class="sc-itmesdiv"></div>');
            $itemsdiv.append(ccOptionDom.getItemsDom(item, item.pageSize));
            $optionsdiv.append($itemsdiv);           
            ccOptionDom.setSingleEvent($itemsdiv);
            
        },
        getItemsDom: function (item, pageSize) {
            var str = "";
            if (typeof item.initData === "object" && item.initData.length > 0) {
                for (var i = 0; i < item.initData.length; i++) {
                    for (var j = 0; j < item.orgData.length; j++) {
                        if (item.idVerify && item.initData[i].id === item.orgData[j].id && item.initData[i].name === item.orgData[j].name) {
                            item.orgData[j]["checked"] = true;
                            break;
                        } else if (item.initData[i].name === item.orgData[j].name) {
                            item.orgData[j]["checked"] = true;
                            break;
                        }
                    }
                }
            }

            for (var j = 0; j < item.orgData.length ; j++) {
                var it = item.orgData[j];
                if (it && it.name && it.name != "") {
                    if (it.checked) {
                        str += '<div class="sc-citem sc-citemChk'+(it.class?(" "+it.class):"")+'" ccid="' + it.id + '">' + it.name + '</div>';
                    } else {
                        str += '<div class="sc-citem'+(it.class?(" "+it.class):"")+'" ccid="' + it.id + '">' + it.name + '</div>';
                    }                    
                }
            }
            return str;
        },
        //设置单选类型事件              
        setSingleEvent: function ($itemsdiv) {
            // 选中选择项事件
            $itemsdiv.find(".sc-citem").bind("click", function () {
                var $objchk = $(this).parents("div.sc-checkitem");
                var set = $objchk.data("chkItemSet");
                if (set.callback.onChoice && set.callback.onChoice instanceof Function) {
                    set.callback.onChoice({ type: set.type, checked: true, multiple: set.multiple, name: set.name, value: $(this).text(), id: $(this).attr("ccid") });
                }
                $objchk.find("div.sc-citemChk").removeClass("sc-citemChk");
                $(this).addClass("sc-citemChk");
                ccChoiceDom.doSingle($(this).parents("div.sc-checkitem"));
            });
        },
    }
    var ccChoiceDom = {
        doSingle: function ($objchk) {
            var tilte = $objchk.find("div.sc-title strong").text();
            var obj = $objchk.find("div.sc-citemChk");
            if (obj && obj.text() !== "") {
                ccChoiceDom.initDom(
                    $objchk,
                    {
                        name: tilte,
                        txt: obj.text(),
                        chkName: obj.text(),
                        chkId: obj.attr("ccid"),
                        chkData: [{ id: obj.attr("ccid"), name: obj.text() }]
                    });
            }
        },
        initDom: function ($objchk, item) {
            var $choicediv = $objchk.parents("div.sc-parent").find("div.sc-choicediv");
            item["parentDomID"] =$objchk.data("parentDomID");
            var divcnt = $choicediv.find("div.ccsel-item");
            for (var i = 0; i < divcnt.length; i++) {
                if ($(divcnt[i]).find("div.ccsel-t").text() === (item.name + "：")) {
                    $(divcnt[i]).find("div.ccsel-item").data(item);
                    $(divcnt[i]).find("div.ccsel-c").text(item.txt);
                    return false;                    
                }
            }

            var $sel = $('<div class="ccsel-item"></div>');
            var $seltitle = $('<div class="ccsel-t"></div>');
            var $selcontext = $('<div class="ccsel-c"></div>');
            var $selcut = $('<div class="ccsel-s">…</div>');
            var $clear = $('<div class="ccs-del" title="' + $.optSelectCar.dom.clearBtn.title + '">' + $.optSelectCar.dom.clearBtn.text + '</div>');
            var $act = $('<div class="ccsel-a"></div>');

            $seltitle.append(item.name + "：");
            if (item.txt && item.txt !== "") {
                $selcontext.append(item.txt);
            }
            $selcut.hide();
            $act.append($clear);
            // 首先判断有没有添加过
            $sel.append($seltitle).append($selcontext).append($selcut).append($act).data(item).prop("title", item.chkName);

            var index = ccChoiceDomHelp.getChoiseIndex($objchk.parent(), item.name);  //按顺序插入
            if (index < divcnt.length) {
                for (var i = 0; i < divcnt.length; i++) {
                    if (i == index) {
                        $(divcnt[i]).before($sel);
                        break;
                    }
                }
            } else {
                $choicediv.append($sel);
            }


            var set = $objchk.data("chkItemSet");
            if ($selcontext.width() > set.width) {
                $selcontext.width(set.width);
                $selcut.show();
            }
            if (set.callback.onSelect && set.callback.onSelect instanceof Function) {
                set.callback.onSelect({ type: set.type, name: item.name, value: item.chkName, id: item.chkId, chkData: item.chkData, timeType: item.timeType || "", multiple: set.multiple })
            }
            //$objchk.hide();

            $clear.bind("click", function () {
                var obj = $(this).parents("div.ccsel-item");
                $("#"+obj.data("parentDomID")).selectCar("delChoise",obj.data("name"));                               
                return false;
            });
        }
     }

         // 已选项目
    var ccChoiceDomHelp = {
        getChoiseIndex: function ($obj, name) {
            if (typeof name !== "string" || name === "") {
                return -1;
            }
            var checkitems = $obj.find("div.sc-checkitem");
            for (var i = 0; i < checkitems.length; i++) {
                var $item = $(checkitems[i]);
                var itname = $item.find("div.sc-title strong").text();
                if (itname == name) {
                    return i;
                    break;
                }
            }
            return -1;
        }
    }

    $.fn.selectCar = function (method) {
        if (typeof method === "string" && methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        }
        else {
            $.error('Method：' + method + 'does not exist on jQuery.commonSelect');
        }
    }
})(jQuery)