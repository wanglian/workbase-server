// - threadId
// - category: Email, ..
// - userType: Users, Contacts, ..
// - userId
// - role: owner, member(default)
// - read
// - createdAt
// - updatedAt
// - params: extension
ThreadUsers = new Mongo.Collection('thread-users');

ThreadUsers.helpers({
  user() {
    return eval(this.userType).findOne(this.userId);
  }
});
