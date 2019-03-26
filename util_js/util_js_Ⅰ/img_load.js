/**
 * 多张图片全部加载完
 */
let mulitImg = [
    'http://www.xxx.com/wp-content/uploads/2018/1.jpg',
    'http://www.xxx.com/wp-content/uploads/2018/2.jpg',
    'http://www.xxx.com/wp-content/uploads/2018/3.jpg',
    'http://www.xxx.com/wp-content/uploads/2018/4.jpg'
];

let promiseAll = [], img = [], imgTotal = mulitImg.length;

for (let i = 0; i < imgTotal; i++) {
    promiseAll[i] = new Promise((resolve, reject) => {
        img[i] = new Image();
        img[i].src = mulitImg[i];
        img[i].onload = function() {
            resolve(img[i])
        }
    })
}

Promise.all(promiseAll).then((img) => {
    // 全部加载完成
})

/**
 * 单张图片加载完
 */
new Promise((resolve, reject) => {
    let img = new Image();
    img.src = 'http://www.xxx.com/upload/1.jpg';
    img.onload = function() {
        resolve(img)
    }
}).then((img) => {
    //加载完成后
})