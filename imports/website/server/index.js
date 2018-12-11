Meteor.methods({
  setup(name, email, password) {
    Users.remove({});
    let adminId = Accounts.createUser({
      email,
      password,
      profile: {name, title: 'Admin', role: 'admin'}
    });

    let instance = Instance.get();
    Instance.update(instance._id, {$set: {adminId}});

    return adminId;
  }
});
