const { spawn } = require('child_process');
const fs = require('fs');
const schedule = require("node-schedule")
const sendMail = require('./lib/mail/mailServer');
const generateReport = require('./lib/mail/generateReport');
const rule = new schedule.RecurrenceRule();

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
        sendMail('yonghao.cao@huawei.com', new Date().getDate(), generateReport(require(`./result/${timeStamp}-fail.json`)), [
            {
                filename: `${timeStamp}-fail.json`,
                path: `./result/${timeStamp}-fail.json`
            }, {
                filename: `${timeStamp}-success.json`,
                path: `./result/${timeStamp}-success.json`
            }
        ]);
    });
}

rule.minute = 40;
schedule.scheduleJob(rule, () => {
    console.log(`time now: ${new Date().getTime()}`);
    exec();
});