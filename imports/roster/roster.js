ThreadCategories.add("Roster", {
  icon: "fa fa-address-book",
  iconUnread: "fa fa-address-book",
  details: ['Members', 'Search', 'PinMessages', 'Files'],
  title(thread) { // client only
    return I18n.t(thread.subject);
  },
  actions() {
    return [
      {
        title: I18n.t('User List'),
        icon: "fa fa-list-ul",
        action() {
          Modal.show('RosterListModal', null, {
            backdrop: 'static'
          });
        }
      },
      {
        title: I18n.t('New User'),
        icon: "fa fa-user-plus",
        action() {
          Modal.show('AddRosterModal', null, {
            backdrop: 'static'
          });
        }
      }
    ]
  }
});

LogTypes.add("user.new", { i18nKey: "log_new_user" });
LogTypes.add("user.edit", { i18nKey: "log_edit_user" });
