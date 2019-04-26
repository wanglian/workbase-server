import { Storage } from '/imports/files/server/storage';

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
  setupCompany(company, domain) {
    check(company, String);
    check(domain, String);

    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    // if (Instance.enabled()) {
    //   return false;
    // }
    let instance = Instance.findOne();
    if (instance) {
      Instance.update({}, {$set: {company, domain}});
    } else {
      Instance.insert({company, domain});
    }
  },
  setupEmail(type, params) {
    check(type, String);
    check(params, Match.Maybe({
      key: Match.Maybe(String)
    }));

    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    if (Instance.enabled()) {
      return false;
    }
    switch(type) {
    case 'mailgun':
      Instance.update({}, {$set: {"modules.email": {
        type: 'mailgun',
        mailgun: {key: params.key}
      }}});
      Mailgun.setup(params.key, Instance.domain());
      break;
    default:
      Instance.update({}, {$unset: {"modules.email": ""}});
    }
  },
  setupStorage(type, params) {
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

    // if (Instance.enabled()) {
    //   return false;
    // }
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
  },
  setupAdmin(name, email, password) {
    check(name, String);
    check(email, String);
    check(password, String);

    if (!Users.isAdmin(this.userId)) {
      return false;
    }

    if (Instance.enabled()) {
      return false;
    }
    let user = Accounts.findUserByEmail(email);
    let adminId;
    if (user) {
      adminId = user._id;
      Accounts.setPassword(adminId, password);
      Users.update(adminId, {$set: {"profile.name": name}});
    } else {
      adminId = Accounts.createUser({
        email,
        password,
        profile: {
          type: 'Users',
          name,
          title: 'Admin',
          role: 'admin'}
      });
    }

    Instance.update({}, {$set: {adminId}});

    return adminId;
  }
});