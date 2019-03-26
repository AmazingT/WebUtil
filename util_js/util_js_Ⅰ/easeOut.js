// 点击返回顶部
var backToTop = function(rate) {
    rate = rate || 2;// 缓动速率
    var doc = document.documentElement || document.body;
    var scrollTop = doc.scrollTop;
    
    var step = function() {
        scrollTop = scrollTop + (0 - scrollTop) / rate;
        
        if (scrollTop < 1) {
            doc.scrollTop = 0;
            return;
        }

        doc.scrollTop = scrollTop;

        requestAnimFrame(step);
    }

    step();
}

// easeOut(先快后慢)函数封装
/**
 * A: 起始位置 B：目标位置 rate: 缓动速率 callback(value位置参数, isEnding是否结束)变化过程中的回调函数
 */
Math.easeOut = function(A, B, rate, callback) {
    if (A == B || typeof(A) != 'number') {
        return;
    }

    B = B || 0;
    rate = rate || 2;

    var step = function() {
        A = A + (B - A) / rate;

        if (A < 1) {
            callback(B, true);
            return;
        }

        callback(A, false);

        requestAnimFrame(step);
    }

    step();
}

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        function(callback) {
            setTimeout(callback, 1000 / 60)
        }
})();