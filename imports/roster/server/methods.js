Meteor.methods({
  startChat(userId) {
    check(userId, String);
    console.log(userId);

    let user = Users.findOne(this.userId);
    let chatUser = Users.findOne(userId);
    if (chatUser) {
      let tu = ThreadUsers.findOne({userType: 'Users', userId: this.userId, chat: userId});
      let threadId = tu && tu.threadId;
      if (!threadId) {
        threadId = Threads.create(user, 'Chat', 'Chat');
        thread = Threads.findOne(threadId);
        Threads.ensureMember(thread, user, {chat: userId});
      }
      return threadId;
    }
  },
  addMember(email, name, title) {
    check(name, String);
    check(email, String);
    check(title, Match.Maybe(String));

    return Accounts.createUser({
      email,
      profile: {
        name,
        title
      }
    })
  },
  editMember(id, email, name, title) {
    check(id, String);
    check(name, String);
    check(email, String);
    check(title, Match.Maybe(String));

    let user = Users.findOne(id);
    if (user) {
      if (email != user.email()) {
        Accounts.removeEmail(id, user.email());
        Accounts.addEmail(id, email);
      }
      if (name != user.name()) Users.update(id, {$set: {"profile.name": name}});
      if (title != user.title()) Users.update(id, {$set: {"profile.title": title}});
    }
  }
});
