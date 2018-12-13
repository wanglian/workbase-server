let api_key = Meteor.settings.mailgun.key;
let domain = Meteor.settings.public.domain;
let client = require('mailgun-js')({apiKey: api_key, domain: domain});

Mailgun = {
  send: (data, callback) => {
    console.log("[mailgun] send email: ")
    console.log(data);
    client.messages().send(data, function (error, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(body);
      }
      callback && callback(error, body);
    });
  }
};

Messages.after.insert(function(userId, doc) {
  if (doc.userType === 'Contacts' || doc.internal) return;

  let threadId = doc.threadId;
  let contacts = ThreadUsers.find({threadId, userType: 'Contacts'}).map(tu => Contacts.findOne(tu.userId));

  if (!_.isEmpty(contacts)) {
    let thread = Threads.findOne(threadId);
    let user = this.transform().user();

    let params = {
      from:    (doc.email && doc.email.from) || user.address(),
      to:      contacts.map(c => c.address()),
      subject: thread.subject,
      text:    doc.content // Markdown(doc.content): 需要html邮件模板
    };

    // "h:Reply-To" last message
    let last = Messages.findOne({threadId, emailId: {$exists: true}}, {sort: {createdAt: -1}});
    console.log(last);
    let replyTo = last && last.emailId;
    if (replyTo) {
      _.extend(params, {"h:In-Reply-To": replyTo});
    }

    // "h:References"

    Mailgun.send(params, Meteor.bindEnvironment((err, result) => {
      if (!err) {
        Messages.update(doc._id, {$set: {
          emailId: result["id"],
          email: {
            from: params.from,
            to:   params.to.join(", ")
          }
        }});
      }
    }));
  }
});