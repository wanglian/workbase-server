import './message-records';

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

Meteor.methods({
  getChartDay() {
    let d = moment();
    let days = Array.from(Array(d.date()).keys()).map((i) => i+1);
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
  },
  async validateMailgun() {
    let instance = Instance.get();
    if (!instance.modules.email) {
      return false;
    }

    let re = await Mailgun.validate(instance.domain);
    switch (re) {
    case 401:
      Instance.update(instance._id, {$set: {
        "modules.email.mailgun.key_valid": false,
        "modules.email.mailgun.domain_valid": false
      }});
      break;
    case 404:
      Instance.update(instance._id, {$set: {
        "modules.email.mailgun.key_valid": true,
        "modules.email.mailgun.domain_valid": false
      }});
      break;
    default:
      Instance.update(instance._id, {$set: {
        "modules.email.mailgun.key_valid": true,
        "modules.email.mailgun.domain_valid": true
      }});
    }
    return re;
  },
  updateMailgunKey(key) {
    check(key, String);
    Instance.update({}, {$set: {
      "modules.email.mailgun.key": key,
      "modules.email.mailgun.key_valid": false,
      "modules.email.mailgun.domain_valid": false
    }});
    Mailgun.setup(key, Instance.domain());
    return Meteor.call("validateMailgun");
  },
  updateCompanyName(name) {
    check(name, String);
    return Instance.update({}, {$set: {
      company: name
    }});
  },
  updateCompanyDomain(domain) {
    check(domain, String);
    Instance.update({}, {$set: {domain}});
    return Meteor.call("validateMailgun");
  }
});