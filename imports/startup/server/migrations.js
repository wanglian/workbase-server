Meteor.startup(() => {
  Migrations.unlock();
  Migrations.migrateTo('latest');
});

Migrations.add({
  version: 1,
  name: 'Add ThreadUser[category=Chat].params.internal',
  up: function() {
    ThreadUsers.find({category: 'Chat'}).forEach((tu) => {
      let chat = Users.findOne(tu.params.chat);
      ThreadUsers.update(tu._id, {$set: {
        "params.internal": chat.internal()
      }});
    });
  }
});
