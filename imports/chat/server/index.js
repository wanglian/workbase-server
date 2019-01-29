import '../chat';

// from owner to member
const WELCOME_MAIL = {
  subject: () => {
    return `${Instance.company()} 欢迎你！`;
  },
  content: (user) => {
    return `你好，${user.name()}！
我们为你开通了工作帐号，你可以在这里
- 收发邮件
- 与工作伙伴即时沟通

如有任何问题，可以在这里给我发消息。`;
  }
};

Accounts.onLogin(function(attempt) {
  let user = Users.findOne(attempt.user._id);
  // welcome
  if (ThreadUsers.find({category: 'Chat', userType: 'Users', userId: user._id}).count() === 0) {
    let admin = Instance.admin();
    if (admin._id != user._id) {
      let thread = Threads.startChat(admin, user);
      Threads.addMessage(thread, admin, {
        content: WELCOME_MAIL.content(user)
      });
    }
  }
});

Messages.before.insert(function(userId, doc) {
  let thread = Threads.findOne(doc.threadId);
  if (thread.category === 'Chat') {
    let tu = ThreadUsers.findOne({threadId: doc.threadId, userId: doc.userId, category: 'Chat'});
    let chat = Users.findOne(tu.params.chat);
    Threads.ensureMember(thread, chat, {chat: doc.userId});
    if (chat.external()) {
      doc.internal = false; // 尽管在/imports/model/server/hooks里有处理，但是多个hooks的执行顺序没有保证，所以在此加上处理
    }
  }
});

Threads.startChat = (user, chatUser) => {
  let tu = ThreadUsers.findOne({userType: 'Users', userId: user._id, "params.chat": chatUser._id});
  tu = tu || ThreadUsers.findOne({userType: 'Users', userId: chatUser._id, "params.chat": user._id});

  let threadId = tu && tu.threadId;
  if (!threadId) {
    threadId = Threads.create(user, 'Chat', 'Chat');
  }

  let thread = Threads.findOne(threadId);
  Threads.ensureMember(thread, user, {chat: chatUser._id});

  return thread;
};

Meteor.methods({
  startChat(userId) {
    check(userId, String);

    let user = Users.findOne(this.userId);
    let chatUser = Users.findOne(userId);
    if (chatUser) {
      let thread = Threads.startChat(user, chatUser);
      return thread._id;
    }
  }
});
