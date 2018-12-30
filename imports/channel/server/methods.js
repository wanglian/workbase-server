Meteor.methods({
  addChannel(email, name) {
    check(name, String);
    check(email, String);

    return Channels.create(email, name);
  },
  editChannel(id, email, name) {
    check(id, String);
    check(name, String);
    check(email, String);

    let channel = Channels.findOne(id);
    if (id) {
      if (email != channel.email()) {
        Accounts.removeEmail(id, channel.email());
        Accounts.addEmail(id, email);
      }
      if (name != channel.name()) Channels.update(id, {$set: {"profile.name": name}});
    }
  },
  addChannelMember(id, userId) {
    check(id, String);
    check(userId, String);

    ChannelUsers.ensureMember(id, userId);
  },
  removeChannelMember(id, userId) {
    check(id, String);
    check(userId, String);

    ChannelUsers.removeMember(id, userId);
  }
});