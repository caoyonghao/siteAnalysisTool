const bbsCrawler = require('./../lib/crawler/bbsCrawler');

// bbsCrawler.exec('https://bbs.aliyun.com/thread/235.html')
const pageLength = ($) => {
    const length = parseInt($($('.pages .fl')[0]).text().replace(/\D/g, ''));
    console.log(length);
    return length;
}

const getData = ($) => {
    const result = [];
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
    return result;
}

const getQueue = (length) => {
    const urlQueue = [];
    for (let i = 2; i < length + 1; i++) {
        urlQueue.push({ uri: `https://bbs.aliyun.com/thread/157.html?page=${i}` });
    }
    return urlQueue;
}


bbsCrawler.exec('https://bbs.aliyun.com/thread/157.html', pageLength, getData, getQueue, 'aliyun-aftersales-bbs');    