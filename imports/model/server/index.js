import '../';
import './hooks';
import './functions';
import './methods';
import './publications';

Meteor.startup(function() {
  Users.rawCollection().createIndex({"profile.type": 1});
  Users.rawCollection().createIndex({"profile.name": 1});
  Users.rawCollection().createIndex({"profile.noreply": 1});
  Threads.rawCollection().createIndex({category: 1});
  ThreadUsers.rawCollection().createIndex({category: 1});
  ThreadUsers.rawCollection().createIndex({scope: 1});
  ThreadUsers.rawCollection().createIndex({threadId: 1});
  ThreadUsers.rawCollection().createIndex({userType: 1});
  ThreadUsers.rawCollection().createIndex({userId: 1});
  ThreadUsers.rawCollection().createIndex({read: 1});
  ThreadUsers.rawCollection().createIndex({archive: 1}, {sparse: 1}); // sparse - 如果文档中不存在则不启用索引
  ThreadUsers.rawCollection().createIndex({star: 1}, {sparse: 1});
  ThreadUsers.rawCollection().createIndex({spam: 1}, {sparse: 1});
  Messages.rawCollection().createIndex({threadId: 1});
  Messages.rawCollection().createIndex({pinAt: 1});
});
