// - channelId
// - userId
ChannelUsers = new Mongo.Collection('channel-users');

Channels = Meteor.users;

Channels.helpers({
  className() {
    if (this.profile.channel) {
      return 'Channels';
    }
    return 'Users';
  }
});

ChannelUsers.helpers({
  user() {
    return Users.findOne(this.userId);
  }
});
