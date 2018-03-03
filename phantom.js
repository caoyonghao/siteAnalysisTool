const page = require('webpage').create();
const fs = require('fs');

// const tasks = require('./data.json');

const result = {
    success: [],
    fail: []
};

const taskRunned = {};
const tasks = [{href: 'http://www.huaweicloud.com/'}];
// const isEnd = () => {
//     if (tasks.length) {
//         runTask(tasks);
//     } else {
//         phantom.exit();
//         fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
//     }
// }
// const resolveUrl = (url) => {
//     return url.split('?')[0].split('#')[0];
// }
const runTask = function (tasks) {
    const task = tasks.shift();
    if (taskRunned[task.href]) {
        isEnd();
    }
    taskRunned[task.href] = true;
    page.open(task.href, function() {
        const links = page.evaluate(function() {
            var tmp = {
                host: window.location.host,
                links: []
            };
            $('a').each(function(idx, el) {
                tmp.links.push({
                    link: $(el).attr('href')
                });
            });
            return tmp;
        });
        console.log(links);
        // const href = resolveUrl(el.href);
        // if ((href.startsWith('http://www.huaweicloud.com') 
        //     || href.startsWith('http://support.huaweicloud.com')
        //     || href.startsWith('http://activity.huaweicloud.com'))
        //     && (!taskRunned[href])) {
        //     tasks.push({href});
        // }
        // isEnd();
    });
}

runTask(tasks);

// export QT_QPA_PLATFORM=offscreen