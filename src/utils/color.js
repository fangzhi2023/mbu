export const hex2Rgba = (hex) => {
    let hexColor = /^#/.test(hex) ? hex.slice(1) : hex,
    r, g, b,a;
    hexColor = /^[0-9a-f]{3}|[0-9a-f]{6}$/i.test(hexColor) ? hexColor : 'fffff00';
    if (hexColor.length === 3) {
        hexColor = hexColor.replace(/(\w)(\w)(\w)/gi, '$1$1$2$2$3$3');
    }
    r = hexColor.slice(0, 2);
    g = hexColor.slice(2, 4);
    b = hexColor.slice(4, 6);
    a = hexColor.slice(6, 8);
    r = parseInt(r, 16);
    g = parseInt(g, 16);
    b = parseInt(b, 16);
    a = parseInt(a, 16);
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (255-a)/255 + ')'
}

export const rgba2Hex = rgba => {
    return `#${makeup(rgba.r.toString(16), 2)}${makeup(rgba.g.toString(16), 2)}${makeup(rgba.b.toString(16), 2)}${makeup(parseInt(rgba.a*255, 10).toString(16), 2)}`
}

/**
 * 字符串补0
 * @param {*} s 原字符串
 * @param {*} n 目标长度
 */
function makeup(s, n) {
    if (!s) return "0".repeat(n)
    const len = s.length
    if (len > n) return s.slice(len-n)
    return "0".repeat(n - len) + s
}