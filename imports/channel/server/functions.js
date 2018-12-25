Channels.create = (email, name) => {
  return Accounts.createUser({
    email,
    profile: {
      channel: true,
      type: 'Channels',
      name
    }
  });
};

ChannelUsers.ensureMember = (channelId, userId) => {
  ChannelUsers.upsert({channelId, userId}, {$set: {createdAt: new Date()}});
};

ChannelUsers.removeMember = (channelId, userId) => {
  ChannelUsers.remove({channelId, userId});
};

ChannelUsers.hasMember = (channelId, userId) => {
  return ChannelUsers.findOne({channelId, userId});
};
