var $ = require('jquery');

/**
 * 提示框 组件
 * @type {{loading, alert, confirm, modal}}
 */
var Notification = (function () {
    var loading, alert, confirm, modal, tips, choose;
    /**
     * 加载提示框
     */
    loading = function () {
        var show, hide, loadingCount = 0;
        show = function () {
            if (loadingCount === 1) {
                return;//保证每次只会有一个loading在显示
            }
            loadingCount++;//loading计数加
            var html =
                '<div class="ares_loading">' +
                '   <div class="loading black refresh">' +
                '       <span class="top"></span>' +
                '       <span class="right"></span>' +
                '       <span class="bottom"></span>' +
                '       <span class="left"></span>' +
                '   </div>' +
                '</div>';
            var loading = $(html);
            $(document.body).append(loading);
        };
        hide = function () {
            if (loadingCount === 1) {
                $('.ares_loading').remove();
            }
            loadingCount = 0;
        };

        return {
            show: show,
            hide: hide,
        };
    }();

    /**
     * 对话提示框
     */
    alert = function () {
        var show, hide, alertState = false;

        /**
         * 显示 alert
         *
         * @param {String} content 提示内容
         * @param {String} title 提示标题
         * @param success 确定回调函数
         */
        show = function (content, title, success) {
            if (alertState) {
                return;
            }
            title = (title == undefined || title == null) ? '系统提示' : title;
            content = (content == undefined ? ' ' : content);
            var html =
                '<div class="ares_msg_box">' +
                '   <div class="message animated zoomIn">' +
                '       <div class="msg_title">' + title + '</div>' +
                '       <div class="msg_content">' + content + '</div>' +
                '       <div class="msg_button">' +
                '           <button class="btn btn-sure">确 定</button>' +
                '       </div>' +
                '   </div>' +
                '</div>';

            var alert = $(html);
            $(document.body).append(alert);
            alertState = true;
            alert.on('click', '.btn-sure', function () {
                if (success) {//成功回调函数
                    success();
                }
                alert.remove();
                alertState = false;
            });
        };

        /**
         * 隐藏 alert
         */
        hide = function () {
            alertState = false;
            $('.ares_msg_box').remove();
        };
        return {
            show: show,
            hide: hide,
        };
    }();

    /**
     * 确认提示框
     */
    confirm = function () {
        var show, hide;

        /**
         * 显示 confirm
         *
         * @param {String} content 提示内容
         * @param {String} title 提示标题
         * @param success 确定回调函数
         * @param cancel 取消回调函数
         */
        show = function (content, title, success, cancel) {
            title = (title == undefined || title == null) ? '系统提示' : title;
            content = content == undefined ? ' ' : content;

            var html =
                '<div class="ares_msg_box">' +
                '   <div class="message">' +
                '       <div class="msg_title">' + title + '</div>' +
                '       <div class="msg_content">' + content + '</div>' +
                '       <div class="msg_button">' +
                '           <span class="btn-groups btn-groups-cancel">' +
                '               <button class="btn btn-cancel">取 消</button>' +
                '           </span>' +
                '           <span class="btn-groups">' +
                '               <button class="btn btn-sure">确 定</button>' +
                '           </span>' +
                '   </div>' +
                '</div>';

            var confirm = $(html);
            $(document.body).append(confirm);
            confirm.on('click', '.btn-sure', function () {
                if (success) {//成功回调函数
                    success();
                }
                confirm.remove();
            }).on('click', '.btn-cancel', function () {
                if (cancel) {//失败回调函数
                    cancel();
                }
                confirm.remove();
            });
        };
        hide = function () {
            $('.ares_msg_box').remove();
        };
        return {
            show: show,
            hide: hide
        };
    }();

    /**
     * 模态框
     * @returns {{show: Function, hide: Function}}
     */
    modal = function () {
        var show, hide;

        /**
         * 显示 modal
         *
         * @param content modal中需要显示的内容
         * @param canClose 是否可以关闭
         */
        show = function (content, canClose) {
            var i = '';
            canClose = (canClose != undefined);

            if (canClose) {
                i = '<button type="button" class="close">&times;</button>';
            }

            const html =
                '<div class="ares_msg_box">' +
                '   <div class="message">' + i + '</div>' +
                '</div>';

            var modal = $(html);
            modal.children().append(content);
            $(document.body).append(modal);
            if (canClose) {
                modal.on('tap', '.close', function () {
                    modal.remove();
                });
            }
        };
        hide = function () {
            $('.ares_msg_box').remove();
        };
        return {
            show: show,
            hide: hide
        }
    };

    /**
     * 提示框
     */
    tips = function () {
        var warning, fail, success;
        /**
         * 显示 tips
         *
         * @param {String} content 提示内容
         * @param success 确定回调函数
         */
        warning = function (content, success) {
            content = (!content ? 'unknown tips.' : content);
            if (Ares.Config.debug) {
                Notification.alert.show(content);
                return;
            }
            var params = ['warning', content];
            Ares.JSBridge.callHandler('AresNoticeTipsPlugin', params, success);
        };
        return {
            warning: warning
            //,fail: fail
            //,success: success
        };
    }();

    /**
     * 弹出选择框
     */
    choose = function () {
        var show, hide, alertState = false;

        /**
         * @param title 提示信息
         * @param chooseArray   操作选项,格式[{label:"",onPress:function(){}}]
         */
        show = function (title, chooseArray) {
            if (alertState) {
                return;
            }
            var chooseBtn = "";
            $.each(chooseArray, function (index, item) {
                console.log(item);
                chooseBtn += '<div class="msg_button"><button class="btn btn-choose" data-name="'+index+'">' + item.label + '</button></div>'
            });
            title = (title == undefined || title == null) ? '请选择' : title;
            var html =
                '<div class="ares_msg_box">' +
                '   <div class="message animated zoomIn">' +
                '       <div class="msg_title">' + title + '</div>' +
                chooseBtn +
                '       <div class="msg_button">' +
                '           <button class="btn btn-sure">取 消</button>' +
                '       </div>' +
                '   </div>' +
                '</div>';

            var alert = $(html);
            $(document.body).append(alert);
            alertState = true;
            alert.on('click','.btn-choose',function () {
                alert.remove();
                alertState = false;
                chooseArray[parseInt($(this).attr("data-name"))].onPress();
            });
            alert.on('click', '.btn-sure', function () {
                alert.remove();
                alertState = false;
            });
        };

        /**
         * 隐藏 alert
         */
        hide = function () {
            alertState = false;
            $('.ares_msg_box').remove();
        };
        return {
            show: show,
            hide: hide,
        };
    }();

    return {
        loading: loading,
        alert: alert,
        confirm: confirm,
        modal: modal,
        tips: tips,
        choose: choose
    }
})();

module.exports = Notification;
