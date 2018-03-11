const page = require('webpage').create();
const fs = require('fs');
// page.onConsoleMessage = function(msg, lineNum, sourceId) {
//     console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
// };
// const tasks = require('./data.json');

const result = {
    success: [],
    fail: []
};

const taskRunned = {};
const tasks = [{href: 'http://www.huaweicloud.com/'}];
var count = 0;
const isEnd = function() {
    if (tasks.length) {
        runTask(tasks);
    } else {
        console.log('failLength', JSON.stringify(result));
        // fs.writeFileSync('result' + new Date().getTime() + '.json', JSON.stringify(result, null, 2));
        // fs.writeFileSync('success' + new Date().getTime() + '.json', JSON.stringify(result.success, null, 2));
        // fs.writeFileSync('fail' + new Date().getTime() + '.json', JSON.stringify(result.fail, null, 2));
        phantom.exit();
    }
}

const runTask = function (tasks) {
    const task = tasks.shift();
    if (taskRunned[task.href]) {
        isEnd();
    }
    taskRunned[task.href] = true;
    console.log(count++ + ' task href is: ' + task.href + ' remain:' + tasks.length)
    page.open(task.href, function(status) {
        console.log(status)
        if (status === 'success') {
            result.success.push(task.href);
            const data = page.evaluate(function(tasks) {
                var resolveUrl = function (url, host, href) {
                    // remove param
                    var result = url.split('?')[0].split('#')[0];
                    if (!result.indexOf('http') === 0) {
                        if (result.indexOf('//') === 0) {
                            result = 'http:' + result;
                        } else {
                            if (result.indexOf('/') === 0) {
                                result = host + result;
                            } else {
                                if (href.indexOf('/') === (href.length - 1)) {
                                    result = href + result;
                                } else {
                                    result = href + '/' + result;
                                }
                            }
                        }
                    }
                    return result;
                }
                var isToScan = function(url, taskRunned) {
                    var flag = false;
                    if ((url.indexOf('http://www.huaweicloud.com') === 0)) {
                        flag = true;
                    }
                    return flag;
                }
                var tmp = {
                    host: window.location.host,
                    href: window.location.href,
                    links: []
                };
                $('a').each(function(idx, el) {
                    var url = $(el).attr('href');
                    if (!url) {
                        return;
                    }
                    url = resolveUrl(url, tmp.host, tmp.href);
                    if (isToScan(url)) {
                        tmp.links.push({
                            link: url
                        });
                    }
                });
                return tmp;
            });
            data.links.forEach(function(el) {
                var target = el.link;
                if (!taskRunned[target]) {
                    tasks.push({href: target});
                }
            });
        } else {
            result.fail.push(task.href);
        }
        isEnd();
    });
}

runTask(tasks);

// export QT_QPA_PLATFORM=offscreen