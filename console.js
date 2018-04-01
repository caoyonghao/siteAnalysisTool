const { spawn } = require('child_process');
const fs = require('fs');
const schedule = require("node-schedule")
const sendMail = require('./lib/mail/mailServer');
const {makeSnaption} = require('./lib/phantom/phantom');
const generateReport = require('./lib/mail/generateReport');
const config = require('./config/config');
const mailList = 'yonghao.cao@huawei.com,huoxiangming@huawei.com,yangzhao15@huawei.com,wanglong42@huawei.com,yangzhongting@huawei.com,shengzhong@huawei.com';

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

const execCrawler = (task) => {
    const timeStamp = new Date().format('yyyyMMdd_hh:mm:ss'),
            {id, type, url, phantom, filter, email} = task;

    let crawler, log = '';

    crawler = spawn('node', ['./lib/crawler/crawler.js', timeStamp, id]);
    // if (runConfigtask) {
    //     crawler = spawn('node', ['./lib/crawler/crawler.js', 'http://www.huaweicloud.com/', timeStamp, run]);
    // } else {
    //     crawler = spawn('node', ['./lib/crawler/crawler.js', 'http://www.huaweicloud.com/', timeStamp]);
    // }
    
    crawler.stdout.on('data', (data) => {
        console.log(data.toString())
        log = `${log}${new Date()} INFO:${data}`;
    });
    
    crawler.stderr.on('data', (data) => {
        log = `${log}${new Date()} ERROR:${data}`;
        console.log(data.toString());
    });
    
    crawler.on('close', (code) => {
        fs.writeFileSync('./log.log', log);
        if (email) {
            const failList = require(`./result/${id}/fail-${timeStamp}.json`);
            const httpList = require(`./result/${id}/http-${timeStamp}.json`);
            const failLength = Object.keys(failList).length;
            if (failLength) {
                sendMail(mailList,
                    `-${new Date().getMonth() + 1}/${new Date().getDate()} ${IDBCursorWithValue}`,
                    generateReport(require(`./result/fail-${timeStamp}.json`)), [
                    {
                        filename: `fail-${timeStamp}.json`,
                        path: `./result/${id}/fail-${timeStamp}.json`
                    }, {
                        filename: `success-${timeStamp}.json`,
                        path: `./result/${id}/success-${timeStamp}.json`
                    }, {
                        filename: `trace-${timeStamp}.json`,
                        path: `./result/${id}/trace-${timeStamp}.json`
                    }, {
                        filename: `http-${timeStamp}.json`,
                        path: `./result/${id}/http-${timeStamp}.json`
                    }
                ]);
            }
        }
    });
}

const execSnapshot = (config) => {
    makeSnaption(config);
}

const args = process.argv.splice(2);
options.mode = args[0];
options.sendMail = args[1];
const snapshotTask = config.snapshot && config.snapshot.tasks;
const crawlerTask = config.crawler && config.crawler.tasks;

if (snapshotTask) {
    snapshotTask.forEach((el) => {
        // console.log(el.id);
    })
}
if (crawlerTask) {
    crawlerTask.forEach((el) => {
        // console.log(el.id);
        execCrawler(el);
    })
}
// if (options.mode === 'snapshot') {
//     execSnapshot(config.snapshot);
// } else if (options.mode === 'watchdog') {
//     execCrawler();
//     setInterval(execCrawler, 300000);
// } else if (options.mode === 'customCrawler') {
//     execCrawler(true);
// } else {
//     //每天两点执行
//     rule.hour = 2;
//     rule.minute = 0;
//     rule.second = 0;
//     schedule.scheduleJob(rule, () => {
//         console.log(`time now: ${new Date().getTime()}`);
//         execCrawler();
//     });
// }

