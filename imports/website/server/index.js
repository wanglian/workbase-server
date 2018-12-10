Meteor.methods({
  setup(domain, admin, password) {
    Instance.remove({});
    Instance.insert({domain});

    Users.remove({});
    Accounts.createUser({
      email: [admin, domain].join('@'),
      password,
      profile: {name: 'Admin', title: 'Admin', role: 'admin'}
    });
  }
});
