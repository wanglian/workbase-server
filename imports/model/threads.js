import { ThreadCategories } from './thread-categories';

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
  hasOwner(user) {
    return ThreadUsers.find({threadId: this._id, userType: user.className(), userId: user._id, role: 'owner'}).count() > 0;
  },
  details() {
    clientOnly();
    let c = ThreadCategories.get(this.category);
    return c && c.details;
  },
  showDetails() {
    return this.details();
  },
  actions() {
    clientOnly();
    let c = ThreadCategories.get(this.category);
    return typeof(c.actions) == "function" ? c.actions(this) : [];
  },
  lastMessage() {
    return Messages.findOne(this.lastMessageId);
  }
});

Threads.boxes = ['inbox', 'channel', 'admin', 'star', 'archive', 'spam'];

export { Threads };