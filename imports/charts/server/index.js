import './message-records';

import moment from 'moment';

Meteor.startup(function() {
  let thread = Threads.findOne({category: 'Charts'});
  if (thread) {
    //
  } else {
    Threads.create(null, 'Charts', 'System Reports', 'admin');
  }
});

Accounts.onLogin(function(attempt) {
  // admin
  let user = Users.findOne(attempt.user._id);
  if (user && user.isAdmin()) {
    let thread = Threads.findOne({category: 'Charts'});
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

Meteor.methods({
  getChartDay() {
    let d = moment();
    let days = Array.from(Array(d.date()).keys()).map(i => i+1);
    let data = {};
    data.internal = days.map((day) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, day, internal: true}).count();
    });
    data.outgoing = days.map((day) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, day, internal: false, userType: 'Users'}).count();
    });
    data.incoming = days.map((day) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, day, userType: 'Contacts'}).count();
    });
    return data;
  },
  getCharHour() {
    let d = moment();
    let hours = Array.from(Array(24).keys());
    let data = {};
    data.internal = hours.map((hour) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, hour, internal: true}).count();
    });
    data.outgoing = hours.map((hour) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, hour, internal: false, userType: 'Users'}).count();
    });
    data.incoming = hours.map((hour) => {
      return MessageRecords.find({year: d.year(), month: d.month() + 1, hour, userType: 'Contacts'}).count();
    });
    return data;
  }
})
