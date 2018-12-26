import '../chat';

Messages.before.insert(function(userId, doc) {
  let thread = Threads.findOne(doc.threadId);
  if (thread.category === 'Chat') {
    let tu = ThreadUsers.findOne({threadId: doc.threadId, userId: doc.userId});
    let chat = Users.findOne(tu.params.chat);
    Threads.ensureMember(thread, chat, {chat: doc.userId});
  }
});

Meteor.methods({
  startChat(userId) {
    check(userId, String);

    let user = Users.findOne(this.userId);
    let chatUser = Users.findOne(userId);
    if (chatUser) {
      let tu = ThreadUsers.findOne({userType: 'Users', userId: this.userId, "params.chat": userId});
      if (!tu) {
        tu = ThreadUsers.findOne({userType: 'Users', userId: userId, "params.chat": this.userId});
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
  }
});
