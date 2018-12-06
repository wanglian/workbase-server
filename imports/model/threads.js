// - category: Email
// - subject
// - scope: private - only members can reply; protected - everyone can reply; public - everyone can search & view
// - userType
// - userId: created by
// - lastMessageId
// - createdAt
// - updatedAt
Threads = new Mongo.Collection('threads');

Threads.helpers({
  members() {
    return ThreadUsers.find({threadId: this._id}).map(tu => tu.user());
  },
  externalMembers() {
    return ThreadUsers.find({threadId: this._id, userType: 'Contacts'}).map(tu => tu.user());
  },
  hasExternalMembers() {
    return ThreadUsers.find({threadId: this._id, userType: 'Contacts'}).count() > 0;
  },
  lastMessage() {
    return Messages.findOne(this.lastMessageId);
  }
});

let categories = {};
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

ThreadCategories.add("Email", {
  icon: "fa fa-envelope-o",
  iconUnread: "fa fa-envelope"
});