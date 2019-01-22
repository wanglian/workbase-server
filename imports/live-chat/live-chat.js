// Threads.helpers({
//   liveChatUser() {
//     return Contacts.findOne()
//   }
// });

ThreadCategories.add("LiveChat", {
  icon: "fa fa-commenting-o",
  iconUnread: "fa fa-commenting",
  title(thread, detail=false) { // client only
    return thread.params && thread.params.email || I18n.t(thread.subject);
  },
  details: ['Members']
});

ThreadCategories.add("AdminLiveChat", {
  icon: "fa fa-commenting-o",
  iconUnread: "fa fa-commenting",
  title(thread, detail=false) { // client only
    return I18n.t(thread.subject);
  },
  details: ['Members'],
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
