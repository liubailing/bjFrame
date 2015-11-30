define(function(require) {

    var A = require("A");
    var $ = require("$");
    var verifytip;
    require("A-verify");
    require("A-dropdown");

    function setopt(data) {
        return {
            listClass: 'bj-oni-dropdown ',
            titleClass: 'bj-oni-dropdown bj-oni-dropdown-sm dropdown-default',
            width: '100%',
            data: data
        }
    }
    var isBeg = true;
    require.async('./querydata', function(dropdata) {
        queryModel = A.define({
            $id: "query_area",
            $skipArray: ["$companyopts", "$jobopts", "$roleopts", "$statusopts"],
            empnum: "",
            username: "liubailing",
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

        A.scan();
        isBeg = false;
    });
    require("A-smartgrid");
    var userlist;

    function getDatasAAA(number) {
        var
            data = []
        for (var i = 0; i < number; i++) {
            data.push({
                name: "shirly" + i,
                userid: parseInt(10 + Math.random() * 20),
                loginname: "登录名" + i,
                username: "姓名" + i,
                company: "公司" + i + "-" + parseInt(10 + Math.random() * 20),
                job: "岗位" + i,
                role: "角色" + i,
                operate: i % 4 ? 1 : 0,
            })
        }
        return data;
    }
    var dataS = []

    function getDatas(number, perpage, currentpage) {
        for (var i = 0; i < number; i++) {
            dataS.push({
                name: "shirly" + i,
                userid: parseInt(10 + Math.random() * 20),
                loginname: "登录名" + i,
                username: "姓名" + i,
                company: "公司" + i + "-" + parseInt(10 + Math.random() * 20),
                job: "岗位" + i,
                role: "角色" + i,
                operate: i % 4 ? 1 : 0,
            })
        }
        return dataS;
    }

    function setData(perpage, currentpage) {
        var data = []
        var startData = (currentpage - 1) * perpage
        var endData = currentpage * perpage
        data = dataS.slice(startData, endData)
        return data;
    }
    userlist = A.define({
        $id: "userlist",
        $skipArray: [""],
        enable: function(index) {
            A.vmodels.sg1.data[index].operate = A.vmodels.sg1.data[index].operate == 0 ? 1 : 0;
            A.vmodels.sg1.render()
        },
        goEdit: function(index, userid) {
            console.log(index, userid)
        },
        opts: {
            selectable: {
                type: "Radio" //为表格添加选中行操作框,可以设置为"Checkbox"或者"Radio"
            },
            pager: {
                showPages: 5,
                // currentPage: 1,
                // totalItems: A.vmodels.sg1.data.length,
                showJumper: true,
                onJump: function(e, pagedata) {
                    //setData()
                    var parm = queryModel.$model;
                    location.href = "#page=" + pagedata.currentPage;
                    console.log(pagedata.currentPage, parm, A.vmodels.sg1.data.length, A.vmodels.sg1.pager.perPages, A.vmodels.sg1.pager);
                    A.vmodels.sg1.data = setData(A.vmodels.sg1.perPages, pagedata.currentPage);
                    A.vmodels.sg1.render()
                },
                canChangePageSize: true,
                perPages: 10,
                options: [10, 20, 50, 100]
            },
            autoResize: true,
            htmlHelper: { // 渲染列数据的方法集合
                // 包装工资列的数据
                actoperate: function(vmId, field, index, cellValue, rowData) {
                    var disabledHtml = '<a class="btn btn-info btn-xs" ms-click="enable(' + index + ')">启用</a>&nbsp;<span class="btn btn-default btn-xs disabled" class="color_gray">编辑</span>'
                    var enabledHtml = '<a class="btn btn-danger btn-xs" ms-click="enable(' + index + ')">停用</a>&nbsp;<span class="btn btn-success btn-xs" ms-click="goEdit(' + index + ',' + rowData.userid + ')">编辑</span>'
                    var actoperateHtml = rowData.operate == 1 ? enabledHtml : disabledHtml;
                    return actoperateHtml
                }
            },
            columns: [{
                key: "userid", //列标识
                name: "员工编号", //列名
                sortable: true, //是否可排序
                isLock: true, //是否锁死列让其始终显示
                align: "left", //列的对象方式
                defaultValue: "shirly", //列的默认值
                customClass: "ddd", //自定义此列单元格类
                toggle: false, //控制列的显示隐藏
                // autoResize: true,
                width: 120 //设置列的宽度
            }, {
                key: "loginname",
                name: "登录名",
                sortable: false,
                width: 100,
                autoResize: false
            }, {
                key: "username",
                name: "姓名",
                sortable: false,
                width: 100,
                autoResize: false
            }, {
                key: "company",
                name: "所属公司",
                sortable: false,
                width: 150,
                autoResize: false
            }, {
                key: "job",
                name: "岗位",
                sortable: true,
                align: "right",
                autoResize: false,
                width: 100
            }, {
                key: "role",
                name: "角色",
                sortable: false,
                align: "right",
                autoResize: false,
                width: 100
            }, {
                key: "act",
                name: "操作",
                defaultValue: "<a>停用</a>&nbsp;&nbsp;<a>编辑</a>",
                width: 100,
                format: "actoperate"
            }],
            onRowSelect: function(rowData, isSelected) {
                if (isSelected) {
                    alert('选择一行的时候回调')
                };
            }
        },
        reRenderData: function(parm) {
            var sg1 = A.vmodels.sg1;
            dataS = [];
            sg1.data = getDatas(50);
            sg1.render()
            console.log(parm, sg1, sg1.perPages)
            sg1.pager.totalItems = sg1.data.length
                // 或者直接通过sg1.render(getDatas(500))重新渲染数据
        },
        clearData: function() {
            var sg1 = A.vmodels.sg1
            sg1.data = []
            sg1.render()
        },
        getSR: function() {
            var sgData = avalon.vmodels.sg1.getSelected()
            var getSelected = []
            for (var i = 0; i < sgData.length; i++) {
                if (sgData[i].selected) {
                    getSelected.push(sgData[i].userid)
                };

            };
            //console.log(getSelected)
        }
    });
    userlist.opts.pager.$watch("perPages", function(a) {
        alert('test');
    })
    A.scan();
})
