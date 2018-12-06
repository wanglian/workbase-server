// - threadId
// - userType: user, contact
// - userId
// - internal: boolean
// - content
// - summary
// - emailId
// - email: from, to, cc, time
Messages = new Mongo.Collection('messages');

Messages.helpers({
  user() {
    return eval(this.userType).findOne(this.userId);
  }
});
