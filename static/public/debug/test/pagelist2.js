       define(function(require) {
      
        var A = require("A");
        var $ = require("$");
        var verifytip;
        require("A-verify");
        require("A-dropdown");

        function setopt(data) {
            // data.unshift({value: '-1',label: '请选择'});
            return {
                listClass: 'bj-oni-dropdown ',
                titleClass: 'bj-oni-dropdown bj-oni-dropdown-sm dropdown-default',
                width: '100%',
                data: data
            }
        }
        var isBeg= true;
        require.async('./querydata', function(dropdata) {
            queryModel = A.define({
                $id: "query_area",
                $skipArray: ["$companyopts", "$jobopts", "$roleopts", "$statusopts"],
                empnum: "",
                username: "",
                loginname: "",
                useremail: "",
                userphone: "",
                department: "",
                $departments: setopt(dropdata.departmentopts),
                job: "",
                $jobopts: setopt(dropdata.jobopts),
                role: "",
                $roleopts: setopt(dropdata.roleopts),
                status: "",
                $statusopts: setopt(dropdata.statusopts),
                verifySuccSubmit: function() {
                    var parm = queryModel.$model;
                    console.log(parm);
                    console.log("验证--成功--提交事件操作");
                    userlist.reRenderData(parm)
                },
                verifyFailSubmit: function() {
                    console.log("验证--失败--提交事件操作");
                }
            });
            queryModel.$watch("username", function(a) {
                    alert('test');
            })
            queryModel.$watch("department", function(a) {
                avalon.log(isBeg);
                if(!isBeg){
                    alert('department：' + a);
                }
            })
        });
        require("A-smartgrid");

        var companyModel = A.define({
            $id: "indexList",
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
                // 渲染列数据的方法集合
                htmlHelper: {
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
                    width:80,
                    format: "actoperate"
                }],
                columns: [{
                    key: "favorite",
                    name: "关注",
                    sortable: false,
                    width: "30%",
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
                    width: "30%" //设置列的宽度
                }, {
                    key: "carCustomer",
                    name: "驾客",
                    sortable: false,
                    width: "32%",
                    autoResize: false,
                    format: "actcarCustomer"
                }]
            },
            reRenderData: function(parm) {
                renderGrid(1,1200)
            },
        });
        A.scan();
        renderGrid(1,600);
        //异步数据交互
        function renderGrid(page,pwidth) {
            var dataS=[];
            for (var i = 0; i < 15; i++) {
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
            A.vmodels.sg2.maxGridWidth=pwidth;
            //A.vmodels.sg2.render(dataS);
            A.vmodels.sg2.render(dataS,true,true);
        }
    })