import './mailgun-emails';

// mailgun 收取邮件
Router.route('/api/v1/mailgun', {
  where: 'server'
}).post(function(req, res, next) {
  console.log("[mailgun] email received");
  // console.log(req.body);
  MailgunEmails.create(req.body);
  res.end("success");
});
