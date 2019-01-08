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

// - channel
// - contact
// - email Email联系人的原始邮箱信息
Threads.startLiveChat = (channel, contact, email) => {
  let tu = ThreadUsers.findOne({userType: 'Contacts', userId: contact._id, "params.chat": channel._id});

  let threadId = tu && tu.threadId;
  if (!threadId) {
    threadId = Threads.create(contact, 'LiveChat', 'Live Chat', 'protected');
  }

  let thread = Threads.findOne(threadId);
  Threads.ensureMember(thread, contact, {chat: channel._id, email});
  Threads.ensureMember(thread, channel, {chat: contact._id, email});

  return thread;
};

Meteor.methods({
  sendLiveChat(email, name, content) {
    check(email, String);
    check(name, Match.Maybe(String));
    check(content, String);

    let address = `${name} <${email}>`;
    let contact = Contacts.parseOne(address);
    let channel = Channels.findOne({"profile.type": 'Channels', "profile.livechat": true});
    if (channel) {
      let thread = Threads.startLiveChat(channel, contact, address);
      return Threads.addMessage(thread, contact, {
        content,
        email: {from: address} // 保存联系人原始信息
      });
    }
  }
});
