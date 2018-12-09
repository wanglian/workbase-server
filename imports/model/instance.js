Instance = new Mongo.Collection('instance');

Instance.domain = () => {
  let instance = Instance.findOne()
  return instance && instance.domain;
};