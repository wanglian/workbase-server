let api_key = 'key-8ygfsuyrnqhip88wryqrzjilak5d1ai5';
let domain = 'weaworking.com';
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
  if (doc.userType === 'Contacts') return;

  let threadId = doc.threadId;
  let contacts = ThreadUsers.find({threadId, userType: 'Contacts'}).map(tu => Contacts.findOne(tu.userId));

  if (!_.isEmpty(contacts)) {
    let thread = Threads.findOne(threadId);
    let user = this.transform().user();

    let params = {
      from:    user.address(),
      to:      contacts.map(c => c.address()),
      subject: thread.subject,
      text:    doc.content
    };

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