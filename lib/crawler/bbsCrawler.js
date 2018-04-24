const Crawler = require("crawler");
const { parseArgs } = require('./../others/util');
const fs = require('fs');

let result = [];

let _pageLength = 0;
let _hasCrawledChild = false;
let _url = '';
let _crawler;
let _pageFunc;
let _getData;
let _output;
let _getQueue;

const pr = (option, done) => {
    console.log(option.uri)
    done();
};
const cb = (error, res, done) => {
    const $ = res.$;
    if ($) {
        // 获取当前页面数
        if (!_pageLength) _pageLength = _pageFunc($);
        result = result.concat(_getData($));
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

        // let urlQueue = [];
        // for (let i = 2; i < _pageLength + 1; i++) {
        //     urlQueue.push({ uri: `${_url}?page=${i}` });
        // }
        _crawler.queue(_getQueue(_pageLength));
    } else {
        console.log(`Finish! Crawler has runned ${result.length} jobs!`);
        fs.writeFileSync(`./result/${_output || 'bbs'}.json`, JSON.stringify(result, null, 2));

    }
}

const forkCrawler = () => {
    const crawler = new Crawler(options);
    crawler.on('drain', drainFunc);
    return crawler;
}

const exec = (url, pageFunc, getData, getQueue, output) => {
    _url = url;
    _getData = getData;
    _pageFunc = pageFunc;
    _output = output;
    _getQueue = getQueue;
    _crawler = forkCrawler();
    _crawler.queue({uri: url});
}

module.exports = { exec };