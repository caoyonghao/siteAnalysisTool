const fs = require('fs');
const jsdom = require("jsdom");
const $ = require('jquery');
const { JSDOM } = jsdom;
const tasks = require('./data.json');

const result = {};

const runTask = (tasks) => {
    const task = tasks.shift();
    console.log(task.href)
    JSDOM.fromURL(task.href, { runScripts: "outside-only" }).then(dom => {
        $(dom.window.parent).find('script').forEach((el, idx) => {
            if (el.src.indexOf(',') > -1  && el.src.indexOf('??') > -1) {
                const modules = el.src.split('??')[1].split(',');
                modules.forEach((el) => {
                    if (result[el]) {
                        result[el] = result[el] + 1;    
                    } else {
                        result[el] = 1;
                    }
                })
            }
        });
        if (tasks.length) {
            runTask(tasks);
        } else {
            fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
        }
    });
}

runTask(tasks);
