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

ThreadCategories.add("Channel", {
  icon: "fa fa-slack",
  iconUnread: "fa fa-slack",
  title(thread) { // client only
    return I18n.t(thread.subject);
  },
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  actions() {
    return [
      {
        title: I18n.t('Channel List'),
        icon: "fa fa-list-ul",
        action() {
          Modal.show('ChannelListModal', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('New Channel'),
        icon: "fa fa-plus",
        action() {
          Modal.show('AddChannelModal', null, {
            backdrop: 'static'
          });
        }
      }
    ]
  }
});

LogTypes.add("channel.new", { i18nKey: "log_new_channel" });
LogTypes.add("channel.edit", { i18nKey: "log_edit_channel" });
LogTypes.add("channel.member.add", { i18nKey: "log_add_channel_member" });
LogTypes.add("channel.member.remove", { i18nKey: "log_remove_channel_member" });
