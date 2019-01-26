import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

toggleArchiveThread = new ValidatedMethod({
  name: 'Threads.methods.archive',
  validate: new SimpleSchema({
    threadId: { type: String }
  }).validator(),
  run({ threadId }) {
    // `this` is the same method invocation object you normally get inside
    // Meteor.methods
    if (!this.userId) {
      // Throw errors with a specific error code
      throw new Meteor.Error('Threads.methods.archive.notLoggedIn', 'Must be logged in to make private lists.');
    }

    const tu = ThreadUsers.findOne({threadId, userType: 'Users', userId: this.userId});
    if (tu) {
      Threads.update(tu._id, {$set: {archive: !tu.archive}}); // just for client
      return ThreadUsers.update(tu._id, {$set: {archive: !tu.archive}});
    } else {
      throw new Meteor.Error('Threads.methods.archive.notExist', 'User does not have the thread.');
    }
  }
});

toggleStarThread = new ValidatedMethod({
  name: 'Threads.methods.star',
  validate: new SimpleSchema({
    threadId: { type: String }
  }).validator(),
  run({ threadId }) {
    if (!this.userId) {
      throw new Meteor.Error('Threads.methods.star.notLoggedIn', 'Must be logged in to make private lists.');
    }

    const tu = ThreadUsers.findOne({threadId, userType: 'Users', userId: this.userId});
    if (tu) {
      Threads.update(tu._id, {$set: {star: !tu.star}}); // just for client
      return ThreadUsers.update(tu._id, {$set: {star: !tu.star}});
    } else {
      throw new Meteor.Error('Threads.methods.star.notExist', 'User does not have the thread.');
    }
  }
});
