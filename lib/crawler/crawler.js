const Crawler = require("crawler");
const { parseArgs } = require('./../others/util');
const fs = require('fs');
const successTasks = {};
const failTasks = {};
const skipTasks = {};
const taskRunned = {};
const startTime = new Date().getTime();
const traceWWW = [];
const httpTasks = [];

const args = parseArgs(process.argv.slice(2));

const taskId = args['--id'];
const timeStamp = args['--time'];
const targetUrl = args['--target']

let deep = args['--deep'] ? parseInt(args['--deep']) : 999999999;
console.log(`fdsfkdsj${deep}`)
// about oom
const TASK_MAX_SIZE = 50000;

let config, siteUrl, needPhantom, filterPath;
if (targetUrl) {
    siteUrl = targetUrl;
} else {
    const crawlerTasks = require('./../../config/config.js').crawler.tasks;
    crawlerTasks.forEach(el => {
        if (el.id === taskId) {
            config = el;
        }
    });

    siteUrl = config.url;
    needPhantom = config.phantom;
    filterPath = config.filter;
}

let tasks = [];
let taskCount = 0;
let round = 0;

/**
 * 
 * @param {*} url 
 */
const isInScanPage = (url) => {
    let flag = false;
    if (!filterPath) return true;
    filterPath.forEach((el) => {
        if (url.indexOf(el) > -1) {
            flag = true;
        }
    });
    return flag;
}

const resolveUrl = (url, host) => {
    // remove param
    var result = url.split('?')[0].split('#')[0];
    if (!result.startsWith('http')) {
        if (result.startsWith('//')) {
            result = 'http:' + result;
        } else {
            if (result.startsWith('/')) {
                result = host + result;
                if (!result.startsWith('http')) {
                    result = 'http://' + result;
                }
            } else {
                result = '';
            }
        }
    }
    return result;
}
const validateUrl = (url) => {
    let flag = false;
    if (url) {
        flag = true;
    }
    return flag;
}
const cleanTasks = (tasksToClean) => {
    let result = [];
    tasksToClean.forEach(el => {
        var uri = el.uri;
        // 去掉已经运行的任务
        if (!taskRunned[uri]) {
            // 去掉重复任务
            let hasTask = false;
            result.forEach(e => {
                if (e.uri === uri) {
                    hasTask = true;
                }
            })
            if (!hasTask) {
                // TODO:去掉非法任务
                result.push(el);
            }
        }
    });
    return result;
}

const crawler = new Crawler({
    maxConnections: 5,
    retries: 0,
    timeout: 3000,
    retryTimeout: 1000,
    preRequest: (option, done) => {
        taskRunned[option.uri] = true;
        console.log((taskCount++) + ' ' + tasks.length + '  ' + option.uri);
        done();
    },
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error || res.statusCode !== 200) {
            if (!res.request) {
                console.log("error: uri error=>", error);
            } else {
                console.log(`error: cause: ${JSON.stringify(res)}`);
                if (res.statusCode === 404) {
                    console.log(`error: find a 404: ${res.request.uri.href}`);
                    failTasks[res.request.uri.href] = { parent: res.options.parent };
                }
            }
        } else {
            successTasks[res.request.uri.href] = true;
            const $ = res.$;
            if ($) {
                $('a').each((index, element) => {
                    const url = resolveUrl($(element).attr('href') || '', res.request.uri.host, res.request.uri.href);
                    // 判断是否扫描路径
                    if (isInScanPage(res.request.uri.href) && validateUrl(url)) {
                        const urlObj = { uri: url, parent: res.request.uri.href };
                        tasks.push(urlObj);
                        // TODO: extend filter
                    } else {
                        skipTasks[url] = true;
                    }
                    // solve mem issue
                    if (tasks.length > TASK_MAX_SIZE) {
                        console.log(`tasks to large, going to clean tasks, tasks length is ${tasks.length}`);
                        tasks = cleanTasks(tasks);
                        console.log(`tasks to large, going to clean tasks, after tasks length is ${tasks.length}`);
                    }
                });
            }
        }
        done();
    }
});

crawler.on('drain', function () {
    console.log(`going to clean task, length is ${tasks.length}`);
    let taskToRun = cleanTasks(tasks);
    tasks = [];
    if (taskToRun.length && deep--) {
        console.log(`round ${round} going to write file`);
        // fs.writeFileSync(`./result/tasksList${round++}.json`, JSON.stringify(taskToRun, null, 2));
        crawler.queue(taskToRun.slice(0, 200));
        tasks = taskToRun.slice(200, taskToRun.length - 200);
        console.log(`round ${round} remain ${tasks.length} tasks to run`);
    } else {
        console.log(`finish! Total run ${taskCount} tasks, cost ${new Date().getTime() - startTime}`);
        try {
            fs.mkdirSync(`./result/${taskId}/`);
        } catch (e) {
            console.log('info: floder is exit', `./result/${taskId}/`);
        }
        console.log(`going to write file, result: ${JSON.stringify(failTasks)}`)
        fs.writeFileSync(`./result/${taskId}/success-${timeStamp}.json`, JSON.stringify(successTasks, null, 2));
        fs.writeFileSync(`./result/${taskId}/fail-${timeStamp}.json`, JSON.stringify(failTasks, null, 2));
        fs.writeFileSync(`./result/${taskId}/skip-${timeStamp}.json`, JSON.stringify(skipTasks, null, 2));
        fs.writeFileSync(`./result/${taskId}/trace-${timeStamp}.json`, JSON.stringify(traceWWW, null, 2));
        fs.writeFileSync(`./result/${taskId}/http-${timeStamp}.json`, JSON.stringify(httpTasks, null, 2));
    }
});


// Queue just one URL, with default callback
if (needPhantom) {
    const { parseUrl } = require('./../phantom/phantom');
    parseUrl(siteUrl).then((data) => {
        console.log(JSON.parse(data));
        const urls = JSON.parse(data);
        urls.forEach((el) => {
            el.uri = resolveUrl(el.uri, siteUrl);
        });
        crawler.queue(urls);
    });
} else {
    crawler.queue({ uri: siteUrl, parent: siteUrl });
}