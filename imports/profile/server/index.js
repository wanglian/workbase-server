import '../account';

Meteor.methods({
  updateProfile(params) {
    check(params, {
      language:  Match.Maybe(String),
      skin:      Match.Maybe(String),
      signature: Match.Maybe(String),
      avatar:    Match.Maybe(String)
    });

    let userId = this.userId;
    let user = Meteor.users.findOne(userId);
    let profile = user.profile;
    _.extend(profile, params);
    return Users.direct.update(userId, {$set: {profile}});
  },
  updateLogin() {
    logAccountAction('Login', {
      user: Users.findOne(this.userId),
      connection: this.connection
    });
  }
});

const logAccountAction = (action, attempt) => {
  let user = Users.findOne(attempt.user._id);
  let connection = attempt.connection;
  // Account
  let thread = Threads.findOne({category: 'Account', userId: user._id});
  if (!thread) {
    let threadId = Threads.create(user, 'Account', 'My Account');
    thread = Threads.findOne(threadId);
    Threads.ensureMember(thread, user);
  }
  Threads.addMessage(thread, user, {
    content: `${action} from ${attempt.connection.clientAddress}: \r\n ${JSON.stringify(attempt.connection.httpHeaders)}`
  });
};

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  // logAccountAction('Login', attempt);
});

Accounts.onLogout(function(attempt) {
  logAccountAction('Logout', attempt);
});

Accounts.onLoginFailure(function(attempt) {
  logAccountAction('Failed Login', attempt);
});
