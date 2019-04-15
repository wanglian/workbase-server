Meteor.methods({
  'resetDatabase'() {
    if (!Meteor.isDevelopment) {
      throw new Meteor.Error('resetDatabase is not allowed outside development')
    }

    MongoInternals.defaultRemoteCollectionDriver().mongo.db.dropDatabase();
  }
});