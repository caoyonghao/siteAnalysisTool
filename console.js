const { spawn } = require('child_process');
const fs = require('fs');
// const crawler = spawn('node', ['crawler.js']);
// let log = '';
// crawler.stdout.on('data', (data) => {
//   log = `${log}${new Date()} INFO:${data}`;
// });

// crawler.stderr.on('data', (data) => {
//     log = `${log}${new Date()} ERROR:${data}`;
// });

// crawler.on('close', (code) => {
//     fs.writeFileSync('./log.log', log);
// });
const sendMail = require('./mail/mailServer');
sendMail('yonghao.cao@huawei.com', 'send a mail to huawei', 'send a mail to huawei', [  
    {  
      filename : 'package.json',  
      path: './package.json'  
    }
  ]);
