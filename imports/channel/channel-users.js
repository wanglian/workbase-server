// - channelId
// - userId
ChannelUsers = new Mongo.Collection('channel-users');

Channels = Meteor.users;

ChannelUsers.helpers({
  channel() {
    return Users.findOne(this.channelId);
  },
  user() {
    return Users.findOne(this.userId);
  }
});

LogTypes.add("channel.new", { i18nKey: "log_new_channel" });
LogTypes.add("channel.edit", { i18nKey: "log_edit_channel" });
LogTypes.add("channel.member.add", { i18nKey: "log_add_channel_member" });
LogTypes.add("channel.member.remove", { i18nKey: "log_remove_channel_member" });
