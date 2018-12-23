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
  }
});

Messages.after.insert(function(userId, doc) {
  if (doc.userType === 'Contacts' || doc.internal) return;

  let message = this.transform();
  let promise = new Promise(function(resolve, reject) {
    try {
      Mailgun.send(message);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
  promise.catch((e) => {
    console.log("[mailgun] send error:");
    console.log(e);
  });
});
