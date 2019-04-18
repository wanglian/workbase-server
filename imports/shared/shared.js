import SimpleSchema from 'simpl-schema';

toggleLikeMessage = new ValidatedMethod({
  name: 'Messages.methods.like',
  validate: new SimpleSchema({
    messageId: { type: String }
  }).validator(),
  run({ messageId }) {
    if (!this.userId) {
      throw new Meteor.Error('Messages.methods.like.notLoggedIn', 'Must be logged in.');
    }

    const message = Messages.findOne(messageId);
    const tu = ThreadUsers.findOne({threadId: message.threadId, userType: 'Users', userId: this.userId});
    if (tu) {
      if (message.hasReact(this.userId, 'like')) {
        Messages.update(messageId, {$pull: {"reacts.like": this.userId}});
      } else {
        Messages.update(messageId, {$push: {"reacts.like": this.userId}});
      }
    } else {
      throw new Meteor.Error('Messages.methods.like.notExist', 'User does not have the message.');
    }
  }
});
