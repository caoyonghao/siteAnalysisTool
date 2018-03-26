module.exports = {
    //邮件配置
 snapshot: {
     tasks: [{
         id: 'homepage',
         url: 'https://www.huaweicloud.com/'
     }, {
        id: 'product',
        url: 'https://www.huaweicloud.com/product/'
    }, {
        id: 'ecs',
        url: 'https://www.huaweicloud.com/product/ecs.html'
    }, {
        id: 'solution',
        url: 'https://www.huaweicloud.com/solution/'
    }, {
        id: 'solution',
        url: 'https://www.huaweicloud.com/solution/businesscloud/'
    }, {
        id: 'activity',
        url: 'https://activity.huaweicloud.com/promotion/'
    }, {
        id: 'help',
        url: 'https://support.huaweicloud.com/index.html'
    }]
 },
 crawler: {
     tasks: [{
         url: 'https://support.huaweicloud.com/index.html',
         phantom: true,
         filter: ['https://support.huaweicloud.com/', 'https://support.huaweicloud.com/']
     }]
 }
}
