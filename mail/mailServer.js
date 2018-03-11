var nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('./config')

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: config.email.service,
    auth: {
        user: config.email.user,
        pass: config.email.pass
    }
}));

var sendMail = function (recipient, subject, html, attachments) {

    smtpTransport.sendMail({
        from: config.email.user,
        to: recipient,
        subject: 'SiteAnalysis检测结果' + subject,
        text: 'SiteAnalysis检测结果' + html,
        html: 'SiteAnalysis检测结果' + html,
        attachments: attachments

    }, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('发送成功')
        }
    });
}

module.exports = sendMail;