// - threadId
// - category: Email, ..
// - userType: Users, Contacts, ..
// - userId
// - read
// - createdAt
// - updatedAt
ThreadUsers = new Mongo.Collection('thread_users');

ThreadUsers.helpers({
  user() {
    return eval(this.userType).findOne(this.userId);
  }
});
