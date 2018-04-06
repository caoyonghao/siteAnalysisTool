const injectDatePrototype = () => {
    Date.prototype.format = function (format) {
        var date = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S+": this.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
            }
        }
        return format;
    }
}

const parseArgs = (args) => {
    const res = {};
    args.forEach(element => {
        const keypair = element.split('=');
        if (keypair.length === 2) {
            res[keypair[0]] = keypair[1];
        } else {
            // 默认只有一个参数
            res[keypair[0]] = true;
        }
    });
    return res;
}

module.exports = {
    injectDatePrototype,
    parseArgs
}