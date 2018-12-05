import './thread-detail.html';
import './thread-detail.css';

Template.ThreadDetail.helpers({
  members() {
    return ThreadUsers.find({threadId: this._id});
  }
});
