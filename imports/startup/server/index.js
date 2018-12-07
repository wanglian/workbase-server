import '../both';

_.extend(Instance, {
  root: {
    email: 'wanglian1024@gmail.com',
    profile: {
      name: 'William'
    }
  },
  admin: {
    id: 'wanglian',
    name: 'Wang Lian'
  }
});

Meteor.startup(() => {
  if (Users.find({}).count() === 0) {
    let params = {
      email: [Instance.admin.id, Instance.domain].join('@'),
      password: 'admin123',
      profile: {name: Instance.admin.name, title: 'Admin', role: 'admin'}
    };
    console.log("[startup] create admin: ");
    console.log(params);
    Accounts.createUser(params);
  }
  if (Contacts.find({}).count() === 0) {
    Contacts.insert(Instance.root);
  }
});
