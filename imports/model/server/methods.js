Meteor.methods({
  markRead(threadId) {
    check(threadId, String);
    ThreadUsers.update({threadId, userType: 'Users', userId: this.userId}, {$set: {read: true}});
  },
  sendMessage(threadId, content) {
    check(threadId, String);
    check(content, String);

    let userId = this.userId;
    let user = Meteor.users.findOne(userId);
    let thread = Threads.findOne(threadId);
    let threadUser = ThreadUsers.findOne({threadId, userId, userType: 'Users'});
    if (thread && threadUser) {
      return Threads.addMessage(thread, user, {
        content
      });
    }
  },
  sendEmail(email, subject, content) {
    check(email, String);
    check(subject, String);
    check(content, String);

    let userId = this.userId;
    let user = Meteor.users.findOne(userId);
    let contacts = Contacts.parse(email);
    if (!_.isEmpty(contacts)) {
      let threadId = Threads.create('Email', subject);
      let thread = Threads.findOne(threadId);

      Threads.ensureMember(thread, user);
      contacts.forEach(c => Threads.ensureMember(thread, c));
      return Threads.addMessage(thread, user, {
        content
      });
    }
  }
});