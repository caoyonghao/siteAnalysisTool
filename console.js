const { spawn } = require('child_process');
const { injectDatePrototype } = require('./lib/others/util');
const fs = require('fs');
const schedule = require("node-schedule")
const sendMail = require('./lib/mail/mailServer');
const { makeSnaption } = require('./lib/phantom/phantom');
const generateReport = require('./lib/mail/generateReport');
const config = require('./config/config');
// const mailList = 'yonghao.cao@huawei.com,huoxiangming@huawei.com,yangzhao15@huawei.com,wanglong42@huawei.com,yangzhongting@huawei.com,shengzhong@huawei.com';
// const mailList = 'yonghao.cao@huawei.com';

const rule = new schedule.RecurrenceRule();
const args = process.argv.splice(2);
const snapshotTask = config.snapshot && config.snapshot.tasks;
const crawlerTask = config.crawler && config.crawler.tasks;

const RUNNING = 'running';
const FINISH = 'finish';

const __tasks = [];

injectDatePrototype();

const execCrawler = (task) => {
    const { time, id, type, target, phantom, filter, email, mailList, deep } = task;
    const  timeStamp = time ? time : new Date().format('yyyyMMdd_hh:mm:ss');

    let crawler, log = '', cmd = ['./lib/crawler/crawler.js'];
    
    if (id) cmd.push(`--id=${id}`);
    if (timeStamp) cmd.push(`--time=${timeStamp}`);
    if (deep) cmd.push(`--deep=${deep}`);
    if (target) cmd.push(`--target=${target}`);

    crawler = spawn('node', cmd);

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
        const failList = require(`./result/${id}/fail-${timeStamp}.json`);
        const httpList = require(`./result/${id}/http-${timeStamp}.json`);
        if (email) {
            const failLength = Object.keys(failList).length;
            let hasHWUrl = false;
            Object.keys(failList).forEach((el) => {
                if (el.indexOf('huaweicloud') > -1) {
                    hasHWUrl = true;
                }
            })
            if (failLength && hasHWUrl) {
                sendMail(mailList,
                    `-${timeStamp} ${id}`,
                    generateReport(require(`./result/${id}/fail-${timeStamp}.json`)), [
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
        __tasks.forEach((el) => {
            if (el.id === id) {
                el.status = FINISH;
                el.failList = failList;
            }
        });
    });

    __tasks.push({id, target, status: RUNNING});
}

const execSnapshot = (config) => {
    makeSnaption(config);
}

const autoRun = () => {
    if (snapshotTask) {
        snapshotTask.forEach((el) => {
            // console.log(el.id);
        })
    }
    if (crawlerTask) {
        crawlerTask.forEach((el) => {
            if (el.type === 'loopTask') {
                setInterval(() => { execCrawler(el) }, 300000);
            } else if (el.type === 'timeTask') {
                //每天两点执行
                rule.hour = 2;
                rule.minute = 0;
                rule.second = 0;
                schedule.scheduleJob(rule, () => {
                    execCrawler(el);
                });
            } else if (el.type === 'onceTask') {
                execCrawler(el);
            }
        })
    }
}

const setupCrawlerTask = ({ id, type, time, target }) => {
    // inject test data
    let deep = 1;
    type = 'onceTask';
    time = '123';

    execCrawler({ id, type, deep, target, time });
}
const queryCrawlerTask = (id) => {
    let res = []
    if (id) {
        __tasks.forEach((el) => {
            if (el.id === id) {
                res.push(el);
            }
        })
    } else {
        res = __tasks;
    }
    return res;
}

module.exports = { autoRun, crawler: { setupCrawlerTask, queryCrawlerTask } };