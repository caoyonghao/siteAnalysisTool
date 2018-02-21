var $ = require("./jq").jq();
 
$.get("http://www.aliyun.com", "gbk", function (html) {
    var title = html.find("title").text();
    console.log(html);
});