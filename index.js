const fs = require('fs');
const jsdom = require("jsdom");
const $ = require('jquery');
const { JSDOM } = jsdom;
// const tasks = require('./data.json');

const result = {
    success: [],
    fail: []
};
let count = 0;
const taskRunned = {};
const tasks = [{href: 'http://www.huaweicloud.com/'}];
const isEnd = () => {
    if (tasks.length) {
        runTask(tasks);
    } else {
        fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
    }
}
const resolveUrl = (url) => {
    return url.split('?')[0].split('#')[0];
}
const runTask = (tasks) => {
    const task = tasks.shift();
    if (taskRunned[task.href]) {
        isEnd();
    }
    taskRunned[task.href] = true;
    JSDOM.fromURL(task.href, { runScripts: "outside-only" }).then(dom => {
        console.log(count++, task.href);
        result.success.push({link: task.href});
        $(dom.window.parent).find('a').forEach((el, idx) => {
            const href = resolveUrl(el.href);
            if ((href.startsWith('http://www.huaweicloud.com') 
                || href.startsWith('http://support.huaweicloud.com')
                || href.startsWith('http://activity.huaweicloud.com'))
                && (!taskRunned[href])) {
                tasks.push({href});
            }
            isEnd();
        });
    }, data => {
        result.fail.push({link: task.href, cause: {
            "name": data.name,
            "statusCode": data.statusCode
        }});
        isEnd();
    });
}

runTask(tasks);
