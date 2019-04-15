import { resetDatabase } from 'meteor/xolvio:cleaner';

Meteor.methods({
  'resetDatabase'() {
    if (!Meteor.isDevelopment) {
      throw new Meteor.Error('resetDatabase is not allowed outside development')
    }

    resetDatabase();
  }
});