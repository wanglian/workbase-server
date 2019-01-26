ThreadCategories.add("Email", {
  icon: "fa fa-envelope-open-o",
  iconUnread: "fa fa-envelope-o",
  details: ['Email', 'Search', 'Members', 'Files'],
  actions() {
    return [
      {
        title: I18n.t('Star'),
        icon(thread) {
          return thread.star ? "fa fa-star text-yellow" : "fa fa-star-o";
        },
        action(thread) {
          toggleStarThread.call({threadId: thread._id});
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
          if (!thread.archive) { // 修改前状态
            let router = Router.current();
            Router.go(router.route.getName(), {}, {query: router.params.query});
          }
        }
      }
    ]
  }
});
