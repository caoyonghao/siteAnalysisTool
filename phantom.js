var page = require('webpage').create();
page.open('http://www.huaweicloud.com', function() {
    page.evaluate(function() {
      $("button").click();
    });
});