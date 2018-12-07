Meteor.methods({
  addChannel(email, name) {
    check(name, String);
    check(email, String);

    let id = Channels.create(email, name);
    ChannelUsers.ensureMember(id, this.userId);

    return id;
  },
  editChannel(id, email, name) {
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
  }
});