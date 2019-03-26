function debounce(fn, t1, t2) {
    var timer = null, 
        startTime = new Date();

    return function () {
        var _this = this,
            args = arguments,
            currentTime = new Date();
        
        clearTimeout(timer);
        if (currentTime - startTime >= t2) {
            fn.applay(_this, args);
            startTime = currentTime;
        } else {
            timer = setTimeout(fn, t1);
        }
    }
}