// - category: Email
// - subject
// - scope:
//  - private: only members can reply [inbox]
//  - protected: everyone can reply [channel]
//  - public: everyone can search & view [shared]
//  - admin: admin threads [admin]
// - userType
// - userId: created by
// - lastMessageId
// - createdAt
// - updatedAt: lastMessageAt
Threads = new Mongo.Collection('threads');

Threads.helpers({
  user() {
    return Users.findOne(this.userId);
  },
  threadUsers() {
    return ThreadUsers.find({threadId: this._id}, {fields: {read: 0}});
  },
  members() {
    return ThreadUsers.find({threadId: this._id}).map(tu => tu.user());
  },
  externalMembers() {
    return ThreadUsers.find({threadId: this._id, userType: 'Contacts'}).map(tu => tu.user());
  },
  hasReplyableExternalMembers() {
    return this.externalMembers().some((contact) => {
      return !contact.noreply();
    });
  },
  isReplyable() {
    let count = ThreadUsers.find({threadId: this._id}).count();
    let countContacts = ThreadUsers.find({threadId: this._id, userType: 'Contacts'}).count();
    // 无内部用户参与的外部邮件，且外部邮件无须回复
    return count === 1 || (count - countContacts) > 1 || this.hasReplyableExternalMembers();
  },
  hasOwner(user) {
    return ThreadUsers.find({threadId: this._id, userType: user.className(), userId: user._id, role: 'owner'}).count() > 0
  },
  details() {
    let c = ThreadCategories.get(this.category);
    return c && c.details;
  },
  showDetails() {
    return this.details();
  },
  actions() {
    let c = ThreadCategories.get(this.category);
    return typeof(c.actions) == "function" ? c.actions() : [];
  },
  lastMessage() {
    return Messages.findOne(this.lastMessageId);
  }
});

// === Thread Categories ===
let categories = {};
// - icon
// - iconUnread
// - details [] 详情模块
// - title
// - actions [] 菜单
//  - icon
//  - title
//  - action function
ThreadCategories = {
  add: (category, defs) => {
    let _obj = {};
    _obj[category] = defs;
    _.extend(categories, _obj);
  },
  get: (category) => {
    return categories[category];
  }
};

LogTypes.add("thread.members.add", { i18nKey: "log_add_thread_members" });
LogTypes.add("thread.members.remove", { i18nKey: "log_remove_thread_member" });
LogTypes.add("thread.revoke", { i18nKey: "log_remoke_thread_message" });

// === Thread Actions ===
ThreadActions = {};
ThreadActions.star = {
  title: I18n.t('Star'),
  icon(thread) {
    return thread.star ? "fa fa-star text-yellow" : "fa fa-star-o";
  },
  action(thread) {
    toggleStarThread.call({threadId: thread._id});
  }
};
ThreadActions.archive = {
  title(thread) {
    return thread.archive ? I18n.t('Cancel Archive') : I18n.t('Archive');
  },
  icon(thread) {
    return thread.archive ? "" : "fa fa-archive";
  },
  action(thread) {
    let count = toggleArchiveThread.call({threadId: thread._id});
    if (count === 1 && !thread.archive) { // 修改前状态
      let router = Router.current();
      Router.go(router.route.getName(), {}, {query: router.params.query});
    }
  }
};
ThreadActions.search = {
  title: I18n.t("Search"),
  icon: "fa fa-search",
  action(thread) {
    Modal.show('ThreadSearchModal', thread, {
      backdrop: 'static'
    });
  }
};
