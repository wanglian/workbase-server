Meteor.methods({
  addMember(email, name, title) {
    check(name, String);
    check(email, String);
    check(title, Match.Maybe(String));

    return Accounts.createUser({
      email,
      profile: {
        type: 'User',
        name,
        title
      }
    });
  },
  editMember(id, email, name, password, title) {
    check(id, String);
    check(name, String);
    check(email, String);
    check(password, Match.Maybe(String));
    check(title, Match.Maybe(String));

    let user = Users.findOne(id);
    if (user) {
      if (email != user.email()) {
        Accounts.removeEmail(id, user.email());
        Accounts.addEmail(id, email);
      }
      if (password) Accounts.setPassword(id, password);
      if (name != user.name()) Users.update(id, {$set: {"profile.name": name}});
      if (title != user.title()) Users.update(id, {$set: {"profile.title": title}});
      return id;
    }
  }
});
