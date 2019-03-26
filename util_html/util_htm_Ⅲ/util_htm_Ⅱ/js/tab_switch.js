	// function $(id){
	// 	return typeof id==='string'?document.getElementById(id):id;
	// }
	var $ = function(id){
		return document.getElementById(id);
	}
window.onload = function(){
	var title = $('title').getElementsByTagName('li');
	var demo = $('content').getElementsByTagName('div');
	var timer;
	if(title.length != demo.length) return;

	for(var i=0;i<title.length;i++){
		title[i].id = i;
		title[i].onmouseover = function(){
			if(timer){
				clearTimeout(timer);
				timer=null;
			}
			var index= this;
			timer = setTimeout(function(){//window对象的方法
				for(var j=0;j<title.length;j++){
					if(title[j].className == 'select'){
					title[j].className = '';
					demo[j].style.display = 'none';
					}
				}
				title[index.id].className = 'select';
				demo[index.id].style.display = 'block';
			},500);
		}

/*
	for(var i=0;i<title.length;i++){
		title[i].id = i;
		title[i].onclick = function(){
			for(var j=0;j<title.length;j++){
			if(title[j].className == 'select'){
				title[j].className = '';
				demo[j].style.display = 'none';
			}
		}
			this.className = 'select';
			demo[this.id].style.display = 'block';
		}

	}
	*/

	}
}