import moment from "moment";

Meteor.startup(() => {
  // Migrations._collection.update({}, {$set: {version: 0}});
  Migrations.unlock();
  Migrations.migrateTo("latest");
});

Migrations.add({
  version: 1,
  name: "change i18n keys",
  up() {
    Threads.update({category: "Roster"}, {$set: {subject: "thread_users_management"}});
    Threads.update({category: "Charts"}, {$set: {subject: "thread_reports"}});
    Threads.update({category: "Account"}, {$set: {subject: "thread_my_account"}}, {multi: true});
  },
  down() {}
});

Migrations.add({
  version: 2,
  name: "daily messages stat",
  up() {
    let d = moment().subtract(1, "days");
    let days = 200;
    while (days > 0) {
      let count = MessageDailyRecords.stat(d.year(), d.month() + 1, d.date());
      if (count  === 0) {
        break;
      } else {
        days --;
      }
    }
  },
  down() {}
});
