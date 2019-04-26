Meteor.publish("site", function() {
  return Instance.find({}, {fields: {domain: 1, company: 1, adminId: 1}});
});

Meteor.publish("site-setup", function() {
  return Instance.find();
});
