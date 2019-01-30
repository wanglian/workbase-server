Meteor.startup(() => {
  Migrations.unlock();
  Migrations.migrateTo('latest');
});
