const fs = require('fs');

const fileName = process.argv[2] || './mock/wordText.txt';
const contentArray = fs.readFileSync(fileName).toString().split('\n');
const htmlModule = [];

contentArray.forEach((str) => {
    // TODO: change method of get line number
    const lineNum = str.slice(0, str.indexOf(' '));
    const depth = lineNum.split('.');
    if (depth === 0) {
        const head = `<div class="law_st-2" name="article-1" id="article-1">${str}</div>`
    } else if (depth === 1) {
        const depthOne = `<li class="">${str}</li>`
    }
})

