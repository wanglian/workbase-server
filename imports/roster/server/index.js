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
  }
});
