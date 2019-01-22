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
        icon: "fa fa-cog",
        action() {
          Modal.show('ProfileModal', null, {
            backdrop: 'static'
          });
        }
      },
      // {
      //   title: I18n.t('Shares'),
      //   action() {
      //     Router.go('shared', {_id: Meteor.userId()});
      //   }
      // },
      {
        title: I18n.t('Sign out'),
        icon: "fa fa-sign-out",
        action(e) {
          e.preventDefault();
          Meteor.logout();
        }
      }
    ]
  }
});

LogTypes.add("login", { i18nKey: "log_login" });
LogTypes.add("login.failed", { i18nKey: "log_login_failed" });
LogTypes.add("logout", { i18nKey: "log_logout" });
LogTypes.add("profile.update", { i18nKey: "log_update_profile" });
