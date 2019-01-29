import './parser';
import './router';

MailgunEmails.before.insert(function(user, doc) {
  doc.createdAt = new Date();
});

const parseEmail = (email) => {
  parseMailgunEmail(email).then((id) => {
    console.log("[mailgun] " + id);
    MailgunEmails.update(email._id, {$set: {parsedAt: new Date()}});
  }).catch((e) => {
    console.log("[mailgun] error:");
    MailgunEmails.update(email._id, {$set: {error: e.stack}});
    console.log(e);
  });
};

MailgunEmails.create = (params) => {
  let email = MailgunEmails.findOne({emailId: params['Message-Id']});
  if (email) {
    // same email
    if (email.parsedAt) {
      console.log("[mailgun] drop");
      return false;
    }
  } else {
    let _id = MailgunEmails.insert({
      emailId: params['Message-Id'],
      params: params
    });
    email = MailgunEmails.findOne(_id);
  }
  parseEmail(email);
};

Meteor.methods({
  parseMailgunEmail(id) {
    check(id, String);
    let email = MailgunEmails.findOne(id);
    email && parseEmail(email);
  }
});

Meteor.publish("mailgun.emails", function() {
  return MailgunEmails.find({parsedAt: {$exists: false}}, {sort: {createdAt: -1}});
});
