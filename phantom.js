var page = require('webpage').create();
var count = 0;
page.open('http://www.huaweicloud.com', function() {
    page.evaluate(function() {
      count = $('a').length;
    });
    console.log(count);
    phantom.exit();
});