const bosonnlp = require('bosonnlp');
const fs = require('fs');
const _ = require('lodash');

const REPLY_WEIGHT = 10;
const nlp = new bosonnlp.BosonNLP('K9qEzsHn.24856.HLi-kVFBCE1V');
const raw = require('./../result/bbs.json');

const sorted = _.sortBy(_.filter(raw, {status: '[求助]'}), [(o) => -(parseInt(o.view) + REPLY_WEIGHT*parseInt(o.reply))]);
fs.writeFileSync(`./result/bbs-sorted.json`, JSON.stringify(sorted, null, 2));

const sliced = _.slice(sorted, 0, 100);
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
        sentiment.push({text: dataForBoson[idx], sentiment: el});
    });

    fs.writeFileSync(`./result/bbs-sentiment.json`, JSON.stringify(sentiment, null, 2));

});