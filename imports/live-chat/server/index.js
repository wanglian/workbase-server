import '../live-chat';

// TODO protect live.chat
const createLiveChat = () => {
  let email = `live.chat@${Instance.domain()}`;
  let channel = Accounts.findUserByEmail(email);
  return channel && channel._id || Accounts.createUser({
    email,
    profile: {
      type: 'Channels',
      name: 'Live Chat',
      livechat: true
    }
  });
};

Meteor.startup(function() {
  let thread = Threads.findOne({category: 'AdminLiveChat'});
  if (thread) {
    Threads.update(thread._id, {$set: {scope: 'test'}});
  } else {
    // Threads.create(null, 'AdminLiveChat', 'thread_live_chat', 'admin');
  }
});

// Accounts.onLogin(function(attempt) {
//   // admin
//   let user = Users.findOne(attempt.user._id);
//   if (user && user.isAdmin()) {
//     let thread = Threads.findOne({category: 'AdminLiveChat'});
//     let channelId = createLiveChat();
//     thread && Threads.ensureMember(thread, user, {channelId});
//   }
// });

// - channel
// - contact
const startLiveChat = (channel, contact) => {
  let tu = ThreadUsers.findOne({userType: 'Contacts', userId: contact._id, "params.chat": channel._id});

  let threadId = tu && tu.threadId;
  if (!threadId) {
    threadId = Threads.create(contact, 'LiveChat', 'Live Chat', 'protected');
  }

  let thread = Threads.findOne(threadId);
  Threads.ensureMember(thread, contact, {chat: channel._id});
  Threads.ensureMember(thread, channel, {chat: contact._id});

  return thread;
};

Meteor.methods({
  sendLiveChatMessage(email, name, content) {
    check(email, String);
    check(name, Match.Maybe(String));
    check(content, String);

    let address = `${name} <${email}>`;
    let contact = Contacts.parseOne(address);
    let channel = Channels.findOne({"profile.type": 'Channels', "profile.livechat": true});
    if (channel) {
      let thread = startLiveChat(channel, contact, address);
      return Threads.addMessage(thread, contact, {
        content,
        email: {from: address} // 保存联系人原始信息
      });
    }
  }
});
