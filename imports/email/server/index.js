const sendEmail = (message) => {
  // not: messages from cnotacts, internal messages, logs
  if (message.userType === 'Contacts' || message.internal || message.contentType === 'log') {
    return false;
  }

  try {
    Mailgun.send(message);
  } catch (e) {
    console.log("[mailgun] send error:");
    console.log(e);
  }
};

Meteor.methods({
  sendEmail(emails, subject, content, fileIds) {
    check(emails, String);
    check(subject, String);
    check(content, String);
    check(fileIds, Match.Maybe([String]));

    let userId = this.userId;
    let user = Meteor.users.findOne(userId);
    let contacts = Contacts.parse(emails);
    if (!_.isEmpty(contacts)) {
      let threadId = Threads.create(user, 'Email', subject);
      let thread = Threads.findOne(threadId);

      Threads.ensureMember(thread, user);
      contacts.forEach((c) => Threads.ensureMember(thread, c));
      let messageId = Threads.addMessage(thread, user, {
        content,
        fileIds
      });
      return threadId;
    }
  },
  resendEmail(messageId) {
    check(messageId, String);
    let message = Messages.findOne(messageId);
    sendEmail(message);
  }
});

Messages.after.insert(function(userId, doc) {
  sendEmail(this.transform());
});
