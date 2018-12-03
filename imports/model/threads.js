// - category: Email
// - subject
// - lastMessageId
Threads = new Mongo.Collection('threads');

WeWork = {};
WeWork.createThread = (category, subject) => {
  return Threads.insert({
    category,
    subject
  });
};

Threads.helpers({
  addMember(user) {
    return ThreadUsers.insert({
      threadId: this._id,
      userType: user.className(),
      userId:   user._id
    });
  },
  addMessage(user, message) {
    let mid = Messages.insert({
      threadId: this._id,
      userType: user.className(),
      userId:   user._id,
      content:  message.content
    });
    Threads.update(this._id, {$set: {lastMessageId: mid}});
    return mid;
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