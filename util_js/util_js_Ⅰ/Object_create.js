/**
 * Object.create(null) 创建一个空对象 该对象没有继承Object.prototype原型链上的属性或者方法
 */
// 底层实现
Object.create = function(obj) {
    var F = function() {};
    F.prototype = obj;
    return new F();
}