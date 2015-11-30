define(function(require) {
    var A = require("A");
    var $ = require("$");
    require("A-dropdown");
    require("A-verify");
    require("A-smartgrid");
    require("A-tooltip");
    require("A-dialog");

    var inlistDate;
    var dataS = [];
    //初始化数据  不能异步
    inlistDate = require('./indexListData');
    
    var companyModel = A.define({
        $id: "indexList",
        enable_true: function(rowID, isF) {
            var obj = A(this);
            switch(isF){
                //黄色星星
                case 0:
                    companyModel._rowID = rowID;
                    avalon.vmodels.dd.toggle = true;
                    avalon.vmodels.dd.rowid = rowID;
                    companyModel.quxiaoguanzhuReason = "";
                break;
                //空心星星
                case 1:
                    companyModel._rowID = rowID;
                    avalon.vmodels.bb.toggle = true;
                    avalon.vmodels.bb.rowid = rowID;
                    companyModel.guanzhuReason = "";
                break;
                //灰色星星
                case 2:
                    companyModel._rowID = rowID;
                    avalon.vmodels.bb.toggle = true;
                    avalon.vmodels.bb.rowid = rowID;
                    companyModel.guanzhuReason = "";
                break;

            }
        },
        yujing: function(id, rowID) {
            companyModel._rowID = rowID;
            avalon.vmodels[id].toggle = true;
        },
        mzgzDialog: function(id, rowID) {
            companyModel._rowID = rowID;
            avalon.vmodels[id].toggle = true;
        },
        lishi: function(id, rowID) {
            companyModel._rowID = rowID;
            avalon.vmodels[id].toggle = true;
        },
        zdUpdate: function() {
            alert(112121);
        },
        select_input_btn: function() {
            alert(companyModel.select_input);
        },
        select_input: "sadsadsa",
        typeo: "",
        $typeOpts: {
            data: inlistDate.condition,
            titleClass: "span_dropdown",
            listClass: "map_side_each_item",
            width: 130,
            listWidth: 130,
            onChange: function() {
                renderGrid(1);
            }
        },
        co: "",
        $carOpts: {
            data: inlistDate.carData,
            titleClass: "span_dropdown1",
            listClass: "map_side_each_item",
            width: 100,
            listWidth: 100,
            onChange: function() {
                renderGrid(1);
            }
        },
        com: "",
        $company: {
            data: inlistDate.company,
            width: 250,
            titleClass:"companyStyle",
            listClass:"companyStyleItem",
            listWidth: 250,
            height: 200,
            onChange: function() {
                renderGrid(1);
            }
        },
        $aaOpts: {
            title: "解除预警",
            container: "modalWrapper",
            onConfirm: function() {
                var parm = JSON.parse(JSON.stringify(companyModel.$model));
                var sgre1 = avalon.vmodels.sg1.getSelected()
                console.log(sgre1)
                console.log(parm._rowID)
                console.log(parm.yujingReason)
            }
        },
        $mzgzOpts: {
            title: "命名规则",
            container: "modalWrapper",
            onConfirm: function() {
                var parm = JSON.parse(JSON.stringify(companyModel.$model));
                var sgre1 = avalon.vmodels.sgmz1.getSelected()
                console.log(sgre1)
                console.log(parm._rowID)
                console.log(parm.yujingReason)

            }
        },
        $bbOpts: {
            title: "加入重点关注",
            container: "modalWrapper",
            onConfirm: function() {
                var parm = JSON.parse(JSON.stringify(companyModel.$model));
                console.log(parm._rowID)
                var sg2Data = A.vmodels.sg2.data;
                for (var i = 0; i < sg2Data.length; i++) {
                    if (sg2Data[i].id == parm._rowID) {
                        sg2Data[i].favorite = 0;
                        var str=companyModel.guanzhuReason.replace(/\n/g,"<br>");
                        sg2Data[i].guanzhuReason = str;
                    }
                };
                A.vmodels.sg2.render(sg2Data);
            }
        },
        $ccOpts: {
            title: "预警历史",
            confirmName: "取消",
            width: 800,
            container: "modalWrapper"
        },
        $ddOpts: {
            title: "取消关注原因",
            width: 400,
            container: "modalWrapper",
            onConfirm: function() {
                var parm = JSON.parse(JSON.stringify(companyModel.$model));
                console.log(parm._rowID)
                var sg2Data = A.vmodels.sg2.data;
                for (var i = 0; i < sg2Data.length; i++) {
                    if (sg2Data[i].id == parm._rowID) {
                        sg2Data[i].favorite = 2;
                        var str=companyModel.quxiaoguanzhuReason.replace(/\n/g,"<br>");
                        sg2Data[i].quxiaoguanzhuReason = str;
                    }
                };
                A.vmodels.sg2.render(sg2Data);
            }

        },

        sScd: "0",
        quHuancar: inlistDate.quHuancar,
        quhuan: "0",
        choose_type: "",
        choose_type1: "",
        resetChooseCar: function(val) {
            companyModel.choose_type = "";
            companyModel.choose_type1 = "";
            renderGrid(1);
        },

        /*配置弹出sg1*/
        sgOpts1: {
            pageable: false,
            autoResize: true,
            selectable: {
                type: "Checkbox",//为表格添加选中行操作框,可以设置为"Checkbox"或者"Radio"
                width:40
            },
            columns: [{
                key: "yujingDate",
                name: "预警日期",
                sortable: false,
                width:200,
                autoResize: false,

            }, {
                key: "yujingRule", //列标识
                name: "预警规则", //列名
                sortable: false, //否可排序
                isLock: true, //是否锁死列让其始终显示
                align: "center", //列的对象方式
                toggle: false, //控制列的显示隐藏
                // autoResize: true,
                width: 160 //设置列的宽度
            }],
            data: altWarnData(3)

        },
        yujingReason: "",
        guanzhuReason: "",
        quxiaoguanzhuReason:"",
        _rowID: "",
        /*配置弹出sg1*/

        /*配置弹出sgmzgz*/
        $sgmzgz1: {
            pageable: false,
            autoResize: true,
            columns: [{
                key: "yujingDate",
                name: "预警日期",
                sortable: false,
                width: 218,
                autoResize: false,

            }, {
                key: "yujingRule", //列标识
                name: "预警规则", //列名
                sortable: false, //否可排序
                isLock: true, //是否锁死列让其始终显示
                align: "center", //列的对象方式
                toggle: false, //控制列的显示隐藏
                // autoResize: true,
                width: 218 //设置列的宽度
            }],
            data: altmzgzData(3)
        },
        /*配置弹出sgmzgz*/

        /*配置弹出sg3*/
        sgOpts3: {
            pageable: false,
            autoResize: true,
            columns: [{
                key: "lishiDate",
                name: "预警日期",
                sortable: false,
                width: 150,
                autoResize: false,

            }, {
                key: "lishiRule", //列标识
                name: "预警规则", //列名
                sortable: false, //否可排序
                isLock: true, //是否锁死列让其始终显示
                align: "center", //列的对象方式
                toggle: false, //控制列的显示隐藏
                // autoResize: true,
                width: 150 //设置列的宽度
            }, {
                key: "lishiPeop", //列标识
                name: "解除人", //列名
                sortable: false, //否可排序
                isLock: true, //是否锁死列让其始终显示
                align: "center", //列的对象方式
                toggle: false, //控制列的显示隐藏
                width: 150 //设置列的宽度
            }, {
                key: "jiechuDate", //列标识
                name: "解除时间", //列名
                sortable: false, //否可排序
                isLock: true, //是否锁死列让其始终显示
                align: "center", //列的对象方式
                toggle: false, //控制列的显示隐藏
                // autoResize: true,
                width: 150 //设置列的宽度
            }, {
                key: "lishiReason", //列标识
                name: "解除原因", //列名
                sortable: false, //否可排序
                isLock: true, //是否锁死列让其始终显示
                align: "center", //列的对象方式
                toggle: false, //控制列的显示隐藏
                // autoResize: true,
                width: 156 //设置列的宽度
            }],
            data: altHostoryData(3)
        },
        /*配置弹出sg3*/
        sgOpts2: {
            pageable: true,
            pager: {
                showPages: 5,
                // currentPage: 1,
                // totalItems: 10,
                showJumper: true,
                onJump: function(e, pagedata) {

                },
                perPages: 20
            },
            htmlHelper: { // 渲染列数据的方法集合
                // 包装关注列的数据
                actfavorite: function(vmId, field, index, cellValue, rowData) {

                    var startStyle = rowData.favorite 
                    switch(rowData.favorite){
                        case 0: startStyle="star_f";break;
                        case 1: startStyle="star_p";break;
                        case 2: startStyle="star_g";break;
                    }
                   
                    var enable_trueFnHtml = "enable_true(" + rowData.id + "," + rowData.favorite + ")";
                    var aaaFn = "aaaaa(" + rowData.favorite + ",'" + rowData.guanzhuReason + "','" + rowData.quxiaoguanzhuReason + "')";
                    var disabledHtml = '<a  id=' + ("aaa" + rowData.id) + ' class="' + (startStyle) + '"  ms-click="' + enable_trueFnHtml + '" ms-mouseleave="bbbbb(' + rowData.favorite + ')"  ms-mouseenter="' + aaaFn + '" "><span class="gztip"></span></a>'
                    return disabledHtml
                },
                // 包装平台车主列的数据
                actcarHost: function(vmId, field, index, cellValue, rowData) {
                    var disabledHtml = '<span class="isCarHost"><a href="#">是</a></span>'
                    var enabledHtml = '<span class="isCarHost" ><a href="#">否</a></span>'
                    var actcarHost = rowData.carHost == false ? disabledHtml : enabledHtml;
                    return actcarHost
                },
                // 包装征信列的数据
                actcredit: function(vmId, field, index, cellValue, rowData) {
                    var disabledHtml = '<span class="iscredit_n"><a href="#">已查</a></span>'
                    var enabledHtml = '<span class="iscredit_n" ><a href="#">待查</a></span>'
                    var actcredit = rowData.credit == false ? disabledHtml : enabledHtml;
                    return actcredit
                },

                // 包装盒子状态列的数据
                actboxState: function(vmId, field, index, cellValue, rowData) {
                    var disabledHtml = '<a href="#" class="iscredit"><span class="iscredit">无信号</span></a>'
                    var enabledHtml = '<a href="#" class="iscredit_n"><span class="iscredit_n">在线</span></a>'
                    var disabledHtml1 = '<a href="#" class="iscredit"><span class="iscredit">断常电</span></a>'
                    var actboxState;
                    switch (rowData.boxState) {
                        case 0:
                            actboxState = disabledHtml;
                            break;
                        case 1:
                            actboxState = disabledHtml1;
                            break;
                        case 2:
                            actboxState = enabledHtml;
                            break;
                    }
                    return actboxState;
                },
                // 包装命中规则列的数据
                acthitRule: function(vmId, field, index, cellValue, rowData) {
                    var mzgzHmtl = "mzgzDialog('mzgz'," + rowData.id + ")"
                    var enabledHtml = '<span class="iscredit" >' + rowData.hitRule + '个</span><span class="info" ms-click="' + mzgzHmtl + '"></span>'
                    return enabledHtml
                },
                // 包装驾客列的数据
                actcarCustomer: function(vmId, field, index, cellValue, rowData) {
                    var enabledHtml = rowData.carCustomer + '<span class="phone" ms-attr-data-phoneNo="' + rowData.ownerID + '" ms-click="get_phoneNo" ms-visible="istelphone1" ms-widget="tooltip,$, $ppOpt" data-tooltip-delegate="false" tp="2"></span>'
                    return enabledHtml
                },
                // 包装历史订单列的数据
                actoldOrder: function(vmId, field, index, cellValue, rowData) {
                    var enabledHtml = '<span class="iscredit_n"> <a href="#">成功' + rowData.oldOrder_suc + '</a> </span><br><span class="iscredit_n"> <a href="#">失败' + rowData.oldOrder_fail + '</a> </span>'
                    return enabledHtml
                },
                // 包装注册下单的数据
                actregOrderDate: function(vmId, field, index, cellValue, rowData) {
                    var enabledHtml = '<span>' + rowData.regDate + '</span><br><span>' + rowData.orderDate + '</span>'
                    return enabledHtml
                },
                // 包装取车还车的数据
                actGetPayCarDate: function(vmId, field, index, cellValue, rowData) {
                    var actGetPayCarDate;
                    var disabledHtml = "";
                    var enabledHtml = rowData.getCarDate + '<br>' + rowData.payCarDate + '<span class="carDate" ></span>'
                    var enabledHtml2 = rowData.getCarDate + '<br>' + rowData.payCarDate + '<span class="carDate2" ></span>'
                    switch (rowData.isRelet) {
                        case 0:
                            actGetPayCarDate = disabledHtml;
                            break;
                        case 1:
                            actGetPayCarDate = enabledHtml;
                            break;
                        case 2:
                            actGetPayCarDate = enabledHtml2;
                            break;
                    }
                    return actGetPayCarDate;
                },
                // 包装操作列的数据
                actoperate: function(vmId, field, index, cellValue, rowData) {
                    var enabledHtml = '<span class="opt_btn"><a target="_Blank" href="http://www.baojia.com?' + rowData.id + '">订单</a></span>'
                    enabledHtml += '<span class="opt_btn"><a target="_Blank" href="http://www.baidu.com?' + rowData.id + '">盒子</a></span>'
                    var lishiFnHtml = "lishi('cc'," + rowData.id + ")"
                    enabledHtml += '<span ms-click="' + lishiFnHtml + '" class="opt_btn">历史</span>'
                    enabledHtml += '<span class="opt_btn">风险事件</span>'
                    var yujingFnHtml = "yujing('aa'," + rowData.id + ")"
                    enabledHtml += '<span ms-click="' + yujingFnHtml + '" class="opt_btn">解除预警</span>'
                    return enabledHtml
                }

            },
            columns: [{
                key: "favorite",
                name: "关注",
                sortable: false,
                width: 80,
                autoResize: false,
                format: "actfavorite"
            }, {
                key: "cityid", //列标识
                name: "城市", //列名
                sortable: false, //否可排序
                isLock: true, //是否锁死列让其始终显示
                align: "center", //列的对象方式
                defaultValue: "shirly", //列的默认值
                customClass: "ddd", //自定义此列单元格类
                toggle: false, //控制列的显示隐藏
                // autoResize: true,
                width: 80 //设置列的宽度

            }, {
                key: "carCustomer",
                name: "驾客",
                sortable: false,
                width: 120,
                autoResize: false,
                format: "actcarCustomer"
            }, {
                key: "carHost",
                name: "平台车主",
                sortable: false,
                width: 70,
                autoResize: false,
                format: "actcarHost"
            }, {
                key: "regOrderDate",
                name: "注册/下单日期",
                sortable: false,
                width: 210,
                autoResize: false,
                format: "actregOrderDate"
            }, {
                key: "getPayCarDate",
                name: "取车/还车日期",
                sortable: false,
                align: "center",
                autoResize: false,
                width: 210,
                format: "actGetPayCarDate"
            }, {
                key: "oldOrder",
                name: "历史订单",
                sortable: false,
                align: "center",
                autoResize: false,
                width: 84,
                format: "actoldOrder"
            }, {
                key: "credit",
                name: "征信",
                sortable: false,
                align: "center",
                autoResize: false,
                width: 70,
                format: "actcredit"
            }, {
                key: "loginUnit",
                name: "登录设备",
                sortable: false,
                align: "center",
                autoResize: false,
                width: 70
            }, {
                key: "carCodeType",
                name: "车牌号",
                sortable: false,
                align: "center",
                autoResize: false,
                width: 110
            }, {
                key: "carType",
                name: "车型年款",
                sortable: false,
                align: "center",
                autoResize: false,
                width: 130
            }, {
                key: "boxState",
                name: "盒子状态",
                sortable: false,
                align: "center",
                autoResize: false,
                width: 80,
                format: "actboxState"
            }, {
                key: "hitRule",
                name: "命中规则",
                sortable: false,
                align: "center",
                autoResize: false,
                width: 100,
                format: "acthitRule"
            }, {
                key: "operate",
                name: "操作",
                sortable: false,
                align: "left",
                autoResize: false,
                width:486,
                format: "actoperate"
            }]
        },
        signInfo: inlistDate.signInfo,
        signInfo1: inlistDate.signInfo1,

        aaaaa: function(isF, reason,quxiaoreason) {
            switch(isF){
                //黄色星星
                case 0:
                var parm = JSON.parse(JSON.stringify(companyModel.$model));
                console.log(parm.guanzhuReason)
                $(this).find('.gztip').show();
                //人和时间
                var date=new Date();
                var dateNoW=date.Format("yyyy-MM-dd hh:mm");
                var person="tongxg";
                $(this).find('.gztip').html('<b></b>' +person+"<br>"+dateNoW+"<br>"+ reason);
                break;

                case 1:
                $(this).find('.gztip').hide();
                break;

                //灰色星星
                case 2:
                //人和时间
                var parm = JSON.parse(JSON.stringify(companyModel.$model));
                console.log(parm.quxiaoguanzhuReason)
                $(this).find('.gztip').show();
                var date=new Date();
                var dateNoW=date.Format("yyyy-MM-dd hh:mm");
                var person="tongxg";
                $(this).find('.gztip').html('<b></b>' +person+"<br>"+dateNoW+"<br>"+ quxiaoreason);
                break;
            }


            // if (isF) {
            //     var parm = JSON.parse(JSON.stringify(companyModel.$model));
            //     console.log(parm.guanzhuReason)
            //     $(this).find('.gztip').show();
            //     $(this).find('.gztip').html('<b></b>' + reason);
            // } else {
            //     $(this).find('.gztip').hide();
            // }

        },
        bbbbb: function(isF) {
            if (isF==0 || isF==2) {
                $(this).find('.gztip').hide();
            }
        },
        get_phoneNo2: function(id) {

            var obj = $("#aaa" + id);
            if (!obj.hasClass('star_f')) {

                $(this).find("span").show();

            } else {
                return false;
            }

            ;
        },
        istelphone1: true,
        $ppOpt: {
            "contentGetter": function(elem) {
                if (elem.tagName.toLowerCase() == 'input' || elem.getAttribute("tp")) return companyModel.phoneNo + (elem.getAttribute("tp") == "2" ? "  <a ms-click=\"hide($event)\" href=\"#\">&times;</a>" : "")
            },
            autohide: false,
            event: 'click',
            positionAt: 'right bottom',
            positionMy: 'left+10 bottom+15'
        },
        get_phoneNo: function(e) {
            var phoneNo = e.target.getAttribute("data-phoneNo");
            companyModel.phoneNo = phoneNo;
        }   
    })

    companyModel.$watch("sScd", function(newVal) {
        renderGrid(1);
    });
    companyModel.$watch("quhuan", function(newVal) {
        if (newVal == "0") {
            $('.show_main_choose').css('display', 'block');
            $('.show_main_choose1').css('display', 'none');
        } else {
            $('.show_main_choose').css('display', 'none');
            $('.show_main_choose1').css('display', 'block');
        }
        renderGrid(1);
    });
    companyModel.$watch("choose_type", function(newVal) {
        renderGrid(1);
    });
    companyModel.$watch("choose_type1", function(newVal) {
        renderGrid(1);
    });
    A.scan();
    renderGrid(1);
    //异步数据交互
    function renderGrid(page) {
        parm = {
            company: companyModel.com,
            typeo: companyModel.typeo,
            co: companyModel.co,
            quhuan: companyModel.quhuan, //切换待选车/待换车
            select_input: companyModel.select_input, //sad输入框数据
            choose_type: companyModel.choose_type, //断电数据
            choose_type1: companyModel.choose_type1 //待换车
        };
        console.log(parm);

        dataS=[];
        for (var i = 0; i < 10; i++) {
            dataS.push({
                id: i,
                cityid: "北京_" + i,
                carCustomer: "吴彦祖_" + i,
                carHost: i % 4 ? true : false,
                regDate: "15/04/29 13:09",
                orderDate: "15/04/29 13:09",
                getCarDate: "15/04/29 13:09",
                payCarDate: "15/04/29 13:09",
                oldOrder_suc: parseInt(10 + Math.random() * 20),
                oldOrder_fail: parseInt(10 + Math.random() * 20),
                credit: i % 4 ? true : false,
                loginUnit: i + 1,
                carCodeType: "京NSK039",
                carType: "别克GL8 2004",
                boxState: i % 3,
                hitRule: parseInt(10 + Math.random() * 20),
                operate: "",
                ownerID: '230',
                isRelet: i % 3,
                favorite: i % 3 ,
                guanzhuReason: "testreason",
                quxiaoguanzhuReason:"sdasdadsasdsadas"
            })
        }
        A.vmodels.sg2.render(dataS);
    }

    //异步数据交互
    function altWarnData(number) {
        var dataS1 = [];
        for (var i = 0; i < number; i++) {
            dataS1.push({
                id: i + 1,
                yujingDate: "15/05/29 09:13",
                yujingRule: "四年以内新车" + i
            })
        }
        return dataS1;
    }

    //异步数据交互
    function altmzgzData(number) {
        var dataSmzgz = [];
        for (var i = 0; i < number; i++) {
            dataSmzgz.push({
                id: i + 1,
                yujingDate: "15/05/29 09:13",
                yujingRule: "四年以内新车命名规则" + i
            })
        }
        return dataSmzgz;
    }

    //异步数据交互
    function altHostoryData(number) {
        var dataS2 = [];
        for (var i = 0; i < number; i++) {
            dataS2.push({
                id: i + 1,
                lishiDate: "15/05/29 09:13",
                lishiRule: "四年以内新车" + i,
                lishiPeop: "赵立安" + i,
                jiechuDate: "1505151121",
                lishiReason: "那非法进阿飞哈卡发放啊哈快发货方那非法进阿飞哈卡发放啊哈快发货方"
            })
        }
        return dataS2;
    }
});
