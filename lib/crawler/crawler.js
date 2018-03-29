const Crawler = require("crawler");
const fs = require('fs');
const { parseUrl } = require('./../phantom/phantom');
const successTasks = {};
const failTasks = {};
const skipTasks = {};
const taskRunned = {};
const startTime = new Date().getTime();
const siteUrl = process.argv[2] || 'http://www.huaweicloud.com/';
const taskId = process.argv[3] || startTime;
const runCustomTask = process.argv[4];
const traceWWW = [];
const httpTasks = [];
let scanPath = ['www.huaweicloud.com', 'activity.huaweicloud.com']
let tasks = [];
let taskCount = 0;
let round = 0;

const isInScanPage = (url) => {
    let flag = false;
    scanPath.forEach((el) => {
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

var crawler = new Crawler({
    maxConnections : 5,
    retries: 0,
    timeout: 3000,
    retryTimeout: 1000,
    preRequest: (option, done) => {
        taskRunned[option.uri] = true;
        console.log((taskCount++) + ' ' +  tasks.length + '  ' + option.uri);
        done();
    },
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error || res.statusCode !== 200){
            if (!res.request) {
                console.log("error: uri error=>", error);
            } else {
                console.log("error: ", res.request.uri.href);
                failTasks[res.request.uri.href] = {parent: res.options.parent};
            }
        }else{
            successTasks[res.request.uri.href] = true;
            const $ = res.$;
            if ($) {
                $('a').each((index, element) => {
                    const url = resolveUrl($(element).attr('href') || '', res.request.uri.host, res.request.uri.href);
                    if (isInScanPage(res.request.uri.href) && validateUrl(url)) {
                        const urlObj = {uri: url, parent: res.request.uri.href};
                        tasks.push(urlObj);
                        if (!runCustomTask) {
                            if (url.indexOf('activity.huaweicloud.com') > -1) {
                                if (res.request.uri.href.indexOf('www.huaweicloud.com') > -1) {
                                    traceWWW.push(urlObj);
                                }
                            }
                            if (url.startsWith('http://')) {
                                httpTasks.push(urlObj);
                            }
                        }
                    } else {
                        skipTasks[url] = true;
                    }
                    if (tasks.length > 50000) {
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

crawler.on('drain',function(){
    console.log(`going to clean task, length is ${tasks.length}`);
    let taskToRun = cleanTasks(tasks);
    tasks = [];
    if (taskToRun.length) {
        console.log(`round ${round} going to write file`);
        // fs.writeFileSync(`./result/tasksList${round++}.json`, JSON.stringify(taskToRun, null, 2));
        crawler.queue(taskToRun.slice(0, 200));
        tasks = taskToRun.slice(200, taskToRun.length - 200);
        console.log(`round ${round} remain ${tasks.length} tasks to run`);
    } else {
        console.log(`finish! Total run ${taskCount} tasks, cost ${new Date().getTime() - startTime}`);
        fs.writeFileSync(`./result/success-${taskId}.json`, JSON.stringify(successTasks, null, 2));
        fs.writeFileSync(`./result/fail-${taskId}.json`, JSON.stringify(failTasks, null, 2));
        fs.writeFileSync(`./result/skip-${taskId}.json`, JSON.stringify(skipTasks, null, 2));
        fs.writeFileSync(`./result/trace-${taskId}.json`, JSON.stringify(traceWWW, null, 2));
        fs.writeFileSync(`./result/http-${taskId}.json`, JSON.stringify(httpTasks, null, 2));
    }
});

// Queue just one URL, with default callback
if (runCustomTask) {
    parseUrl('https://support.huaweicloud.com/index.html').then((data) => {
        console.log(JSON.parse(data));
        scanPath = ['support.huaweicloud.com'];
        const urls = JSON.parse(data);
        urls.forEach((el) => {
            el.uri = resolveUrl(el.uri, 'https://support.huaweicloud.com');
        });
        crawler.queue(urls);
    });
} else {
    crawler.queue({uri: siteUrl, parent: siteUrl});
}
