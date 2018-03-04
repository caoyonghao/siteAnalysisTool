const page = require('webpage').create();
const fs = require('fs');

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
        phantom.exit();
        fs.writeFileSync('result' + new Date().getTime() + '.json', JSON.stringify(result, null, 2));
        fs.writeFileSync('success' + new Date().getTime() + '.json', JSON.stringify(result.success, null, 2));
        fs.writeFileSync('fail' + new Date().getTime() + '.json', JSON.stringify(result.fail, null, 2));
    }
}
const resolveUrl = function (url, host, href) {
    // remove param
    let result = url.split('?')[0].split('#')[0];
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
const isToScan = function(url, taskRunned) {
    let flag = false;
    if ((url.startsWith('http://www.huaweicloud.com') 
        || url.startsWith('http://support.huaweicloud.com')
        || url.startsWith('http://activity.huaweicloud.com'))
        && (!taskRunned[url])) {
        flag = true;
    }
    return flag;
}
const runTask = function (tasks) {
    const task = tasks.shift();
    if (taskRunned[task.href]) {
        isEnd();
    }
    taskRunned[task.href] = true;
    console.log(count++, task.href, tasks.length)
    page.open(task.href, function() {
        const data = page.evaluate(function() {
            var tmp = {
                host: window.location.host,
                href: window.location.href,
                links: []
            };
            $('a').each(function(idx, el) {
                tmp.links.push({
                    link: $(el).attr('href')
                });
            });
            return tmp;
        });
        data.links.forEach(function(el) {
            var target = resolveUrl(el, data.host, data.href);
            if (isToScan(target)) {
                tasks.push({href: target});
            }
        });
        isEnd();
    });
}

runTask(tasks);

// export QT_QPA_PLATFORM=offscreen