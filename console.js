const { spawn } = require('child_process');
const fs = require('fs');
const schedule = require("node-schedule")
const sendMail = require('./lib/mail/mailServer');
const generateReport = require('./lib/mail/generateReport');
const rule = new schedule.RecurrenceRule();
let options = {};

Date.prototype.format = function(format) {

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

const exec = () => {
    const timeStamp = new Date().format('yyyyMMdd_hh:mm:ss');
    const crawler = spawn('node', ['./lib/crawler/crawler.js', 'http://www.huaweicloud.com/', timeStamp]);
    let log = '';
    crawler.stdout.on('data', (data) => {
        log = `${log}${new Date()} INFO:${data}`;
    });
    
    crawler.stderr.on('data', (data) => {
        log = `${log}${new Date()} ERROR:${data}`;
        console.log(data.toString());
    });
    
    crawler.on('close', (code) => {
        fs.writeFileSync('./log.log', log);
        if (options.sendMail) {
            const failList = require(`./result/fail-${timeStamp}.json`);
            const length = Object.keys(failList).length;
            if (length) {
                sendMail('yonghao.cao@huawei.com,huoxiangming@huawei.com,yangzhao15@huawei.com,wanglong42@huawei.com,yangzhongting@huawei.com,shengzhong@huawei.com', `-${new Date().getMonth() + 1}/${new Date().getDate()}`, generateReport(require(`./result/${timeStamp}-fail.json`)), [
                    {
                        filename: `fail-${timeStamp}.json`,
                        path: `./result/fail-${timeStamp}.json`
                    }, {
                        filename: `success-${timeStamp}.json`,
                        path: `./result/success-${timeStamp}.json`
                    }
                ]);
            }
        }
    });
}

const args = process.argv.splice(2);
options.mode = args[0];
options.sendMail = args[1];

if (options.mode === 'watchdog') {
    exec();
    setInterval(exec, 300000);
} else {
    //每天两点执行
    rule.hour =2;
    rule.minute =0;
    rule.second =0
    schedule.scheduleJob(rule, () => {
        console.log(`time now: ${new Date().getTime()}`);
        exec();
    });
}

