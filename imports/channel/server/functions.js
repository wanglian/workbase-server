Channels.create = (email, name) => {
  let id = Accounts.createUser({
    email,
    profile: {
      channel: true,
      name
    }
  });

  // welcome
  let channel = Channels.findOne(id);
  if (ThreadUsers.find({userType: 'Channels', userId: id}).count() === 0) {
    let root = Contacts.findOne({email: Instance.root.email});
    let threadId = Threads.create(root, 'Email', 'Congratulations!', 'protected');
    let thread = Threads.findOne(threadId);
    Threads.ensureMember(thread, channel);
    Threads.ensureMember(thread, root);
    Threads.addMessage(thread, root, {
      content: "If you have any question, just ask me here..."
    });
  }

  return id;
};

ChannelUsers.ensureMember = (channelId, userId) => {
  ChannelUsers.upsert({channelId, userId}, {$set: {createdAt: new Date()}});
};

ChannelUsers.hasMember = (channelId, userId) => {
  return ChannelUsers.findOne({channelId, userId});
};
