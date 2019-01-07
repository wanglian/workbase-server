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

      logAccountAction(user, {action: 'profile.update', params: {set: JSON.stringify(changedSet)}});
      return true;
    }

    return false;
  },
  updateLogin() {
    let user = Users.findOne(this.userId);
    let connection = this.connection;
    logAccountAction(user, {action: 'login', params: {ip: connection.clientAddress, meta: connection.httpHeaders}});
  }
});

const ensureAccountThread = (user) => {
  let thread = Threads.findOne({category: 'Account', userId: user._id});
  if (!thread) {
    let threadId = Threads.create(user, 'Account', 'My Account');
    thread = Threads.findOne(threadId);
  }
  Threads.ensureMember(thread, user);
  return thread;
};
const logAccountAction = (user, content) => {
  // Account
  let thread = ensureAccountThread(user);
  Threads.addMessage(thread, user, {
    contentType: 'log',
    content
  });
};

Accounts.onLogin(function(attempt) {
  // console.log("on login ..");
  let user = Users.findOne(attempt.user._id);
  ensureAccountThread(user);
});

Accounts.onLogout(function(attempt) {
  let user = Users.findOne(attempt.user._id);
  let connection = attempt.connection;
  logAccountAction(user, {action: 'logout', params: {ip: connection.clientAddress, meta: connection.httpHeaders}});
});

Accounts.onLoginFailure(function(attempt) {
  if (attempt.user) {
    let user = Users.findOne(attempt.user._id);
    let connection = attempt.connection;
    logAccountAction(user, {action: 'login.failed', params: {ip: connection.clientAddress, meta: connection.httpHeaders}});
  }
});
