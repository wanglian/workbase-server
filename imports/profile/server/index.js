Meteor.methods({
  updateProfile(params) {
    check(params, {
      language:  Match.Maybe(String),
      skin:      Match.Maybe(String),
      signature: Match.Maybe(String),
      avatar:    Match.Maybe(String)
    });

    let userId = this.userId;
    let user = Meteor.users.findOne(userId);
    let profile = user.profile;
    _.extend(profile, params);
    return Users.direct.update(userId, {$set: {profile}});
  }
});