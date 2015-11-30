//@description avalon.ui.tree组件编辑功能扩展，包括增删改节点
//define(["avalon", "./avalon.tree", "text!./avalon.tree.check.html"], function(avalon, tree, check_html) {
define(function(require) {
    require("A-tree-check");
    if (!window.avalon) {
        console.error("此验证框架依赖于avalon框架。请先引入 avalon 框架");
        return false;
    }

    avalon = window.avalon;
    if (sysConfig.jsTracking) avalon.log('seajs-Tracking："tree.droptree --- 下拉选择树"'); //
    require("A-tree-droptree-css");

    var template = require("text!../libs/model/avalon.tree.droptree.html");

    var tempId = new Date() - 0,
        // 表格视图结构
        userAgent = (window.navigator.userAgent || '').toLowerCase(),
        positionAbsolute = userAgent.indexOf('msie 6') !== -1 || userAgent.indexOf('msie 7') !== -1,
        remptyfn = /^function\s+\w*\s*\([^)]*\)\s*{\s*}$/m;
    // 页面在排序的时候不用更新排序icon的状态为ndb，但如果是重新渲染数据的话重置icon状态为ndb

    var widget = avalon.ui.droptree = function(element, data, vmodels) {
        var options = data.droptreeOptions,
            $element = avalon(element),
            vmId = data.droptreeId,
            ctrid = "dtCTR" + data.droptreeId;

        var treedata = doTreeData(options.nodes, options.chkLeaf, options.chkIds);
        options.selNodes = treedata.chkNodes;
        options.count = treedata.chkNodes.length;
        options.droptree = {
            children: treedata.nodes,
            view: {
                showIcon: false,
                dblClickExpand: true,
            },
            data: {
                simpleData: {
                    enable: true,
                    pIdKey: "pid"
                }
            }
        }

        if (options.multiple) {
            options.droptree.check = {
                enable: true,
                chkboxType: {
                    "Y": "",
                    "N": ""
                }
            }
        }

        options.template = options.getTemplate(template, options);
        var vmodel = avalon.define(vmId, function(vm) {
            options.droptree.callback = {
                onClick: function(arg) {
                    var node = arg.leaf;
                    if (options.checkleaf && node.isParent)
                        avalon.log("isParentselect");
                    else {
                        if (options.multiple) {} else {
                            vm.selNodes = [node];
                        }
                    }
                },
                onCheck: function(arg) {
                    var node = arg.leaf;
                    if (options.multiple) {
                        var nodes = arg.vm.getCheckedNodes();
                        vm.selNodes = [];
                        for (var i = 0, j = nodes.length; i < j; i++) {
                            if (options.chkLeaf && nodes[i].isParent) {
                                console.log(nodes[i].name);
                            } else {
                                vm.selNodes.push(nodes[i]);
                            }
                        };
                    }
                }
            }

            avalon.mix(vm, options);
            vm.showtoggle = false;
            vm.treeId = "droptree" + vmId;

            vm._delNode = function(e) {
                var obj = avalon(e.target);
            }

            vm._toggle = function(e) {
                vm.showtoggle = !vm.showtoggle;
            };
            vm._listleave = function() {
                vm.showtoggle = false;
            };
            vm.getSelected = function() {
                var nodes = vm.selNodes;
                var ids = [];
                for (var i = 0, j = nodes.length; i < j; i++) {
                    if (options.chkLeaf && nodes[i].isParent) {

                    } else {
                        ids.push(nodes[i].id);
                    }
                };
                return ids
            }
            vm.$remove = function() {}
            vm.render = function(data, init, noShowLoading) {
                console.log("render");
            };
            // @config 绑定组件的元素引用
            vm.widgetElement = element
            vm.$init = function() {
                options.template = options.template.replace('MS_DROPTREE_TREE_ID', vm.treeId); //.replace('MS_DROPTREE_CTR',ctrid);
                var dropdownHTML = avalon.parseHTML(options.template)
                element.appendChild(dropdownHTML)
                var $objtree = avalon(document.getElementById(vm.treeId));
                $objtree.attr('ms-widget', ['tree', "droptree-" + vmId, 'droptree'].join())

                avalon.scan(element, [vmodel].concat(vmodels))
            }
        });
        return vmodel;
    }

    function doTreeData(treeNodes, chkleaf, chkIds) {
        var data = {
            nodes: [],
            chkNodes: []
        };
        var hasCHK = chkIds && chkIds.length > 0;
        for (var i = 0, j = treeNodes.length; i < j; i++) {
            if (chkleaf && treeNodes[i].isParent) treeNodes[i]["nocheck"] = true; // 处理只选择子节点

            if (hasCHK) // 这个最后处理
            {
                for (var k = 0, l = chkIds.length; k < l; k++) {
                    if (chkIds[k] == treeNodes[i].id) {
                        treeNodes[i].checked = true;
                        data.chkNodes.push(treeNodes[i]);
                        break;
                    }
                }
            }

            data.nodes.push(treeNodes[i]);
        };
        return data
    }

    widget.defaults = {
        container: '',
        // element | id
        autoResize: true,
        data: [],
        columns: [],
        allChecked: true,
        noResult: '\u6682\u65F6\u6CA1\u6709\u6570\u636E',
        isAffix: false,
        affixHeight: 0,
        selectable: false,
        getTemplate: function(str, options) {
            return str;
        }
    };
    return avalon;
})
