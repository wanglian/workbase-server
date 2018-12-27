ThreadCategories.add("Account", {
  icon: "fa fa-cog fa-1-2x",
  iconUnread: "fa fa-cog fa-1-2x",
  title(thread, detail=false) { // client only
    return I18n.t(thread.subject);
  },
  details: false,
  actions() {
    return [
      {
        title: I18n.t('Profile'),
        action() {
          Modal.show('ProfileModal', null, {
            backdrop: 'static',
            keyboard: false
          });
        }
      }
    ]
  }
});