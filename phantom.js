var page = require('webpage').create();
page.open('http://www.huaweicloud.com', function() {
    page.evaluate(function() {
      console.log($('a').length);
    });
    phantom.exit();
});