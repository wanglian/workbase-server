import '../';
import './hooks';
import './functions';
import './methods';
import './publications';

Meteor.startup(function() {
  Users._ensureIndex({"profile.type": 1});
  Users._ensureIndex({"profile.name": 1});
  Users._ensureIndex({"profile.noreply": 1});
  Threads._ensureIndex({category: 1});
  ThreadUsers._ensureIndex({category: 1});
  ThreadUsers._ensureIndex({scope: 1});
  ThreadUsers._ensureIndex({threadId: 1});
  ThreadUsers._ensureIndex({userType: 1});
  ThreadUsers._ensureIndex({userId: 1});
  ThreadUsers._ensureIndex({read: 1});
  Messages._ensureIndex({threadId: 1});
});
