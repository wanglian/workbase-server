import '../account';

Meteor.methods({
  updateProfile(params) {
    check(params, {
      language:  Match.Maybe(String),
      skin:      Match.Maybe(String),
      signature: Match.Maybe(String),
      avatar:    Match.Maybe(String)
    });

    let user = Meteor.users.findOne(this.userId);
    let profile = user.profile;
    let changedSet = _.omitBy(params, (v, k, o) => { return v === profile[k]});
    if (!_.isEmpty(changedSet)) {
      _.extend(profile, changedSet);
      Users.direct.update(this.userId, {$set: {profile}});

      // log
      logAccountAction(user, `Update Profile: \r\n ${JSON.stringify(changedSet)}`);
      return true;
    }

    return false;
  },
  updateLogin() {
    let user = Users.findOne(this.userId);
    let connection = this.connection;
    logAccountAction(user, `Login from ${connection.clientAddress}: \r\n ${JSON.stringify(connection.httpHeaders)}`);
  }
});

const ensureAccountThread = (user) => {
  let thread = Threads.findOne({category: 'Account', userId: user._id});
  if (!thread) {
    let threadId = Threads.create(user, 'Account', 'My Account');
    thread = Threads.findOne(threadId);
    Threads.ensureMember(thread, user);
  }
  return thread;
};
const logAccountAction = (user, content) => {
  // Account
  let thread = ensureAccountThread(user);
  Threads.addMessage(thread, user, {content});
};

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  // logAccountAction('Login', attempt);
  ensureAccountThread(attempt.user);
});

Accounts.onLogout(function(attempt) {
  let user = Users.findOne(attempt.user._id);
  let connection = attempt.connection;
  logAccountAction(user, `Logout from ${connection.clientAddress}: \r\n ${JSON.stringify(connection.httpHeaders)}`);
});

Accounts.onLoginFailure(function(attempt) {
  if (attempt.user) {
    let user = Users.findOne(attempt.user._id);
    let connection = attempt.connection;
    logAccountAction(user, `Failed Login from ${connection.clientAddress}: \r\n ${JSON.stringify(connection.httpHeaders)}`);
  }
});
