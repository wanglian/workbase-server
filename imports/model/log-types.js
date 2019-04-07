let _logTypes = {}; // i18nKey
LogTypes = {
  add(type, defs) {
    let _obj = {};
    _obj[type] = defs;
    _.extend(_logTypes, _obj);
  },
  get(type) {
    return _logTypes[type];
  }
};

LogTypes.add("thread.members.add", { i18nKey: "log_add_thread_members" });
LogTypes.add("thread.members.remove", { i18nKey: "log_remove_thread_member" });
LogTypes.add("thread.revoke", { i18nKey: "log_remoke_thread_message" });

export {LogTypes};
