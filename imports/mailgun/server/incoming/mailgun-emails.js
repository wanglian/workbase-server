// - emailId
// - params
// - parsedAt
MailgunEmails = new Mongo.Collection('mailgun_emails');

MailgunEmails.create = (params) => {
  let email = MailgunEmails.findOne({emailId: params['Message-Id']});
  if (email) {
    // same email
    if (email.parsedAt) {
      console.log("[mailgun] drop");
    } else {
      MailgunEmails.parseEmail(email);
    }
  } else {
    return MailgunEmails.insert({
      emailId: params['Message-Id'],
      params: params
    });
  }
};

MailgunEmails.after.insert(function(userId, doc) {
  MailgunEmails.parseEmail(this.transform());
});

MailgunEmails.parseEmail = (doc) => {
  let params     = doc.params;
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

  let fromUser = Contacts.parseOne(from);

  let threadId;
  references = references && references.split(' ') || [];
  replyTo && _.union(references, [replyTo]);
  if (!_.isEmpty(references)) {
    let message = Messages.findOne({emailId: {$in: references}});
    threadId    = message && message.threadId;
  }
  if (!threadId) {
    threadId = Threads.create(fromUser, 'Email', subject);
  }
  let thread = Threads.findOne(threadId);

  let toUser   = Contacts.parseOne(recipient);
  let toUsers  = Contacts.parse(to);
  Threads.ensureMember(thread, fromUser);
  Threads.ensureMember(thread, toUser);
  toUsers.forEach(user => Threads.ensureMember(thread, user));
  if (cc) {
    let ccUsers  = Contacts.parse(cc);
    ccUsers.forEach(user => Threads.ensureMember(thread, user));
  }

  Threads.addMessage(thread, fromUser, {
    content,
    emailId,
    email: { from, to, cc, date }
  });

  MailgunEmails.update(doc._id, {$set: {parsedAt: new Date()}});
};