import './thread.html';

Template.Thread.helpers({
  messages() {
    return Messages.find({threadId: this._id}, {sort: {createdAt: -1}});
  }
});
