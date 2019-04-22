import '../account';

Meteor.methods({
  updateProfile(params) {
    check(params, {
      language:  Match.Maybe(String),
      skin:      Match.Maybe(String),
      message:   Match.Maybe(String),
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

Meteor.publishComposite("admin.threads", function() {
  if (!this.userId) return this.ready();
  let user = Users.findOne(this.userId);
  if (!user || !user.isAdmin()) return this.ready();

  return {
    find() {
      return ThreadUsers.find({userType: 'Users', userId: this.userId, scope: 'admin'}, {
        sort: {updatedAt: -1}
      });
    },
    children: [
      {
        find(tu) {
          return Threads.find({_id: tu.threadId}, {
            transform: (doc) => {
              doc.read = tu.read;
              doc.params = tu.params;
              return doc;
            }
          });
        },
        children: [
          {
            find(thread) {
              return Messages.find({_id: thread.lastMessageId});
            },
            children: [
              {
                find(message) {
                  return Users.find({_id: message.userId});
                }
              }
            ]
          }
        ]
      }
    ]
  };
});

const ensureAccountThread = (user) => {
  let thread = Threads.findOne({category: 'Account', userId: user._id});
  if (!thread) {
    let threadId = Threads.create(user, 'Account', 'thread_my_account');
    thread = Threads.findOne(threadId);
  }
  Threads.ensureMember(thread, user);
  return thread;
};
const logAccountAction = (user, content) => {
  let thread = ensureAccountThread(user);
  Threads.addMessage(thread, user, {
    contentType: 'log',
    content
  });
};

Accounts.onLogin(function(attempt) {
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
