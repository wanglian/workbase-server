Threads.startLiveChat = (contact, user) => {
  let tu = ThreadUsers.findOne({userType: 'Contacts', userId: contact._id, "params.livechat": user._id});

  let threadId = tu && tu.threadId;
  if (!threadId) {
    threadId = Threads.create(contact, 'LiveChat', 'Live Chat', 'protected');
  }

  let thread = Threads.findOne(threadId);
  Threads.ensureMember(thread, contact, {chat: user._id});
  Threads.ensureMember(thread, user, {chat: contact._id});

  return thread;
};

Meteor.methods({
  setup(name, email, password) {
    Users.remove({});
    let adminId = Accounts.createUser({
      email,
      password,
      profile: {
        type: 'Users',
        name,
        title: 'Admin',
        role: 'admin'}
    });

    let instance = Instance.get();
    Instance.update(instance._id, {$set: {adminId}});

    return adminId;
  },
  sendLiveChat(email, name, content) {
    check(email, String);
    check(name, Match.Maybe(String));
    check(content, String);

    let contact = Contacts.parseOne(`${name} <${email}>`);
    let channel = Channels.findOne({"profile.type": 'Channels', "profile.livechat": true});
    if (channel) {
      let thread = Threads.startLiveChat(contact, channel);
      return Threads.addMessage(thread, contact, {
        content
      });
    }
  }
});
