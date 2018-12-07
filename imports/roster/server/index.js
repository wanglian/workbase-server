import '../chat';
import './publications';

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
  addMember(name, email, title) {
    check(name, String);
    check(email, String);
    check(title, Match.Maybe(String));

    return Accounts.createUser({
      email: [email, Instance.domain].join('@'),
      profile: {
        name,
        title
      }
    })
  }
});
