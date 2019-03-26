/**
 * 应用场景：移动营销业务数据缓存
 *
 * 存储范围：
 * 1.目前暂定包含form表单元素的value值，非表单元素的text,图片录音资源(img,audio,video)的src
 * 2.支持手动传参json,非传参json情况下第一条为默认方案
 * 3.默认方案存取的dom,在html标签必须附加data-key属性
 * 4.data-key属性应避免重复,区分便于存取
 *
 * 介于图片录音资源(img,audio,video)src基于base64转码显示，暂存数据的值实为一串字符串string
 *
 * 输出内容：该API暴露了4个方法: save(存储) 和 get(获取) 和getCacheList(获取缓存数据列表) 以及render(渲染dom)
 *
 * 实现思路：
 * 1.通过业务模块的url,获取相应的缓存标识ID（唯一,暂定为cacheID）
 * 2.缓存标识ID(cacheID)只用于和原生交互，并不作为真实数据
 * 3.通过缓存标识ID(cacheID)基于jsBridge和原生交互，进而进行存(save)取(get)数据
 * 4.该插件只提供API，缓存数据存储(save)、获取(get)、删除(delete)和dom渲染(render)在业务模块手动调用
 *
 * 实例Demo:
 * cache.save(cacheID,data,{},callback); //存取业务模块缓存数据
 * var data = cache.get(cacheID,callback); //通过缓存标识ID获取缓存数据,并指定成功失败回调
 * var data = cache.getCacheList(callback); //获取缓存列表数据
 * cache.render(data,callback); //渲染业务页面dom
 *
 * author: wangyonghui(wangyonghui@yitong.com.cn)
 * time: 2015-11-19
 */

'use strict';

var $ = require('jquery');
var JSBridge = require('ares.jsbridge.js');

/*
 * function
 * 获取节点名称tagName
 * */
var _getTagName = function(name){
    return name.tagName.toLowerCase();
};


/*
 * function
 * 获取节点类型type
 * */

var _getNodeType = function(name){
    return name.type.toLowerCase();
};

/**
 * 获取节点数据，便于草稿箱缓存
 * @returns {{}}
 * @private
 */
var _getNodeData = function (data) {
    /*
     * 传参string节点
     * 缓存该节点下的所有带有data-key的子节点的数据
     * 未传任何参数,缓存document.body下所有子节点数据
     * 存储的缓存节点为真实有效的数据节点,提升性能
     * */
    var _data = {},parent = document.body;

    if(data && typeof data == "string") {
        parent = document.getElementById(data);
    }

    var children = $("[data-key]",$(parent));

    $.each(children,function(i,v){

        if (_getTagName(v) == "img" || _getTagName(v) == "audio" || _getTagName(v) == "video") {
            /*
             * 资源型数据(src）
             * 资源型数据存储的值应该是一个对象体而非标量
             * 原因是需要额外的信息方便查找
             * 此处新增的id属性是为了图片资源上传提供图片标识
             * */
            if($(v).attr("src")) {
                _data[$(v).data("key")] = {
                    src :  v.src,
                    id : $(v).data("id")
                };
            }
        } else if (_getTagName(v) == "input" || _getTagName(v) == "select" || _getTagName(v) == "textarea") {
            //特殊表单元素
            if (_getNodeType(v) == "radio" || _getNodeType(v) == "checkbox") {
                if(v.checked){
                    _data[$(v).data("key")] = "checked";
                }
            }  else if(v.value) {//普通表单元素
                _data[$(v).data("key")] = v.value;
            }

        } else {
            //普通节点html span等(text）
            if($(v).text().trim()) {
                _data[$(v).data("key")] = v.innerText;
            }
        }
    });


    return _data;
};

/*
 * 元数据处理
 * setMetaData为业务模块自行传参
 * setMetaData不传参,元数据metaData默认值为空
 * */
var _getMetaData = function (setMetaData) {

    var metaData = {};

    if(setMetaData) {
        switch (typeof setMetaData) {
            case "object" :
                if($.isPlainObject(setMetaData)) {
                    metaData = setMetaData;
                }
                break;

            case "function" :
                metaData = setMetaData();
                break;
        }
    }

    return metaData;
}

var Cache = function () {
    /*
     * function
     * 存储缓存数据
     * cacheID在业务模块调用Ares.uuid.get()方法生成
     * 缓存json数据类型,data传参json对象
     * 缓存某个节点下的所有带有data-key属性的节点,data传父节点ID
     * 缓存页面所有带有data-key的数据,data传参null
     * setMetaData用以生成元数据关联缓存数据,方便数据库查找
     * setMetaData传递参数为json或者function运行生成的的json
     * setMetaData做为元数据通过key(这里的cacheID)关联缓存数据
     * */
    var _save = function(cacheID,data,photosData,setMetaData,callback){
        //metaData元数据[关联缓存数据]
        var metaData = _getMetaData(setMetaData);
        //调用插件保存
        JSBridge.callHandler("AresCachePlugin",["save",{key:cacheID},{data: $.extend(metaData,photosData)}],callback);
    };

    /*
     * function
     * 获取缓存
     * 通过缓存标识cacheID获取缓存数据
     * 如果缓存表示为空,默认通过url获取缓存标识cacheID
     * */
    var _get = function(cacheID,callback){
        var _cacheID = cacheID ? cacheID : _getDatabyUrl("cacheID");
        if(_cacheID) {
            JSBridge.callHandler("AresCachePlugin",["query",{key:cacheID}],callback);
        }
    };


    /*
     * function
     * 删除缓存
     * */
    var _delete = function(cacheID,callback){
        if(!cacheID){
            console.log('请传入正确的key');
            return;
        }
        JSBridge.callHandler("AresCachePlugin",["deleteData",{key:cacheID}],callback);
    };


    /*
     * function
     * 获取缓存列表数据
     * */
    var _getCacheList = function(data,callback){
        JSBridge.callHandler("AresCachePlugin",["queryList",{data:data}],callback);
    };


    /*
     * function
     * 获取数据后渲染dom
     * callback回调函数
     * callback应用场景为初始页面并不存在这类dom需要动态生成dom
     * 上述场景callback进行特殊处理,动态生成dom插入html节点
     * */
    var _render = function(data,callback){

        if(!data) {
            console.info("缓存数据不存在或者数据类型有误");
            return;
        }

        var _data = $.isPlainObject(data) ? data : JSON.parse(data);

        $.each(_data,function(i,v){
            var dom = $("[data-key="+ i +"]").get(0);
            if(dom){
                switch (_getTagName(dom)) {
                    case "input":
                        if (_getNodeType(dom) == "radio" || _getNodeType(dom) == "checkbox") { //单选框或者多选框
                            dom.checked = v;
                        } else { //普通表单元素
                            dom.value = v;
                        }
                        break;

                    case "select":
                        dom.value = v;
                        break;

                    case "textarea":
                        dom.value = v;
                        break;

                    case "img":
                        dom.src = v.src;
                        $(dom).attr("data-id",v.id);
                        break;

                    case "audio":
                        dom.src = v.src;
                        $(dom).attr("data-id",v.id);
                        break;

                    case  "video":
                        dom.src = v.src;
                        $(dom).attr("data-id",v.id);
                        break;

                    default : //默认节点如div span
                        dom.innerText = v;
                        break;
                }
            }
        });

        typeof callback == "function" && callback(_data);
    };


    /*
     * function
     * 通过url获取所需参数
     * */
    var _getDatabyUrl = function(name){
        var reg = new RegExp("[?&]" + name + "=([^=&]+)"),
            hash = location.href,
            match = hash.match(reg);

        return match && match.length > 1 ? match[1] : '';
    };

    /*
     * function
     * 存储DraftBox缓存数据
     * cacheID在业务模块身份证-业务类型方法生成
     * 缓存json数据类型,data传参json对象
     * 缓存某个节点下的所有带有data-key属性的节点,data传父节点ID
     * 缓存页面所有带有data-key的数据,data传参null
     * */
    var _saveDraftBox = function(dBoxID,data,callback){
        //获取节点数据，便于草稿箱缓存
        var _data = _getNodeData(data);
        //调用插件
        JSBridge.callHandler("AresDraftBoxCachePlugin",["save",{key:dBoxID},{data: _data}],callback);
    };

    /*
     * function
     * 获取DraftBox缓存
     * 通过缓存标识cacheID获取缓存数据
     * 如果缓存表示为空,默认通过url获取缓存标识cacheID
     * */
    var _getDraftBox = function(cacheID,callback){
        var _cacheID = cacheID ? cacheID : _getDatabyUrl("cacheID");
        if(_cacheID) {
            JSBridge.callHandler("AresDraftBoxCachePlugin",["query",{key:cacheID}],callback);
        }
    };

    /*
     * function
     * 删除DraftBox缓存
     * */
    var _deleteDraftBox = function(cacheID,callback){
        if(!cacheID){
            console.log('请传入正确的key');
            return;
        }
        JSBridge.callHandler("AresDraftBoxCachePlugin",["deleteData",{key:cacheID}],callback);
    };

    /*
     * function
     * 获取DraftBox缓存列表数据
     * */
    var _getDraftBoxCacheList = function(data,callback){
        JSBridge.callHandler("AresDraftBoxCachePlugin",["queryList",{data:data}],callback);
    };


    return {
        //==============普通缓存==============
        save : _save, //暴露save方法
        get : _get, //暴露get方法
        delete : _delete, //暴露delete方法
        getCacheList : _getCacheList, //暴露getCacheList方法
        //==============草稿箱缓存==============
        saveDraftBox : _saveDraftBox, //暴露save方法
        getDraftBox : _getDraftBox, //暴露get方法
        deleteDraftBox : _deleteDraftBox, //暴露delete方法
        getDraftBoxCacheList : _getDraftBoxCacheList, //暴露getCacheList方法
        //==============其他相关==============
        getDatabyUrl : _getDatabyUrl, //暴露getDatabyUrl方法
        render : _render //暴露render方法
    }
}();


module.exports = Cache;