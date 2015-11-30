define(function(require) {
    var A = require("A");   

    var model = A.define({
        $id: "includepublic",
        header:"/views/public/header.htm",
        footer: "/views/public/footer.htm"
    })

   
    FConfig.iframeH=document.documentElement.clientHeight-FConfig.offsetT+(FConfig.isTab?0:40)

    require("A-tree-menu");
    require("A-tab");

    var zNodes =[
        { id:1, pid:0, name:"权限系统功能菜单",open:true},
        { id:2, pid:1, name:"测试页面-1", gourl:"/public/test/page1.html"},
        { id:3, pid:1, name:"测试页面-2", gourl:"/public/test/page2.html"},
        { id:7, pid:1, name:"测试字页面"},
        { id:70, pid:7, name:"测试页面-3",gourl:"/public/test/page3.html"},
        { id:701, pid:70, name:"3级页面",gourl:"/public/test/page3.html"},
        { id:71, pid:7, name:"测试页面-4",gourl:"/public/test/page4.html"},
        { id:72, pid:7, name:"测试页面-5",gourl:"/public/test/page5.html"},
        { id:8, pid:1, name:"测试页面-6",gourl:"/public/test/page6.html"},
        { id:81, pid:8, name:"测试页面-66",gourl:"/public/test/page6.html"},
        { id:54, pid:5, name:"点击日志"}
    ];
        
    A.define("pagebody", function(vm) {
        vm.tree =  A.mix(true, {}, avalon.treeMenu, {
            children: zNodes, 
            data: {
                simpleData: {
                    enable: true,
                    pIdKey: "pid"
                }
            },
            view:{
                showIcon:false
            },
            onInit:function(vm){},
            callback: {           
                beforeClick:function(arg){
                    var node = arg.leaf;
                    if(node.isParent) node.open =!node.open;
                    if(!node.gourl) return false;
                    return true;
                },
                onClick: function(arg){
                    var node = arg.leaf;
                    FConfig.isTab? openTab(node.id,node.name,node.gourl,true):openTab(1,"首页",node.gourl,true)
                }
            }
        });

      
       
        vm.tab = {
            onInit:function(vmodel, options, vmodels){
                if(!FConfig.isTab){
                    document.body.getElementsByClassName("oni-tab-slider")[0].style.display="none";
                }
            },            
            onActivate: function(event, vmode) {
                vm.setTree(vmode.tabs[vmode.active].id);
            },
            onClickActive: function(event, vmode) {
                vm.setTree(vmode.tabs[vmode.active].id);
            },
            onRemove: function(vmode) {
                vm.setTree(vmode.tabs[vmode.active].id);
            },
            target:"_self",
            event:"click",
            active: 0,
            tabs: [{id:1,title: "首页",removable: false}],
            tabpanels: [{content:FConfig.iframeHtml.Format(1,FConfig.iframeH,sysConfig.defaultPage) }]
        };

        vm.setTree=function(id){
            var tree = avalon.vmodels.menutree;
            var leaf = tree.getNodeByParam("id",parseInt(id));
            if(leaf.length>0)tree.selectNode(leaf[0]);
        };
        vm.$skipArray = ["menutree","tab"]
    })
    A.scan(); 
})
