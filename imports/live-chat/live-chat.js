ThreadCategories.add("LiveChat", {
  icon: "fa fa-commenting-o",
  iconUnread: "fa fa-commenting",
  title(thread, detail=false) { // client only
    return I18n.t(thread.subject);
  },
  details: ['Members']
});

ThreadCategories.add("AdminLiveChat", {
  icon: "fa fa-cog fa-1-2x",
  iconUnread: "fa fa-cog fa-1-2x",
  title(thread, detail=false) { // client only
    return I18n.t(thread.subject);
  },
  details: ['Members'],
  actions() {
    return [
      {
        title: I18n.t('Members'),
        action() {
          let channel = Channels.findOne({"profile.type": 'Channels', "profile.livechat": true});
          Modal.show('ChannelMembersModal', channel, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('Settings'),
        action() {

        }
      }
    ]
  }
});
