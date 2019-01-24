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
// - updatedAt
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
  hasExternalMembers() {
    return ThreadUsers.find({threadId: this._id, userType: 'Contacts'}).count() > 0;
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
