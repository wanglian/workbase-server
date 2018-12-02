import '../both';

Meteor.startup(() => {
  if (Meteor.users.find({}).count() === 0) {
    console.log("[startup] create admin: ");
    Accounts.createUser({
      email: 'admin@test.com',
      password: 'admin123',
      profile: {name: 'Admin'}
    });
  }
});