// - category: Email
// - subject
Threads = new Mongo.Collection('threads');

// - email
// - name
Contacts = new Mongo.Collection('contacts');

// - threadId
// - userType: user, contact
// - userId
ThreadUsers = new Mongo.Collection('thread_users');

// - threadId
// - userType: user, contact
// - userId
// - content
Messages = new Mongo.Collection('messages');

WeWork = {};
WeWork.createThread = (subject) => {
  return Threads.insert({
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
    return Messages.insert({
      threadId: this._id,
      userType: user.className(),
      userId:   user._id,
      content:  message.content
    });
  }
});

Contacts.helpers({
  className() {
    return 'Contacts';
  }
});

Meteor.users.helpers({
  className() {
    return 'Meteor.users';
  }
});