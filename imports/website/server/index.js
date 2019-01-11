Meteor.methods({
  setupCompany(company, domain) {
    check(company, String);
    check(domain, String);

    Instance.update({}, {$set: {company, domain}});
  },
  setupEmail(type, params) {
    check(type, String);
    check(params, Match.Maybe({
      key: Match.Maybe(String)
    }));

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

    switch(type) {
    case 's3':
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

    Users.remove({});
    let adminId = Accounts.createUser({
      email,
      password,
      profile: {
        type: 'Users',
        name,
        title: 'Admin',
        role: 'admin'}
    });

    Instance.update({}, {$set: {adminId}});

    return adminId;
  }
});
