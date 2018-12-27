// - category: Email
// - subject
// - scope: private - only members can reply; protected - everyone can reply; public - everyone can search & view
// - userType
// - userId: created by
// - lastMessageId
// - createdAt
// - updatedAt
import { Index, MinimongoEngine } from 'meteor/easy:search';

Threads = new Mongo.Collection('threads');

ThreadsIndex = new Index({
  collection: Threads,
  fields: ['subject'],
  defaultSearchOptions: {limit: 15},
  engine: new MinimongoEngine({
    sort: () => { updatedAt: -1 },
    selector(searchObject, options, aggregation) {
      // retrieve the default selector
      const selector = this.defaultConfiguration().selector(searchObject, options, aggregation);

      // options.search.userId contains the userId of the logged in user
      // selector.userType = 'Users';
      // selector.userId = options.search.userId;
      let threadIds = ThreadUsers.find({userType: 'Users', userId: options.search.userId}).map(tu => tu.threadId);
      selector._id = {$in: threadIds};
      console.log(selector);
      return selector;
    },
    transform(doc) {
      return Threads.findOne(doc._id);
    }
  })
});

Threads.helpers({
  user() {
    return eval(this.userType).findOne(this.userId);
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
      return !contact.noreply;
    });
  },
  isReplyable() {
    let count = ThreadUsers.find({threadId: this._id}).count();
    let countContacts = ThreadUsers.find({threadId: this._id, userType: 'Contacts'}).count();
    return count === 1 || (count - countContacts) > 1 || this.hasReplyableExternalMembers();
  },
  hasOwner(user) {
    return ThreadUsers.find({threadId: this._id, userType: user.className(), userId: user._id, role: 'owner'}).count() > 0
  },
  title(detail=false) {
    let c = ThreadCategories.get(this.category);
    return typeof(c.title) == "function" ? c.title(this, detail) : this.subject;
  },
  showDetails() {
    let c = ThreadCategories.get(this.category);
    return c && c.details;
  },
  details() {
    let c = ThreadCategories.get(this.category);
    return c && c.details;
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
