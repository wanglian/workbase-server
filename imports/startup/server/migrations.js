Meteor.startup(() => {
  Migrations.unlock();
  Migrations.migrateTo('latest');
});

Migrations.add({
  version: 1,
  name: 'Add ThreadUser[category=Chat].params.internal',
  up() {
    ThreadUsers.find({category: 'Chat'}).forEach((tu) => {
      let chat = Users.findOne(tu.params.chat);
      ThreadUsers.update(tu._id, {$set: {
        "params.internal": chat.internal()
      }});
    });
  },
  down() {}
});

Migrations.add({
  version: 2,
  name: 'Update Thread.category Email -> Chat for 1-1 emails',
  up() {
    Threads.find({category: 'Email'}).forEach((t) => {
      let tus = ThreadUsers.find({threadId: t._id});
      if (tus.count() === 2) {
        Threads.update(t._id, {$set: {category: 'Chat'}});
        tus = tus.fetch();
        let tu1 = tus[0];
        let tu2 = tus[1];
        ThreadUsers.update(tu1._id, {$set: {category: 'Chat', params: {chat: tu2.userId, internal: tu2.userType != 'Contacts'}}});
        ThreadUsers.update(tu2._id, {$set: {category: 'Chat', params: {chat: tu1.userId, internal: tu1.userType != 'Contacts'}}});
      }
    });
  },
  down() {}
});

const mergeThread = (winnerId, loserId) => {
  Messages.update({threadId: loserId}, {$set: {threadId: winnerId}});
  ThreadUsers.remove({threadId: loserId});
  Threads.remove(loserId);
};
Migrations.add({
  version: 3,
  name: 'Merge Thread[category=Chat]',
  up() {
    ThreadUsers.find({category: 'Chat'}).forEach((tu) => {
      tu = ThreadUsers.findOne(tu._id); // reload
      if (tu && tu.thread()) {
        ThreadUsers.find({userId: tu.userId, "params.chat": tu.params.chat}).forEach((ls) => {
          if (ls._id != tu._id) {
            mergeThread(tu.threadId, ls.threadId);
          }
        });
      }
    });
  },
  down() {}
});
