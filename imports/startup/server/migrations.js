Meteor.startup(() => {
  Migrations.migrateTo('latest');
});

const OldContacts = new Mongo.Collection('contacts');

Migrations.add({
  version: 1,
  name: '合并Contacts到Users: Contacts => Meteor.users.profile.type = Contacts',
  up: function() {
    OldContacts.find({}).forEach((o) => {
      let c = Contacts.parseOne(o.email);
      OldContacts.direct.update(o._id, {$set: {userId: c._id}});
    });
    Threads.find({userType: 'Contacts'}).forEach((m) => {
      let c = OldContacts.findOne(m.userId);
      if (c) {
        Threads.direct.update(m._id, {$set: {userId: c.userId}});
      }
    });
    ThreadUsers.find({userType: 'Contacts'}).forEach((m) => {
      let c = OldContacts.findOne(m.userId);
      if (c) {
        ThreadUsers.direct.update(m._id, {$set: {userId: c.userId}});
      }
    });
    Messages.find({userType: 'Contacts'}).forEach((m) => {
      let c = OldContacts.findOne(m.userId);
      if (c) {
        Messages.direct.update(m._id, {$set: {userId: c.userId}});
      }
    });
    MessageRecords.find({userType: 'Contacts'}).forEach((m) => {
      let c = OldContacts.findOne(m.userId);
      if (c) {
        MessageRecords.direct.update(m._id, {$set: {userId: c.userId}});
      }
    });
  }
});
