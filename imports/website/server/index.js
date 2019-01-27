Meteor.methods({
  setupCompany(company, domain) {
    check(company, String);
    check(domain, String);

    if (Instance.enabled()) return false;
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

    if (Instance.enabled()) return false;
    switch(type) {
    case 'mailgun':
      Instance.update({}, {$set: {"modules.email": {
        type: 'mailgun',
        mailgun: {key: params.key}
      }}});
      Mailgun.setup();
      break;
    default:
      Instance.update({}, {$unset: {"modules.email": ""}});
    }
  },
  setupS3(type, params) {
    check(type, String);
    check(params, Match.Maybe({
      key:    Match.Maybe(String),
      secret: Match.Maybe(String),
      bucket: Match.Maybe(String),
      region: Match.Maybe(String),
    }));

    if (Instance.enabled()) return false;
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

    if (Instance.enabled()) return false;
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

Meteor.publish("site", function() {
  return Instance.find();
});
