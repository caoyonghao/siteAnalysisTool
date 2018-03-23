const { spawn } = require('child_process');
const fs = require('fs');
const schedule = require("node-schedule")
const sendMail = require('./lib/mail/mailServer');
const generateReport = require('./lib/mail/generateReport');
const rule = new schedule.RecurrenceRule();
let options = {};

const exec = () => {
    const timeStamp = new Date().getTime();
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
            const failList = require(`./result/${timeStamp}-fail.json`);
            const length = Object.keys(failList).length;
            if (length) {
                sendMail('yonghao.cao@huawei.com,huoxiangming@huawei.com,yangzhao15@huawei.com,wanglong42@huawei.com,yangzhongting@huawei.com,shengzhong@huawei.com', `-${new Date().getMonth() + 1}/${new Date().getDate()}`, generateReport(require(`./result/${timeStamp}-fail.json`)), [
                    {
                        filename: `${timeStamp}-fail.json`,
                        path: `./result/${timeStamp}-fail.json`
                    }, {
                        filename: `${timeStamp}-success.json`,
                        path: `./result/${timeStamp}-success.json`
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

