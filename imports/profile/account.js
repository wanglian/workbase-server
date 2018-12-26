ThreadCategories.add("Account", {
  icon: "fa fa-cog",
  iconUnread: "fa fa-cog",
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