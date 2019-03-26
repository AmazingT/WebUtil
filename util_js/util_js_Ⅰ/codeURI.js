// JavaScript encodeURI()编码函数
/* encodeURI(URIstring)函数可把字符串作为URI进行编码 */
/**
 * @URIstring string(含有 URI 或其他要编码的文本)
 * return URIstring副本(其中的某些字符将被十六进制的转义序列进行替换)
 */

// 编码了中文和空格
encodeURI("http://www.baidu.com.cn?q=123&name=周 波");
// http://www.baidu.com.cn?q=123&name=%E5%91%A8%20%E6%B3%A2
// 不会编码的部分：字母 数字 符号：-_.!~*'()。;?:@=+$,#

// 注：如果URI组件中含有分隔符(？ # : //)，则应当使用encodeURIComponent()方法分别对各组件进行编码.
encodeURIComponent("http://www.baidu.com.cn?q=123&name=周 波");
// http%3A%2F%2Fwww.baidu.com.cn%3Fq%3D123%26name%3D%E5%91%A8%20%E6%B3%A2


// JavaScript decodeURI()解码函数
/**
 * decodeURI(URIstring)函数可对encodeURI()函数编码过的URI进行解码。
 * @URIstring string(含有要解码的 URI 或其他要解码的文本)
 */
decodeURI("http://www.baidu.com.cn?q=123&name=%E5%91%A8%20%E6%B3%A2");
// http://www.baidu.com.cn?q=123&name=周 波
decodeURIComponent("http%3A%2F%2Fwww.baidu.com.cn%3Fq%3D123%26name%3D%E5%91%A8%20%E6%B3%A2");
// http://www.baidu.com.cn?q=123&name=周 波


// 浏览器原生提供了Base64编码解码方法(atob/btoa) IE10+
// IE8/IE9 需要引入一段ployfill脚本或一个js文件
/*
	<!-- [if IE]>
	<script src="./base64-polyfill.js"></script>
	<![endif]-->
*/
// 解码(atob)
var decodeData = window.atob(encodeData);
// OR
var decodeData = self.atob(encodeData);

// 编码(btoa)
var encodeData = window.btoa(encodeData);

window.btoa("http://www.baidu.com");
// "aHR0cDovL3d3dy5iYWlkdS5jb20="

window.atob("aHR0cDovL3d3dy5iYWlkdS5jb20");
// "http://www.baidu.com"


// 中文的Base64数据转换报错解决方法：中文先encode(encodeURI/encodeURIComponent)编码再Base64编码btoa, 后Base64解码atob再decode(decodeURI/decodeURIComponent)
