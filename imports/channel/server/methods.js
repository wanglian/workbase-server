const logChannelAdmin = (admin, content) => {
  let thread = Threads.findOne({category: 'Channel'});
  Threads.addMessage(thread, admin, {
    contentType: 'log',
    content
  });
};

Meteor.methods({
  addChannel(email, name) {
    check(name, String);
    check(email, String);

    let channelId = Channels.create(email, name);

    let admin = Users.findOne(this.userId);
    let channel = Channels.findOne(channelId);
    logChannelAdmin(admin, {
      action: 'channel.new',
      params: {
        channel: channel.address()
      }
    });

    return channelId;
  },
  editChannel(id, email, name) {
    check(id, String);
    check(name, String);
    check(email, String);

    let channel = Channels.findOne(id);
    if (id) {
      let prev = channel.address();

      if (email !== channel.email()) {
        Accounts.removeEmail(id, channel.email());
        Accounts.addEmail(id, email);
      }
      if (name !== channel.name()) {
        Channels.update(id, {$set: {"profile.name": name}});
      }

      let admin = Users.findOne(this.userId);
      channel.findOne(id);
      logChannelAdmin(admin, {
        action: 'channel.edit',
        params: {
          prev,
          now: channel.address()
        }
      });
    }
  },
  addChannelMember(id, userId) {
    check(id, String);
    check(userId, String);

    ChannelUsers.ensureMember(id, userId);

    let admin = Users.findOne(this.userId);
    let channel = Channels.findOne(id);
    let member = Users.findOne(userId);
    logChannelAdmin(admin, {
      action: 'channe.member.add',
      params: {
        channel: channel.address(),
        member: member.address()
      }
    });
  },
  removeChannelMember(id, userId) {
    check(id, String);
    check(userId, String);

    ChannelUsers.removeMember(id, userId);

    let admin = Users.findOne(this.userId);
    let channel = Channels.findOne(id);
    let member = Users.findOne(userId);
    logChannelAdmin(admin, {
      action: 'channe.member.remove',
      params: {
        channel: channel.address(),
        member: member.address()
      }
    });
  }
});
