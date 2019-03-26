//一：Object
var person = new Object();
	person.name = "zb";
	person.age = 22;
	person.eat = function() {
		alert("eat!");
	}
	alert(person.name);
	person.eat();

//二：对象字面量
var people = {
	name: 'zb',
	age: 23,
	sex: '男',
	run: function() {
		alert("run!");
	}
}
alert(people.age);
people.run();

//三：工厂模式(方法不共享)
function createPerson(name, age, sex) {
	var o = new Object();
	o.name = name;
	o.age = age;
	o.sex = sex;
	o.sayName = function() {
		alert(this.name);
	};
	return o;
}
createPerson("Kevin", 22, "男").sayName();
createPerson("Kevins", 23, "女").sayName();

//四：自定义构造函数模式(缺点：每个实例指向不同的函数实例,而不是同一个)
function Person(name, age, sex) {
	this.name = name;
	this.age = age;
	this.sex = sex;
	this.sayName = function() {
		alert(this.name);
	}
}
var p = new Person("mike", 25, "男");
p.sayName();

//五：原型模式(缺点：实例p1,p2共享了friends)
function People() {

}
People.prototype = {
	constructor: People,
	name: 'Kevin',
	age: 22,
	sex: '男',
	friends: ['Jams', 'Mary'],
	sayFriends: function() {
		alert(this.friends);
	}
}
var p1 = new People();
p1.friends.push("zb");
p1.sayFriends(); //Jams,Mary,zb
var p2 = new People();
p2.sayFriends(); //Jams,Mary,zb

//六：组合模式(原型+构造)(推荐,使用广泛)
function Animal(name, age, sex) {
	this.name = name;
	this.age = age;
	this.sex = sex;
	this.friends = ['a', 'b'];
}
Animal.prototype.sayFriends = function() {
	alert(this.name + this.age + this.friends);
}
var a1 = new Animal("zb", 28, "男");
var a2 = new Animal("zbs", 29, "女");
a1.friends.push("c");
a1.sayFriends(); // zb 28 a,b,c
a2.sayFriends(); // zbs 29 a,b

//七：动态原型模式(推荐,在构造函数中完成对原型的创建)
function Car(name, price, color) {
	this.name = name;
	this.price = price;
	this.color = color;
	this.friends = ['法拉利', '保时捷'];
	if (typeof this.sayName != "function") { //typeof 返回值有六种可能： "number," "string," "boolean," "object," "function," 和 "undefined."
		Car.prototype.sayName = function() {
			alert(this.name);
		}

		Car.prototype.sayFriends = function() {
			alert(this.friends);
		}
	}
}
var c1 = new Car("宝马", 50, "red");
c1.sayName(); // 宝马
c1.friends.push("奥迪");
c1.sayFriends(); //法拉利，保时捷，奥迪
var c2 = new Car("奔驰", 50, "black");


//八：升级版(常见)
function Person (info){
	this._init_(info);
}

Person.prototype = {
	constructor : Person,
	_init_ : function(info) { //构造函数放到了原型上
		this.name = info.name;
		this.age = info.age;
		this.sex = info.sex;
	},

	sayHello : function() {
		console.log('hello');
	}
};
/*******************/
  /*new的执行原理*/
/*******************/
//new的执行原理 => var o={};o._proto_=constructor.prototype;
var myNew = function(constructor,args) {
	var o = {};
	o._proto_ = constructor.prototype;
	var res = constructor.apply(o, args);
	var type = typeof res;
	if (['string','number','boolean','null','undefined'].indexOf(type) !== -1){
		return o;
	}
	return res;
};

// 测试
function Person(name) {
	this.name = name;
} 
Person.prototype.sayHello = function() {
	console.log(this.name);
}
var o = myNew(Person,['pawn']);
console.log(o);
o.sayHello();

//九：类jQuery封装(将对象的构造操作放在函数里面，自己充当一个工厂)
var Person = function(info) {
	return new Person.prototype.init(info);
};

Person.prototype = {
	constructor:Person,
	init:function(){
		this.name = info.name;
	}
};

Person.prototype.init.prototype = Person.protype;

//改进型一：
var Person = function(info){
	return new Person.fn.init(info);
}

Person.fn = Person.prototype = {
	constructor:Person,
	init:function(){
		this.name = info.name;
		this.sayHello = function(){
			this.makeArray();
		}
	},
	makeArray: function(){
		console.log(this.name);
	}
};

Person.fn.init.prototype = Person.fn;

//改进型二：
var Person = (function(window){
	var Person = function(name,age) {
		return new Person.fn.init(name,age);
	};

	Person.fn = Person.prototype = {
		constructor: Person,
		init: function(name,age) {
			this.name = name;
			this.age = age;
			this.sayHello = function() {
				this.makeArray();
			}
		},
		makeArray: function() {
			console.log(this.name+":"+this.age);
		}
	}

	Person.fn.init.prototype = Person.fn;

	return Person;
})();

//测试
var p = Person('pawn',22);
p.sayHello();