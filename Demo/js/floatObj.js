// 解决js浮点数运算精度丢失问题
var floatObj = {
    // 判断是否为整数
    isInteger: function(obj) {
        return Math.floor(obj) === obj;
    },
    /**
     * 将一个浮点数转为整数
     * @param floatNum {number} 小数
     * @return {object} {times: 100, num 314} 3.14 >> 314
     */
    toInteger: function(floatNum) {
        var ret = {times: 1, num: 0};
        if (this.isInteger(floatNum)) {
            ret.num = floatNum;
            return ret;
        }
        var strfi = floatNum + '';
        var dotPos = strfi.indexOf('.');
        var len = strfi.substr(dotPos + 1).length;
        var times = Math.pow(10, len);
        // 0.29 * 100 = 28.999999999999996部分值比原值小
        var intNum = parseInt(floatNum * times + 0.5, 10);
        ret.times = times;
        ret.num = intNum;
        
        return ret;
    },
    /**
     * 实现加减乘除 小数化为整数 再缩小为小数
     */
    operation: function(a,b,op) {
        var o1 = this.toInteger(a);
        var o2 = this.toInteger(b);
        var n1 = o1.num;
        var n2 = o2.num;

        var t1 = o1.times;
        var t2 = o2.times;

        var max = t1 > t2 ? t1 : t2;
        var result = null;

        switch(op) {
            case 'add':
                if (t1 === t2) {// 两个小数位数相同
                    result = n1 + n2;
                } else if(t1 > t2) {// 0.12 + 0.1 = 0.22
                    result = n1 + n2 * (t1 / t2);// 12 + 1 * (100 / 10) = 22
                } else {
                    result = n1 * (t2 / t1) + n2;
                }
                return result / max;
            case 'subtract':
                if (t1 === t2) {
                    result = n1 - n2;
                } else if(t1 > t2) {
                    result = n1 - n2 * (t1 / t2);
                } else {
                    result = n1 * (t2 / t1) - n2;
                }
                return result / max;
            case 'multiply':
                result = (n1 * n2) / (t1 * t2);
                return result;
            case 'divide':// 0.29 / 10
                result = (n1 / n2) * (t2 / t1);// 29 / 10 * 1 / 100
                return result;
            default:
                return;
        }
    },
    add: function(a, b) {
        return this.operation(a, b, 'add');
    },
    subtract: function(a, b) {
        return this.operation(a, b, 'subtract');
    },
    multiply: function(a, b) {
        return this.operation(a, b, 'multiply');
    },
    divide: function(a, b) {
        return this.operation(a, b, 'divide');
    }
};