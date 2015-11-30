//系统配置
sysConfig = {
    defaultPage: "/views/home.html",
    viewPath:"/views",
    signinUrl:"/",
    jsTracking: true,
    isDebug: true,
    pageSize:15,
}

FConfig={
    isTab:true,
    offsetT:130,
    offsetL:200,
    iframeH:800,
    iframeHtml:'<div class="divFrame"><iframe id="bjiframe{0}" class="divFramePage" style="width:100%; height:{1}px;" src="{2}"></iframe></div>'
}

if(typeof seajs !== 'undefined' && seajs &&  seajs.config){
    if (sysConfig.isDebug ){
        seajs.config({ map: [["/src/","/debug/"]]})
    }else{
        sysConfig.viewPath="";
    }

    seajs.config({        
        paths: {"A":"/js"},// 路径配置
    });
}