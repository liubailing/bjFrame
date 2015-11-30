define(function(require, exports, moudle) {
    function Widget() {
        this.boundingBox = null;
       
    }

    moudle.exports = Widget;
    Widget.prototype = {
        on: function(type, handler) {
            if (typeof this.handlers[type] == 'undefined') {
                this.handlers[type] = [];
            }
            this.handlers[type].push(handler);
            return this;
        },
        fire: function(type, data) {
            if (this.handlers[type] instanceof Array) {
                var handlers = this.handlers[type];
                for (var i = 0, len = handlers.length; i < len; i++) {
                    handlers[i](data);
                };
            }
        },
        render: function() {
            this.renderUI();
            this.handlers = {};
            this.bindUI();
            this.syncUI();
        },
        destory: function() {
            this.destructoy();
            this.boundingBox.off();
            this.boundingBox.remove();
        },
        renderUI: function() {}, //接口：添加dom节点
        bindUI: function() {}, //接口：监听事件
        syncUI: function() {}, //接口：初始化组件属性
        destructoy: function() {} //接口：销毁前处理函数
    }
})
