let elStyle = document.createElement("div").style;

let vendor = (() => {
    let prefixObj = {
        'webkit': 'webkitTransform',
        'Moz': 'MozTransform',
        'ms': 'msTransform',
        'O': 'OTransform',
        'standard': 'transform'
    }

    for (let key in prefixObj) {
        if (elStyle[prefixObj[key]] != undefined) {
            return key;
        }
    }

    return false;
})();

export default function prefixStyle(style) {
    if (!vendor) return;
    if (vendor == 'standard') return style;
    return vendor + style.charAt(0).toUpperCase() + style.substr(1);
}