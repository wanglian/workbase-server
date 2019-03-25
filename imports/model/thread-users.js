// - threadId
// - category: Email, ..
// - scope
// - userType: Users, Contacts, ..
// - userId
// - role: owner, member(default)
// - read
// - archive
// - star
// - archiveAt
// - createdAt
// - updatedAt
// - params: extension
ThreadUsers = new Mongo.Collection('thread-users');

ThreadUsers.helpers({
  thread() {
    return Threads.findOne(this.threadId);
  },
  user() {
    return Users.findOne(this.userId);
  },
  isOwner() {
    return this.role === 'owner';
  }
});
