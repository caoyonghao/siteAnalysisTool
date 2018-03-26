const phantom = require('phantom');
const path = require('path');

const makeSnaption = async function (config) {
    for (let idx = 0; idx < config.tasks.length; idx++) {
        const el = config.tasks[idx];
        const id = el.id;
        const url = el.url;
        const instance = await phantom.create([], { phantomPath: './node_modules/phantomjs/bin/phantomjs' });
        const page = await instance.createPage();
        await page.property('userAgent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36');
        const target = path.resolve(process.cwd(), `./result/snapshot/${id}-mb.png`);
        const targetPC = path.resolve(process.cwd(), `./result/snapshot/${id}-pc.png`);
        await page.open(url);
        await page.render(target);
        await page.property('viewportSize', { width: 1680, height: 768 });
        await page.open(url);
        await page.render(targetPC);
        await instance.exit();
    }
}

const parseUrl = async function(url) {
    const instance = await phantom.create([], { phantomPath: './node_modules/phantomjs/bin/phantomjs' });
    const page = await instance.createPage();
    await page.property('userAgent', 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36');
    await page.open(url);
    const result = await page.evaluate(function() {
        var res = [];
        var length = $('.help-menu-panel .item a').length;
        for (var i = 0; i < length; i++) {
            res.push({uri: $('.help-menu-panel .item a').eq(i).attr('href'), parent: window.location.href});
        }
        
        return JSON.stringify(res);
    });
    await instance.exit();
    return result;
}
module.exports = {makeSnaption, parseUrl};