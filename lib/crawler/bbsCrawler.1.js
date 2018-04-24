const Crawler = require("crawler");
const { parseArgs } = require('./../others/util');
const fs = require('fs');

const result = [];

let _pageLength = 0;
let _hasCrawledChild = false;
let _url = '';
let _crawler;

const pr = (option, done) => done();
const cb = (error, res, done) => {
    const $ = res.$;
    if ($) {
        // 获取当前页面数
        if (!_pageLength) _pageLength = parseInt($($('.pages .fl')[0]).text().replace(/\D/g, ''));
        $('.tr3').each((idx, el) => {
            result.push({
                id: $(el).find('.subject').attr('id'),
                type: $($(el).find('.subject a')[0]).attr('title'),
                title: $(el).find('.subject .subject_t').text(),
                status: $($(el).find('.subject a')[1]).text(),
                url: $(el).find('.subject .subject_t').attr('href'),
                time: $($(el).find('.subject>.mt10>span')[0]).text().trim().slice(4),
                view: $($(el).find('.num .read-recommend strong')[0]).text(),
                reply: $($(el).find('.num .read-recommend strong')[1]).text(),
                lastReply: $($(el).find('.subject>.mt10>span')[0]).text().trim().slice(4)
            });
        });
    }
    done();
}

const options = {
    maxConnections: 5,
    retries: 0,
    timeout: 3000,
    retryTimeout: 1000,
    preRequest: pr,
    // This will be called for each crawled page
    callback: cb
};

const drainFunc = () => {
    if (!_hasCrawledChild) {
        _hasCrawledChild = true;

        const urlQueue = [];
        for (let i = 2; i < _pageLength + 1; i++) {
            urlQueue.push({ uri: `${_url}?page=${i}` });
        }
        _crawler.queue(urlQueue);
    } else {
        console.log(`Finish! Crawler has runned ${result.length} jobs!`);
        fs.writeFileSync(`./result/bbs.json`, JSON.stringify(result, null, 2));

    }
}

const forkCrawler = () => {
    const crawler = new Crawler(options);
    crawler.on('drain', drainFunc);
    return crawler;
}

const exec = (url) => {
    _url = url;
    _crawler = forkCrawler();
    _crawler.queue({uri: url});
}

module.exports = { exec };