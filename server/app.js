const express = require('express');
const app = express();

const { crawler } = require('./../console.js')

app.use(express.static('dist'));

app.get('/rest/v1/crawler/', function (req, res) {
  console.log('someone requesting');
  res.send('Hello World');
  crawler.setupCrawlerTask({id: new Date().getTime(), target: 'https://www.huaweicloud.com/notice/1477380522345.html'});
})
app.get('/rest/v1/crawler/query', function (req, res) {
  const tasks = crawler.queryCrawlerTask();
  res.send(JSON.stringify(tasks));
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})