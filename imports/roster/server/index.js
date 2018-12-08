import '../chat';
import './methods';

Messages.before.insert(function(userId, doc) {
  let thread = Threads.findOne(doc.threadId);
  if (thread.category === 'Chat') {
    let tu = ThreadUsers.findOne({threadId: doc.threadId, userId: doc.userId});
    let chat = Users.findOne(tu.params.chat);
    Threads.ensureMember(thread, chat, {chat: doc.userId});
  }
});
