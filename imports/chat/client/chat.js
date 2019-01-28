import './chat.html';

Template.ThreadDetailChat.helpers({
  includeUsers() {
    return [Meteor.user(), this.chat()];
  }
});
