define(function(require, exports, module) {
    //seajs.use("bjtipcss2");
    var $ = require("$");

    function BJWin() {
        this.cfg = {};
    }

    module.exports = BJWin;

    var BJWinprototype = {
        _getcfg: function(_class, domid) {
            var set = {
                target: null,
                className: null,
                width: 300,
                height: null,
                left: null,
                top: null,
                mask: false,
                maskHide: true,
                show: true,
                showSelf: false,
                showTime: 0,
                txt: "",
                _domExite: false,
                _class: "",
                _id: ""
            }
            if (_class) set._class = "bj_" + _class;
            if (domid) set._id = set._class + "_" + domid;
            else set._id = set._class;
            set._domExite = $("#" + set._id).length > 0;
            return set;
        },
        renderUI: function() {
            this.boundingBox = $('<div id= "' + this.cfg._id + '"class="bj_tip ' + (this.cfg._class) + '"></div>');

            var $boxContent = $('<div class="bj_tip_content">' + this.cfg.txt + '</div>');
            if (this.cfg._class == "bj_alert") {
                var $boxTitle = $('<div class="bj_tip_title"></div>');
                var $boxFooder = $('<div class="bj_tip_fooder"></div>');
                $boxFooder.html('<div class="bj_tip_cancle">确定</div>')
                $boxTitle.html('<div class="bj_tip_close">×</div>');
                this.boundingBox.append($boxTitle).append($boxContent).append($boxFooder);
            } else {
                this.boundingBox.append($boxContent);
            }

            if (this.cfg.mask) {
                this.mask = $('<div class="bj_mask"></div>');
                this.mask.appendTo(document.body);
            }
        },
        bindUI: function() {
            var that = this;
            this.boundingBox.find('.bj_tip_close').bind("click", function() {
                that.fire("close");
                that.destory();
            });

            this.boundingBox.delegate('.bj_tip_cancle', 'click', function(event) {
                that.fire("close");
                that.destory();
            });

            if (this.cfg.mask && this.cfg.maskHide) {
                this.mask.bind("click", function() {
                    that.fire("close");
                    that.destory();
                });
            }
        },
        syncUI: function() {
            this.boundingBox.css({
                width: this.cfg.width,
                height: this.cfg.height,
                left: (this.cfg.left || (window.innerWidth - this.cfg.width) / 2),
                top: (this.cfg.top || (window.innerHeight - this.boundingBox.outerHeight()) / 2)
            });

            if (this.boundingBox.className) this.boundingBox.addClass(this.boundingBox.className);

        },
        destructoy: function() {
            this.mask && $(".bj_mask").remove();
        },
        alert: function(cfg) {
            this.cfg = $.extend(this._getcfg("alert"), cfg, {
                mask: true
            });
            if (this.cfg._domExite) {
                this.boundingBox = $("#" + this.cfg._id);
                this.boundingBox.find(".bj_tip_content").html(this.cfg.txt);
            } else {
                this.render();
                $(document.body).append(this.boundingBox);
                this.syncUI()
            }
            return this;
        },
        warn: function(cfg) {
            this.cfg = $.extend(this._getcfg("warn"), cfg);
            if (this.cfg._domExite) {
                this.boundingBox = $("#" + this.cfg._id);
                this.boundingBox.find(".bj_tip_content").html(this.cfg.txt);
            } else {
                if (this.cfg.target && $(this.cfg.target).length > 0) {
                    var obj = $(this.cfg.target);
                    this.cfg.left = this.cfg.left + obj.offset().left;
                    this.cfg.top = (this.cfg.top > 0 ? this.cfg.top : obj.outerHeight()) + obj.offset().top;
                }
                this.render();
            }

            if (!this.cfg._domExite) $(document.body).append(this.boundingBox);
            if (this.cfg.showTime > 0) {
                this.boundingBox.fadeIn(200).delay(1200).fadeOut(200);
            }
            return this;
        },
        verify: function(obj, cfg) {
            obj = $(obj);

            if(obj.prop("type") === "radio") return false;
            if (obj && obj.length !== 1 && obj[0].id) {
                console.error("注意：验证提示对象必须具有唯一性。此验证提示的对象不明确！");
            }

            // if (cfg.state == "onError") {
            //     obj.removeClass('verify_success').addClass('verify_error')
            // } else if (cfg.state == "onReset") {
            //     obj.removeClass('verify_success').removeClass('verify_error')
            // } else {
            //     obj.removeClass('verify_error').addClass('verify_success')
            // }

            this.cfg = $.extend(this._getcfg("verify", obj[0].id), cfg);

            if (this.cfg._domExite) {
                this.boundingBox = $("#" + this.cfg._id);
                this.boundingBox.find(".bj_tip_content").html(this.cfg.txt);
            } else {
                this.renderUI();
                this.cfg.top = (this.cfg.top > 0 ? this.cfg.top : obj.outerHeight());
                this.boundingBox.css({
                    "display": "none",
                    width: obj.outerWidth(),
                    height: "auto",
                    left: this.cfg.left,
                    top: this.cfg.top
                });
                obj.after(this.boundingBox);
            }

            if (this.cfg.state == "onSuccess" && this.boundingBox.hasClass('bj_verify_succ')) return this;

            this.boundingBox.removeClass("bj_verify_reset").removeClass('bj_verify_error').removeClass('bj_verify_succ');
            if (this.cfg.state == "onError") {
                this.boundingBox.addClass('bj_verify_error').show();
            } else if (this.cfg.state == "onReset") {
                this.boundingBox.addClass('bj_verify_reset').show();
                //$(".bj_verify_error").fadeOut();
            } else if (this.cfg.state == "onSuccess") {
                this.boundingBox.addClass('bj_verify_succ').show(100).delay(1200).fadeOut(200);
            }
            this.boundingBox.show();
            //if(this.boundingBox.hasClass('bj_verify'))this.boundingBox.show(100).delay(1200).fadeOut(200);
            return this;
        }
    }
    var wid = require("W");
    BJWin.prototype = $.extend({}, new wid(), BJWinprototype);
});