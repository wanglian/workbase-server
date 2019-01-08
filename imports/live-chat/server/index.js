import '../live-chat';

Meteor.startup(function() {
  Threads.upsert({category: 'AdminLiveChat'}, {$set: {subject: 'Live Chat Management', scope: 'private'}});
});

Accounts.onLogin(function(attempt) {
  // admin
  let admin = Instance.admin();
  if (admin._id === attempt.user._id) {
    let thread = Threads.findOne({category: 'AdminLiveChat'});
    Threads.ensureMember(thread, admin, {admin: true});
  }
});

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
