Meteor.startup(() => {
  // Migrations._collection.update({}, {$set: {version: 0}});
  Migrations.unlock();
  Migrations.migrateTo('latest');
});
