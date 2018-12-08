Meteor.methods({
  startChat(userId) {
    check(userId, String);

    let user = Users.findOne(this.userId);
    let chatUser = Users.findOne(userId);
    if (chatUser) {
      let tu = ThreadUsers.findOne({userType: 'Users', userId: this.userId, chat: userId});
      if (!tu) {
        tu = ThreadUsers.findOne({userType: 'Users', userId: userId, chat: this.userId});
        if (tu) {
          Threads.ensureMember(thread, user, {chat: userId});
        }
      }

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
    });
  },
  editMember(id, email, name, password, title) {
    check(id, String);
    check(name, String);
    check(email, String);
    check(password, Match.Maybe(String));
    check(title, Match.Maybe(String));

    let user = Users.findOne(id);
    if (user) {
      if (email != user.email()) {
        Accounts.removeEmail(id, user.email());
        Accounts.addEmail(id, email);
      }
      if (password) Accounts.setPassword(id, password);
      if (name != user.name()) Users.update(id, {$set: {"profile.name": name}});
      if (title != user.title()) Users.update(id, {$set: {"profile.title": title}});
      return id;
    }
  }
});
