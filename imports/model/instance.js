// - company
// - domain
// - adminId
// - sharedId
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

Instance.emailEnabled = () => {
  let instance = Instance.get();
  return instance && instance.modules && instance.modules.email;
};

export { Instance };
