define(function(require, exports, module) {
    var BJPage = function() {
        this.cfg = {
            defaultPage:"dashboard/index.htm",
            subPagesDirectory : "app/",
            headUrl :"public/header.htm",
            footUrl: "public/footer.htm",
            page404 : "error/index.htm",
            headContent : "pageHeader",
            mainContent : "pageMain",
            footContent :"pageFooter"
        };
    }

    module.exports = BJPage;

    var BJPagePrototype = {
        // renderHeader: function() {
        //      return this;
        // },
        // renderBody: function() {
        //      return this;
        // },
        // renderFooter: function() {
        //      return this;
        // },
        // renderUI: function() {
        //     this.boundingBox = $('<div class="bj_page"></div>');
        //     var $boxHeader = $('<div class="bj_page_header"></div>');
        //     var $boxContent = $('<div class="bj_page_content"></div>');
        //     var $boxFooter = $('<div class="bj_page_footer"></div>');

        //     this.boundingBox.append($boxHeader).append($boxContent).append($boxFooter);
        // },
        // bindUI: function() {
        // },
        // syncUI: function() {
        // },
        // destructoy: function() {
        // },
        // init: function(cfg) {
        //     this.cfg = $.extend({}, this.cfg, cfg);
        //     this.render();
        //     return this;
        // }
    }
    //var wid = require("_widget");
    //BJPage.prototype={};
    //BJPage.prototype = $.extend({}, new wid(), BJPagePrototype);
});
