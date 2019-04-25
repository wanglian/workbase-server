Meteor.startup(() => {
  // Migrations._collection.update({}, {$set: {version: 0}});
  Migrations.unlock();
  Migrations.migrateTo('latest');
});

Migrations.add({
  version: 1,
  name: 'change i18n keys',
  up() {
    Threads.update({category: 'Roster'}, {$set: {subject: "thread_users_management"}});
    Threads.update({category: 'Charts'}, {$set: {subject: "thread_reports"}});
    Threads.update({category: 'Account'}, {$set: {subject: "thread_my_account"}}, {multi: true});
  },
  down() {}
});
