import './mailgun-emails';

Router.configureBodyParsers = function() {
  Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
  }));
};
// mailgun 收取邮件
Router.route('/api/v1/mailgun', {
  where: 'server'
}).post(function(req, res, next) {
  console.log("[mailgun] email received");
  let body = req.body;
  if (!_.isEmpty(body)) {
    // console.log(body);
    try {
      MailgunEmails.create(body);
    } catch (e) {
      console.log("[mailgun] error:");
      console.log(e);
    }
  }
  res.end("success");
});
