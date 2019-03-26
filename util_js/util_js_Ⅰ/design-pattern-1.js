/**
 * 设计模式 - 桥接模式
 * 桥接模式的核心在于将抽象部分和它的实现部分分离，使它们都可以独立的变化
 */

// 实现版本一(缺点：每次点击都会创建一个mask div)
var createMask = function () {
    return document.body.appendChild(document.createElement('div'));
}

$('#login_btn').click(function() {
    var mask = createMask();
    mask.show();
})

// 实现版本二(缺点：创建了一个全局变量，不点击登录时就白白创建)
var mask = document.body.appendChild(document.createElement('div'));
$('#login_btn').click(function() {
    mask.show();
})

// 实现版本三(使用了饱汉单例模式，避免了没有点击登录时的不必要创建。但是使用了全局变量)
var mask;
var createMask = function () {
    if (!!mask) {
        return mask;
    } else {
        mask = document.body.appendChild(document.createElement('div'));
    }
};

$('#login_btn').click(function() {
    var mask = createMask();
    mask.show();
})

// 实现版本四(使用闭包避免了全局变量的污染;但是同时存在了两种逻辑：创建和单例化)
var createMask = function () {
    var mask;
    return function () {
        return mask || (mask = document.body.appendChild(document.createElement('div')))
    }
}();

// 实现版本五(桥接模式:创建和单例化分离，满足单一职责设计理念)
var singleton = function (fn) {
    var result;
    return function() {
        return result || (result = fn.apply(this, arguments))
    }
};

var origin = function () {
    return document.body.appendChild(document.createElement('div'));
};

var createMask = singleton(origin);

