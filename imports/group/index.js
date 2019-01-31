Threads.helpers({
  // 群聊名称
  name() {
    return _.isArray(this.subject) ? null : this.subject;
  }
});

ThreadCategories.add("Group", {
  icon: "fa fa-comments-o",
  iconUnread: "fa fa-comments",
  details: ['Group', 'Search', 'Members', 'Files'],
  title(thread) {
    clientOnly();

    let members = thread.subject;
    if (_.isArray(members)) {
      let me = Meteor.user();
      _.pull(members, me.name());
      return members.join(', ');
    }
    return thread.subject;
  },
  actions() {
    return [
      ThreadActions.star,
      ThreadActions.search,
      ThreadActions.archive
    ]
  }
});

LogTypes.add("group.create", { i18nKey: "log_create_group" });
LogTypes.add("group.name.update", { i18nKey: "log_update_group_name" });
