Meteor.methods({
  addMember(email, name, title) {
    check(name, String);
    check(email, String);
    check(title, Match.Maybe(String));

    let userId = Accounts.createUser({
      email,
      profile: {
        type: 'Users',
        name,
        title
      }
    });

    let admin = Users.findOne(this.userId);
    let user = Users.findOne(userId);
    logUserAdmin(admin, `New User: ${user.email()} \r\n ${JSON.stringify(user.profile)}`);

    return userId;
  },
  editMember(id, email, name, password, title) {
    check(id, String);
    check(name, String);
    check(email, String);
    check(password, Match.Maybe(String));
    check(title, Match.Maybe(String));

    let user = Users.findOne(id);
    if (user) {
      let changes = {};
      if (email != user.email()) {
        changes.email = {from: user.email(), to: email};
        Accounts.removeEmail(id, user.email());
        Accounts.addEmail(id, email);
      }
      if (password) {
        changes.password = "changed";
        Accounts.setPassword(id, password);
      }
      if (name != user.name()) {
        changes.name = {from: user.name(), to: name};
        Users.update(id, {$set: {"profile.name": name}});
      }
      if (title != user.title()) {
        changes.title = {from: user.title(), to: title};
        Users.update(id, {$set: {"profile.title": title}});
      }

      let admin = Users.findOne(this.userId);
      logUserAdmin(admin, `Edit User: ${user.email()} \r\n ${JSON.stringify(changes)}`);

      return id;
    }
  }
});

const logUserAdmin = (admin, content) => {
  let thread = Threads.findOne({category: 'Roster'});
  Threads.addMessage(thread, admin, {
    contentType: 'log',
    content
  });
}
