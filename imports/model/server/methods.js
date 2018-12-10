Meteor.methods({
  markRead(threadId) {
    check(threadId, String);
    ThreadUsers.update({threadId, userType: 'Users', userId: this.userId}, {$set: {read: true}});
  },
  sendMessage(threadId, content, internal=false) {
    check(threadId, String);
    check(content, String);

    let userId = this.userId;
    let user = Meteor.users.findOne(userId);
    let thread = Threads.findOne(threadId);
    let threadUser = ThreadUsers.findOne({threadId, userId, userType: 'Users'});
    if (thread && thread.scope != 'private' || threadUser) {
      return Threads.addMessage(thread, user, {
        content,
        internal
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
      let threadId = Threads.create(user, 'Email', subject);
      let thread = Threads.findOne(threadId);

      Threads.ensureMember(thread, user);
      contacts.forEach(c => Threads.ensureMember(thread, c));
      return Threads.addMessage(thread, user, {
        content
      });
    }
  },
  queryContacts(keyword) {
    check(keyword, String);

    let search = {$or: [
      {"profile.name": {$regex: keyword, $options: 'i'}},
      {email: {$regex: keyword, $options: 'i'}}
    ]};
    let contacts = Contacts.find(search, {limit: 5}).map(c => [{name: c.name(), email: c.email}]);
    let users = Users.find(search, {limit: 5}).map(c => [{name: c.name(), email: c.email()}]);
    return _.union(users, contacts);
  }
});