import './view.html';
import './style.css';

Template.PinMessageButton.events({
  "click .btn-pin"(e, t) {
    e.stopPropagation();
    togglePinMessage.call({messageId: this._id});
  }
});

Template.ThreadDetailPinMessages.onRendered(function() {
  this.autorun(() => {
    let data = Template.currentData();
    this.subscribe("thread.messages.pin", data._id);
  });
});

Template.ThreadDetailPinMessages.helpers({
  count() {
    return Counts.get(`messages.pin.${this._id}`);
  },
  messages() {
    return Messages.find({threadId: this._id, pinAt: {$exists: true}});
  }
});

Template.ThreadDetailPinMessages.events({
  "click .btn-view-pin"(e, t) {
    e.preventDefault();
    Modal.show('MessageModal', this);
  },
});
