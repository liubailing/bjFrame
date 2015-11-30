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
    template = template.split("MS_OPTION_TEMPLATE");
   
    var widget = avalon.ui.droptree = function(element, data, vmodels) {
        var options = data.droptreeOptions,
            $element = avalon(element),
            vmId = data.droptreeId;
        if(options.showtree)
        {
            options.template = template[1]
        }else
        {
            options.template = template[0]
        }

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
            var chkboxType = {"Y": "","N": ""}
            if(options.chkboxType) chkboxType= options.chkboxType;
            options.droptree.check = {
                enable: true,
                chkboxType:chkboxType
            }
        }

        //options.template = options.getTemplate(template, options);
        var vmodel = avalon.define(vmId, function(vm) {
            options.droptree.callback = {
                beforeClick:function(arg){
                    arg.e.preventDefault();
                    if (options.multiple) return false;
                    var node = arg.leaf;
                    if (options.chkLeaf && node.isParent)  return false;
                    return true;
                },
                onClick: function(arg) {                   
                    var node = arg.leaf;
                    if (options.chkLeaf && node.isParent) return;                 
                    vm.selNodes = [node];
                    if(options.callback && options.callback.onClick){
                        options.callback.onClick(node);
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
            vm.divId = "divdp-" + vmId;
            vm.treeDivId = "treediv-" + vmId;
            vm.treeId = "dtree-" + vmId;
            

            vm._delNode = function(e) {
                var obj = avalon(e.target);
                var id = obj.attr("chkid");
                var tree = avalon.vmodels[vm.treeId];
                var leaf = tree.getNodeByParam("id",parseInt(id));
                if(leaf.length>0)  leaf = leaf[0];
                if(options.multiple){
                     tree.checkNode(leaf,false);
                }else{
                    tree.cancelSelectedNode(leaf);
                }
                e.preventDefault()
            }

            vm._toggle = function(e) {
                vm.showtoggle = !vm.showtoggle;
                e.preventDefault()
            };
            vm._toggle1 = function(e) {
                vm.showtoggle = true;
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
             vm.reset=function(nodes,chkIds) {
                vm.selNodes = [];
                var treedata = doTreeData(nodes, options.chkLeaf, chkIds);
                vm.selNodes = treedata.chkNodes;
                var tree = avalon.vmodels[vm.treeId];
             
                tree.reset(treedata.nodes);
                if(!options.multiple && vm.selNodes.length>0)
                {
                    var id = vm.selNodes[0].id;                
                    var leaf = tree.getNodeByParam("id",parseInt(id));
                    if(leaf.length>0)  
                    {
                        leaf = leaf[0];
                        tree.selectNode(leaf);
                        var path = tree.cVisitor(leaf,function(startLeaf, options){return startLeaf});
                        
                        if(!leaf.isParent) leaf = path[(path.length-1)];
                        tree.expand(leaf,true,false);
                    }
                }
             }
            vm.$remove = function() {}
            vm.render = function(data, init, noShowLoading) {
                console.log("render");
            };
            // @config 绑定组件的元素引用
            vm.widgetElement = element
            vm.$init = function() {
                options.template = options.template.replace('MS_DROPTREE_TREE_ID', vm.treeDivId).replace('MS_DROPTREE_DIV_ID',vm.divId);
                var dropdownHTML = avalon.parseHTML(options.template)
                element.appendChild(dropdownHTML)
                var $objdiv = avalon(document.getElementById(vm.divId));
                var $objtree = avalon(document.getElementById(vm.treeDivId));
                $objtree.css({width:avalon(element).width()-2,top:$objdiv.outerHeight()-1});

                $objtree.attr('ms-widget', ['tree', vm.treeId, 'droptree'].join());
                avalon.scan(element, [vmodel].concat(vmodels))

                if(!options.multiple && vm.selNodes.length>0)
                {
                    var id = vm.selNodes[0].id;
                    var tree = avalon.vmodels[vm.treeId];                 
                    var leaf = tree.getNodeByParam("id",parseInt(id));
                    if(leaf.length>0)  
                    {
                        leaf = leaf[0];
                        tree.selectNode(leaf);
                    }
                }
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
        nodes:[],
        selNodes:[],
        chkLeaf:false,
        multiple:false,
        getTemplate: function(str, options) {
            return str;
        }
    };
    return avalon;
})
