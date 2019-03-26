/**
 * 获取 [0, num+] 的随机数
 */
function getRandomNum(num) {
    return Math.floor(Math.random() * (num + 1));
}

/**
 * 获取 [min, max] 的随机数
 */
function getRandomNum(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
}

/**
 * 随机颜色(不支持IE6 7 8) rgba IE9+才支持
 */
function getRandomColor() {
    var r = Math.floor(Math.random() * 256);
    var g = Math.floor(Math.random() * 256);
    var b = Math.floor(Math.random() * 256);

    return "rgb("+ r + "," + g + "," + b +")";
}

/**
 * 随机颜色(支持任意浏览器)
 */
function getRandomColor() {
    var r = getRandomNum(255).toString(16);
    var g = getRandomNum(255).toString(16);
    var b = getRandomNum(255).toString(16);

    return "#" + r + g + b;
}