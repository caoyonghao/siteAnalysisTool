const { parseUrl } = require('./lib/phantom/phantom');
parseUrl('https://support.huaweicloud.com/index.html').then((data) => {
    console.log(JSON.parse(data))
});