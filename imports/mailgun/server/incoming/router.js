import './mailgun-emails';

const saveMail = (params) => {
  let email = MailgunEmails.findOne({messageId: params['Message-Id']});
  if (email) {
    // same email
    console.log("[mailgun] drop");
  } else {
    MailgunEmails.insert({
      messageId: params['Message-Id'],
      params: params
    });
  }
};

// mailgun 收取邮件
Router.route('/api/v1/mailgun', {
  where: 'server'
}).post(function(req, res, next) {
  console.log("[mailgun] email received");

  saveMail(req.body);

  res.end("success");
});
