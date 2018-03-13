const Crawler = require("crawler");
const fs = require('fs');
const tasks = [];
const successTasks = {};
const failTasks = {};
const taskRunned = {};
const startTime = new Date().getTime();
const siteUrl = process.argv[2] || 'http://www.huaweicloud.com/';
const taskId = process.argv[3] || startTime;

const resolveUrl = (url, host, href) => {
    // remove param
    var result = url.split('?')[0].split('#')[0];
    if (!result.startsWith('http')) {
        if (result.startsWith('//')) {
            result = 'http:' + result;
        } else {
            if (result.startsWith('/')) {
                result = host + result;
            } else {
                result = '';
            }
        }
    }
    return result;
}
const isToScan = (url, host, successTasks, failTasks) => {
    var flag = false;

    if ((url.startsWith('http://www.huaweicloud.com'))
        || url.startsWith('http://support.huaweicloud.com')
        || url.startsWith('http://activity.huaweicloud.com')
        || (url.startsWith('https://www.huaweicloud.com'))
        || url.startsWith('https://support.huaweicloud.com')
        || url.startsWith('https://activity.huaweicloud.com')) {
        flag = true;
    }
    if (taskRunned[url]) {
        flag = false;
    }
    return flag;
}
const isEnd = (res) => {
    while(tasks.length > 0) {
        const task = tasks.shift();
        if (isToScan(task.uri, res.request.uri.href, successTasks, failTasks)) {
            console.log(`remain ${tasks.length}, scan ${task.uri}`);
            taskRunned[task.uri] = true;
            crawler.queue(task);
            break;
        }
    }
    if (tasks.length === 0) {
        console.log(`task finish, cost ${new Date().getTime() - startTime}`);
        fs.writeFileSync(`./result/${taskId}-success.json`, JSON.stringify(successTasks, null, 2));
        fs.writeFileSync(`./result/${taskId}-fail.json`, JSON.stringify(failTasks, null, 2));
    }
}
var crawler = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error || res.statusCode !== 200){
            console.log("error: ", res.request.uri.href);
            failTasks[res.request.uri.href] = {parent: res.options.parent};
            isEnd(res);
        }else{
            successTasks[res.request.uri.href] = true;
            const $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $('a').each((index, element) => {
                const url = resolveUrl($(element).attr('href') || '', 'http' + res.request.uri.host, res.request.uri.href);
                if (isToScan(url, res.request.uri.href, successTasks, failTasks)) {
                    tasks.push({uri: url, parent: res.request.uri.href});
                }
            });

            isEnd(res);
        }
        done();
    }
});

// Queue just one URL, with default callback
crawler.queue({uri: siteUrl, parent: siteUrl});
