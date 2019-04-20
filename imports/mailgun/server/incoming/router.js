Router.onBeforeAction(Iron.Router.bodyParser.urlencoded({
  extended: true,
  limit: '10mb'
}));

Router.route('/api/v1/mailgun', {
  where: 'server'
}).post(function(req, res, next) {
  res.end("success");

  let body = req.body;
  if (!_.isEmpty(body)) {
    MailgunEmails.create(body);
  }
});
