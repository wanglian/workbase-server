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

export { ThreadUsers };