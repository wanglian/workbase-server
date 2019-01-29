Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
  extended: true,
  limit: '10mb'
}));

// mailgun 收取邮件
Router.route('/api/v1/mailgun', {
  where: 'server'
}).post(function(req, res, next) {
  console.log("[mailgun] email received");
  res.end("success");

  let body = req.body;
  if (!_.isEmpty(body)) {
    // console.log(body);
    MailgunEmails.create(body);
  }
});
