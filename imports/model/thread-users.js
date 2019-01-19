// - threadId
// - category: Email, ..
// - scope
// - userType: Users, Contacts, ..
// - userId
// - role: owner, member(default)
// - read
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

LogTypes.add("thread.members.add", { i18nKey: "log_add_thread_members" });
LogTypes.add("thread.members.remove", { i18nKey: "log_remove_thread_member" });
