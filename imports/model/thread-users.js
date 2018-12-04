// - threadId
// - userType: user, contact
// - userId
// - read
// - createdAt
// - updatedAt
ThreadUsers = new Mongo.Collection('thread_users');

ThreadUsers.before.insert(function(userId, doc) {
  doc.createdAt = new Date();
});

ThreadUsers.before.update(function(userId, doc, fieldNames, modifier, options) {
  modifier.$set = modifier.$set || {};
  modifier.$set.updatedAt = new Date();
});
