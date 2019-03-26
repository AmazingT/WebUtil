// 防抖函数
function debounce(fn, t) {
    var timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(fn, t);
    }
}

debounce(doSomething, 1000);