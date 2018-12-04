Meteor.methods({
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
  }
});