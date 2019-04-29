import { Storage } from '/imports/files/server/storage';
import moment from 'moment';

Meteor.methods({
  getChartDay() {
    if (!Users.isAdmin(this.userId)) {
      return false;
    }

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
    if (!Users.isAdmin(this.userId)) {
      return false;
    }

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
    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    let instance = Instance.get();
    if (!instance.modules.email) {
      return false;
    }

    let re = await Mailgun.validate(instance.domain);
    switch (re) {
    case false:
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

    if (!Users.isAdmin(this.userId)) {
      return false;
    }

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

    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    return Instance.update({}, {$set: {
      company: name
    }});
  },
  updateCompanyDomain(domain) {
    check(domain, String);

    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    Instance.update({}, {$set: {domain}});
    return Meteor.call("validateMailgun");
  },
  updateStorage(type, params) {
    check(type, String);
    check(params, Match.Maybe({
      key:    Match.Maybe(String),
      secret: Match.Maybe(String),
      bucket: Match.Maybe(String),
      region: Match.Maybe(String),
    }));

    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    switch(type) {
    case 'S3':
      Instance.update({}, {$set: {"modules.storage": {
        type: 'S3',
        s3: params
      }}});
      Storage.setup();
      break;
    default:
      Instance.update({}, {$set: {"modules.storage": {
        type: 'GridFS'
      }}});
      Storage.setup();
    }
  }
});