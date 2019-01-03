Meteor.startup(() => {
  Migrations.migrateTo('latest');
});

// Migrations.add({
//   version: 1,
//   name: 'add ThreadUsers.scope, copy from Threads',
//   up: function() {
//     ThreadUsers.find({}).forEach((tu) => {
//       let thread = tu.thread();
//       if (thread) {
//         ThreadUsers.update(tu._id, {$set: {scope: tu.thread().scope}});
//       } else {
//         ThreadUsers.remove(tu._id);
//       }
//     });
//   }
// });
