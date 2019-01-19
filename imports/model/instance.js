// - company
// - domain
// - adminId
// - modules
//  - storage: type[GridFS/S3], s3(key/secret/bucket/region)
//  - email: type[mailgun], mailgun(key)
Instance = new Mongo.Collection('instance');

Instance.get = () => {
  return Instance.findOne();
};

Instance.company = () => {
  let instance = Instance.get();
  return instance && instance.company;
};

Instance.domain = () => {
  let instance = Instance.get();
  return instance && instance.domain;
};

Instance.enabled = () => {
  let instance = Instance.get();
  return instance && instance.adminId;
};

Instance.admin = () => {
  let instance = Instance.get();
  return instance && instance.adminId && Users.findOne(instance.adminId);
};

let _logTypes = {}; // i18nKey
LogTypes = {
  add(type, defs) {
    let _obj = {};
    _obj[type] = defs;
    _.extend(_logTypes, _obj);
  },
  get(type) {
    return _logTypes[type];
  }
};
