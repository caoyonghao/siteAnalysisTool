var express = require('express');
var app = express();

app.use(express.static('dist'));

app.get('/rest/v1/crawler/', function (req, res) {
  console.log('someone requesting');
  res.send('Hello World');
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("应用实例，访问地址为 http://%s:%s", host, port)

})