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
  let threadId = doc.threadId;
  let thread = Threads.findOne(threadId);
  let user = this.transform().user();

  let params = {
    from:    user.address(),
    subject: thread.subject,
    text:    doc.content
  };

  let contactIds = ThreadUsers.find({threadId, userType: 'Contacts'}).map(tu => tu.userId);
  if (doc.userType === 'Contacts') {
    contactIds = _.without(contactIds, doc.userId);
  }
  params.to = Contacts.find({_id: {$in: contactIds}}).map(c => c.address());

  if (!_.isEmpty(params.to)) {
    Mailgun.send(params, Meteor.bindEnvironment((err, result) => {
      if (!err) {
        Messages.update(doc._id, {$set: {emailId: result["id"]}});
      }
    }));
  }
});