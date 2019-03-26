// 获取[min, max]之间的随机数
function getRandom(min, max) {
    return Math.floor(min + (max - min + 1) * Math.random());
    // return (min + (max - min) * Math.random()) | 0;
}

// 数组乱序
function shuffle(arr) {
    var _arr = arr.slice();// 获取数组的副本(不会改变原数组)
    for (var i = 0; i < _arr.length; i++) {
        var j = getRandom(0, i);
        var t = _arr[i];
        _arr[i] = _arr[j];
        _arr[j] = t;
    }

    return _arr;
}

// 数组去重
function removeRepeatArray(arr) {
    var _arr = [];
    for (var i = 0; i < arr.length; i++) {
        if (_arr.indexOf(arr[i]) == -1) {
            _arr.push(arr[i]);
        }
    }
    return _arr;
}

// 数组去重(ES6)
let arr = new Set([1,1,2,2,3,4]);

// 数组去重(高阶函数filter实现) =>类似高阶函数还有(map/reduce/sort)
// 利用了indexOf只返回符合条件的第一个元素的下标的特点
arr.filter(function(value, index, arr) {
	return arr.indexOf(value) === index;
})

// [].slice.call()
// Array.prototype.slice.call(arguments) 截取函数参数放数组里面(apply())
// Array.from()

// 获取指定key的value
var getQueryString = function(key) {
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var str = location.search.substr(1).match(reg);

    if(str != null) {
        return str[2];
    }
};

// 获取所有参数转对象
var parseQueryString = function(url) {
    // var reg = new RegExp("([^\?\&\=]+)\=([^\?\&\=]*)","g");
	// 查找给定集合外的任何字符。[^adgk]
	// 当使用构造函数创造正则对象时，需要常规的字符转义规则（在前面加反斜杠 \）。比如，以下是等价的
	var reg = /([^?&=]+)=([^?&=]*)/g;
    var obj = {};
    while (reg.test(url)) {
        obj[RegExp.$1] = RegExp.$2;
    }
    return obj;
};

// jQuery的hasClass,addClass,removeClass方法封装
var util = {
	// 是否有类名
	hasClass: function(ele, cls) {
		//  字符串的方法match() //s:空格 ^n：任何n开头的字符串 n$: 任何n结尾的字符串
		//	return !!ele.className.match(new RegExp("(\\s||^)" + cls + "(\\s|$)"));

		//  RegExp对象的方法test(),exec()
		//	var reg = new RegExp("(^|\\s)" + ele + "(\\s|$)");
		//	return reg.test(el.className);

		//  空格分割,数组方法indexOf()
		var arr = ele.className.split(/\s+/);
		return (arr.indexOf(cls) == -1) ? false : true;
	},
	// 添加类名
	addClass: function(ele, cls) {
		if (!this.hasClass(ele, cls)) {
			ele.className += " " + cls;
		}
	},
	// 删除类名
	removeClass: function(ele, cls) {
		if (this.hasClass(ele, cls)) {
			var reg = new RegExp("(^|\\s)" + cls + "(\\s|$)");
			ele.className = ele.className.replace(reg, " ");
		}
		/*
		if (this.hasClass(ele , cls)) {
			var classArray = ele.className.split(" ");//空格分割
			var _leftArray = [];
			classArray.forEach(function(val) {
				if (val != "" && val != cls) {
					_leftArray.push(val);
				}
			});
			ele.className = _leftArray.join(" ");//空格分隔
		}
		*/
	},
	// 设置样式
	setStyle: function(ele, json) {
		for (var attr in json) {
			ele.style[attr] = json[attr];
		}
	},
	// 显示
	show: function(ele) {
		ele.style.display = "";
	},
	// 隐藏
	hide: function(ele) {
		ele.style.display = "none";
	}
};

// 获取id封装
function $(id) {
	return document.getElementById(id);
}

// 获取id和class封装
function $(selector) {
	// 类名 $('.selector')
	if (selector.substr(0, 1) == ".") {
		//	return document.getElementsByClassName(selector.substr(1)); //IE9以上
		//  return document.querySelector(slector);
		return document.querySelectorAll(selector); //IE6,7 不兼容
	}
	return document.getElementById(selector); // id $('selector')
}

// 类名获取
function getClassName(oParent, name) {
	var arr = [],
		len;
	var all = oParent.getElementsByTagName('*'); //获取父级元素下的所有元素
	for (var i = 0,len = all.length; i < len; i++) {
		if (all[i].className === name) {
			arr.push(all[i]);
		}
	}
	return arr;
}

// 对象形式封装
var util = {
	getId: function(id) {
		return document.getElementById(id);
	},
	getClassName: function(name) {
		return document.querySelectorAll(name);
	}
};


///////////////////////////
me.hasClass = function(e, c) {
	var re = new RegExp("(^|\\s)" + c + "(\\s|$)"); //"className"/"  className "
	return re.test(e.className);
};

me.addClass = function(e, c) {
	if (me.hasClass(e, c)) {
		return;
	}

	var newclass = e.className.split(' ');
	newclass.push(c);
	e.className = newclass.join(' ');
};

me.removeClass = function(e, c) {
	if (!me.hasClass(e, c)) {
		return;
	}

	var re = new RegExp("(^|\\s)" + c + "(\\s|$)", 'g');
	e.className = e.className.replace(re, ' ');
};

me.offset = function(el) {
	var left = -el.offsetLeft,
		top = -el.offsetTop;

	// jshint -W084
	while (el = el.offsetParent) {
		left -= el.offsetLeft;
		top -= el.offsetTop;
	}
	// jshint +W084

	return {
		left: left,
		top: top
	};
};

// 实现call()方法
Function.prototype.call2 = function(context) {
	context = context || window;
	context.fn = this;

	var args = [];
	for (var i = 1, len = arguments.length; i < len; i++) {
		args.push('arguments[' + i + ']');
	}

	// es6
	// let args = [...arguments].slice(1);
	// let result = context.fn(...args);

	// 将字符串转换为可被执行的JavaScript代码(安全性，性能)
	var result = eval('context.fn('+ args + ')');

	delete context.fn;
	return result;
}

// apply()方法实现
Function.prototype.apply2 = function(context, arr) {
	context = context || window;
	context.fn = this;

	let result;
	if (!arr) {
		result = context.fn();
	} else {
		result = context.fn(...arr);
	}

	delete context.fn;
	return result;
}

//============ 闭包 ===========//
// 函数作为返回值
function sum(arr) {
	return arr.reduce(function(x, y) {
		return x + y;
	})
}

sum([1,2,3]) // 6

// 但，注意：如果不需要立刻求和，而是在后面的代码中，根据需要再计算怎么办？可以不返回求和的结果，而是返回求和的函数！
function lazy_num(arr) {
	var sum = function() {
		return arr.reduce(function(x, y) {
			return x + y;
		});
	}
	return sum;
}
// 当调用lazy_num()时，返回的并不是求和结果，而是求和函数：
var f = lazy_num([1,2,3]); // function sum()
// 当调用函数f时，才真正计算求和的结果：
f(); // 6

// 请再注意一点，当我们调用lazy_sum()时，每次调用都会返回一个新的函数，即使传入相同的参数：
var f1 = lazy_sum([1, 2, 3]);
var f2 = lazy_sum([1, 2, 3]);
f1 === f2; // false

// 另一个需要注意的问题是，返回的函数并没有立刻执行，而是直到调用了f()才执行。我们来看一个例子：
function count() {
	var arr = [];
	for (var i = 0; i <= 3; i++) {
		arr.push(function() {
			return i * i;
		});
	}
	return arr;
}

var results = count();
var f1 = results[0];
var f2 = results[1];
var f3 = results[2];

f1(); // 16
f2(); // 16
f3(); // 16

// 返回的函数引用了变量i，但它并非立刻执行。(非立即执行表达式)

// 使用闭包实现(创建一个匿名函数并立即执行)
function _count() {
	var arr = [];
	for (var i = 0; i <= 3; i++) {
		arr.push((function(n) {
			return n * n;
		})(i));
	}
	return arr;
}

var result = _count(); // 0 1 4 9

// 难道闭包就是为了返回一个函数然后延迟执行吗？
// 只有函数的语言里，借助闭包，同样可以封装一个私有变量
function create_counter(n) {
	var x = n || 0;
	return {
		inc: function() {
			x += 1;
			return x;
		}
	}
}

// 在返回的对象中，实现了一个闭包，该闭包携带了局部变量x，并且，从外部代码根本无法访问到变量x。
// 换句话说，闭包就是携带状态的函数，并且它的状态可以完全对外隐藏起来。

// 闭包还可以把多参数的函数变成单参数的函数。如：Math.pow(x, y)
function make_pow(n) {
	return function(x) {
		return Math.pow(x, n)
	}
}

// 斐波那契数列
function fib(max) {
	var a = 0,
		b = 1,
		arr = [0, 1];
	while(arr.length < max) {
		[a, b] = [b, a + b];
		arr.push(b);
	}
	return arr;
}