const bosonnlp = require('bosonnlp');
const fs = require('fs');
const _ = require('lodash');

const REPLY_WEIGHT = 10;
const nlp = new bosonnlp.BosonNLP('K9qEzsHn.24856.HLi-kVFBCE1V');
const raw = require('./../result/bbs.json');

const sorted = _.sortBy(_.filter(raw, { status: '[求助]' }), [(o) => -(parseInt(o.view) + REPLY_WEIGHT * parseInt(o.reply))]);
fs.writeFileSync(`./result/bbs-sorted.json`, JSON.stringify(sorted, null, 2));

const dataSince2017 = _.filter(sorted, o => o.time.startsWith('2017') || o.time.startsWith('2018'));
const dataByMonth = [];
for (let i = 1; i < 13; i++) {
    let tmp = i;
    if (i < 10) tmp = '0' + i;
    dataByMonth.push({ label: `2017-${tmp}`, data: _.filter(dataSince2017, o => o.time.startsWith(`2017-${tmp}`)) });
}
for (let j = 1; j < 4; j++) {
    dataByMonth.push({ label: `2018-0${j}`, data: _.filter(dataSince2017, o => o.time.startsWith(`2017-0${j}`)) });
}
fs.writeFileSync(`./result/bbs-since2017-month.json`, JSON.stringify(dataByMonth, null, 2));

const sliced = _.slice(dataSince2017, 0, 100);
fs.writeFileSync(`./result/bbs-sliced.json`, JSON.stringify(sliced, null, 2));

const dataForBoson = [];
_.forEach(sliced, el => {
    dataForBoson.push(el.title);
});
fs.writeFileSync(`./result/bbs-before-boson.json`, JSON.stringify(dataForBoson, null, 2));

console.log(`ready to send data, length is ${dataForBoson.length}`)
nlp.sentiment(dataForBoson, result => {
    const sentiment = [];
    const resultJSON = JSON.parse(result);
    console.log(`get sentiment data, length is ${resultJSON.length}`)
    _.forEach(resultJSON, (el, idx) => {
        sentiment.push({text: dataForBoson[idx], url: sliced[idx].url, sentiment: el});
    });
    
    fs.writeFileSync(`./result/bbs-sentiment.json`, JSON.stringify(_.sortBy(sentiment, o => o.sentiment[0]), null, 2));

});