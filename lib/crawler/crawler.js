const Crawler = require("crawler");
const fs = require('fs');
const { parseUrl } = require('./../phantom/phantom');
const successTasks = {};
const failTasks = {};
const skipTasks = {};
const taskRunned = {};
const startTime = new Date().getTime();
const siteUrl = process.argv[2] || 'http://www.huaweicloud.com/';
const taskId = process.argv[3] || startTime;
const runCustomTask = process.argv[4];
let scanPath = ['www.huaweicloud.com', 'activity.huaweicloud.com']
let tasks = [];
let taskCount = 0;
let round = 0;

const isInScanPage = (url) => {
    let flag = false;
    scanPath.forEach((el) => {
        if (url.indexOf(el) > -1) {
            flag = true;
        }
    });
    return flag;
}

const resolveUrl = (url, host) => {
    // remove param
    var result = url.split('?')[0].split('#')[0];
    if (!result.startsWith('http')) {
        if (result.startsWith('//')) {
            result = 'http:' + result;
        } else {
            if (result.startsWith('/')) {
                result = host + result;
                if (!result.startsWith('http')) {
                    result = 'http://' + result;
                }
            } else {
                result = '';
            }
        }
    }
    return result;
}
const validateUrl = (url) => {
    let flag = false;
    if (url) {
        flag = true;
    }
    return flag;
}
const cleanTasks = (tasksToClean) => {
    let result = [];
    tasksToClean.forEach(el => {
        var uri = el.uri;
        // 去掉已经运行的任务
        if (!taskRunned[uri]) {
            // 去掉重复任务
            let hasTask = false;
            result.forEach(e => {
                if (e.uri === uri) {
                    hasTask = true;
                }
            })
            if (!hasTask) {
                // TODO:去掉非法任务
                result.push(el);
            }
        }
    });
    return result;
}

var crawler = new Crawler({
    maxConnections : 5,
    retries: 0,
    timeout: 3000,
    retryTimeout: 1000,
    preRequest: (option, done) => {
        taskRunned[option.uri] = true;
        console.log((taskCount++) + '   ' + option.uri);
        done();
    },
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error || res.statusCode !== 200){
            if (!res.request) {
                console.log("error: uri error=>", error);
            } else {
                console.log("error: ", res.request.uri.href);
                failTasks[res.request.uri.href] = {parent: res.options.parent};
            }
        }else{
            successTasks[res.request.uri.href] = true;
            const $ = res.$;
            if ($) {
                $('a').each((index, element) => {
                    const url = resolveUrl($(element).attr('href') || '', res.request.uri.host, res.request.uri.href);
                    if (isInScanPage(res.request.uri.href) && validateUrl(url)) {
                        // console.log(`push ${url}`);
                        tasks.push({uri: url, parent: res.request.uri.href});
                    } else {
                        skipTasks[url] = true;
                    }
                });
            }
        }
        done();
    }
});

crawler.on('drain',function(){
    console.log(tasks.length);
    var taskToRun = cleanTasks(tasks);
    tasks = [];
    if (taskToRun.length) {
        fs.writeFileSync(`./result/tasksList${round++}.json`, JSON.stringify(taskToRun, null, 2));
        crawler.queue(taskToRun);
    } else {
        console.log(`finish! Total run ${taskCount} tasks, cost ${new Date().getTime() - startTime}`);
        fs.writeFileSync(`./result/success-${taskId}.json`, JSON.stringify(successTasks, null, 2));
        fs.writeFileSync(`./result/fail-${taskId}.json`, JSON.stringify(failTasks, null, 2));
        fs.writeFileSync(`./result/skip-${taskId}.json`, JSON.stringify(skipTasks, null, 2));
    }
});

// Queue just one URL, with default callback
if (runCustomTask) {
    console.log('fdsf')
    // parseUrl('https://support.huaweicloud.com/index.html').then((data) => {
    //     console.log(JSON.parse(data));
    //     scanPath = ['support.huaweicloud.com'];
    //     const urls = JSON.parse(data);
    //     urls.forEach((el) => {
    //         el.uri = resolveUrl(el.uri, 'https://support.huaweicloud.com');
    //     })
    //     crawler.queue(urls);
    // });
    const urls = [{"uri":"/ecs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/csbs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cce/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/bms/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/as/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/functionstage/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/ims/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dec/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/deh_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cci_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/usermanual-servicestage/zh-cn_topic_0053812706.html ","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dms/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/smn/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cse_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/functiongraph_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/productdesc-apm/apm_06_0006.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/productdesc-aom/aom_06_0006.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/productdesc-cpts/cpts_productdesc_0001.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/bcs_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/apig_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/usermanual-aos/aos_01_0000.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/usermanual-swr/swr_01_0001.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/workspace/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/price-principle/zh-cn_topic_0088492731.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/price-bestpract/zh-cn_topic_0088404785.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/price-bizlogic/zh-cn_topic_0088407240.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/price-fcslogic/zh-cn_topic_0094669296.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/price-declogic/zh-cn_topic_0101321604.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/evs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/vbs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dss_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/obs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cdn/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/sfs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/des/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dess_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/rds/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dds/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dcs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/ddm_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/drs_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cloudim_faq/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cloudvc/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cloudipcc_faq/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/voice_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/PrivateNumber_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/devg-sdk/zh-cn_topic_0070637169.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/devg-sdk_cli/zh-cn_topic_0070637155.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/api_list/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/vpc/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/elb/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/natgateway_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dc/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/vpn/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dns/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/oms/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cdm/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/usermanual-IoT/iot_01_0024.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/qs-consolehome/zh-cn_topic_0016739341.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/mc_faq/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/pro_price/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/pro_features/features_1.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-permissions/zh-cn_topic_0063498930.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-account/zh-cn_topic_0031285551.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-billing/zh-cn_topic_0081343161.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-support/zh-cn_topic_0065264094.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-bpconsole/zh-cn_topic_0071293240.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-marketplace/zh-cn_topic_0046212946.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-ca/zh-cn_topic_0046606215.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/bp_usernotice/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-iaas/zh-cn_topic_0040259342.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/compliance/1486968407000.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-period/zh-cn_topic_0086671074.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/antiddos/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cad/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/webscan/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/hss_gls/glossary.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dbss_gls/glossary.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/kms/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/sas_gls/glossary.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/waf_gls/glossary.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/ssa/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dis/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/mrs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dws/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dps/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/mls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/ges_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/uquery/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/es/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cloudtable/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/ocr_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/ils_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/dls_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/moderation_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/deblur_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/image_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/asr_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/tts_gls/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/ces/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/iam/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/cts/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/ccs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/crs/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/lts_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/tms/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/rts_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1479456954745.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1479457012211.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1492767016468.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1479457040846.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1479457068315.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1492767785690.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1479457091347.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1479457111259.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1496648313109.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"/devcloud/1500256562906.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/sol_disaster/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/sol_migrationcloud_faq/","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/usermanual-hpc/zh-cn_topic_0062552886.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/sap_dld/index.html","parent":"https://support.huaweicloud.com/index.html"},{"uri":"http://support.huaweicloud.com/gc_faq/index.html","parent":"https://support.huaweicloud.com/index.html"}];
    scanPath = ['support.huaweicloud.com'];
    urls.forEach((el) => {
        el.uri = resolveUrl(el.uri, 'https://support.huaweicloud.com');
    })
    crawler.queue(urls);
} else {
    crawler.queue({uri: siteUrl, parent: siteUrl});
}
