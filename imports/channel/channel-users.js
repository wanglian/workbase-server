// - channelId
// - userId
ChannelUsers = new Mongo.Collection('channel-users');

Channels = Meteor.users;

ChannelUsers.helpers({
  user() {
    return Users.findOne(this.userId);
  }
});

ThreadCategories.add("Channel", {
  icon: "fa fa-slack fa-1-2x",
  iconUnread: "fa fa-slack fa-1-2x",
  title(thread, detail=false) { // client only
    return I18n.t(thread.subject);
  },
  details: ['Members'],
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
