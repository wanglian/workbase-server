MailgunEmails = new Mongo.Collection('mailgun_emails');

MailgunEmails.create = (params) => {
  let email = MailgunEmails.findOne({messageId: params['Message-Id']});
  if (email) {
    // same email
    console.log("[mailgun] drop");
  } else {
    return MailgunEmails.insert({
      messageId: params['Message-Id'],
      params: params
    });
  }
};

MailgunEmails.after.insert(function(userId, doc) {
  WeWork.parseMailgunEmail(doc.params);
});

const emailParser = require('address-rfc2822');
const parseEmailAddress = (emails) => {
  return emailParser.parse(emails);
};

const domain = 'weaworking.com';
const findOrCreateUser = (attrs) => {
  let email = attrs.address;
  if (attrs.host() === domain) {
    return Accounts.findUserByEmail(email);
  } else {
    let contact = Contacts.findOne({email});
    if (!contact) {
      contactId = Contacts.insert({
        email,
        name: attrs.name() || attrs.user()
      });
      contact = Contacts.findOne(contactId);
    }
    return contact;
  }
};

WeWork.parseMailgunEmail = (params) => {
  let subject   = params['subject'];
  let from      = params['From'];
  let to        = params['To'];
  let cc        = params['Cc'];
  // let bcc  = this._bcc;
  let recipient = params['recipient'];
  let content   = params['body-html'] || `<pre>${params['body-plain']}</pre>`
  let replyTo   = params['In-Reply-To'];
  let date      = params['Date'];

  let threadId  = WeWork.createThread('Email', subject);
  let thread    = Threads.findOne(threadId);

  let fromUser  = findOrCreateUser(parseEmailAddress(from)[0]);
  let toUser    = findOrCreateUser(parseEmailAddress(recipient)[0]);

  thread.addMember(fromUser);
  thread.addMember(toUser);

  thread.addMessage(fromUser, {
    content
  });
};