const { spawn } = require('child_process');
const fs = require('fs');
const crawler = spawn('node', ['crawler.js']);
let log = '';
crawler.stdout.on('data', (data) => {
  log = `${log}${new Date()} INFO:${data}`;
});

crawler.stderr.on('data', (data) => {
    log = `${log}${new Date()} ERROR:${data}`;
});

crawler.on('close', (code) => {
    fs.writeFileSync('./log.log', log);
});
