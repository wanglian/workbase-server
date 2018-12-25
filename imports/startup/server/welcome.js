// 1 from Will to owner
const ROOT = "Will <will@weaworking.com>";

// 2 from owner to member
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
  if (ThreadUsers.find({userType: 'Users', userId: user._id}).count() === 0) {
    let root = Instance.admin() || Contacts.parseOne(ROOT);
    let threadId = Threads.create(root, 'Email', WELCOME_MAIL.subject());
    let thread = Threads.findOne(threadId);
    Threads.ensureMember(thread, user);
    Threads.ensureMember(thread, root);
    Threads.addMessage(thread, root, {
      content: WELCOME_MAIL.content(user)
    });
  }
});
