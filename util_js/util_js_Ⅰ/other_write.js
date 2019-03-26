/* js高级写法 */

// 1. 取整
parseInt(a, 10);  
/* 优化 */
~~a;

// 2. 向下取整
Math.floor(a);
/* 优化 */
a|0;

// 3. 未定义undefined
undefined
/*  优化 */
void 0;

// 4. 判断数组是否存在某一个元素
//for循环
/* 优化 */
[1, 2, 3].indexOf(2);

// 5.优化大量的if else判断或switch语句
if (color) {
    if (color == "black") {
        console.log("black");
    } else if (color == "red") {
        console.log("red");
    } else if (color == "blue") {
        console.log("blue");
    } else {
        console.log("green");
    }
}

// OR
switch(color) {
    case "black":
        console.log("black");
        break;
    case "red":
        console.log("red");
        break;
    case "blue":
        console.log("blue");
        break;
    default:
        console.log("green");
}

// OR
switch(color) {
    case (typeof color === "string" && color == "black"):
        console.log("black");
        break;
    case (typeof color === "string" && color == "red"):
        console.log("red");
        break;
    case (typeof color === "string" && color == "blue"):
        console.log("blue");
        break;
}

/* 优化 */
var colorObj = {
    "black": function() {
        console.log("black");
    },
    "red": function() {
        console.log("red");
    },
    "blue": function() {
        console.log("blue");
    }
};

if ("red" in colorObj) {
    colorObj["red"]();
}

// 5. 检查某对象是否含有某属性
var obj = {
    key: 'value'
};

if (obj.key) {}

/* 优化 */
obj.hasOwnProperty('key');
// OR
"key" in obj;

// 6. 将有length属性的对象转为数组(如NodeList, parameters)
/* nodeList */
// querySelector只能选择第一个匹配的节点
// querySelectorAll可以选择多个节点,以","分隔开,返回的是个数组
var li = document.querySelectorAll('li');

/* arguments */
function test() {
    if (arguments.length > 0) {}
}

/* 转化 */
[].slice.call(nodeList);
// OR
Array.prototype.slice.call(obj);
// ES6的Array.from(obj);
Array.from(nodeList);