import '../email';

Meteor.methods({
  sendEmail(emails, subject, content) {
    check(emails, String);
    check(subject, String);
    check(content, String);

    let userId = this.userId;
    let user = Meteor.users.findOne(userId);
    let contacts = Contacts.parse(emails);
    if (!_.isEmpty(contacts)) {
      let threadId = Threads.create(user, 'Email', subject);
      let thread = Threads.findOne(threadId);

      Threads.ensureMember(thread, user);
      contacts.forEach(c => Threads.ensureMember(thread, c));
      Threads.addMessage(thread, user, {
        content
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

const sendEmail = (message) => {
  // 忽略：内部消息和来自外部的消息
  if (message.userType === 'Contacts' || message.internal) return;
  // 忽略：日志
  if (message.contentType === 'log') return;

  new Promise((resolve, reject) => {
    try {
      Mailgun.send(message);
      resolve();
    } catch (e) {
      reject(e);
    }
  }).catch((e) => {
    console.log("[mailgun] send error:");
    console.log(e);
  });
};

Messages.after.insert(function(userId, doc) {
  sendEmail(this.transform());
});
