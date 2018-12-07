Meteor.publish("roster", function() {
  return Users.find({"profile.channel": {$ne: true}}, {fields: {emails: 1, profile: 1}});
});
