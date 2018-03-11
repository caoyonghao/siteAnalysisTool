const { spawn } = require('child_process');
const fs = require('fs');
const sendMail = require('./mail/mailServer');

const timeStamp = new Date().getTime();
const crawler = spawn('node', ['crawler.js', 'http://www.huaweicloud.com/', timeStamp]);
let log = '';
crawler.stdout.on('data', (data) => {
  log = `${log}${new Date()} INFO:${data}`;
});

crawler.stderr.on('data', (data) => {
    log = `${log}${new Date()} ERROR:${data}`;
});

crawler.on('close', (code) => {
    fs.writeFileSync('./log.log', log);
    sendMail('yonghao.cao@huawei.com', 'send a mail to huawei', 'send a mail to huawei', [
        {
            filename: `${timeStamp}-fail.json`,
            path: `./result/${timeStamp}-fail.json`
        }, {
            filename: `${timeStamp}-success.json`,
            path: `./result/${timeStamp}-success.json`
        }
    ]);
});

