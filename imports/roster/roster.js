ThreadCategories.add("Roster", {
  icon: "fa fa-address-book-o fa-1-2x",
  iconUnread: "fa fa-address-book fa-1-2x",
  details: ['Members'],
  title(thread, detail=false) { // client only
    return I18n.t(thread.subject);
  },
  actions() {
    return [
      {
        title: I18n.t('User List'),
        icon: "fa fa-list-ul",
        action() {
          Modal.show('RosterListModal', null, {
            backdrop: 'static',
            keyboard: false
          });
        }
      },
      {
        title: I18n.t('New User'),
        icon: "fa fa-plus",
        action() {
          Modal.show('AddRosterModal', null, {
            backdrop: 'static',
            keyboard: false
          });
        }
      }
    ]
  }
});
