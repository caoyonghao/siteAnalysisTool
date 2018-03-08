const Crawler = require("crawler");
const fs = require('fs');
const tasks = [];
const successTasks = {};
const failTasks = {};
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
                if (href.endsWith('/')) {
                    result = href + result;
                } else {
                    result = href + '/' + result;
                }
            }
        }
    }
    return result;
}
const isToScan = (url, host, successTasks, failTasks) => {
    var flag = false;
    if ((url.startsWith('http://www.huaweicloud.com'))) {
        flag = true;
    }
    if (successTasks[url]) {
        flag = false;
    }
    if (failTasks[url]) {
        // failTasks[url].host.push(host);
        flag = false;
    }
    return flag;
}
var crawler = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log("error: ", res.request.uri.href);
            failTasks[res.request.uri.href] = true;
        }else{
            successTasks[res.request.uri.href] = true;
            const $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            $('a').each((index, element) => {
                const url = resolveUrl($(element).attr('href') || '', 'http' + res.request.uri.host, res.request.uri.href);
                if (isToScan(url, res.request.uri.href, successTasks, failTasks)) {
                    tasks.push(url);
                }
            });
            if (tasks.length > 0) {
                while(tasks.length > 0) {
                    const task = tasks.shift();
                    if (isToScan(task, res.request.uri.href, successTasks, failTasks)) {
                        console.log(`remain ${tasks.length}, scan ${task}`);
                        crawler.queue(task);
                        break;
                    }
                }
            } else {
                fs.writeFileSync('result' + new Date().getTime() + '.json', JSON.stringify(result, null, 2));
                fs.writeFileSync('success' + new Date().getTime() + '.json', JSON.stringify(result.success, null, 2));
                fs.writeFileSync('fail' + new Date().getTime() + '.json', JSON.stringify(result.fail, null, 2));
            }
        }
        done();
    }
});

// Queue just one URL, with default callback
crawler.queue('http://www.huaweicloud.com');