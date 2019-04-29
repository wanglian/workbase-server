import './message-records';
import './methods';

import moment from 'moment';

Meteor.startup(function() {
  let thread = Threads.findOne({category: 'Charts'});
  thread || Threads.create(null, 'Charts', 'thread_reports', 'admin');
  thread = Threads.findOne({category: 'Settings'});
  thread || Threads.create(null, 'Settings', 'thread_settings', 'admin');
});

Accounts.onLogin(function(attempt) {
  let user = Users.findOne(attempt.user._id);
  if (user && user.isAdmin()) {
    let thread = Threads.findOne({category: 'Charts'});
    thread && Threads.ensureMember(thread, user);
    thread = Threads.findOne({category: 'Settings'});
    thread && Threads.ensureMember(thread, user);
  }
});

Messages.after.insert(function(userId, doc) {
  // let m = moment.utc(doc.createdAt);
  let m = moment(doc.createdAt);
  MessageRecords.insert({
    userType:  doc.userType,
    userId:    doc.userId,
    messageId: this._id,
    internal:  doc.internal,
    year:      m.year(),
    month:     m.month() + 1,
    day:       m.date(),
    hour:      m.hour()
  });
});
