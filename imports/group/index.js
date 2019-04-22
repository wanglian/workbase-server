Threads.helpers({
  // group name
  name() {
    return _.isArray(this.subject) ? null : this.subject;
  }
});

LogTypes.add("group.create", { i18nKey: "log_create_group" });
LogTypes.add("group.name.update", { i18nKey: "log_update_group_name" });
