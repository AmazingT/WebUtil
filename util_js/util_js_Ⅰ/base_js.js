/**
 * 基本的JavaScript知识
 */

// 1、使用typeof bar === 'object'来确定bar是否是对象的潜在陷阱是什么？如何避免？
// 陷阱：null被认为是对象！
var bar = null;
console.log(typeof bar === 'object'); // true
// 解决：先判断是否不是null
console.log((bar !== null) && (typeof bar === 'object')); // false
// 函数也要返回true时
console.log((bar !== null) && ((typeof bar === 'object') || (typeof bar === 'function')));

// 2、下面代码输出什么？
(function () {
    var a = b = 3;// 严格模式下会报错(b is not defined)
})();
console.log(a, b);// undefined 3
// 解决：实际赋值相当于 b = 3; var a = b; b没有var声明故是全局变量而a是函数作用域内的局部变量
// b：全局变量在函数作用域外访问时值为3; a: 局部变量在函数作用域外访问时为undefined

// 3、下面代码输出什么？
var myObject = {
    foo: "bar",
    func: function () {
        var self = this;
        console.log("outer func: this.foo = " + this.foo);// bar
        console.log("outer func: self.foo = " + self.foo);// bar
        (function () {
            // 内部函数中,this不再指向 myObject
            console.log("inner func: this.foo = " + this.foo);// undefined
            console.log("inner func: self.foo = " + self.foo);// bar
        })();
    }
};

myObject.func();

// 4、封装JavaScript源文件的全部内容到一个函数块有什么意义及理由？
/**
 * 创建了一个私有的命名空间，从而有助于避免不同JavaScript模块和库之间潜在的名称冲突。
 */

// 5、在JavaScript源文件的开头包含 use strict 有什么意义和好处？
/**
 * 在JavaScript代码运行时自动实行更严格解析和错误处理的方法。那些被忽略或默默失败了的代码错误，会产生错误或抛出异常。
 * 使调试更加容易。防止意外的全局变量(未声明的变量)。
 * 消除 this 强制(如果没有严格模式，引用null或未定义的值到 this 值会自动强制到全局变量。)。
 * 不允许重复的属性名称或参数值。使eval() 更安全。在 delete使用无效时抛出错误。
 */

// 6、考虑以下两个函数。它们会返回相同的东西吗？ 为什么相同或为什么不相同？
function foo1() {
    return {
        bar: "hello"
    };
}

function foo2() {
    return
    {
        bar: "hello"
    };
}
// 包含 return语句的代码行（代码行上没有其他任何代码），分号会立即自动插入到返回语句之后。
// foo1() => {bar: "hello"} foo2() => undefined

// 7、NaN 是什么？它的类型是什么？你如何可靠地测试一个值是否等于 NaN ？
/**
 * NaN 属性代表一个“不是数字”的值(Not a Number)。但是它的类型是Number。(typeof NaN => Number)
 * NaN 和任何东西比较——甚至是它自己本身！——结果是false(NaN === NaN)
 * 一种半可靠的方法来测试一个数字是否等于 NaN，是使用内置函数 isNaN()，但即使使用 isNaN() 依然并非是一个完美的解决方案。
 * 一个更好的解决办法是使用 value !== value，如果值等于NaN，只会产生true。另外，ES6提供了一个新的 Number.isNaN() 函数，这是一个不同的函数，并且比老的全局 isNaN() 函数更可靠。
 */
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 == 0.3); // false

// 9、下列代码行1-4如何排序，使之能够在执行代码时输出到控制台？ 为什么？
(function () {
    console.log(1);
    setTimeout(function () { console.log(2) }, 1000);
    setTimeout(function () { console.log(3) }, 0);
    console.log(4);
})();
// console => 1 4 3 2
/**
 * 解决： setTimeout() 也会把其引用的函数的执行放到事件队列中，如果浏览器正忙的话。
 * 当setTimeout()的第二个参数为0的时候，它的意思是“尽快”执行指定的函数。
 * 具体而言，函数的执行会放置在事件队列的下一个计时器开始。
 * 但是请注意，这不是立即执行：函数不会被执行除非下一个计时器开始。
 */

// 10、写一个简单的函数（少于80个字符），要求返回一个布尔值指明字符串是否为回文结构。
function isPalindrome(str) {
    str = str.replace(/\W/g, '').toLowerCase();// 查找非单词字符
    return (str == str.split('').reverse().join(''));
}

// 11、写一个 sum方法，在使用下面任一语法调用时，都可以正常工作。
/**
 * console.log(sum(2,3)); // Outputs 5
 * console.log(sum(2)(3)); // Outputs 5
 */
// 解决：被以 sum(2)(3)这样的形式调用时要返回一个匿名函数
function sum1(x) {
    if (arguments.length == 2) {
        return arguments[0] + arguments[1];
    } else {
        return function(y) {
            return x + y;
        };
    }
}

function sum2(x, y) {
    if (y !== undefined) {
        return x + y;
    } else {
        return function(y) {
            return x + y;
        };
    }
}

// 12、下面的代码将输出什么到控制台，为什么？
console.log(1 + "2" + "2");// '122'

console.log(1 + +"2" + "2");// '32'

console.log(1 + -"1" + "2");// '02'

console.log(+"1" + "1" + "2");// '112'

console.log( "A" - "B" + "2");// 'NaN2'

console.log( "A" - "B" + 2);// NaN

// 13、以下代码行将输出什么到控制台？
console.log("0 || 1 = " + (0 || 1));// 1

console.log("1 || 2 = " + (1 || 2));// 1

console.log("0 && 1 = " + (0 && 1));// 0

console.log("1 && 2 = " + (1 && 2));// 2 (注意：返回2)