import './parser';
import './router';

MailgunEmails.before.insert(function(user, doc) {
  doc.createdAt = new Date();
});

const parseEmail = (email) => {
  parseMailgunEmail(email).then(() => {
    // MailgunEmails.update(email._id, {$set: {parsedAt: new Date()}});
  }).catch((e) => {
    MailgunEmails.update(email._id, {$set: {error: e.stack}});
  });
};

MailgunEmails.create = (params) => {
  let email = MailgunEmails.findOne({emailId: params['Message-Id']});
  if (email) {
    // same email: drop
    if (email.parsedAt) {
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
  },
  removeMailgunEmail(id) {
    check(id, String);
    return MailgunEmails.remove({_id: id});
  }
});

Meteor.publish("mailgun.emails", function() {
  return MailgunEmails.find({parsedAt: {$exists: false}}, {sort: {createdAt: -1}});
});
