ThreadCategories.add("Email", {
  icon: "fa fa-envelope-open-o",
  iconUnread: "fa fa-envelope-o",
  details: ['Email', 'Search', 'Members', 'Files'],
  actions() {
    return [
      {
        title: I18n.t('Star'),
        icon: "fa fa-star",
        action() {
          
        }
      },
      {
        title(thread) {
          return thread.archive ? I18n.t('Cancel Archive') : I18n.t('Archive');
        },
        icon(thread) {
          return thread.archive ? "" : "fa fa-archive";
        },
        action(thread) {
          toggleArchiveThread.call({threadId: thread._id});
          let router = Router.current();
          Router.go(router.route.getName(), {}, {query: router.params.query});
        }
      }
    ]
  }
});
