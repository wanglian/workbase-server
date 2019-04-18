import '../live-chat';
import './view';

ThreadCategories.add("LiveChat", {
  icon: "fa fa-commenting-o",
  iconUnread: "fa fa-commenting",
  title(thread) { // client only
    return thread.params && thread.params.email || I18n.t(thread.subject);
  },
  details: ['Members', 'Search', 'PinMessages', 'Files'],
});

ThreadCategories.add("AdminLiveChat", {
  icon: "fa fa-commenting-o",
  iconUnread: "fa fa-commenting",
  title(thread) { // client only
    return I18n.t(thread.subject);
  },
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  actions() {
    return [
      {
        title: I18n.t('Members'),
        icon: "fa fa-list-ul",
        action() {
          let thread = Threads.findOne({category: 'AdminLiveChat'});
          Modal.show('ChannelMembersModal', {_id: thread.params.channelId}, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('Settings'),
        icon: "fa fa-cog",
        action() {

        }
      }
    ]
  }
});

Router.route('/contact', {
  name: 'contact',
  template: 'Contact',
  waitOn() {
    return Meteor.subscribe("site");
  }
});