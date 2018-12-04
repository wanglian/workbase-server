MailgunEmails = new Mongo.Collection('mailgun_emails');

MailgunEmails.create = (params) => {
  let email = MailgunEmails.findOne({emailId: params['Message-Id']});
  if (email) {
    // same email
    console.log("[mailgun] drop");
  } else {
    return MailgunEmails.insert({
      emailId: params['Message-Id'],
      params: params
    });
  }
};

MailgunEmails.after.insert(function(userId, doc) {
  MailgunEmails.parseEmail(doc.params);
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
        profile: {
          name: attrs.name() || attrs.user()
        }
      });
      contact = Contacts.findOne(contactId);
    }
    return contact;
  }
};

MailgunEmails.parseEmail = (params) => {
  let subject    = params['subject'];
  let from       = params['From'];
  let to         = params['To'];
  let cc         = params['Cc'];
  let recipient  = params['recipient'];
  let content    = params['body-html'] || `<pre>${params['body-plain']}</pre>`
  let replyTo    = params['In-Reply-To'];
  let date       = params['Date'];
  let references = params['References'];
  let emailId    = params['Message-Id'];

  let threadId;
  references = references && references.split(' ') || [];
  replyTo && _.union(references, [replyTo]);
  if (!_.isEmpty(references)) {
    let message = Messages.findOne({emailId: {$in: references}});
    threadId    = message && message.threadId;
  }
  if (!threadId) {
    threadId = Threads.create('Email', subject);
  }
  let thread = Threads.findOne(threadId);

  let fromUser = findOrCreateUser(parseEmailAddress(from)[0]);
  let toUser   = findOrCreateUser(parseEmailAddress(recipient)[0]);

  Threads.ensureMember(thread, fromUser);
  Threads.ensureMember(thread, toUser);
  Threads.addMessage(thread, fromUser, {
    content,
    emailId
  });
};